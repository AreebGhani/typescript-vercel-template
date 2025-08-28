import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
/**
 ** Retrieves information about the file and directory of the caller function.
 * This utility inspects the call stack to determine the filename and directory
 * of the code that invoked this function. It is useful for logging, debugging,
 * or dynamically resolving file paths relative to the caller.
 * @returns An object containing:
 * - `filename`: The absolute path to the caller's file.
 * - `dirname`: The directory name of the caller's file.
 */
const getFileInfo = () => {
    const stack = new Error().stack;
    const callerLine = stack?.split('\n')[2];
    const match = callerLine?.match(/\((.*):\d+:\d+\)/);
    let filePath = match?.[1] || callerLine?.split(' ').pop()?.trim();
    if (filePath?.startsWith('file://')) {
        filePath = fileURLToPath(filePath);
    }
    const filename = resolve(filePath || process.cwd());
    return {
        filename,
        dirname: dirname(filename),
    };
};
export default getFileInfo;
//# sourceMappingURL=fileInfo.js.map