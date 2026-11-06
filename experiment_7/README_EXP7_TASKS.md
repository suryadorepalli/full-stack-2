# EXP-7 — Task Management + Paginated GET Posts

## Backend
Spring Boot runs on `http://localhost:8080`.

### Test users
- Admin: `admin` / `admin123`
- User: `user` / `user123`

### Task APIs
- `POST /api/tasks` — ADMIN or USER
- `GET /api/tasks?page=0&size=5` — ADMIN or USER, paginated
- `PUT /api/tasks/{id}` — ADMIN can edit any task; USER can edit only their own task
- `DELETE /api/tasks/{id}` — ADMIN ONLY

The delete restriction is enforced in Spring Security with:

`@PreAuthorize("hasRole('ADMIN')")`

Therefore hiding the Delete button in React is only the UI restriction; the API itself also rejects a normal user.

## Frontend
Run from `frontend`:

```bash
npm install
npm run dev
```

The dashboard contains the Create/Edit task card. The **GET POSTS** button opens `/posts`, where tasks are fetched from the backend in pages of 5.

## Important behavior
Creating a task does not call the GET-all endpoint. The full list is loaded only when the user opens **GET POSTS**.
