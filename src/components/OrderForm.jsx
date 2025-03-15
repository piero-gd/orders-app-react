import { useState, useEffect } from "react";

const OrderForm = ({ order, onSave, onOpenModal }) => {
  const [orderNumber, setOrderNumber] = useState(order?.orderNumber || "");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [products, setProducts] = useState(order?.products || []);
  const [finalPrice, setFinalPrice] = useState(order?.finalPrice || 0);

  useEffect(() => {
    setOrderNumber(order?.orderNumber || "");
    setProducts(order?.products || []);
  }, [order]);

  // calcular precio cuando cambian productos; reduce => metodo acumulador
  useEffect(() => {
    const total = products.reduce((sum, p) => sum + p.unitPrice * p.qty, 0);
    setFinalPrice(total);
  }, [products]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ orderNumber, date, products, finalPrice });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Order #:</label>
      <input
        type="text"
        value={orderNumber}
        onChange={(e) => setOrderNumber(e.target.value)}
        required
      />

      <label>Date:</label>
      <input type="date" value={date} disabled />

      <label># Products:</label>
      <input type="number" value={products.length} disabled />

      <label>Final Price:</label>
      <input type="text" value={`$${finalPrice.toFixed(2)}`} disabled />

      <button
        type="button"
        onClick={() => onOpenModal()}
        disabled={order?.status === "Completed"}
      >
        ➕ Add Product
      </button>
      <button type="submit" disabled={order?.status === "Completed"}>
        💾 Save Order
      </button>
    </form>
  );
};

export default OrderForm;
