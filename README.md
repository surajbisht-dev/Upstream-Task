# Upstream — Full-Stack (MERN) Practical Assessment

This project is a small end-to-end MERN application built as part of the Upstream Full-Stack practical assessment.  
It demonstrates backend API design, secure approval flows, dependency handling, risk analysis, and exporting dashboard widgets to a branded PowerPoint file.

---

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (for secure one-time approval action tokens)
- Joi / Zod (validation)
- Nodemon
- Jest + Supertest (testing)
- PptxGenJS (PowerPoint generation)

### Frontend
- React (Vite)
- Tailwind CSS
- Axios (API calls)
- React Router DOM
- Recharts (risk charts)
- html-to-image (convert widgets to images for export)

---

## Features Implemented

### 1) Email-Based Approval with One-Click Actions
- Create approval requests with title, description, and approver email.
- Backend generates **Approve / Reject / Hold** links with:
  - Expiration time
  - One-time usage (no replay allowed)
- Clicking a link updates the approval status without login.
- A simple confirmation page is shown after action.
- Frontend lists all approvals and reflects status updates.
- Email sending is simulated using console links (deliverability not required).

---

### 2) Tasks with Dependencies
- Create, edit, and delete tasks.
- Add multiple dependencies to tasks.
- Tasks are automatically grouped as:
  - Blocked
  - Active
  - Done
- Cycle detection is implemented and a warning is shown if a cycle exists.

---

### 3) Risk Analysis Dashboard
- Rule-based risk scoring system (0–100).
- Risk calculation considers:
  - Unresolved dependencies
  - Task status
  - Due date proximity
- Dashboard displays:
  - Top 5 riskiest tasks
  - Bar chart showing risk per task
  - Short explanation (rationale) for each task

---

### 4) Export Dashboard to PowerPoint (.pptx)
- User can select multiple widgets from the dashboard.
- Export page allows basic branding:
  - Title
  - Primary color
  - Footer text
  - Optional logo upload
- Widgets are exported as images to preserve visual appearance.
- Backend generates a PowerPoint file and provides a download link.
- Handles empty selections and large exports gracefully.

---
## Problems Faced (and Fixes)

### 1) PowerShell `curl -X` not working
- **Issue:** In PowerShell, `curl` is an alias of `Invoke-WebRequest`, so commands like `curl -X POST ...` fail with parameter errors.
- **Fix:** Used PowerShell-native commands instead:
  - `Invoke-RestMethod -Method Post -Uri "http://localhost:5000/api/dev/seed"`

### 2) PptxGenJS module import issues (JSZip / ESM/CJS mismatch)
- **Issue:** While generating PPT files, module errors appeared such as:
  - `Cannot use import statement outside a module`
  - package export path issues
- **Fix:** Kept backend in ESM mode and used correct imports:
  - Set `"type": "module"` in `package.json`
  - Used: `import PptxGenJS from "pptxgenjs"`

### 3) CORS issues between frontend and backend
- **Issue:** Browser blocked API calls when frontend and backend ran on different ports/domains.
- **Fix:** Updated CORS configuration in backend to allow frontend requests during development and make deployment easier.

### 4) Export widget capture dependency
- **Issue:** Initially, exporting required opening the Risk Dashboard first because widget DOM needed to exist for screenshot capture.
- **Fix:** Export page now renders the selected widgets in a hidden/offscreen area and captures images from there, so export works directly.

---
## Setup & Run (Local)

### Backend
```bash
cd backend
npm install
npm run dev

### Frontend
```bash
cd frontend
npm install
npm run dev

