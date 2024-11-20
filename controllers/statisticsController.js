const Article = require('../models/Article');
const Comment = require('../models/Comment');
const Like = require('../models/Like');
const User = require('../models/User');

// 获取文章统计
const getArticleStats = async (req, res) => {
    try {
        const { articleId } = req.params;
        console.log('Getting stats for article:', articleId);

        const article = await Article.findById(articleId);
        if (!article) {
            console.log('Article not found');
            return res.status(404).json({
                success: false,
                message: '文章不存在'
            });
        }

        const stats = {
            views: article.views || 0,
            likes: await Like.countDocuments({ article: articleId, type: 'article' }),
            comments: await Comment.countDocuments({ article: articleId, isDeleted: false })
        };

        console.log('Article stats:', stats);
        return res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Error getting article stats:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// 获取用户统计
const getUserStats = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: '用户不存在'
            });
        }

        const stats = {
            articles: await Article.countDocuments({ author: userId }),
            likes: await Like.countDocuments({ user: userId }),
            comments: await Comment.countDocuments({ author: userId, isDeleted: false })
        };

        res.json({ success: true, data: stats });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 获取总体统计
const getOverallStats = async (req, res) => {
    try {
        console.log('Getting overall stats');

        const stats = {
            users: await User.countDocuments(),
            articles: await Article.countDocuments(),
            comments: await Comment.countDocuments({ isDeleted: false }),
            likes: await Like.countDocuments()
        };

        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);

        const recentStats = {
            newUsers: await User.countDocuments({ createdAt: { $gte: lastWeek } }),
            newArticles: await Article.countDocuments({ createdAt: { $gte: lastWeek } }),
            newComments: await Comment.countDocuments({ 
                createdAt: { $gte: lastWeek },
                isDeleted: false
            })
        };

        console.log('Stats:', { total: stats, recent: recentStats });

        return res.status(200).json({
            success: true,
            data: {
                total: stats,
                recent: recentStats
            }
        });
    } catch (error) {
        console.error('Error getting overall stats:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// 获取热门统计
const getHotStats = async (req, res) => {
    try {
        console.log('Getting hot stats');

        const [hotArticles, activeUsers] = await Promise.all([
            Article.find()
                .sort({ views: -1, likes: -1 })
                .limit(5)
                .select('title views likes'),
            User.find()
                .sort({ 'stats.articleCount': -1 })
                .limit(5)
                .select('username stats')
        ]);

        console.log('Hot stats:', { hotArticles, activeUsers });

        return res.status(200).json({
            success: true,
            data: {
                hotArticles,
                activeUsers
            }
        });
    } catch (error) {
        console.error('Error getting hot stats:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getArticleStats,
    getUserStats,
    getOverallStats,
    getHotStats
}; 