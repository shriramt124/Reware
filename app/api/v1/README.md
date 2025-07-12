# ReWear API Documentation

## Overview

This document provides details about the ReWear API endpoints, which enable the functionality of the ReWear platform - a community clothing exchange application that promotes sustainable fashion through direct swaps and a point-based redemption system.

## Base URL

```
/api/v1
```

## Authentication

Most endpoints require authentication using a JWT token. Include the token in the Authorization header:

```
Authorization: Bearer <your_token>
```

## Response Format

All API responses follow a standard format:

```json
{
  "success": true|false,
  "message": "Optional message about the operation",
  "data": { /* Response data */ }
}
```

## Error Handling

Errors return appropriate HTTP status codes and include a descriptive message:

```json
{
  "success": false,
  "message": "Error description"
}
```

## Endpoints

### Authentication

#### Register

- **URL**: `/auth/register`
- **Method**: `POST`
- **Auth Required**: No
- **Description**: Register a new user account
- **Request Body**:
  ```json
  {
    "name": "User Name",
    "email": "user@example.com",
    "password": "securepassword"
  }
  ```
- **Success Response**: `201 Created`

#### Login

- **URL**: `/auth/login`
- **Method**: `POST`
- **Auth Required**: No
- **Description**: Authenticate a user and receive a token
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword"
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "token": "jwt_token_here",
      "user": {
        "id": "user_id",
        "name": "User Name",
        "points": 75
      }
    }
  }
  ```

### Items

#### List Items

- **URL**: `/items`
- **Method**: `GET`
- **Auth Required**: No
- **Description**: Get a list of available items with optional filtering
- **Query Parameters**:
  - `category`: Filter by category
  - `size`: Filter by size
  - `condition`: Filter by condition
  - `search`: Search in title and description
  - `sort`: Sort field (uploadDate, pointsValue)
  - `order`: Sort order (asc, desc)
  - `page`: Page number for pagination
  - `limit`: Items per page
- **Success Response**: `200 OK`

#### Create Item

- **URL**: `/items`
- **Method**: `POST`
- **Auth Required**: Yes
- **Description**: Create a new item listing
- **Request Body**:
  ```json
  {
    "title": "Item Title",
    "description": "Item description",
    "category": "Category",
    "size": "Size",
    "condition": "Condition",
    "images": ["image_url_1", "image_url_2"],
    "tags": ["tag1", "tag2"]
  }
  ```
- **Success Response**: `201 Created`

#### Get Item

- **URL**: `/items/:id`
- **Method**: `GET`
- **Auth Required**: No
- **Description**: Get details of a specific item
- **Success Response**: `200 OK`

#### Update Item

- **URL**: `/items/:id`
- **Method**: `PUT`
- **Auth Required**: Yes
- **Description**: Update an existing item (only by the uploader)
- **Request Body**: Same as Create Item, but fields are optional
- **Success Response**: `200 OK`

#### Delete Item

- **URL**: `/items/:id`
- **Method**: `DELETE`
- **Auth Required**: Yes
- **Description**: Delete an item (only by the uploader)
- **Success Response**: `200 OK`

#### Report Item

- **URL**: `/items/:id/report`
- **Method**: `POST`
- **Auth Required**: Yes
- **Description**: Report an inappropriate item
- **Request Body**:
  ```json
  {
    "reason": "Reason for report",
    "description": "Detailed description"
  }
  ```
- **Success Response**: `200 OK`

#### Redeem Item

- **URL**: `/items/:id/redeem`
- **Method**: `POST`
- **Auth Required**: Yes
- **Description**: Redeem an item using points
- **Success Response**: `200 OK`

### Swaps

#### Create Swap Request

- **URL**: `/swaps`
- **Method**: `POST`
- **Auth Required**: Yes
- **Description**: Create a new swap request
- **Request Body**:
  ```json
  {
    "requestedItemId": "item_id",
    "offeredItemIds": ["item_id_1", "item_id_2"]
  }
  ```
- **Success Response**: `201 Created`

#### Get User's Swaps

- **URL**: `/swaps`
- **Method**: `GET`
- **Auth Required**: Yes
- **Description**: Get all swap requests for the authenticated user
- **Query Parameters**:
  - `status`: Filter by status (pending, accepted, completed, rejected)
  - `role`: Filter by role (requester, owner)
- **Success Response**: `200 OK`

#### Get Swap

- **URL**: `/swaps/:id`
- **Method**: `GET`
- **Auth Required**: Yes
- **Description**: Get details of a specific swap request
- **Success Response**: `200 OK`

#### Accept Swap

- **URL**: `/swaps/:id/accept`
- **Method**: `PUT`
- **Auth Required**: Yes
- **Description**: Accept a swap request (only by the item owner)
- **Success Response**: `200 OK`

#### Reject Swap

- **URL**: `/swaps/:id/reject`
- **Method**: `PUT`
- **Auth Required**: Yes
- **Description**: Reject a swap request (by either party)
- **Success Response**: `200 OK`

#### Complete Swap

- **URL**: `/swaps/:id/complete`
- **Method**: `PUT`
- **Auth Required**: Yes
- **Description**: Mark a swap as completed (by either party)
- **Success Response**: `200 OK`

### User

#### Get Profile

- **URL**: `/users/profile`
- **Method**: `GET`
- **Auth Required**: Yes
- **Description**: Get the authenticated user's profile
- **Success Response**: `200 OK`

#### Update Profile

- **URL**: `/users/profile`
- **Method**: `PUT`
- **Auth Required**: Yes
- **Description**: Update the authenticated user's profile
- **Request Body**:
  ```json
  {
    "name": "Updated Name",
    "bio": "Updated bio",
    "location": "Updated location",
    "avatar": "avatar_url",
    "preferences": {
      "categories": ["Category1", "Category2"],
      "sizes": ["Size1", "Size2"],
      "notifications": {
        "email": true,
        "swapRequests": true
      }
    }
  }
  ```
- **Success Response**: `200 OK`

#### Get Dashboard

- **URL**: `/users/dashboard`
- **Method**: `GET`
- **Auth Required**: Yes
- **Description**: Get the user's dashboard data including items, swaps, and statistics
- **Success Response**: `200 OK`

#### Get Points

- **URL**: `/users/points`
- **Method**: `GET`
- **Auth Required**: Yes
- **Description**: Get the user's points balance and transaction history
- **Success Response**: `200 OK`

### Admin

#### Approve Items

- **URL**: `/admin/items/approve`
- **Method**: `POST`
- **Auth Required**: Yes (Admin only)
- **Description**: Approve pending items
- **Request Body**:
  ```json
  {
    "itemIds": ["item_id_1", "item_id_2"]
  }
  ```
- **Success Response**: `200 OK`

#### Reject Items

- **URL**: `/admin/items/reject`
- **Method**: `POST`
- **Auth Required**: Yes (Admin only)
- **Description**: Reject pending items
- **Request Body**:
  ```json
  {
    "itemIds": ["item_id_1", "item_id_2"],
    "reason": "Rejection reason"
  }
  ```
- **Success Response**: `200 OK`

#### Get Reports

- **URL**: `/admin/reports`
- **Method**: `GET`
- **Auth Required**: Yes (Admin only)
- **Description**: Get all reported items
- **Query Parameters**:
  - `status`: Filter by status (pending, dismissed, removed)
- **Success Response**: `200 OK`

#### Process Reports

- **URL**: `/admin/reports`
- **Method**: `POST`
- **Auth Required**: Yes (Admin only)
- **Description**: Process reported items (dismiss or remove)
- **Request Body**:
  ```json
  {
    "reportIds": ["report_id_1", "report_id_2"],
    "action": "dismiss" // or "remove"
  }
  ```
- **Success Response**: `200 OK`

#### Add Points

- **URL**: `/users/points`
- **Method**: `POST`
- **Auth Required**: Yes (Admin only)
- **Description**: Add points to a user
- **Request Body**:
  ```json
  {
    "userId": "user_id",
    "amount": 50,
    "reason": "Reason for adding points"
  }
  ```
- **Success Response**: `200 OK`

## Status Codes

- `200 OK`: The request was successful
- `201 Created`: A new resource was successfully created
- `400 Bad Request`: The request was invalid or cannot be served
- `401 Unauthorized`: Authentication is required and has failed or not been provided
- `403 Forbidden`: The authenticated user doesn't have permission to access the requested resource
- `404 Not Found`: The requested resource does not exist
- `500 Internal Server Error`: An error occurred on the server