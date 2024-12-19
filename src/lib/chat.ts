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
   * Respond in markdown format by passing markdown: true
   */
  markdown?: boolean;

  /**
   * The current page the user is on. It should be the same as the one added in Navigable for this model.
   */
  currentPage?: string;

  /**
   * The signature of the request. Should be provided if using a shared secret key.
   */
  signature?: string;
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
