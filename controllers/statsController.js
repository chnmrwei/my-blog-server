const StatsService = require('../services/statsService');
const Article = require('../models/Article');

// 更新文章访问量
const updateViews = async (req, res) => {
    try {
        const { id } = req.params;
        const ip = req.ip || req.connection.remoteAddress;

        const article = await Article.findById(id);
        if (!article) {
            return res.status(404).json({
                success: false,
                message: '文章不存在'
            });
        }

        await article.updateViewCount(ip);

        res.json({
            success: true,
            data: {
                viewCount: article.viewCount
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// 获取热门文章
const getHotArticles = async (req, res) => {
    try {
        const { days = 7, limit = 10 } = req.query;
        const articles = await StatsService.getHotArticles(
            parseInt(days),
            parseInt(limit)
        );

        res.json({
            success: true,
            data: articles
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// 获取统计概览
const getStats = async (req, res) => {
    try {
        const stats = await StatsService.getStats();

        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    updateViews,
    getHotArticles,
    getStats
}; 