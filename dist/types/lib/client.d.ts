import { IActionHandler } from "./actionHandler.js";
import { IChatGetMessageResponse, IChatSendMessageOptions, IChatSendMessageResponse } from "./chat.js";
/**
 * Nodejs Client for Navigable AI
 */
export default class NavigableAI {
    private apiKey;
    private actionHandlers;
    /**
     * Create an instance of NavigableAIClient for a single model
     *
     * @param apiKey API key for a model in Navigable AI
     */
    constructor(apiKey: string);
    /**
     * Get the last 20 messages in the last conversation by your user's unique identifier
     *
     * @param identifier Your user's unique identifier
     */
    getMessages(identifier: string): Promise<IChatGetMessageResponse | undefined>;
    /**
     * Send a message to Navigable AI and get a response from the assistant.
     *
     * @param message  Message to send
     * @param options Options
     * @returns Response object or null
     */
    sendMessage(message: string, options?: IChatSendMessageOptions): Promise<IChatSendMessageResponse | null>;
    /**
     * Register an action handler.
     *
     * The action handler will run when the assistant responds with a suitable action that can be taken by the user.
     *
     * @param actionName Name of the action in Navigable AI
     * @param handler Function to handle the action
     */
    registerActionHandler(actionName: string, handler: IActionHandler): void;
}
