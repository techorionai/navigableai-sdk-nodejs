import { IActionHandler } from "./actionHandler.js";
import { IChatGetMessageResponse, IChatSendMessageOptions, IChatSendMessageResponse } from "./chat.js";
/**
 * Nodejs Client for Navigable AI
 */
export default class NavigableAI {
    private apiKey;
    private sharedSecretKey;
    private actionHandlers;
    /**
     * Create an instance of NavigableAIClient for a single model
     *
     * @param apiKey API key for a model in Navigable AI
     * @param sharedSecretKey Shared secret key between your server and client. Use any random string, ensure it is the same on the server and client. If provided, each request will verify the signature coming from the client.
     */
    constructor(apiKey: string, sharedSecretKey?: string);
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
    /**
     * Verifies the signature of a message sent from the client.
     *
     * This will compare the signature sent in the request with a signature generated
     * using the same shared secret key. If the two match, the request is deemed valid.
     *
     * @param message The message sent from the client
     * @param signature The signature sent from the client
     * @returns A Promise that resolves to a boolean indicating if the signature is valid
     */
    private verifyRequestSignature;
}
