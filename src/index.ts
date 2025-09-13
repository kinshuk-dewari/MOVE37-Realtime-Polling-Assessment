import http from "http";
import app from "./app";
import { initSocket } from "./websocket/socket";

const PORT = process.env.PORT || 4000;

// creating a http server
const server = http.createServer(app);

// initializing websocket on the http server
initSocket(server);

// starting server
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
