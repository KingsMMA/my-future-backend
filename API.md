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

### GET /users
- **Description:** List all users or provide user-related operations (implementation dependent).
- **Access:** Government only

### GET /users/:uuid
- **Description:** Get user info by UUID.
- **Access:** Government only
- **Response:**
  - `user` object with fields: uuid, email, points, name, accountType, address, pfp, contributedTo

### GET /users/@me
- **Description:** Get info for the current authenticated user.
- **Access:** Authenticated users only
- **Response:**
  - `user` object with fields: uuid, email, points, name, accountType, address, pfp, contributedTo

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

### POST /projects/:id/contribute
- **Description:** Contribute points to a project.
- **Request Body:**
  - `amount` (number): The number of points to contribute.
- **Access:** Authenticated users only
- **Response:**
  - `success` (boolean)
  - `message` (string)
  - `amount` (number): Amount contributed
  - `newProgress` (number): Updated project progress
  - `newPoints` (number): User's new points balance
  - `goal` (number): Project goal
  - `completed` (boolean): Whether the project is now completed

### POST /projects/:id/businessContribution
- **Description:** Contribute points to a project as a business.
- **Request Body:**
  - `amount` (number): The number of points to contribute.
  - `businessName` (string): Name of the business contributing.
  - `businessAddress` (string): Address of the business.
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
