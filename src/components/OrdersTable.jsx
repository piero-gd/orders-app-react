import React from "react";

const OrdersTable = ({ orders, onEdit, onDelete, onStatusChange }) => {
  return (
    <table border="1" width="100%">
      <thead>
        <tr>
          <th>ID</th>
          <th>Order #</th>
          <th>Date</th>
          <th># Products</th>
          <th>Final Price</th>
          <th>Status</th>
          <th>Options</th>
        </tr>
      </thead>
      <tbody>
        {orders.length > 0 ? (
          orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.orderNumber}</td>
              <td>{order.date ? order.date.substring(0, 10) : ""}</td>
              <td>{order.product_count || 0}</td>
              <td>S/{order.finalPrice.toFixed(2)}</td>
              <td>
                <select
                  value={order.status || "Pending"}
                  onChange={(e) => onStatusChange(order.id, e.target.value)}
                  className={
                    order.status === "Pending" ? "status-pending" :
                    order.status === "InProgress" ? "status-in-process" :
                    order.status === "Completed" ? "status-completed" : ""
                  }
                >
                  <option value="Pending">Pending</option>
                  <option value="InProgress">InProgress</option>
                  <option value="Completed">Completed</option>
                </select>
              </td>
              <td>
                <button onClick={() => onEdit(order.id)}>✏️ Edit</button>
                <button onClick={() => onDelete(order.id)}>❌ Delete</button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="7" align="center">
              No orders found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default OrdersTable;
