import io from "socket.io-client";

// argv to make pollId broadcasting dynamic 
const pollId = parseInt(process.argv[2] || "1");
const socket = io("http://localhost:4000");

socket.on("connect", () => {
  console.log(`Connected: ${socket.id}, joining poll ${pollId}`);
  socket.emit("joinPoll", pollId);
});

socket.on("pollUpdated", (data: any) => {
  console.log(`Poll ${pollId} update:`, data);
});

socket.on("disconnect", () => {
  console.log(`Disconnected: ${socket.id}`);
});