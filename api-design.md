# ReWear API Design

## Overview

This document outlines the API design for the ReWear platform, a community clothing exchange application that enables users to swap or redeem clothing items using a point-based system.

## Base URL

```
/api/v1
```

## Authentication

### Endpoints

#### Register User

```
POST /auth/register
```

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "string",
    "name": "string",
    "email": "string",
    "points": 0,
    "joinedDate": "string",
    "token": "string"
  }
}
```

#### Login User

```
POST /auth/login
```

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "id": "string",
    "name": "string",
    "email": "string",
    "points": 0,
    "joinedDate": "string",
    "token": "string"
  }
}
```

#### Logout User

```
POST /auth/logout
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

## User Management

### Endpoints

#### Get User Profile

```
GET /users/profile
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "email": "string",
    "points": 0,
    "joinedDate": "string",
    "avatar": "string",
    "successfulSwaps": 0
  }
}
```

#### Update User Profile

```
PUT /users/profile
```

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "avatar": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "string",
    "name": "string",
    "email": "string",
    "points": 0,
    "joinedDate": "string",
    "avatar": "string",
    "successfulSwaps": 0
  }
}
```

## Item Management

### Endpoints

#### Create Item

```
POST /items
```

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "category": "string",
  "size": "string",
  "condition": "string",
  "tags": ["string"],
  "images": ["string"] // Base64 encoded or URLs
}
```

**Response:**
```json
{
  "success": true,
  "message": "Item created successfully and pending approval",
  "data": {
    "id": "string",
    "title": "string",
    "description": "string",
    "category": "string",
    "size": "string",
    "condition": "string",
    "tags": ["string"],
    "images": ["string"],
    "pointsValue": 0,
    "status": "pending",
    "uploadedDate": "string",
    "uploaderId": "string"
  }
}
```

#### Get All Items

```
GET /items
```

**Query Parameters:**
```
category: string
size: string
condition: string
tags: string (comma separated)
search: string
page: number
limit: number
sort: string (newest, oldest, points_high, points_low)
```

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "string",
        "title": "string",
        "description": "string",
        "category": "string",
        "size": "string",
        "condition": "string",
        "tags": ["string"],
        "images": ["string"],
        "pointsValue": 0,
        "status": "available",
        "uploadedDate": "string",
        "uploader": {
          "id": "string",
          "name": "string",
          "avatar": "string"
        }
      }
    ],
    "pagination": {
      "total": 0,
      "page": 0,
      "limit": 0,
      "pages": 0
    }
  }
}
```

#### Get Item by ID

```
GET /items/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "title": "string",
    "description": "string",
    "category": "string",
    "size": "string",
    "condition": "string",
    "tags": ["string"],
    "images": ["string"],
    "pointsValue": 0,
    "status": "available",
    "uploadedDate": "string",
    "uploader": {
      "id": "string",
      "name": "string",
      "avatar": "string",
      "joinedDate": "string",
      "successfulSwaps": 0
    }
  }
}
```

#### Update Item

```
PUT /items/:id
```

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "category": "string",
  "size": "string",
  "condition": "string",
  "tags": ["string"],
  "images": ["string"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Item updated successfully",
  "data": {
    "id": "string",
    "title": "string",
    "description": "string",
    "category": "string",
    "size": "string",
    "condition": "string",
    "tags": ["string"],
    "images": ["string"],
    "pointsValue": 0,
    "status": "available",
    "uploadedDate": "string",
    "uploaderId": "string"
  }
}
```

#### Delete Item

```
DELETE /items/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Item deleted successfully"
}
```

#### Report Item

```
POST /items/:id/report
```

**Request Body:**
```json
{
  "reason": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Item reported successfully"
}
```

## Swap Management

### Endpoints

#### Request Swap

```
POST /swaps
```

**Request Body:**
```json
{
  "itemId": "string",
  "offeredItemIds": ["string"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Swap request sent successfully",
  "data": {
    "id": "string",
    "status": "pending",
    "requestDate": "string",
    "requestedItem": {
      "id": "string",
      "title": "string",
      "image": "string"
    },
    "offeredItems": [
      {
        "id": "string",
        "title": "string",
        "image": "string"
      }
    ],
    "requesterId": "string",
    "ownerId": "string"
  }
}
```

#### Get User's Swap Requests

```
GET /swaps
```

**Query Parameters:**
```
type: string (sent, received, all)
status: string (pending, accepted, rejected, completed)
page: number
limit: number
```

**Response:**
```json
{
  "success": true,
  "data": {
    "swaps": [
      {
        "id": "string",
        "status": "pending",
        "requestDate": "string",
        "requestedItem": {
          "id": "string",
          "title": "string",
          "image": "string"
        },
        "offeredItems": [
          {
            "id": "string",
            "title": "string",
            "image": "string"
          }
        ],
        "requester": {
          "id": "string",
          "name": "string",
          "avatar": "string"
        },
        "owner": {
          "id": "string",
          "name": "string",
          "avatar": "string"
        }
      }
    ],
    "pagination": {
      "total": 0,
      "page": 0,
      "limit": 0,
      "pages": 0
    }
  }
}
```

#### Get Swap by ID

```
GET /swaps/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "status": "pending",
    "requestDate": "string",
    "requestedItem": {
      "id": "string",
      "title": "string",
      "description": "string",
      "image": "string",
      "category": "string",
      "size": "string",
      "condition": "string"
    },
    "offeredItems": [
      {
        "id": "string",
        "title": "string",
        "description": "string",
        "image": "string",
        "category": "string",
        "size": "string",
        "condition": "string"
      }
    ],
    "requester": {
      "id": "string",
      "name": "string",
      "avatar": "string"
    },
    "owner": {
      "id": "string",
      "name": "string",
      "avatar": "string"
    }
  }
}
```

#### Accept Swap

```
PUT /swaps/:id/accept
```

**Response:**
```json
{
  "success": true,
  "message": "Swap accepted successfully",
  "data": {
    "id": "string",
    "status": "accepted"
  }
}
```

#### Reject Swap

```
PUT /swaps/:id/reject
```

**Response:**
```json
{
  "success": true,
  "message": "Swap rejected successfully",
  "data": {
    "id": "string",
    "status": "rejected"
  }
}
```

#### Complete Swap

```
PUT /swaps/:id/complete
```

**Response:**
```json
{
  "success": true,
  "message": "Swap completed successfully",
  "data": {
    "id": "string",
    "status": "completed"
  }
}
```

## Points Management

### Endpoints

#### Redeem Item with Points

```
POST /points/redeem
```

**Request Body:**
```json
{
  "itemId": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Item redeemed successfully",
  "data": {
    "id": "string",
    "item": {
      "id": "string",
      "title": "string",
      "image": "string",
      "pointsValue": 0
    },
    "redeemDate": "string",
    "pointsUsed": 0,
    "remainingPoints": 0
  }
}
```

#### Get User's Points History

```
GET /points/history
```

**Query Parameters:**
```
type: string (earned, spent, all)
page: number
limit: number
```

**Response:**
```json
{
  "success": true,
  "data": {
    "currentPoints": 0,
    "transactions": [
      {
        "id": "string",
        "type": "earned",
        "amount": 0,
        "description": "string",
        "date": "string",
        "relatedItemId": "string"
      }
    ],
    "pagination": {
      "total": 0,
      "page": 0,
      "limit": 0,
      "pages": 0
    }
  }
}
```

## Admin Management

### Endpoints

#### Get Pending Items

```
GET /admin/items/pending
```

**Query Parameters:**
```
page: number
limit: number
```

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "string",
        "title": "string",
        "description": "string",
        "category": "string",
        "size": "string",
        "condition": "string",
        "images": ["string"],
        "uploadedDate": "string",
        "uploader": {
          "id": "string",
          "name": "string",
          "avatar": "string"
        }
      }
    ],
    "pagination": {
      "total": 0,
      "page": 0,
      "limit": 0,
      "pages": 0
    }
  }
}
```

#### Get Reported Items

```
GET /admin/items/reported
```

**Query Parameters:**
```
page: number
limit: number
```

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "string",
        "title": "string",
        "description": "string",
        "category": "string",
        "size": "string",
        "condition": "string",
        "images": ["string"],
        "reportReason": "string",
        "reportedBy": {
          "id": "string",
          "name": "string"
        },
        "reportDate": "string",
        "uploader": {
          "id": "string",
          "name": "string",
          "avatar": "string"
        }
      }
    ],
    "pagination": {
      "total": 0,
      "page": 0,
      "limit": 0,
      "pages": 0
    }
  }
}
```

#### Approve Item

```
PUT /admin/items/:id/approve
```

**Request Body:**
```json
{
  "pointsValue": 0
}
```

**Response:**
```json
{
  "success": true,
  "message": "Item approved successfully",
  "data": {
    "id": "string",
    "status": "available",
    "pointsValue": 0
  }
}
```

#### Reject Item

```
PUT /admin/items/:id/reject
```

**Request Body:**
```json
{
  "reason": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Item rejected successfully"
}
```

#### Dismiss Report

```
PUT /admin/items/:id/dismiss-report
```

**Response:**
```json
{
  "success": true,
  "message": "Report dismissed successfully"
}
```

#### Remove Item

```
DELETE /admin/items/:id
```

**Request Body:**
```json
{
  "reason": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Item removed successfully"
}
```

## Error Handling

All API endpoints will return appropriate HTTP status codes and error messages in the following format:

```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    {
      "field": "field_name",
      "message": "Error message for this field"
    }
  ]
}
```

## Common Status Codes

- 200 OK: Request succeeded
- 201 Created: Resource created successfully
- 400 Bad Request: Invalid request parameters
- 401 Unauthorized: Authentication required
- 403 Forbidden: Insufficient permissions
- 404 Not Found: Resource not found
- 500 Internal Server Error: Server error

## Authentication

All endpoints except for authentication endpoints and public item endpoints require authentication. Authentication is handled using JWT tokens.

The token should be included in the Authorization header of the request:

```
Authorization: Bearer <token>
```