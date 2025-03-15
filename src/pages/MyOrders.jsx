import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import OrdersTable from "../components/OrdersTable";
import { API_BASE_URL } from "../config";

const MyOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Llama al endpoint GET /orders
    axios
      .get(`${API_BASE_URL}/orders`)
      .then((response) => {
        setOrders(response.data);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
      });
  }, []);

  const handleEdit = (id) => {
    navigate(`/add-order/${id}`);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      axios
        .delete(`${API_BASE_URL}/orders/${id}`)
        .then(() => {
          // Actualizar el estado quitando la orden eliminada
          setOrders(orders.filter((order) => order.id !== id));
        })
        .catch((error) => console.error("Error deleting order:", error));
    }
  };

  const handleStatusChange = (orderId, newStatus) => {
    axios
      .put(`http://localhost:3001/orders/${orderId}/status`, { status: newStatus })
      .then(() => {
        setOrders(
          orders.map((o) =>
            o.id === orderId ? { ...o, status: newStatus } : o
          )
        );
      })
      .catch((error) => console.error("Error updating status:", error));
  };

  return (
    <div className="container">
      <h1>Orders App by Piero</h1>
      <button onClick={() => navigate("/add-order")}>➕ Add Order</button>
      <OrdersTable
        orders={orders}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};

export default MyOrders;
