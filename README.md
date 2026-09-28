# Placement Tracker — Full Stack Portfolio Project

A mini full-stack web application for tracking job and placement applications.

## Assessment Requirements Covered

- Frontend: React + CSS
- Backend: Node.js + Express.js
- Database: MongoDB
- API: REST API
- CRUD: Create, Read, Update, Delete
- Version control ready: Git + GitHub
- Deployment: optional

## Features

- Dashboard with application statistics
- Add new placement/job applications
- View saved applications from MongoDB
- Edit application details
- Delete applications
- Search by company, role, or location
- Filter by application status
- Application and interview dates
- Notes field
- Form validation and API error handling
- Responsive layout for desktop, tablet, and mobile
- MongoDB persistence
- Health-check endpoint

## Project Structure

```text
placement-tracker/
├── backend/
│   ├── models/
│   │   └── Application.js
│   ├── routes/
│   │   └── applicationRoutes.js
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ApplicationForm.jsx
│   │   │   └── ApplicationList.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
│
└── README.md
```

## REST API

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/applications` | Create application |
| GET | `/api/applications` | Read all applications |
| GET | `/api/applications/:id` | Read one application |
| PUT | `/api/applications/:id` | Update application |
| DELETE | `/api/applications/:id` | Delete application |
| GET | `/api/health` | API/database health check |

The GET endpoint also supports:
- `?q=amazon` — search company, role, or location
- `?status=Interview` — filter by status

## Requirements

Install:
- Node.js
- MongoDB Community Server
- VS Code (recommended)

## Run Locally

### 1. Backend

```bash
cd backend
npm install
```

Create a `.env` file from `.env.example`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/placement_tracker
CLIENT_URL=http://localhost:5173
```

Start:

```bash
npm run dev
```

or:

```bash
npm start
```

Backend runs at:

`http://localhost:5000`

### 2. Frontend

Open a second terminal:

```bash
cd frontend
npm install
```

Create `.env` from `.env.example` if required:

```env
VITE_API_URL=http://localhost:5000/api/applications
```

Start:

```bash
npm run dev
```

Frontend runs at the Vite URL shown in the terminal, normally:

`http://localhost:5173`

## MongoDB

The application uses the local database:

```text
placement_tracker
```

MongoDB Compass can be used to inspect the database and documents.

## GitHub

Before pushing:

```bash
git init
git add .
git commit -m "Build placement tracker full stack application"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

Do not commit `.env` files or `node_modules`.

## Portfolio / Presentation Explanation

A concise way to explain the architecture:

> "The application uses React for the frontend, Express and Node.js for the REST API, and MongoDB with Mongoose for persistence. The frontend communicates with the backend using HTTP requests. The backend exposes CRUD endpoints for placement applications, while MongoDB stores the application records. The dashboard calculates status-based statistics from the retrieved records."

## Future Enhancements

- Authentication and user-specific application data
- Charts and analytics
- Email reminders for interviews
- Cloud deployment
- Role-based access control


## Advanced features
- Priority levels (Low / Medium / High)
- Application source and job URL tracking
- Interview and follow-up dates
- Status pipeline analytics
- Upcoming interviews and next-action panels
- Search, status filtering, and sorting
- CSV export
- Light/dark mode with browser persistence

## Enhanced navigation and job board
The frontend now includes Dashboard, Applications, Job Board, Analytics, and Settings navigation. The Job Board contains selected official openings verified on 28 September 2026 and lets users pre-fill an application record before applying.
