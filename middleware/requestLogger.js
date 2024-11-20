const expressWinston = require('express-winston');
const winston = require('winston');
const path = require('path');

const requestLogger = expressWinston.logger({
    transports: [
        new winston.transports.File({
            filename: path.join('logs', 'requests.log')
        })
    ],
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    meta: true,
    msg: "HTTP {{req.method}} {{req.url}}",
    expressFormat: true,
    colorize: false,
    ignoreRoute: function (req, res) { 
        // 忽略特定路由的日志，比如健康检查
        return req.url.includes('/health'); 
    }
});

module.exports = requestLogger; 