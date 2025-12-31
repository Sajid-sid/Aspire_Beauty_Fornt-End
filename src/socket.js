import { io } from "socket.io-client";


const socket = io(import.meta.env.VITE_BACKEND_URL, {
  transports: ["websocket"],
  withCredentials: true,
});

socket.on("connect", () => {
  // console.log("Customer socket connected:", socket.id);
});

socket.on("connect_error", (err) => {
  console.error("Customer socket error:", err.message);
});

socket.on("disconnect", (reason) => {
  console.log("Customer socket disconnected:", reason);
});

export default socket;
