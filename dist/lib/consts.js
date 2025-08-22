"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENDPOINTS = exports.API_KEY_HEADER = exports.DEFAULT_TIMEOUT = exports.HOSTNAME = void 0;
exports.HOSTNAME = "www.navigable.ai";
exports.DEFAULT_TIMEOUT = 30000;
exports.API_KEY_HEADER = "X-Api-Key";
// API Endpoints
exports.ENDPOINTS = {
    SEND_MESSAGE: {
        path: "/api/v1/chat",
        method: "POST",
    },
    GET_MESSAGES: {
        path: "/api/v1/chat",
        method: "GET",
    },
    GET_CHAT_SESSIONS: {
        path: "/api/v1/chat/sessions",
        method: "GET",
    },
    GET_SESSION_MESSAGES: {
        path: "/api/v1/chat/sessions/", // sessionId will be appended dynamically
        method: "GET",
    },
};
