import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MyOrders from "./pages/MyOrders";
import AddEditOrder from "./pages/AddEditOrder";

const App = () => {
  const [orders, setOrders] = useState([
    {
      id: 1,
      orderNumber: "ORD001",
      date: "2024-03-01",
      products: [{ id: 1, name: "Product A", unitPrice: 10, qty: 2 }],
      finalPrice: 20,
    },
    {
      id: 2,
      orderNumber: "ORD002",
      date: "2024-03-02",
      products: [
        { id: 2, name: "Product B", unitPrice: 5, qty: 1 },
        { id: 3, name: "Product C", unitPrice: 15, qty: 1 },
      ],
      finalPrice: 20,
    },
  ]);

  return (
    <Router>
      <Routes>
        <Route path="/my-orders" element={<MyOrders orders={orders} setOrders={setOrders} />} />
        <Route path="/add-order" element={<AddEditOrder orders={orders} setOrders={setOrders} />} />
        <Route path="/add-order/:id" element={<AddEditOrder orders={orders} setOrders={setOrders} />} />
      </Routes>
    </Router>
  );
};

export default App;
