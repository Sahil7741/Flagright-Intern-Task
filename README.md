# 🔍 User & Transactions Relationship Visualization System

This project visualizes user relationships and transaction connections using **Neo4j**, **Express**, and **React** with **Cytoscape.js**. It detects links between users through shared attributes (email, phone, address) and connects transactions via shared IPs or device IDs.

---

## 🗂 Project Structure

```
.
├── backend/           # Express API + Cypher queries + seed data
├── client/            # React + Cytoscape.js frontend
├── docker-compose.yml # Combined services (Neo4j, backend, client)
└── README.md
```

---

## 🚀 Features

- Create and view users & transactions
- Auto-link users via shared email/phone/address
- Auto-link transactions via IP or Device ID
- Visualize graph relationships in real time
- REST APIs for all entities

---

## 🧠 Tech Stack

- ⚡ Neo4j (Graph Database)
- 🔧 Express.js (Backend API)
- 💻 React + MUI + Cytoscape.js (Frontend Visualization)
- 🐳 Docker & Docker Compose (Deployment)

---

## 📦 Prerequisites

- Docker & Docker Compose installed  
  👉 [Install Docker](https://docs.docker.com/get-docker/)

---

## 🏁 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Sahil7741/Flagright-Intern-Task.git
cd Flagright-Intern-Task
```

---

## 🛠 Required Environment Files

Create a `.env` file inside both the `backend/` and `client/` directories:

### 🔹 `backend/.env`
```env
NEO4J_URI=bolt://localhost:7687
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=flagright
```

### 🔹 `client/.env`
```env
VITE_API_URL=http://localhost:5000
```

---

## 📦 Install Dependencies

Before starting Docker Compose, make sure to install project dependencies locally:

```bash
cd backend
npm install

cd ../client
npm install
```

---

## 🚀 Run the Full Stack (Neo4j + Backend + Frontend)

Return to the root directory and run:

```bash
docker-compose up --build
```

This will:
- Start Neo4j on `localhost:7474` (Browser) and `bolt://neo4j:7687`
- Start Backend API on `http://localhost:5000`
- Start Frontend at `http://localhost:5173`
- Optionally generate large-scale synthetic data via the admin endpoint (see below)

Once all three containers report "ready", open a new terminal and load the large synthetic dataset:

```bash
curl -X POST "http://localhost:5000/admin/generate?users=2000&transactions=100000"
```

This call is idempotent and will upsert **100k transactions** together with their user relationships.

---

## 📬 API Endpoints

| Route                             | Method | Description                          |
|----------------------------------|--------|--------------------------------------|
| `/users`                         | POST   | Add or update a user                 |
| `/users`                         | GET    | List users with pagination & search  |
| `/transactions`                  | POST   | Create or update a transaction       |
| `/transactions`                  | GET    | List transactions with pagination & filters |
| `/relationships/user/:id`        | GET    | Get all relationships of a user      |
| `/relationships/transaction/:id` | GET    | Get all relationships of a transaction |
| `/admin/generate`<br>`?users=…&transactions=…` | POST   | Generate synthetic users/transactions |

---

## 👁 Access Services

| Service     | URL                    |
|-------------|------------------------|
| Frontend    | http://localhost:5173  |
| Backend API | http://localhost:5000  |
| Neo4j UI    | http://localhost:7474  |

> Neo4j Login:  
> Username: `neo4j`  
> Password: `flagright`

---

## 🧪 Seeding Details

- 8 Users with shared emails, phones, or addresses
- 12+ Transactions with reused IPs / device IDs
- Bidirectional transaction links via `RELATED_TO`

---

## 🧰 Large-scale Data Generation (100k+ Transactions)

Use the admin endpoint to generate data in batches (idempotent MERGE operations):

```bash
curl -X POST "http://localhost:5000/admin/generate?users=2000&transactions=100000"
```

Notes:
- Defaults: `users=2000`, `transactions=100000` when omitted.
- Shared attributes are intentionally repeated to create `SHARED_ATTRIBUTE` edges.
- Transactions reuse IPs/deviceIds to create `RELATED_TO` edges.
- `seed.js` only inserts a small demo dataset; use this endpoint in demos to satisfy the "100k transactions" requirement.

---

## ✅ Local Verification

If you prefer to run the services without Docker, start them individually after installing dependencies:

```bash
# Terminal 1
cd backend
npm run dev

# Terminal 2
cd client
npm run dev
```

Both commands use hot reload; the backend listens on `http://localhost:5000`, the frontend on `http://localhost:5173`.

> Automated tests and linters are not bundled yet. Add your own under `backend/` and `client/` and wire them into `npm test` / `npm run lint` as needed.

---

## 📄 Pagination, Sorting, and Filtering

### GET `/transactions`
Query parameters:
- `page` (default: 1), `limit` (default: 25, max: 200)
- `sortBy`: `id` | `amount` (default: `id`)
- `direction`: `asc` | `desc` (default: `asc`)
- Filters: `ip`, `deviceId`, `senderId`, `receiverId`, `minAmount`, `maxAmount`

Example:
```bash
curl "http://localhost:5000/transactions?page=1&limit=50&sortBy=amount&direction=desc&ip=192.168.0"
```

Response shape:
```json
{
  "data": [ { "transaction": {"id":"..."}, "sender": {...}, "receiver": {...} } ],
  "page": 1,
  "limit": 50,
  "total": 100000
}
```

### GET `/users`
Query parameters:
- `page`, `limit`, `sortBy` (`id` | `name`), `direction`
- `q` (search across name/email/phone/address/payment_methods)

Example:
```bash
curl "http://localhost:5000/users?page=2&limit=25&sortBy=name&q=gmail.com"
```

Response shape:
```json
{
  "data": [ {"id":"...","name":"..."} ],
  "page": 2,
  "limit": 25,
  "total": 2000
}
```

---

## 🧼 Cleanup

To stop and remove all containers, volumes, and networks:

```bash
docker-compose down -v
```

---

## 📎 Tips

- If `neo4j` container fails its health check, rerun `docker-compose up --build` or wait a few extra seconds before starting dependent services.
- Re-run `curl -X POST "http://localhost:5000/admin/generate"` anytime you need to refresh the large dataset.

---

## Notes

This repository contains a full-stack prototype for visualizing relationships between users and transactions using a graph database, with Dockerized services for local development and demo.