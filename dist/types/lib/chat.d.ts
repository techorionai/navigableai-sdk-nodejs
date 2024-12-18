export interface IChatSendMessageOptions {
    /**
     * Unique id of the user sending the message.
     */
    identifier?: string;
    /**
     * Start a new conversation by passing new: true
     */
    new?: boolean;
    /**
     * Don't run the action handler by passing omitActionHandler: true
     */
    omitActionHandler?: boolean;
    /**
     * Respond in markdown format by passing markdown: true
     */
    markdown?: boolean;
    /**
     * The current page the user is on. It should be the same as the one added in Navigable for this model.
     */
    currentPage?: string;
}
export interface IChatSendMessageResponse {
    statusCode: number;
    success: boolean;
    message: string;
    errors?: Record<string, string>;
    data: {
        assistantMessage: string;
        action: string | null;
        identifier: string;
    };
}
export interface IChatGetMessageResponse {
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
    }[];
}
