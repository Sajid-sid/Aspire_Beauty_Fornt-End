import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const STATUS_STEPS = ["Pending", "Confirmed", "Shipped", "Delivered"];

const OrderStatus = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const orderId = query.get("orderId");

  const [step, setStep] = useState(0);
  const [orderTotal, setOrderTotal] = useState(null);
  const [view, setView] = useState("success"); // success → tracking

  // ✅ Auto switch to tracking after 3 sec
  useEffect(() => {
    const timer = setTimeout(() => {
      setView("tracking");
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // ✅ Fetch Order Status from backend
  const fetchStatus = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/orders/status/${orderId}`
      );

      const status = res.data.orderStatus;
      const total = res.data.totalAmount;

      setOrderTotal(total);

      const index = STATUS_STEPS.indexOf(status);
      if (index !== -1) setStep(index);
    } catch (err) {
      console.error("Status fetch failed", err);
    }
  };

  // ✅ Fetch immediately and auto-refresh every 10 sec
  useEffect(() => {
    fetchStatus();

    const interval = setInterval(() => {
      fetchStatus();
    }, 10000);

    // ✅ Stop refresh if Delivered
    if (step === 3) clearInterval(interval);

    return () => clearInterval(interval);
  }, [step]);

  // ✅ Manual Track button
  const handleTrackNow = () => setView("tracking");

  return (
    <div className="max-w-2xl mx-auto p-6 text-center">
      {/* ✅ SUCCESS VIEW */}
      {view === "success" && (
        <div>
          <h2 className="text-3xl font-bold text-green-600 mb-3">
            ✅ Order Placed Successfully!
          </h2>

          <p className="text-lg mb-2">
            Order ID: <span className="font-semibold">#{orderId}</span>
          </p>

          {orderTotal && (
            <p className="text-xl font-bold text-[#001b3d] mb-6">
              Total: ₹{orderTotal}
            </p>
          )}

          <button
            onClick={handleTrackNow}
            className="bg-[#ff5757] hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold text-lg"
          >
            Track Order
          </button>

          <p className="mt-3 text-gray-500 text-sm">
            Redirecting automatically...
          </p>
        </div>
      )}

      {/* ✅ TRACKING VIEW */}
      {view === "tracking" && (
        <div>
          <h2 className="text-2xl font-bold text-[#001b3d] mb-6">
            Live Order Tracking
          </h2>

          <div className="flex justify-between items-center relative mt-10 mb-10">
            {/* Line */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-300 -z-10"></div>

            {STATUS_STEPS.map((label, i) => (
              <div key={i} className="flex flex-col items-center w-1/4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    i <= step ? "bg-green-600 text-white" : "bg-gray-300"
                  }`}
                >
                  {i + 1}
                </div>
                <p
                  className={`mt-2 text-sm ${
                    i <= step ? "font-semibold text-green-600" : "text-gray-500"
                  }`}
                >
                  {label}
                </p>
              </div>
            ))}
          </div>

          {step === 3 && (
            <p className="text-green-700 font-bold text-xl mt-4">
              ✅ Your order has been delivered!
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderStatus;
