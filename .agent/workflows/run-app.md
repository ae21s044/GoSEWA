---
description: Start the GoSEWA application (backend + frontend)
---

# Run GoSEWA Application

This workflow starts both the backend and frontend servers for the GoSEWA application.

## Steps

### 1. Start the Backend Server

Open a terminal in the project root and run:

```bash
cd c:\Antigravity\GoSEWA
node src/app.js
```

The backend will start on **http://localhost:3000**

### 2. Start the Frontend Development Server

Open a new terminal and run:

```bash
cd c:\Antigravity\GoSEWA\frontend
npm run dev
```

The frontend will start on **http://localhost:5173**

### 3. Access the Application

Open your browser and navigate to:
**http://localhost:5173**

### 4. Login Credentials

Use these test credentials to log in:

- **Email:** `subagent@test.com`
- **Password:** `password123`
- **Role:** GAUSHALA

## Quick Check

To verify if the servers are already running:

```bash
# Check if backend is running (should show node process)
Get-Process node -ErrorAction SilentlyContinue

# Check if frontend is running (should show npm process)
Get-Process npm -ErrorAction SilentlyContinue
```

## Stopping the Application

Press `Ctrl+C` in each terminal window to stop the respective server.
