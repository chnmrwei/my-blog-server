const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');

// 限流配置
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15分钟
    max: 100, // 限制每个IP 15分钟内最多100个请求
    message: '请求过于频繁，请稍后再试',
    standardHeaders: true,
    legacyHeaders: false
});

// API特定的限流
const apiLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1小时
    max: 5, // 限制每个IP 1小时内最多5次尝试
    message: '尝试次数过多，请1小时后再试',
    standardHeaders: true,
    legacyHeaders: false
});

// 安全中间件配置
const securityMiddleware = [
    // 基本安全头
    helmet(),
    
    // XSS防护
    xss(),
    
    // NoSQL注入防护
    mongoSanitize(),
    
    // 参数污染防护
    hpp({
        whitelist: [
            'sort', 'page', 'limit', 'fields',
            'category', 'tags', 'status'
        ]
    }),
    
    // 全局限流
    limiter
];

module.exports = {
    securityMiddleware,
    apiLimiter
}; 