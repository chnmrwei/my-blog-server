const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 保护路由中间件
const protect = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ message: '未授权访问' });
        }

        // 验证token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 获取用户信息
        const user = await User.findById(decoded.id).select('_id username email role');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: '用户不存在'
            });
        }

        console.log('Auth middleware - User:', user);
        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({
            success: false,
            message: '未授权'
        });
    }
};

// 管理员中间件
const admin = async (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: '需要管理员权限' });
    }
};

module.exports = { protect, admin }; 