const express = require('express');
const router = express.Router();

// 测试路由
router.get('/profile', (req, res) => {
    res.json({ 
        message: '获取用户资料成功',
        user: {
            id: 1,
            username: 'test',
            email: 'test@example.com'
        }
    });
});

module.exports = router; 