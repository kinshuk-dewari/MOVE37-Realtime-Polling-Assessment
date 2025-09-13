
# Move37 Realtime Polling

A real-time polling application built with **Node.js**, **Express**, **Prisma**, **PostgreSQL**, and **JWT authentication**.  
Users can register, log in, and create or vote on polls with multiple options.  

---

## Features
- User authentication with JWT
- Create polls with multiple options
- Fetch all polls (with options + vote counts)
- Fetch a single poll by ID
- Real-time-ready design with Prisma + PostgreSQL
- Fully tested with **Jest** + **Supertest**

---

## Tech Stack
- **Backend:** Node.js, Express, WebSocket, Socket.io
- **Database:** PostgreSQL (via Prisma ORM)
- **Auth:** JWT (JSON Web Tokens)
- **Testing:** Jest, Supertest

---

## Getting Started

### 1.  Clone the Repository
```bash
git clone https://github.com/your-username/move37-realtime-polling.git
cd move37-realtime-polling
````

### 2.  Install Dependencies

```bash
npm install
```

### 3.  Setup Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/pollsdb?schema=public"
JWT_SECRET="this@#is>?my%secret+_key"
PORT=6969
```

Replace the DATABASE_URL with the postgressql 
### 4.  Setup Database with Prisma

Migrating the database and generating Prisma Client
```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 5.  Run the Server

```bash
npm run dev
```

Server will start at: **[http://localhost:5000](http://localhost:6969)**

---
### 6.  Run the WebSocket

```bash
npm run test:ws 3
```
<p>Here, 3 is the pollId of the poll you want to see live updates of.[you can enter pollId of any poll you want to see]
When you run this, the WebSocket client (src/test/testClient.ts) connects to the server and joins the poll room poll_3.
 You’ll then start receiving real-time updates such as new votes, live vote counts, and poll events for that poll.
</p>

---

## Running Tests

### Run **all tests**

```bash
npm run test
```

### Run **auth tests only**

```bash
npm run test:auth
```

### Run **poll tests only**

```bash
npm run test:poll
```

---

## API Endpoints

### Auth Routes

* `POST /api/auth/register` → Register a new user
  **Body:**

  ```json
  {
    "name": "Kinshuk",
    "email": "sampleKinshuk@email.com",
    "password": "Password"
  }

* `POST /api/auth/login` → Login & receive JWT
  **Body:**

  ```json
  {
    "username": "Kinshuk",
    "password": "Password"
  }

### Poll Routes (protected)

* `POST /api/polls` → Create a new poll
  **Body:**

  ```json
  {
    "question": "What is your name ?",
    "options": ["Kinshuk", "Hutu", "Monu"]
  }
  ```
* `GET /api/polls` → Fetch all polls
* `GET /api/polls/:id` → Fetch single poll by ID
### Vote Routes (protected)

* `POST /api/castVote` → casts a poll
 enter (pollId) id of the poll that was created  and the (pollId) id of the option
  **Body:**
  ```json
  {
    "pollId": 1,
    "optionId": 4
  }
  ```

---

## Folder Structure

```
src/
 ├── app.ts              # Express app setup
 ├── server.ts           # Entry point
 ├── controllers/        # Route handlers
 │   ├── userController.ts
 │   └── pollController.ts
 │   └── voteController.ts
 ├── middlewares/        # Auth middleware
 │   └── authMiddleware.ts
 ├── routes/             # API routes
 │   ├── index.ts
 │   └── pollRoutes.ts
 │   └── userRoutes.ts
 │   └── voteRoutes.ts
 ├── test/               # Jest tests
 │   ├── auth.test.ts
 │   ├── poll.test.ts
 │   ├── vote.test.ts
 │   ├── testClient.ts
 │   └── setup.ts
 ├── utils/               # utils for Prisma
 │   └── setup.ts
 ├── websocket/               # Web Socket
 │   └── sockets.ts
 └── prisma/             # Prisma schema
     └── schema.prisma
```

---

## Developer Notes

* JWT token must be included in `Authorization: Bearer <token>` header for poll APIs.
* `req.user` is populated by `authMiddleware` after verifying JWT.

---

