import React, { useState, useEffect } from "react";

const ProductModal = ({ isOpen, onClose, onSave, products, productToEdit }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (productToEdit) {
      setSelectedProduct(productToEdit);
      setQuantity(productToEdit.qty);
    } else {
      setSelectedProduct(products[0] || null);
      setQuantity(1);
    }
  }, [productToEdit, products]);

  const handleSave = () => {
    if (!selectedProduct) return;
    onSave({ ...selectedProduct, qty: quantity, totalPrice: selectedProduct.unitPrice * quantity });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{productToEdit ? "Edit Product" : "Add Product"}</h2>
        <label>Product:</label>
        <select value={selectedProduct?.id || ""} onChange={(e) => setSelectedProduct(products.find(p => p.id === Number(e.target.value)))}>
          {products.map((p) => (
            <option key={p.id} value={p.id}>{p.name} - ${p.unitPrice}</option>
          ))}
        </select>
        <label>Quantity:</label>
        <input type="number" value={quantity} onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))} />
        <button onClick={handleSave}>Save</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default ProductModal;
