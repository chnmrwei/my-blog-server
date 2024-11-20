const csrf = require('csurf');

// CSRF 保护中间件
const csrfProtection = csrf({
    cookie: {
        key: '_csrf',
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    }
});

// 不需要 CSRF 保护的路由
const excludedPaths = [
    '/api-docs',
    '/api/users/register',
    '/api/users/login',
    '/api/users/profile',
    '/api/users/password',
    '/api/users/avatar',
    '/api/articles',
    '/api/comments',
    '/api/likes',
    '/api/admin/users',
    '/api/admin/stats',
    '/api/admin/users/status',
    '/test'
];

// 添加 Postman 请求头检查
const isPostmanRequest = (req) => {
    return req.headers['user-agent'] && req.headers['user-agent'].includes('Postman');
};

// 设置 CSRF Token
const setCSRFToken = (req, res, next) => {
    // 如果是 Postman 请求或在排除列表中，跳过 CSRF 检查
    if (isPostmanRequest(req) || excludedPaths.some(path => req.path.startsWith(path))) {
        return next();
    }

    try {
        csrfProtection(req, res, next);
    } catch (error) {
        next(error);
    }
};

// 验证 CSRF Token
const validateCSRFToken = (req, res, next) => {
    // 如果是 Postman 请求或在排除列表中，跳过 CSRF 检查
    if (isPostmanRequest(req) || excludedPaths.some(path => req.path.startsWith(path))) {
        return next();
    }

    try {
        csrfProtection(req, res, next);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    setCSRFToken,
    validateCSRFToken
}; 