import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart } from "../features/cart/cartSlice";
import { clearSingleCheckoutItem } from "../features/checkout/checkoutSlice";
import { placeOrder } from "../features/orders/ordersSlice";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
  "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir",
  "Ladakh", "Lakshadweep", "Puducherry"
];

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useSelector((state) => state.user);
  const { items } = useSelector((state) => state.cart);
  const { singleItem, mode } = useSelector((state) => state.checkout);
  const { loading } = useSelector((state) => state.orders);

  const query = new URLSearchParams(location.search);
  const pageMode = query.get("mode") || mode;
  const checkoutItems = pageMode === "single" && singleItem ? [singleItem] : items;

  const subtotal = checkoutItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = 50;
  const grandTotal = subtotal + deliveryFee;

  const [form, setForm] = useState({
    userid: user?.id || 0,
    fullname: user?.fullname || "",
    email: user?.email || "",
    mobile: user?.mobile || "",
    address: "",
    landmark: "",
    addressType: "Home",
    city: "",
    state: "",
    pincode: "",
    latitude: null,
    longitude: null,
  });

  const [pincodeLoading, setPincodeLoading] = useState(false);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      userid: user?.id || prev.userid,
      fullname: user?.fullname || prev.fullname,
      email: user?.email || prev.email,
      mobile: user?.mobile || prev.mobile,
    }));
  }, [user]);

  const fetchCityFromPincode = async (pin) => {
    if (!pin || pin.length !== 6) return;

    try {
      setPincodeLoading(true);
      const res = await axios.get(`https://api.postalpincode.in/pincode/${pin}`);
      const data = res.data;

      if (data[0]?.Status === "Success" && data[0].PostOffice?.length > 0) {
        const po = data[0].PostOffice[0];
        setForm((prev) => ({
          ...prev,
          city: po.District || prev.city,
          state: po.State || prev.state,
        }));
      } else {
        setForm((prev) => ({ ...prev, city: "", state: "" }));
      }
    } finally {
      setPincodeLoading(false);
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;

      setForm((prev) => ({ ...prev, latitude: lat, longitude: lon }));

      try {
        const rev = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
        );
        const data = rev.data;
        const addr = data?.address || {};

        setForm((prev) => ({
          ...prev,
          address: prev.address || data.display_name || "",
          city: prev.city || addr.city || addr.town || addr.village || "",
          state: prev.state || addr.state || "",
          pincode: prev.pincode || addr.postcode || "",
        }));
      } catch { }
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "pincode") {
      const sanitized = value.replace(/\D/g, "").slice(0, 6);
      setForm((prev) => ({ ...prev, pincode: sanitized }));
      if (sanitized.length === 6) fetchCityFromPincode(sanitized);
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

const handlePlaceOrder = async () => {
  // ✅ Required validations
  if (!form.fullname?.trim()) return alert("Please enter full name.");
  if (!form.mobile?.trim()) return alert("Please enter mobile number.");
  if (!form.address?.trim() || !form.city?.trim() || !form.pincode?.trim()) {
    return alert("Please fill all required fields.");
  }

  const orderData = {
    userid: form.userid || 0,
    fullName: form.fullname || "Guest",
    phone: form.mobile || "0000000000",
    email: form.email || "",
    address: form.address,
    landmark: form.landmark || null,
    addressType: form.addressType || "Home",
    city: form.city,
    state: form.state,
    pincode: form.pincode,
    latitude: form.latitude || null,
    longitude: form.longitude || null,
    totalAmount: grandTotal,
    items: checkoutItems.map((item) => ({
      productId: item.productId || item.id,
      variantId: item.variantId || null,
      variantName: item.variantName || null,
      variantImage: item.variantImage || null,
      productName: item.productName || item.name || "Unknown Product",
      price: item.price || 0,
      quantity: item.quantity || 1,
      productImage: item.productImage || item.image1 || null,
    })),
  };

  try {
    const result = await dispatch(placeOrder(orderData));

    if (result.meta.requestStatus === "fulfilled") {
      // ✅ Remove items from cart/localStorage
      if (pageMode === "single" && singleItem) {
        const variantId = singleItem.selectedVariant?.variantId || singleItem.id;
        dispatch(removeFromCart(variantId));
        dispatch(clearSingleCheckoutItem());
      } else {
        // Remove all items being checked out
        checkoutItems.forEach((i) => {
          const variantId = i.selectedVariant?.variantId || i.id;
          dispatch(removeFromCart(variantId));
        });
      }

      // ✅ Navigate to order status page
      navigate(`/order-status?orderId=${result.payload.orderId}`);
    } else {
      alert("Order failed. Please try again.");
    }
  } catch (err) {
    console.error("handlePlaceOrder error:", err);
    alert("Something went wrong. Please try again.");
  }
};



  return (
    <div className="max-w-5xl mx-auto p-6 mt-6">
      <h2 className="text-3xl font-bold text-[#001B3D] mb-8">Checkout</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Delivery Form */}
        <div className="lg:col-span-2 bg-white shadow-lg border rounded-2xl p-6">
          <h3 className="text-xl font-semibold mb-4">Delivery Details</h3>
          <button
            onClick={handleUseCurrentLocation}
            className="bg-green-600 text-white px-4 py-2 rounded-lg mb-4 hover:bg-green-700 transition"
          >
            Use Current Location
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input disabled value={form.fullname} className="border p-3 rounded-lg bg-gray-100" />
            <input disabled value={form.email} className="border p-3 rounded-lg bg-gray-100" />
            <input disabled value={form.mobile} className="border p-3 rounded-lg bg-gray-100" />

            <input
              name="pincode"
              value={form.pincode}
              onChange={handleInputChange}
              placeholder="Pincode"
              className="border p-3 rounded-lg"
            />

            <input
              name="city"
              value={form.city}
              onChange={handleInputChange}
              placeholder="City"
              className="border p-3 rounded-lg"
            />

            <select
              name="state"
              value={form.state}
              onChange={handleInputChange}
              className="border p-3 rounded-lg"
            >
              <option value="">Select State</option>
              {INDIAN_STATES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>

            <textarea
              name="address"
              value={form.address}
              onChange={handleInputChange}
              placeholder="Full Address"
              rows={3}
              className="border p-3 rounded-lg md:col-span-2"
            />

            <input
              type="text"
              name="landmark"
              value={form.landmark}
              onChange={handleInputChange}
              placeholder="Landmark (optional)"
              className="border p-3 rounded-lg md:col-span-2"
            />

            <select
              name="addressType"
              value={form.addressType}
              onChange={handleInputChange}
              className="border p-3 rounded-lg"
            >
              <option value="">Select Address Type</option>
              <option value="Home">Home</option>
              <option value="Work">Work</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white shadow-lg border rounded-2xl p-6 h-fit sticky top-4">
          <h2 className="text-xl font-bold mb-2">Order Summary</h2>
          <p className="text-sm text-[#001B3D] mb-4">
            Total Items: <span className="font-semibold">{checkoutItems.reduce((s, i) => s + i.quantity, 0)}</span>
          </p>

          <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
            {checkoutItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between border-b pb-4">
                <img
                  src={item.selectedVariant?.product_image || item.image1 || item.productImage || "/no-image.png"}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1 px-4">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold">₹{item.price * item.quantity}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 space-y-2 text-base">
            <div className="flex justify-between font-medium">
              <span>Subtotal:</span> <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery:</span> <span>₹{deliveryFee}</span>
            </div>
            <div className="flex justify-between text-xl font-bold border-t pt-3">
              <span>Total:</span>
              <span className="text-green-600">₹{grandTotal}</span>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className="w-full mt-6 bg-[#FF5757] hover:bg-red-600 text-white py-3 rounded-xl font-semibold text-lg transition"
          >
            {loading ? "Placing Order..." : "Confirm & Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
