const winston = require('winston');
const path = require('path');

// 定义日志格式
const logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
);

// 创建 logger 实例
const logger = winston.createLogger({
    format: logFormat,
    transports: [
        // 错误日志
        new winston.transports.File({
            filename: path.join('logs', 'error.log'),
            level: 'error',
        }),
        // 普通日志
        new winston.transports.File({
            filename: path.join('logs', 'combined.log'),
        }),
        // 操作日志
        new winston.transports.File({
            filename: path.join('logs', 'operation.log'),
            level: 'info',
        })
    ],
});

// 开发环境下同时输出到控制台
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        )
    }));
}

module.exports = logger; 