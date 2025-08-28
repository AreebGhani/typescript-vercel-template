/// <reference types="node" />
import { dirname } from 'path';
/**
 ** Retrieves information about the file and directory of the caller function.
 * This utility inspects the call stack to determine the filename and directory
 * of the code that invoked this function. It is useful for logging, debugging,
 * or dynamically resolving file paths relative to the caller.
 * @returns An object containing:
 * - `filename`: The absolute path to the caller's file.
 * - `dirname`: The directory name of the caller's file.
 */
declare const getFileInfo: () => {
    filename: string;
    dirname: string;
};
export default getFileInfo;
