/**
 * Action handler function
 *
 * @template T Action handler context
 * @param uniqueId Unique identifier for the action
 * @param context Context to do something useful with the suggested action.
 * Example: Pass the express response object and use it in the handler to redirect to a different page if using server side rendering
 */
export type IActionHandler = <T = any>(uniqueId: string, context?: T) => void;
