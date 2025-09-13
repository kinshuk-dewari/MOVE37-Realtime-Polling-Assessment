import { Server as HTTPServer } from "http";
import { Server, Socket } from "socket.io";

let io: Server | null = null;

// Initializing Socket.IO
export function initSocket(server: HTTPServer) {
  io = new Server(server, {
    cors: { origin: "*" }, 
  });

  io.on("connection", (socket: Socket) => {
    console.log("Socket connected:", socket.id);


    // Joining a poll room
    socket.on("joinPoll", (pollId: number) => {
      const room = `poll_${pollId}`;
      socket.join(room);
      console.log(`${socket.id} joined ${room}`);
    });

    // Leaving a poll room
    socket.on("leavePoll", (pollId: number) => {
      const room = `poll_${pollId}`;
      socket.leave(room);
      console.log(`${socket.id} left ${room}`);
    });
    
    // Disconnecting from a poll room
    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });
}

// Broadcasting poll update to all clients in the poll room 
export function broadcastPollUpdate(pollId: number, data: any) {
  if (!io) return;
  const room = `poll_${pollId}`;
  io.to(room).emit("pollUpdated", data);
}
