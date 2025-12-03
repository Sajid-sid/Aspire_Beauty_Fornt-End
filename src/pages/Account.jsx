import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "../features/user/userSlice";
import { getUserOrders, getOrderById, clearCurrentOrder } from "../features/orders/ordersSlice";

import { FaUser, FaHeart, FaBell, FaShoppingBag, FaLock } from "react-icons/fa";
import Wishlist from "./Wishlist";
import api from '../api.js'

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";
const BACKEND_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:5001";


const primary = "#001b3d"; // Deep Ocean
const secondary = "#ff5757"; // Corel Red

const Account = () => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.user);
 
  const { orders, currentOrder, orderLoading } = useSelector((state) => state.orders);

  const [fullname, setFullname] = useState(user?.fullname || "");
  const [mobile, setMobile] = useState(user?.mobile || "");
  const [profileFile, setProfileFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [activeTab, setActiveTab] = useState("details");
  const [message, setMessage] = useState("");

  const tabs = [
    { id: "details", label: "User Details", icon: <FaUser /> },
    { id: "update-profile", label: "Update Profile", icon: <FaUser /> },
    { id: "orders", label: "Orders", icon: <FaShoppingBag /> },
    { id: "wishlist", label: "Wishlist", icon: <FaHeart /> },
    { id: "notifications", label: "Notifications", icon: <FaBell /> },
    { id: "password", label: "Update Password", icon: <FaLock /> },
  ];

  // Fetch orders when orders tab is active
  useEffect(() => {
    if (activeTab === "orders" && user?.id) {
      dispatch(getUserOrders(user.id));
    }
  }, [activeTab, user?.id, dispatch]);

  const handleViewOrder = (orderId) => {
    setSelectedOrderId(orderId);
    dispatch(getOrderById(orderId));
  };

  const handleBackToOrders = () => {
    setSelectedOrderId(null);
    dispatch(clearCurrentOrder());
  };

  // Determine final profile image (backend may return full URL)
  const finalProfile =
    user?.profile?.startsWith("http")
      ? user.profile
      : user?.profile
      ? `${BACKEND_URL}/uploads/${user.profile.replace("/uploads/", "")}`
      : "/default-avatar.png";

  const handleProfileUpdate = async () => {
    const formData = new FormData();
    formData.append("fullname", fullname);
    formData.append("mobile", mobile);
    if (profileFile) formData.append("profile", profileFile);

    try {
      const res = await api.put(
        `/users/update-profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage("✅ Profile updated successfully!");
      dispatch(updateUser(res.data.user));
      setPreview(null);
      setProfileFile(null);
    } catch (error) {
      console.error(error);
      setMessage("❌ Profile update failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-5 py-10 md:flex gap-10">
      {/* SIDEBAR */}
      <div className="md:w-1/4 w-full mb-8 md:mb-0">
        <div className="flex flex-col items-center text-center mb-6">
          <img
            src={preview || finalProfile}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-4"
            style={{ borderColor: primary }}
          />

          <h3 className="mt-3 text-xl font-semibold" style={{ color: primary }}>
            {user?.fullname}
          </h3>

          <p className="text-gray-500 text-sm">{user?.email}</p>
          <p className="text-gray-500 text-sm">{user?.mobile}</p>
        </div>

        <div className="flex flex-col gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 p-3 rounded-md text-sm font-medium transition-all border ${
                activeTab === tab.id
                  ? "text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
              style={{
                backgroundColor: activeTab === tab.id ? primary : "",
                borderColor: activeTab === tab.id ? primary : "#ddd",
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="md:w-3/4 w-full">
        {/* MESSAGE */}
        {message && (
          <p
            className={`mb-4 text-center font-medium ${
              message.includes("❌") ? "text-red-500" : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}

        {/* USER DETAILS */}
        {activeTab === "details" && (
          <div>
            <h2 className="text-2xl font-semibold mb-5" style={{ color: primary }}>
              User Details
            </h2>

            <div className="space-y-2 text-gray-700">
              <p><strong>Name:</strong> {user?.fullname}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Mobile:</strong> {user?.mobile}</p>
            </div>
          </div>
        )}

        {/* UPDATE PROFILE */}
        {activeTab === "update-profile" && (
          <div>
            <h2 className="text-2xl font-semibold mb-5" style={{ color: primary }}>
              Update Profile
            </h2>

            <form
              className="flex flex-col gap-5"
              onSubmit={(e) => {
                e.preventDefault();
                handleProfileUpdate();
              }}
            >
              <div className="flex flex-col items-center">
                <img
                  src={preview || finalProfile}
                  alt="Profile"
                  className="w-28 h-28 rounded-full object-cover border-4 mb-3"
                  style={{ borderColor: primary }}
                />

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="profileUpload"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setProfileFile(file);
                      setPreview(URL.createObjectURL(file));
                    }
                  }}
                />

                <label
                  htmlFor="profileUpload"
                  className="cursor-pointer text-white text-sm px-4 py-2 rounded-md"
                  style={{ backgroundColor: primary }}
                >
                  Change Photo
                </label>
              </div>

              <div>
                <label className="block mb-1 font-medium" style={{ color: primary }}>
                  Full Name
                </label>
                <input
                  type="text"
                  className="border p-3 rounded-md w-full"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                />
              </div>

              <div>
                <label className="block mb-1 font-medium" style={{ color: primary }}>
                  Mobile Number
                </label>
                <input
                  type="text"
                  className="border p-3 rounded-md w-full"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="text-white p-3 rounded-md font-medium"
                style={{ backgroundColor: primary }}
              >
                Save Changes
              </button>
            </form>
          </div>
        )}

        {/* ORDERS */}
        {activeTab === "orders" && (
          <div>
            <h2 className="text-2xl font-semibold mb-5" style={{ color: primary }}>
              Your Orders
            </h2>

            {orderLoading && <p>Loading orders...</p>}

            {!orderLoading && !selectedOrderId && orders.length === 0 && (
              <p className="text-gray-600">No orders yet.</p>
            )}

            {!orderLoading && !selectedOrderId && orders.length > 0 && (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="border p-4 rounded-md hover:shadow cursor-pointer"
                    onClick={() => handleViewOrder(order.id)}
                  >
                    <div className="flex justify-between">
                      <p><strong>Order ID:</strong> #{order.id}</p>
                      <p><strong>Status:</strong> {order.orderStatus}</p>
                    </div>
                    <p><strong>Total:</strong> ₹{order.totalAmount}</p>
                    <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                    <p className="text-sm text-gray-500">{order.items.length} item(s)</p>
                  </div>
                ))}
              </div>
            )}

            {!orderLoading && selectedOrderId && currentOrder && (
              <div>
                <button
                  className="mb-4 px-4 py-2 bg-gray-200 rounded-md"
                  onClick={handleBackToOrders}
                >
                  ← Back to Orders
                </button>

                <h3 className="text-xl font-semibold mb-3">Order #{currentOrder.id}</h3>
                <p><strong>Status:</strong> {currentOrder.orderStatus}</p>
                <p><strong>Total:</strong> ₹{currentOrder.totalAmount}</p>
                <p><strong>Date:</strong> {new Date(currentOrder.createdAt).toLocaleString()}</p>

                <div className="mt-4 space-y-2">
                  {currentOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between border-b pb-2">
                      <img
                        src={item.imageUrl} // backend should return full URL
                        alt={item.productName}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div className="flex-1 px-4">
                        <p className="font-semibold">{item.productName}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold">₹{item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* WISHLIST */}
        {activeTab === "wishlist" && (
          <div className="w-full">
            <Wishlist />
          </div>
        )}

        {/* NOTIFICATIONS */}
        {activeTab === "notifications" && (
          <div>
            <h2 className="text-2xl font-semibold mb-5" style={{ color: primary }}>
              Notifications
            </h2>
            <p className="text-gray-600">No new notifications.</p>
          </div>
        )}

        {/* PASSWORD */}
        {activeTab === "password" && (
          <div>
            <h2 className="text-2xl font-semibold mb-5" style={{ color: primary }}>
              Update Password
            </h2>

            <form className="flex flex-col gap-4">
              <input type="password" placeholder="Current Password" className="border p-3 rounded-md w-full" />
              <input type="password" placeholder="New Password" className="border p-3 rounded-md w-full" />
              <input type="password" placeholder="Confirm New Password" className="border p-3 rounded-md w-full" />

              <button
                type="submit"
                className="text-white p-3 rounded-md font-medium"
                style={{ backgroundColor: primary }}
              >
                Update Password
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Account;
