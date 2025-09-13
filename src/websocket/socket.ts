import { Server as HTTPServer } from "http";
import { Server, Socket } from "socket.io";

let io: Server | null = null;

export function initSocket(server: HTTPServer) {
  io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket: Socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("joinPoll", (pollId: number) => {
      const room = `poll_${pollId}`;
      socket.join(room);
      console.log(`${socket.id} joined ${room}`);
    });

    socket.on("leavePoll", (pollId: number) => {
      const room = `poll_${pollId}`;
      socket.leave(room);
      console.log(`${socket.id} left ${room}`);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });
}

export function broadcastPollUpdate(pollId: number, data: any) {
  if (!io) return;
  const room = `poll_${pollId}`;
  io.to(room).emit("pollUpdated", data);
}
