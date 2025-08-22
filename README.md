# Navigable AI Node SDK

This is a Node.js SDK for interacting with the Navigable AI API, enabling easy integration for chat functionality and message management, including sending messages, retrieving previous conversations, and handling custom actions.

## Installation

Install the package via npm:

```bash
npm install navigableai-node
```

## Basic Instantiation

To use the SDK, you first need to instantiate the `NavigableAI` class with an API key. Optionally, you can also provide a shared secret key for secure message verification.

```typescript
const { NavigableAI } = require("navigableai-node");

const apiKey = "YOUR_API_KEY";
const sharedSecretKey = "YOUR_SHARED_SECRET_KEY"; // Optional, but recommended for added security

const navigableAI = new NavigableAI(apiKey, sharedSecretKey);
```

## Usage

Once the `NavigableAI` instance is created, you can use it to send messages, retrieve conversations, or handle custom actions like contacting support.

### Example: Basic Express Server Setup

```js
const express = require("express");
const { NavigableAI } = require("navigableai-node");

const app = express();
const port = 3000;

// Initialize the Navigable AI client
const apiKey = "YOUR_API_KEY";
const sharedSecretKey = "YOUR_SHARED_SECRET_KEY"; // Optional, but recommended for added security
const navigableAI = new NavigableAI(apiKey, sharedSecretKey);

// Action Handler: Contact Support
navigableAI.registerActionHandler("Contact Support", (uniqueId, context) => {
  console.log(`User with ID ${uniqueId} needs support. Context:`, context);

  // If passing the response object as the context, you can use it to redirect to a different page. Useful for server side routing
  // context.redirect('/support');
});

// Endpoint to send a message to Navigable AI
app.post("/assistant/send-message", express.json(), async (req, res) => {
  const {
    message,
    identifier,
    markdown,
    currentPage,
    configuredActions,
    configuredFunctions,
    functionCallId,
  } = req.body;

  const signature = req.headers["x-request-signature"];

  try {
    const response = await navigableAI.sendMessage(message, {
      identifier,
      new: req.body.new,
      markdown,
      currentPage,
      configuredActions,
      configuredFunctions,
      functionCallId,
      signature,
    });
    if (!response) throw new Error("Failed to send message");

    // Handle action if present
    const action = response?.data?.action;
    if (action && navigableAI.actionHandlers[action]) {
      navigableAI.actionHandlers[action](identifier, res); // Call the registered action handler
    }

    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ error: "Error sending message" });
  }
});

// Endpoint to get the last 20 messages in a conversation
app.get("/assistant/get-messages", async (req, res) => {
  const { identifier } = req.query;

  const signature = req.headers["x-request-signature"];

  try {
    const messages = await navigableAI.getMessages(String(identifier), {
      signature,
    });
    if (!messages) throw new Error("Failed to get messages");

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: "Error retrieving messages" });
  }
});

// Endpoint to get chat sessions for a user
app.get("/assistant/get-chat-sessions", async (req, res) => {
  const { identifier } = req.query;

  const signature = req.headers["x-request-signature"];

  try {
    const sessions = await navigableAI.listChatSessions(String(identifier), {
      signature,
    });
    if (!sessions) throw new Error("Failed to get chat sessions");

    res.status(200).json(sessions);
  } catch (err) {
    res.status(500).json({ error: "Error retrieving chat sessions" });
  }
});

// Endpoint to get messages by chat session ID
app.get("/assistant/get-session-messages/:sessionId", async (req, res) => {
  const { sessionId } = req.params;
  const { identifier } = req.query;

  const signature = req.headers["x-request-signature"];

  try {
    const messages = await navigableAI.getMessagesBySessionId(
      sessionId,
      String(identifier),
      {
        signature,
      }
    );
    if (!messages) throw new Error("Failed to get session messages");

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: "Error retrieving session messages" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
```

### Description of Functions

- **`sendMessage(message: string, options?: IChatSendMessageOptions)`**:

  - Sends a message to Navigable AI and gets a response.
  - The `options` parameter is optional and can include:
    - `identifier`: The unique user identifier (optional).
    - `new`: Start a new conversation (optional).
    - `markdown`: Flag to respond in markdown format (optional).
    - `currentPage`: The current page the user is on (optional).
    - `configuredActions`: The list of configured actions in both Navigable AI and your app (optional).
    - `configuredFunctions`: The list of configured functions in both Navigable AI and your app (optional).
    - `functionCallId`: The ID of the function call (optional). Required when returning the value of a function call.
    - `signature`: The signature of the request if using a shared secret key (optional). Payload is the message.

- **`getMessages(identifier: string, options?: IChatGetMessageOptions)`**:

  - Retrieves the last 20 messages from the conversation for a specific user.
  - The `options` parameter is optional and can include:
    - `signature`: The signature of the request if using a shared secret key (optional). Payload is the identifier.

- **`listChatSessions(identifier: string, options?: IChatGetMessageOptions)`**:

  - Retrieves a list of chat sessions for a specific user.
  - The `options` parameter is optional and can include:
    - `signature`: The signature of the request if using a shared secret key (optional). Payload is the identifier.

- **`getMessagesBySessionId(sessionId: string, identifier: string, options?: IChatGetMessageOptions)`**:

  - Retrieves messages from a specific chat session.
  - The `options` parameter is optional and can include:
    - `signature`: The signature of the request if using a shared secret key (optional). Payload is the identifier.

- **`registerActionHandler(actionName: string, handler: IActionHandler)`**:

  - Registers an action handler function that will run when the assistant suggests an action.
  - The handler function receives a unique identifier and context as arguments.

- **`verifyRequestSignature(message: string, signature: string)`**:
  - Verifies the signature of a request when using a shared secret key (this is a private method and is used internally). Only the signature needs to be passed as part of the options to the `sendMessage` function.

### Action Handler Example

The action handler is a custom function you define to process specific actions that Navigable AI may suggest. For example, if the assistant suggests that the user contact support, the action handler for "Contact Support" will be triggered.

```typescript
navigableAI.registerActionHandler("Contact Support", (uniqueId, context) => {
  console.log(
    `User ${uniqueId} requested support. Context: ${JSON.stringify(context)}`
  );
  // Implement support functionality, such as logging the issue or triggering email notifications.
});
```

When sending a message, the assistant may respond with an action (e.g., "Contact Support"). After receiving the response from the API, check if there is an action and call the registered handler if the action exists:

```typescript
const response = await navigableAI.sendMessage(message, {
  identifier,
  new: req.body.new,
  markdown,
  currentPage,
  configuredActions,
  configuredFunctions,
  functionCallId,
  signature,
});

// If an action exists in the response, handle it
const action = response?.data?.action;
if (action && navigableAI.actionHandlers[action]) {
  navigableAI.actionHandlers[action](identifier, res); // Handle action
}
```

### API Configuration

- **API_KEY**: This key is required to authenticate your requests to Navigable AI. You can obtain it by signing up for the API and creating a new model.
- **Shared Secret Key**: If you wish to verify the integrity of the requests, you can provide a shared secret key. This will require you to send a valid signature in each request, which the server will verify using the key. The key should be a random string, ensure it is the same on the server and client.

### Example Request

Here's an example of how you might send a message from a user:

```json
{
  "message": "Hello, I need help with my account",
  "identifier": "user123",
  "new": true,
  "markdown": false,
  "currentPage": "Dashboard",
  "configuredActions": ["Contact Support"],
  "configuredFunctions": ["Raise a Support Ticket"],
  "functionCallId": "<functionCallId>",
  "signature": "<signature>"
}
```

### Sample Response

A successful response from the API will look like this:

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Message sent successfully",
  "data": {
    "assistantMessage": "How can I assist you with your account?",
    "action": null,
    "identifier": "user123",
    "toolCalls": []
  }
}
```

If there is an error, the response will contain the error details:

```json
{
  "statusCode": <error status code>,
  "success": false,
  "message": "<error message>",
  "errors": {
    "message": "The message cannot be empty"
  }
}
```

For a more detailed explanation of the responses, refer to the [Navigable AI API Documentation](https://www.navigable.ai/docs/category/api).

## API Reference

For more detailed usage, refer to the following types:

### `IChatSendMessageOptions`

```ts
interface IChatSendMessageOptions {
  identifier?: string;
  new?: boolean;
  markdown?: boolean;
  currentPage?: string;
  configuredActions?: string[];
  configuredFunctions?: string[];
  functionCallId?: string;
  signature?: string;
}
```

### `IChatSendMessageResponse`

```ts
interface IChatSendMessageResponse {
  statusCode: number;
  success: boolean;
  message: string;
  errors?: Record<string, string>;
  data: {
    assistantMessage: string;
    action: string | null;
    identifier: string;
    toolCalls: ToolCall[];
  };
}
```

### `ToolCall`

```ts
interface ToolCall {
  id: string;
  type: string;
  function: {
    name: string;
    /**
     * JSON string of arguments
     */
    arguments: string;
  };
}
```

### `IChatGetMessageResponse`

```ts
interface IChatGetMessageResponse {
  statusCode: number;
  success: boolean;
  message: string;
  errors?: Record<string, string>;
  data: {
    sender: "USER" | "ASSISTANT";
    content: string;
    new: boolean;
    createdAt: Date;
    action: string | null;
    toolCalls: ToolCall[];
  }[];
}
```

### License

This project is licensed under the ISC License.

---

Feel free to fork and modify the SDK according to your needs!

---

## Chat Sessions

### List chat sessions for a user

```typescript
import { NavigableAI } from "./src";

const client = new NavigableAI("YOUR_API_KEY");
const sessions = await client.listChatSessions("user@example.com");
console.log(sessions);
```

### Get messages by chat session ID

```typescript
import { NavigableAI } from "./src";

const client = new NavigableAI("YOUR_API_KEY");
const messages = await client.getMessagesBySessionId(
  "SESSION_ID",
  "user@example.com"
);
console.log(messages);
```
