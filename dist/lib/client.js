"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const consts_js_1 = require("./consts.js");
const request_js_1 = __importDefault(require("./request.js"));
const crypto_1 = require("crypto");
/**
 * Nodejs Client for Navigable AI
 */
class NavigableAI {
    /**
     * Create an instance of NavigableAIClient for a single model
     *
     * @param apiKey API key for a model in Navigable AI
     * @param sharedSecretKey Shared secret key between your server and client. Use any random string, ensure it is the same on the server and client. If provided, each request will verify the signature coming from the client.
     */
    constructor(apiKey, sharedSecretKey) {
        this.sharedSecretKey = undefined;
        this.actionHandlers = {};
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
    getMessages(identifier, options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.sharedSecretKey) {
                    if (!(options === null || options === void 0 ? void 0 : options.signature)) {
                        throw new Error("Signature is required when using shared secret key");
                    }
                    const isValid = yield this.verifyRequestSignature(identifier, options === null || options === void 0 ? void 0 : options.signature);
                    if (!isValid) {
                        throw new Error("Invalid signature");
                    }
                }
                const res = yield (0, request_js_1.default)({
                    hostname: consts_js_1.HOSTNAME,
                    method: consts_js_1.ENDPOINTS.GET_MESSAGES.method,
                    path: consts_js_1.ENDPOINTS.GET_MESSAGES.path + `?identifier=${identifier}`,
                    headers: {
                        [consts_js_1.API_KEY_HEADER]: this.apiKey,
                    },
                });
                return res;
            }
            catch (err) {
                console.error({
                    identifier,
                    options,
                });
                if (err instanceof Error) {
                    console.error("Navigable AI: Error: " + err.message);
                }
                else {
                    console.error("Navigable AI: Error: " + err);
                }
                return null;
            }
        });
    }
    /**
     * Send a message to Navigable AI and get a response from the assistant.
     *
     * @param message  Message to send
     * @param options Options
     * @returns Response object or null
     */
    sendMessage(message, options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.sharedSecretKey) {
                    if (!(options === null || options === void 0 ? void 0 : options.signature)) {
                        throw new Error("Signature is required when using shared secret key");
                    }
                    const isValid = yield this.verifyRequestSignature(message, options === null || options === void 0 ? void 0 : options.signature);
                    if (!isValid) {
                        throw new Error("Invalid signature");
                    }
                }
                const res = yield (0, request_js_1.default)({
                    hostname: consts_js_1.HOSTNAME,
                    method: consts_js_1.ENDPOINTS.SEND_MESSAGE.method,
                    path: consts_js_1.ENDPOINTS.SEND_MESSAGE.path,
                    headers: {
                        [consts_js_1.API_KEY_HEADER]: this.apiKey,
                        "Content-Type": "application/json",
                    },
                }, {
                    message,
                    identifier: options === null || options === void 0 ? void 0 : options.identifier,
                    new: options === null || options === void 0 ? void 0 : options.new,
                    markdown: options === null || options === void 0 ? void 0 : options.markdown,
                    currentPage: options === null || options === void 0 ? void 0 : options.currentPage,
                    configuredActions: options === null || options === void 0 ? void 0 : options.configuredActions,
                    configuredFunctions: options === null || options === void 0 ? void 0 : options.configuredFunctions,
                    functionCallId: options === null || options === void 0 ? void 0 : options.functionCallId,
                });
                return res;
            }
            catch (error) {
                console.error({
                    message,
                    options,
                });
                if (error instanceof Error) {
                    console.error("Navigable AI: Error: " + error.message);
                }
                else {
                    console.error("Navigable AI: Error: " + error);
                }
                return null;
            }
        });
    }
    /**
     * Register an action handler.
     *
     * The action handler will run when the assistant responds with a suitable action that can be taken by the user.
     *
     * @param actionName Name of the action in Navigable AI
     * @param handler Function to handle the action
     */
    registerActionHandler(actionName, handler) {
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
    verifyRequestSignature(payload, signature) {
        return new Promise((resolve) => {
            if (this.sharedSecretKey) {
                const expectedSignature = (0, crypto_1.createHmac)("sha256", this.sharedSecretKey)
                    .update(payload)
                    .digest("hex");
                resolve(expectedSignature === signature);
            }
            else {
                resolve(true);
            }
        });
    }
    /**
     * List chat sessions for a user identifier.
     * @param identifier User's unique identifier
     * @param options Optional signature for verification
     */
    listChatSessions(identifier, options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.sharedSecretKey) {
                    if (!(options === null || options === void 0 ? void 0 : options.signature)) {
                        throw new Error("Signature is required when using shared secret key");
                    }
                    const isValid = yield this.verifyRequestSignature(identifier, options.signature);
                    if (!isValid) {
                        throw new Error("Invalid signature");
                    }
                }
                const res = yield (0, request_js_1.default)({
                    hostname: consts_js_1.HOSTNAME,
                    method: consts_js_1.ENDPOINTS.GET_CHAT_SESSIONS.method,
                    path: consts_js_1.ENDPOINTS.GET_CHAT_SESSIONS.path + `?identifier=${identifier}`,
                    headers: {
                        [consts_js_1.API_KEY_HEADER]: this.apiKey,
                    },
                });
                return res;
            }
            catch (err) {
                console.error({
                    identifier,
                    options,
                });
                if (err instanceof Error) {
                    console.error("Navigable AI: Error: " + err.message);
                }
                else {
                    console.error("Navigable AI: Error: " + err);
                }
                return null;
            }
        });
    }
    /**
     * Get messages by chat session ID.
     * @param sessionId Chat session ID
     * @param identifier User's unique identifier
     * @param options Optional signature for verification
     */
    getMessagesBySessionId(sessionId, identifier, options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.sharedSecretKey) {
                    if (!(options === null || options === void 0 ? void 0 : options.signature)) {
                        throw new Error("Signature is required when using shared secret key");
                    }
                    const isValid = yield this.verifyRequestSignature(identifier, options.signature);
                    if (!isValid) {
                        throw new Error("Invalid signature");
                    }
                }
                const res = yield (0, request_js_1.default)({
                    hostname: consts_js_1.HOSTNAME,
                    method: consts_js_1.ENDPOINTS.GET_SESSION_MESSAGES.method,
                    path: consts_js_1.ENDPOINTS.GET_SESSION_MESSAGES.path +
                        `${sessionId}?identifier=${identifier}`,
                    headers: {
                        [consts_js_1.API_KEY_HEADER]: this.apiKey,
                    },
                });
                return res;
            }
            catch (err) {
                console.error({
                    sessionId,
                    identifier,
                    options,
                });
                if (err instanceof Error) {
                    console.error("Navigable AI: Error: " + err.message);
                }
                else {
                    console.error("Navigable AI: Error: " + err);
                }
                return null;
            }
        });
    }
}
exports.default = NavigableAI;
