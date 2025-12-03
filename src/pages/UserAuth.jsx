import React, { useState, useEffect } from "react";
import Logo from "../assets/navLogo.png";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../utils/cropImage";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  registerUser,
  loginUser,
  forgotPassword,
  clearMessage,
} from "../features/user/userSlice";

const UserAuth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, message, error, token } = useSelector((state) => state.user);

  const [view, setView] = useState("login");

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    notify: true,
    profile: "",
  });

  // Validation errors
  const [errors, setErrors] = useState({});

  // Cropper states
  const [image, setImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Redirect if logged in
  useEffect(() => {
    if (token) navigate("/");
  }, [token, navigate]);

  useEffect(() => {
    dispatch(clearMessage());
    setErrors({});
  }, [view, dispatch]);

  // ---------------- VALIDATION LOGIC ----------------
  const validate = () => {
    let newErrors = {};

    if (view === "signup") {
      if (!formData.fullname.trim() || formData.fullname.length < 3)
        newErrors.fullname = "Full name must be at least 3 characters";

      if (!/^[0-9]{10}$/.test(formData.mobile))
        newErrors.mobile = "Mobile number must be 10 digits";

      if (!/^\S+@\S+\.\S+$/.test(formData.email))
        newErrors.email = "Enter a valid email";

      if (formData.password.length < 6)
        newErrors.password = "Password must be at least 6 characters";

      if (formData.password !== formData.confirmPassword)
        newErrors.confirmPassword = "Passwords do not match";
    }

    if (view === "login") {
      if (!formData.email) newErrors.email = "Email is required";
      if (!formData.password) newErrors.password = "Password is required";
    }

    if (view === "forgot") {
      if (!/^\S+@\S+\.\S+$/.test(formData.email))
        newErrors.email = "Enter a valid registered email";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Select image
  const onSelectImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imgUrl = URL.createObjectURL(file);
    setImage(imgUrl);
  };

  // Crop apply
  const handleCropDone = async () => {
    if (!croppedAreaPixels) return;

    const cropped = await getCroppedImg(image, croppedAreaPixels);
    setCroppedImage(cropped);
    setFormData({ ...formData, profile: cropped });
    setImage(null);
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });

    // Clear field-specific error immediately
    setErrors({ ...errors, [name]: "" });
  };

  // ---------------- SUBMIT ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      if (view === "signup") {
        const fd = new FormData();
        fd.append("fullname", formData.fullname);
        fd.append("email", formData.email);
        fd.append("mobile", formData.mobile);
        fd.append("password", formData.password);
        fd.append("confirmPassword", formData.confirmPassword);
        fd.append("notify", formData.notify);

        if (croppedImage) {
          const blob = await fetch(croppedImage).then((r) => r.blob());
          fd.append("profile", blob, "profile.png");
        }

        await dispatch(registerUser(fd)).unwrap();
      }

      if (view === "login") {
        await dispatch(
          loginUser({ email: formData.email, password: formData.password })
        ).unwrap();
      }

      if (view === "forgot") {
        await dispatch(forgotPassword({ email: formData.email })).unwrap();
      }
    } catch (err) {
      console.error("Auth Error:", err);
    }
  };

  return (
    <div className="flex justify-center items-center p-3 min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="min-w-[90%] md:min-w-[40%] flex flex-col items-center my-10 
        border-gray-200 border rounded-xl shadow-xl p-8 bg-white"
      >
        <img src={Logo} className="h-28 w-auto mb-3" alt="Aspire Beauty logo" />

        <h3 className="text-[#001B3D] text-xl font-bold mb-6">
          {view === "login"
            ? "LOGIN"
            : view === "signup"
              ? "SIGN UP"
              : "FORGOT PASSWORD"}
        </h3>

        {/* ------------------ SIGNUP ------------------ */}
        {view === "signup" && (
  <>
    {/* Profile upload stays same */}
    <div className="flex flex-col items-center mb-6 w-full">
      <label className="text-sm text-gray-700 mb-2 font-medium">
        Profile Picture
      </label>

      <div className="relative">
        {croppedImage ? (
          <img
            src={croppedImage}
            className="h-28 w-28 rounded-full shadow-md object-cover border-2 border-gray-300"
          />
        ) : (
          <div className="h-28 w-28 rounded-full bg-gray-100 border-2 border-gray-300 flex items-center justify-center shadow-inner">
            <span className="text-gray-500 text-xs">No Image</span>
          </div>
        )}
      </div>

      <label className="mt-3 cursor-pointer bg-gray-100 px-4 py-2 rounded-lg border border-gray-300 text-sm hover:bg-gray-200 transition">
        Choose Image
        <input
          type="file"
          accept="image/*"
          onChange={onSelectImage}
          className="hidden"
        />
      </label>
    </div>

    {/* IMAGE CROPPER POPUP */}
    {image && (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 px-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-5">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
            Adjust Your Profile Photo
          </h3>

          <div className="relative w-full h-64 bg-gray-200 rounded-lg overflow-hidden shadow-inner">
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(c, p) => setCroppedAreaPixels(p)}
            />
          </div>

          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="mt-4 w-full accent-[#001B3D]"
          />

          <div className="flex justify-between mt-5">
            <button
              type="button"
              onClick={() => setImage(null)}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleCropDone}
              className="px-5 py-2 bg-[#001B3D] text-white rounded-lg shadow hover:bg-[#002B5D] transition"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Signup Inputs */}
    {["fullname", "mobile", "email", "password", "confirmPassword"].map(
      (field) => (
       <div key={field} className="w-full flex flex-col items-center">
  <div className="relative min-w-[80%]">
    <input
      type={
        field === "password"
          ? showPassword ? "text" : "password"
          : field === "confirmPassword"
          ? showConfirmPassword ? "text" : "password"
          : field === "mobile"
          ? "text"
          : field
      }
      name={field}
      value={formData[field]}
      onChange={handleChange}
      placeholder={
        field === "fullname"
          ? "Full Name"
          : field === "mobile"
          ? "Mobile Number"
          : field === "email"
          ? "Email Address"
          : field === "password"
          ? "Password"
          : "Confirm Password"
      }
      className="border-gray-300 w-full border rounded-xl p-2 pl-4 pr-12 mt-1 focus:border-[#001B3D]"
      required
    />

    {/* SHOW / HIDE ICON FIXED POSITION */}
    {(field === "password" || field === "confirmPassword") && (
      <span
        onClick={() =>
          field === "password"
            ? setShowPassword(!showPassword)
            : setShowConfirmPassword(!showConfirmPassword)
        }
        className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-xs text-gray-600"
      >
        {field === "password"
          ? showPassword
            ? "Hide"
            : "Show"
          : showConfirmPassword
          ? "Hide"
          : "Show"}
      </span>
    )}
  </div>

  {errors[field] && (
    <p className="text-red-600 text-xs mt-1 w-[80%]">{errors[field]}</p>
  )}
</div>
      )
    )}

    <div className="flex items-center min-w-[80%] mb-3 mt-2">
      <input
        type="checkbox"
        name="notify"
        checked={formData.notify}
        onChange={handleChange}
        className="mr-2 h-4 w-4"
      />
      <label className="text-sm text-gray-700">
        Receive updates & notifications
      </label>
    </div>
  </>
)}


        {/* ------------------ LOGIN ------------------ */}
        {view === "login" && (
          <>
            {/* Email */}
            <div className="w-full flex flex-col items-center">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="border-gray-300 min-w-[80%] border rounded-xl p-2 px-4 mt-1 focus:border-[#001B3D]"
                required
              />
              {errors.email && (
                <p className="text-red-600 text-xs mt-1 w-[80%]">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="relative min-w-[80%] mt-3">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="border-gray-300 w-full border rounded-xl p-2 px-4 pr-12 focus:border-[#001B3D]"
                required
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 text-sm"
              >
                {showPassword ? "Hide" : "Show"}
              </span>
            </div>

            <p
              className="text-sm text-[#001B3D] cursor-pointer mt-3 hover:underline"
              onClick={() => setView("forgot")}
            >
              Forgot Password?
            </p>
          </>
        )}

        {/* ------------------ FORGOT PASSWORD ------------------ */}
        {view === "forgot" && (
          <div className="w-full flex flex-col items-center">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your registered email"
              className="border-gray-300 min-w-[80%] border rounded-xl p-2 px-4 mt-1 focus:border-[#001B3D]"
              required
            />
            {errors.email && (
              <p className="text-red-600 text-xs mt-1 w-[80%]">
                {errors.email}
              </p>
            )}
          </div>
        )}

        {/* ------------------ SUBMIT BUTTON ------------------ */}
        <button
          type="submit"
          disabled={loading}
          className={`my-4 bg-[#001B3D] text-white p-2 px-5 rounded hover:bg-[#002B5D] transition ${loading && "opacity-50 cursor-not-allowed"
            }`}
        >
          {loading
            ? "Please wait..."
            : view === "login"
              ? "Login"
              : view === "signup"
                ? "Sign Up"
                : "Send Reset Link"}
        </button>

        {/* Message */}
        {(message || error) && (
          <p
            className={`text-sm text-center ${message ? "text-green-600" : "text-[#FF5757]"
              }`}
          >
            {message || error}
          </p>
        )}

        {/* Footer */}
        <div className="text-sm text-gray-600 mt-4">
          {view === "login" ? (
            <>
              Don’t have an account?{" "}
              <span
                className="text-[#001B3D] cursor-pointer hover:underline"
                onClick={() => setView("signup")}
              >
                Sign Up
              </span>
            </>
          ) : view === "signup" ? (
            <>
              Already have an account?{" "}
              <span
                className="text-[#001B3D] cursor-pointer hover:underline"
                onClick={() => setView("login")}
              >
                Login
              </span>
            </>
          ) : (
            <span
              className="text-[#001B3D] cursor-pointer hover:underline"
              onClick={() => setView("login")}
            >
              Back to Login
            </span>
          )}
        </div>
      </form>
    </div>
  );
};

export default UserAuth;
