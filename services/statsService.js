const Article = require('../models/Article');
const CacheService = require('./cacheService');

class StatsService {
    // 计算阅读时长
    static calculateReadTime(content) {
        const wordsPerMinute = 200; // 假设平均阅读速度
        const wordCount = content.trim().split(/\s+/).length;
        return Math.ceil(wordCount / wordsPerMinute);
    }

    // 获取热门文章
    static async getHotArticles(days = 7, limit = 10) {
        const cacheKey = `hot:articles:${days}:${limit}`;
        
        // 尝试从缓存获取
        const cached = CacheService.get(cacheKey);
        if (cached) return cached;

        // 计算日期范围
        const date = new Date();
        date.setDate(date.getDate() - days);

        // 获取热门文章
        const articles = await Article.find({
            isPublished: true,
            createdAt: { $gte: date }
        })
            .select('title description viewCount author tags createdAt')
            .populate('author', 'username avatar')
            .sort('-viewCount -createdAt')
            .limit(limit);

        // 缓存结果（1小时）
        CacheService.set(cacheKey, articles, 3600);

        return articles;
    }

    // 获取统计数据
    static async getStats() {
        const cacheKey = 'stats:overview';
        
        // 尝试从缓存获取
        const cached = CacheService.get(cacheKey);
        if (cached) return cached;

        // 获取总访问量
        const totalViews = await Article.aggregate([
            { $group: { _id: null, total: { $sum: '$viewCount' } } }
        ]);

        // 获取今日访问量
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayViews = await Article.aggregate([
            {
                $match: {
                    'visitors.lastVisitAt': { $gte: today }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 }
                }
            }
        ]);

        const stats = {
            totalViews: totalViews[0]?.total || 0,
            todayViews: todayViews[0]?.total || 0
        };

        // 缓存结果（5分钟）
        CacheService.set(cacheKey, stats, 300);

        return stats;
    }
}

module.exports = StatsService; 