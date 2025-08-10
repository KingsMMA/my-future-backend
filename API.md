# My Future Backend API Documentation

## Authentication

### POST /auth/login
- **Description:** Log in a user.
- **Request Body:**
  - `email` (string)
  - `password` (string)
- **Access:** Public

### POST /auth/register
- **Description:** Register a new user.
- **Request Body:**
  - `email` (string)
  - `password` (string)
  - `name` (string)
  - `accountType` ("citizen" | "business")
  - `address` (string)
  - `pfp` (Base64 string)
- **Access:** Public

### POST /auth/logout
- **Description:** Log out the current user.
- **Access:** Authenticated users only

### GET /auth/@me
- **Description:** Get the current authentication state data.
- **Access:** Authenticated users only

---

## Users

### GET /users/:uuid
- **Description:** Get user info by UUID.
- **Access:** Government only

### GET /users/@me
- **Description:** Get info for the current authenticated user.
- **Access:** Authenticated users only

---

## Projects

### GET /projects
- **Description:** List all projects.
- **Access:** Public

### POST /projects/:id
- **Description:** Create a new project.
- **Request Body:**
  - `name` (string)
  - `description` (string)
  - `category` (string)
  - `thumbnail` (Base64 string)
  - `goal` (number)
  - `contact` (string)
- **Access:** Government only

### GET /projects/:id
- **Description:** Get project info by ID.
- **Access:** Public

### PUT /projects/:id
- **Description:** Update one or more fields of a project by ID.
- **Request Body:**
  - Any subset of: `name` (string), `description` (string), `category` (string), `thumbnail` (string), `goal` (number), `contact` (string)
- **Access:** Government only

### DELETE /projects/:id
- **Description:** Delete a project by ID.
- **Access:** Government only

---

## Status

### GET /status
- **Description:** Check API/server status.
- **Access:** Public

---

## Example Error Response
```json
{
  "success": false,
  "message": "Missing required field: name"
}
```

---

## Notes on Privileged Endpoints
- Endpoints marked as "Government only" require a government account and valid authentication token.
- Endpoints marked as "Authenticated users only" require a valid login session.
- Other endpoints are public unless otherwise noted.

---

For more details on request/response formats, see the source code or contact the API maintainer.
