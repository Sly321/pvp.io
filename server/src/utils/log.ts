import { createLogger, format, transports } from "winston"
const { combine, timestamp, printf, colorize, prettyPrint } = format;

const loglevel = process.env.LOG_LEVEL || "info"
console.log("LogLevel Option is: '" + loglevel + "'")

let currentDateString = ""

const logger = createLogger({
    level: loglevel,
    format: combine(format.json(), timestamp()),
    defaultMeta: { service: 'pvp.io' },
})

function createFileTransports() {
    currentDateString = new Date().toLocaleDateString("de-DE", { year: "numeric", month: "2-digit", day: "2-digit"})
    return [
        new transports.File({ filename: `logs/${currentDateString}-error.log`, level: 'error', format: combine(format.json(), timestamp())  }),
        new transports.File({ filename: `logs/${currentDateString}-debug.log`, level: 'debug', format: combine(format.json(), timestamp())  }),
        new transports.File({ filename: `logs/${currentDateString}-http.log`, level: 'http', format: combine(format.json(), timestamp()) }),
        new transports.File({ filename: `logs/${currentDateString}-info.log`, level: 'info', format: combine(format.json(), timestamp()) }),
        new transports.File({ filename: `logs/${currentDateString}-all.log`, format: combine(format.json(), timestamp()) }),
    ]
}

function assignTransports() {
    logger.clear()

    createFileTransports().forEach(transport => logger.add(transport))

    if (process.env.NODE_ENV !== 'production') {
        const consoleFormat = printf(({ level, message, timestamp }) => {
            return `${timestamp} [${level}]: ${message}`;
        });
    
        logger.add(new transports.Console({
          format: consoleFormat,
        }));
    }    
}

function log(level: "info" | "http" |"debug" | "error", ...args: Array<any>) {
    if (currentDateString !== new Date().toLocaleDateString("de-DE", { year: "numeric", month: "2-digit", day: "2-digit"})) {
        assignTransports()
    }

    logger[level](args)
}

export const Log = {
    http: (...args: Array<any>) => {
        log("http", args)
    },
    info: (...args: Array<any>) => {
        log("info", args)
    },
    debug: (...args: Array<any>) => {
        log("debug", args)
    },
    error: (...args: Array<any>) => {
        log("error", args)
    },
}