const logger = require('../config/logger');

// 自定义错误类
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

// 错误处理中间件
const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // 记录错误日志
    logger.error({
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        ip: req.ip,
        user: req.user ? req.user._id : 'anonymous'
    });

    // 开发环境返回详细错误信息
    if (process.env.NODE_ENV === 'development') {
        res.status(err.statusCode).json({
            success: false,
            error: err,
            message: err.message,
            stack: err.stack
        });
    } 
    // 生产环境返回简化错误信息
    else {
        if (err.isOperational) {
            res.status(err.statusCode).json({
                success: false,
                message: err.message
            });
        } else {
            res.status(500).json({
                success: false,
                message: '服务器内部错误'
            });
        }
    }
};

module.exports = {
    AppError,
    errorHandler
}; 