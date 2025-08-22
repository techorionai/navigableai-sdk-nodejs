import { config } from "process";
import { IActionHandler } from "./actionHandler.js";
import {
  IChatGetMessageOptions,
  IChatGetMessageResponse,
  IChatSendMessageOptions,
  IChatSendMessageResponse,
  IChatListSessionsResponse,
} from "./chat.js";
import { API_KEY_HEADER, ENDPOINTS, HOSTNAME } from "./consts.js";
import request from "./request.js";
import { createHmac } from "crypto";

/**
 * Nodejs Client for Navigable AI
 */
export default class NavigableAI {
  private apiKey: string;
  private sharedSecretKey: string | undefined = undefined;
  public actionHandlers: Record<string, IActionHandler> = {};

  /**
   * Create an instance of NavigableAIClient for a single model
   *
   * @param apiKey API key for a model in Navigable AI
   * @param sharedSecretKey Shared secret key between your server and client. Use any random string, ensure it is the same on the server and client. If provided, each request will verify the signature coming from the client.
   */
  constructor(apiKey: string, sharedSecretKey?: string) {
    if (!apiKey || !apiKey.trim().length) {
      throw new Error("Navigable AI: Error: API key is required");
    }
    this.apiKey = apiKey;

    if (sharedSecretKey) {
      this.sharedSecretKey = sharedSecretKey;
    }
  }

  /**
   * Get the last 20 messages in the last conversation by your user's unique identifier
   *
   * @param identifier Your user's unique identifier
   */
  async getMessages(identifier: string, options?: IChatGetMessageOptions) {
    try {
      if (this.sharedSecretKey) {
        if (!options?.signature) {
          throw new Error("Signature is required when using shared secret key");
        }

        const isValid = await this.verifyRequestSignature(
          identifier,
          options?.signature
        );
        if (!isValid) {
          throw new Error("Invalid signature");
        }
      }

      const res = await request<IChatGetMessageResponse>({
        hostname: HOSTNAME,
        method: ENDPOINTS.GET_MESSAGES.method,
        path: ENDPOINTS.GET_MESSAGES.path + `?identifier=${identifier}`,
        headers: {
          [API_KEY_HEADER]: this.apiKey,
        },
      });

      return res;
    } catch (err) {
      console.error({
        identifier,
        options,
      });
      if (err instanceof Error) {
        console.error("Navigable AI: Error: " + err.message);
      } else {
        console.error("Navigable AI: Error: " + err);
      }
      return null;
    }
  }

  /**
   * Send a message to Navigable AI and get a response from the assistant.
   *
   * @param message  Message to send
   * @param options Options
   * @returns Response object or null
   */
  async sendMessage(message: string, options?: IChatSendMessageOptions) {
    try {
      if (this.sharedSecretKey) {
        if (!options?.signature) {
          throw new Error("Signature is required when using shared secret key");
        }

        const isValid = await this.verifyRequestSignature(
          message,
          options?.signature
        );
        if (!isValid) {
          throw new Error("Invalid signature");
        }
      }

      const res = await request<IChatSendMessageResponse>(
        {
          hostname: HOSTNAME,
          method: ENDPOINTS.SEND_MESSAGE.method,
          path: ENDPOINTS.SEND_MESSAGE.path,
          headers: {
            [API_KEY_HEADER]: this.apiKey,
            "Content-Type": "application/json",
          },
        },
        {
          message,
          identifier: options?.identifier,
          new: options?.new,
          markdown: options?.markdown,
          currentPage: options?.currentPage,
          configuredActions: options?.configuredActions,
          configuredFunctions: options?.configuredFunctions,
          functionCallId: options?.functionCallId,
        }
      );

      return res;
    } catch (error) {
      console.error({
        message,
        options,
      });
      if (error instanceof Error) {
        console.error("Navigable AI: Error: " + error.message);
      } else {
        console.error("Navigable AI: Error: " + error);
      }
      return null;
    }
  }

  /**
   * Register an action handler.
   *
   * The action handler will run when the assistant responds with a suitable action that can be taken by the user.
   *
   * @param actionName Name of the action in Navigable AI
   * @param handler Function to handle the action
   */
  registerActionHandler(actionName: string, handler: IActionHandler) {
    this.actionHandlers[actionName] = handler;
  }

  /**
   * Verifies the signature of a payload sent from the client.
   *
   * This will compare the signature sent in the request with a signature generated
   * using the same shared secret key. If the two match, the request is deemed valid.
   *
   * @param payload The payload used to verify the signature
   * @param signature The signature sent from the client
   * @returns A Promise that resolves to a boolean indicating if the signature is valid
   */
  private verifyRequestSignature(
    payload: string,
    signature: string
  ): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.sharedSecretKey) {
        const expectedSignature = createHmac("sha256", this.sharedSecretKey)
          .update(payload)
          .digest("hex");
        resolve(expectedSignature === signature);
      } else {
        resolve(true);
      }
    });
  }
  /**
   * List chat sessions for a user identifier.
   * @param identifier User's unique identifier
   * @param options Optional signature for verification
   */
  async listChatSessions(identifier: string, options?: IChatGetMessageOptions) {
    try {
      if (this.sharedSecretKey) {
        if (!options?.signature) {
          throw new Error("Signature is required when using shared secret key");
        }
        const isValid = await this.verifyRequestSignature(
          identifier,
          options.signature
        );
        if (!isValid) {
          throw new Error("Invalid signature");
        }
      }

      const res = await request<IChatListSessionsResponse>({
        hostname: HOSTNAME,
        method: ENDPOINTS.GET_CHAT_SESSIONS.method,
        path: ENDPOINTS.GET_CHAT_SESSIONS.path + `?identifier=${identifier}`,
        headers: {
          [API_KEY_HEADER]: this.apiKey,
        },
      });

      return res;
    } catch (err) {
      console.error({
        identifier,
        options,
      });
      if (err instanceof Error) {
        console.error("Navigable AI: Error: " + err.message);
      } else {
        console.error("Navigable AI: Error: " + err);
      }
      return null;
    }
  }

  /**
   * Get messages by chat session ID.
   * @param sessionId Chat session ID
   * @param identifier User's unique identifier
   * @param options Optional signature for verification
   */
  async getMessagesBySessionId(
    sessionId: string,
    identifier: string,
    options?: IChatGetMessageOptions
  ) {
    try {
      if (this.sharedSecretKey) {
        if (!options?.signature) {
          throw new Error("Signature is required when using shared secret key");
        }
        const isValid = await this.verifyRequestSignature(
          identifier,
          options.signature
        );
        if (!isValid) {
          throw new Error("Invalid signature");
        }
      }

      const res = await request<IChatGetMessageResponse>({
        hostname: HOSTNAME,
        method: ENDPOINTS.GET_SESSION_MESSAGES.method,
        path:
          ENDPOINTS.GET_SESSION_MESSAGES.path +
          `${sessionId}?identifier=${identifier}`,
        headers: {
          [API_KEY_HEADER]: this.apiKey,
        },
      });

      return res;
    } catch (err) {
      console.error({
        sessionId,
        identifier,
        options,
      });
      if (err instanceof Error) {
        console.error("Navigable AI: Error: " + err.message);
      } else {
        console.error("Navigable AI: Error: " + err);
      }
      return null;
    }
  }
}
