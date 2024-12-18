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
/**
 * Nodejs Client for Navigable AI
 */
class NavigableAI {
    /**
     * Create an instance of NavigableAIClient for a single model
     *
     * @param apiKey API key for a model in Navigable AI
     */
    constructor(apiKey) {
        this.actionHandlers = {};
        this.apiKey = apiKey;
    }
    /**
     * Get the last 20 messages in the last conversation by your user's unique identifier
     *
     * @param identifier Your user's unique identifier
     */
    getMessages(identifier) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
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
                if (err instanceof Error) {
                    console.error("Navigable AI: Error: " + err.message);
                }
                else {
                    console.error("Navigable AI: Error: " + err);
                }
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
                });
                if (res.statusCode === 200 && res.data.action) {
                    if (this.actionHandlers[res.data.action] &&
                        !(options === null || options === void 0 ? void 0 : options.omitActionHandler)) {
                        this.actionHandlers[res.data.action](res.data.action, res.data.identifier);
                    }
                }
                return res;
            }
            catch (error) {
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
}
exports.default = NavigableAI;
