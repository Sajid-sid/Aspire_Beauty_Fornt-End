import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../api";
import { useDispatch } from "react-redux";
import { logoutUser } from "../features/user/userSlice";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const handleReset = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." });
      return;
    }

    try {
      const res = await api.post("/users/reset-password", {
        token,
        password,
        confirmPassword,
      });

      if (res.data.success) {
        setMessage({
          type: "success",
          text: "Password reset successful! Redirecting to login...",
        });

        dispatch(logoutUser());
        localStorage.removeItem("token");

        setSearchParams({});

        setTimeout(() => {
          navigate("/user-login");
        }, 1500);
      } else {
        setMessage({
          type: "error",
          text: res.data.message || "Something went wrong.",
        });
      }
    } catch (err) {
      console.error(err);
      setMessage({
        type: "error",
        text: "Reset link is invalid or expired.",
      });
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <form
        onSubmit={handleReset}
        className="bg-white shadow-lg rounded-lg p-8 w-96 border border-gray-200"
      >
        <h2 className="text-2xl font-bold mb-5 text-center text-[#001B3D]">
          Reset Password
        </h2>

        {message && (
          <p
            className={`text-center text-sm mb-3 ${
              message.type === "success"
                ? "text-green-600"
                : "text-[#FF5757]"
            }`}
          >
            {message.text}
          </p>
        )}

        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3 outline-none focus:border-[#001B3D]"
          required
        />

        <input
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 outline-none focus:border-[#001B3D]"
          required
        />

        <button
          type="submit"
          className="w-full bg-[#001B3D] text-white py-2 rounded-md hover:bg-[#00112A] transition"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
