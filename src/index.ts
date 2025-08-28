import server from '@/server';

/**
 * The entry point of the application.
 * This module exports the default server instance.
 * @module index
 */
export default (async () => {
  return await server();
})();
