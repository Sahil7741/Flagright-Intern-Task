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
git clone https://github.com/divyaagrawal261/Flagright-Intern-Task.git
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
- Automatically seed the database with:
  - 🔹 Users with shared attributes
  - 🔹 12+ Transactions with direct & indirect links
  - 🔹 Auto-created relationship edges

---

## 📬 API Endpoints

| Route                             | Method | Description                          |
|----------------------------------|--------|--------------------------------------|
| `/user`                          | POST   | Add/update user                      |
| `/relationships/user/:id`        | GET    | Get all relationships of a user      |
| `/transaction`                   | POST   | Create/Update a transaction          |
| `/transaction`                   | GET    | List all transactions with details   |
| `/user`                          | GET    | List all users                       |
| `/relationships/transaction/:id` | GET    | Get all relationships of a transaction |

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

## 🧼 Cleanup

To stop and remove all containers, volumes, and networks:

```bash
docker-compose down -v
```

---

## 📎 Tips

- If `neo4j` container fails health check, increase `timeout` or run manually.
- To re-seed data, delete `.seeded` file in `backend/`.

---

## Demo Video

Follow this link to view the demo video.
It covers complete setup using the Readme file and Demo of all the features provided
[Link](https://youtu.be/DMDzyHnYuvQ)

---

## 🧠 Maintainer

Made with 💡 by [Divya Agrawal](https://github.com/divyaagrawal261)