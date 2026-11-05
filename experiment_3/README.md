# RBAC Authentication Web Project

A React + Vite application demonstrating role-based access control, protected routes, and JWT-style authentication handling in the frontend.

## Features

- Login flow with demo credentials
- Token-based authentication simulation
- Protected routes for authenticated users
- Role-based route guards for Admin, Editor, and Viewer
- Responsive UI with navbar and sidebar
- Fake backend for authentication and authorization logic
- Axios-based service layer

## Tech Stack

- React
- Vite
- React Router DOM
- Axios
- JavaScript
- CSS

## Installation

From the project folder, run:

```bash
npm install
```

## Run the App

Start the development server:

```bash
npm run dev
```

Then open http://localhost:5173/.

## Demo Credentials

- Admin: `admin` / `admin123`
- Editor: `editor` / `editor123`
- Viewer: `viewer` / `viewer123`

## How It Works

1. The user logs in with a demo account.
2. A token is stored locally in the browser.
3. Protected routes check whether the user is authenticated.
4. Role-based guards verify whether the user has permission to access a page.
5. Unauthorized access is redirected to the access-denied screen.

## Roles

- Admin: full access to protected and admin-only pages
- Editor: access to editing-related pages
- Viewer: read-only access

## Author

Built as a frontend practice project for learning RBAC and route protection with React and Vite.
