import { IActionHandler } from "./actionHandler.js";
import {
  IChatGetMessageResponse,
  IChatSendMessageOptions,
  IChatSendMessageResponse,
} from "./chat.js";
import { API_KEY_HEADER, ENDPOINTS, HOSTNAME } from "./consts.js";
import request from "./request.js";

/**
 * Nodejs Client for Navigable AI
 */
export default class NavigableAI {
  private apiKey: string;
  private actionHandlers: Record<string, IActionHandler> = {};

  /**
   * Create an instance of NavigableAIClient for a single model
   *
   * @param apiKey API key for a model in Navigable AI
   */
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Get the last 20 messages in the last conversation by your user's unique identifier
   *
   * @param identifier Your user's unique identifier
   */
  async getMessages(identifier: string) {
    try {
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
      if (err instanceof Error) {
        console.error("Navigable AI: Error: " + err.message);
      } else {
        console.error("Navigable AI: Error: " + err);
      }
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
        }
      );

      if (res.statusCode === 200 && res.data.action) {
        if (
          this.actionHandlers[res.data.action] &&
          !options?.omitActionHandler
        ) {
          this.actionHandlers[res.data.action](
            res.data.action,
            res.data.identifier
          );
        }
      }

      return res;
    } catch (error) {
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
}
