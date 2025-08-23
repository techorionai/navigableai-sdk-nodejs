# New APIs

This document summarizes the endpoints defined in `Navigable Public API.postman_collection.json`.

Environment variables used

- `{{apiUrl}}` — base URL (collection uses `{{apiUrl}}v1`)
- `{{apiKey}}` — API key value sent in the `x-api-key` header

Authentication

- Type: API Key
- Header: `x-api-key: {{apiKey}}`

---

## 1) Get Messages

- Method: GET

- Path: `/v1/chat`

- Query parameters:

  - `identifier` (string) — e.g. `info@techorionai.com` (required)

- Example request:

  - `GET {{apiUrl}}v1/chat?identifier=info@techorionai.com`

- Description: Retrieve messages for the given identifier.

## 2) Send Message

- Method: POST

- Path: `/v1/chat`

- Headers: `Content-Type: application/json`, `x-api-key: {{apiKey}}`

- Body (JSON):

```json
{
  "identifier": "info@techorionai.com",
  "message": "hi"
}
```

- Example request:

  - `POST {{apiUrl}}v1/chat?identifier=info@techorionai.com` (collection includes the identifier as a query param)

- Description: Send a chat message on behalf of the provided identifier.

## 3) Get Chat Sessions

- Method: GET

- Path: `/v1/chat/sessions`

- Query parameters:

  - `identifier` (string) — e.g. `info@techorionai.com` (required)

- Example request:

  - `GET {{apiUrl}}v1/chat/sessions?identifier=info@techorionai.com`

- Description: List chat sessions associated with the identifier.

## 4) Get Messages By Chat Session ID

- Method: GET

- Path: `/v1/chat/sessions/:sessionId`

- Path variables:

  - `sessionId` — example value from collection: `688f3d650b9274b065fd7b34-68920cd8f6e9055435637570`

- Query parameters:

  - `identifier` (string) — e.g. `info@techorionai.com` (required)

- Example request:

  - `GET {{apiUrl}}v1/chat/sessions/688f3d650b9274b065fd7b34-68920cd8f6e9055435637570?identifier=info@techorionai.com`

- Description: Retrieve messages in a specific chat session.

---

Notes

1. For invalid request body/params, the API returns a 400 Bad Request with the response body in the following shape:

```json
{
  "success": false,
  "message": "some error string",
  "errors": {
    "fieldName": "error reason"
  }
}
```

2. For the Send Message API, `identifier` can be passed via either a query parameter or in the request body. This is supported for flexibility.

3. No pagination is implemented at this time.

List Sessions API response example:

```json
{
  "success": true,
  "message": "SUCCESS",
  "data": [
    {
      "id": "688f3d650b9274b065fd7b34-68a47a54bc756b79db21dd14",
      "title": "new message",
      "createdAt": "2025-08-19T13:21:12.251Z",
      "closed": false
    },
    {
      "id": "688f3d650b9274b065fd7b34-68a344a8bc756b79db21dd0f",
      "title": "hello",
      "createdAt": "2025-08-18T15:20:03.093Z",
      "closed": true
    }
  ]
}
```

Note: The "List session messages by session id" endpoint returns the same response structure as the Get Messages API. The Get Messages response shape is defined in `./src/lib/chat.ts`.
