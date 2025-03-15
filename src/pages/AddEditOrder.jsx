import { useEffect, useState, useReducer } from "react";
import { useParams, useNavigate } from "react-router-dom";
import OrderForm from "../components/OrderForm";
import ProductModal from "../components/ProductModal";
import ProductTable from "../components/ProductTable";
import axios from "axios";
import { API_BASE_URL } from "../config";

const calculateFinalPrice = (products) =>
  products.reduce((sum, p) => sum + p.totalPrice, 0);

const orderReducer = (state, action) => {
  switch (action.type) {
    case "SET_ORDER":
      return action.payload;
    case "UPDATE_ORDER_FIELD":
      return { ...state, [action.field]: action.value };
    case "ADD_OR_UPDATE_PRODUCT": {
      const product = action.payload;
      // Convertir ambos IDs a número para asegurar la comparación
      const index = state.products.findIndex(
        (p) => Number(p.id) === Number(product.id)
      );
      let updatedProducts;
      if (index !== -1) {
        updatedProducts = [...state.products];
        if (product.isEdit) {
          // Modo edición: se reemplaza la cantidad
          updatedProducts[index] = {
            ...product,
            totalPrice: Number(product.qty) * product.unitPrice,
          };
        } else {
          // Modo agregar: se acumula la cantidad
          const existingProduct = updatedProducts[index];
          const newQty = Number(existingProduct.qty || 0) + Number(product.qty);
          updatedProducts[index] = {
            ...existingProduct,
            qty: newQty,
            totalPrice: newQty * existingProduct.unitPrice,
          };
        }
      } else {
        // Si no existe, se agrega el producto nuevo
        updatedProducts = [...state.products, product];
      }
      return {
        ...state,
        products: updatedProducts,
        finalPrice: calculateFinalPrice(updatedProducts),
      };
    }
    case "REMOVE_PRODUCT": {
      const updatedProducts = state.products.filter(
        (p) => p.id !== action.payload
      );
      return {
        ...state,
        products: updatedProducts,
        finalPrice: calculateFinalPrice(updatedProducts),
      };
    }
    default:
      return state;
  }
};

const initialOrder = {
  orderNumber: "",
  date: new Date().toISOString().split("T")[0],
  products: [],
  finalPrice: 0,
};

const AddEditOrder = ({ orders = [], setOrders }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, dispatch] = useReducer(orderReducer, initialOrder);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (id) {
      setLoading(true);
      axios
        .get(`${API_BASE_URL}/orders/${id}`)
        .then((response) => {
          // La respuesta debe contener la orden completa con sus productos
          dispatch({ type: "SET_ORDER", payload: response.data });
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching order:", error);
          setLoading(false);
        });
    }
  }, [id]);

  const handleOpenModal = (product = null) => {
    setProductToEdit(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setProductToEdit(null);
  };

  const handleSaveProduct = (product) => {
    if (productToEdit) {
      dispatch({
        type: "ADD_OR_UPDATE_PRODUCT",
        payload: { ...product, isEdit: true },
      });
    } else {
      dispatch({ type: "ADD_OR_UPDATE_PRODUCT", payload: product });
    }
    handleCloseModal();
  };

  const handleSave = (newOrderData) => {
    const orderToSave = { ...order, ...newOrderData };

    if (id) {
      // Edición: PUT a /orders/:id
      axios
        .put(`http://localhost:3001/orders/${id}`, orderToSave)
        .then((res) => {
          // Actualiza el estado global o redirige
          navigate("/my-orders");
        })
        .catch((error) => console.error("Error updating order:", error));
    } else {
      // Creación: POST a /orders
      axios
        .post("http://localhost:3001/orders", orderToSave)
        .then((res) => {
          navigate("/my-orders");
        })
        .catch((error) => console.error("Error creating order:", error));
    }
  };

  const handleRemoveProduct = (productId) => {
    if (window.confirm("Are you sure you want to remove this product?")) {
      dispatch({ type: "REMOVE_PRODUCT", payload: productId });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h1>{id ? "Edit Order" : "Add Order"}</h1>
      <OrderForm
        order={order}
        onSave={handleSave}
        onOpenModal={handleOpenModal}
      />
      <ProductTable
        products={order.products}
        onEdit={handleOpenModal}
        onRemove={handleRemoveProduct}
        orderStatus={order.status}
      />
      <ProductModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveProduct}
        products={[
          { id: 1, name: "Product A", unitPrice: 10 },
          { id: 2, name: "Product B", unitPrice: 20 },
          { id: 3, name: "Product C", unitPrice: 30 },
        ]}
        productToEdit={productToEdit}
      />
    </div>
  );
};

export default AddEditOrder;
