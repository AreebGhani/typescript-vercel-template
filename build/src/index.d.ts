/// <reference types="node" />
/**
 * The entry point of the application.
 * This module exports the default server instance.
 * @module index
 */
declare const _default: Promise<{
    http: import("http").Server<typeof import("http").IncomingMessage, typeof import("http").ServerResponse>;
    io: import("socket.io").Server<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any>;
}>;
export default _default;
