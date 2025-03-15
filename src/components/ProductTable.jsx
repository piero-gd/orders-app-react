import React from "react";

const ProductTable = ({ products, onEdit, onRemove, orderStatus }) => {
  return (
    <div>
      <h2>Products in Order</h2>
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Unit Price</th>
            <th>Qty</th>
            <th>Total Price</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>
                  ${product.unitPrice ? product.unitPrice.toFixed(2) : "0.00"}
                </td>
                <td>{product.qty || 0}</td>
                <td>
                  $
                  {product.unitPrice && product.qty
                    ? (product.unitPrice * product.qty).toFixed(2)
                    : "0.00"}
                </td>
                <td>
                  <button
                    onClick={() => onEdit(product)}
                    disabled={orderStatus === "Completed"}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => onRemove(product.id)}
                    disabled={orderStatus === "Completed"}
                  >
                    🗑️ Remove
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No products added yet</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
