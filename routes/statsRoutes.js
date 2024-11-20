const express = require('express');
const router = express.Router();
const {
    updateViews,
    getHotArticles,
    getStats
} = require('../controllers/statsController');

// 更新文章访问量
router.post('/articles/:id/view', updateViews);

// 获取热门文章
router.get('/hot-articles', getHotArticles);

// 获取统计概览
router.get('/overview', getStats);

module.exports = router; 