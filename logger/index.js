const path = require('path');
const { createLogger, format, transports } = require('winston');
let topModule = module;

while (topModule.parent) {
    topModule = topModule.parent;
}

const getCallerFile = () => {
    const originalFunc = Error.prepareStackTrace;
    let callerFile;
    try {
        const err = new Error();
        Error.prepareStackTrace = (err, stack) => stack;
        const currentFile = err.stack.shift().getFileName();

        while (err.stack.length) {
            const caller = err.stack.shift();
            if (caller.getFileName() !== currentFile) {
                callerFile = `${path.basename(caller.getFileName())}:${caller.getLineNumber()}`;
                break;
            }
        }
    } catch (e) {}
    Error.prepareStackTrace = originalFunc;
    return callerFile || 'unknown location';
}

const logger = createLogger({
    transports: [
        new transports.Console({
            level: 'info',
            format: format.combine(
                format.colorize(),
                format.timestamp({
                    format: 'YYYY-MM-DD HH:mm:ss',
                }),
                format.printf((info) => {
                    return `${info.timestamp} [${info.level}]: ${info.message} (at ${info.caller || 'unknown location'})`;
                })
            ),
            handleExceptions: true,
        }),
        new transports.File({
            level: 'info',
            format: format.combine(
                format.timestamp({
                    format: 'YYYY-MM-DD HH:mm:ss',
                }),
                format.printf((info) => {
                    return `${info.timestamp} [${info.level}]: ${info.message} (at ${info.caller || 'unknown location'})`;
                })
            ),
            filename: 'output.log',
            dirname: 'logs',
            maxsize: 10485760,
            maxFiles: 10,
            handleExceptions: true,
        }),
    ],
});

['info', 'warn', 'error', 'debug'].forEach((level) => {
    const original = logger[level];
    logger[level] = function (...args) {
        const caller = getCallerFile();
        original.call(this, { message: args[0], caller });
    };
});

module.exports = logger;

