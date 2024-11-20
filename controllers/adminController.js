const User = require('../models/User');
const Article = require('../models/Article');
const Comment = require('../models/Comment');
const Like = require('../models/Like');

// 获取仪表盘数据
const getDashboard = async (req, res) => {
    try {
        // 获取今日日期范围
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // 统计数据
        const stats = await Promise.all([
            // 用户统计
            User.countDocuments(),
            User.countDocuments({ createdAt: { $gte: today } }),
            
            // 文章统计
            Article.countDocuments({ isPublished: true }),
            Article.countDocuments({ 
                isPublished: true,
                createdAt: { $gte: today }
            }),
            
            // 评论统计
            Comment.countDocuments(),
            Comment.countDocuments({ createdAt: { $gte: today } }),
            
            // 总访问量
            Article.aggregate([
                { $group: { _id: null, total: { $sum: '$viewCount' } } }
            ])
        ]);

        res.json({
            success: true,
            data: {
                users: {
                    total: stats[0],
                    today: stats[1]
                },
                articles: {
                    total: stats[2],
                    today: stats[3]
                },
                comments: {
                    total: stats[4],
                    today: stats[5]
                },
                views: {
                    total: stats[6][0]?.total || 0
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// 用户管理 - 获取用户列表
const getUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const users = await User.find()
            .select('username email role isActive createdAt')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await User.countDocuments();

        return res.status(200).json({
            success: true,
            data: {
                list: users,
                pagination: {
                    current: page,
                    pageSize: limit,
                    total
                }
            }
        });
    } catch (error) {
        console.error('Error getting users:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// 用户管理 - 更新用户状态
const updateUserStatus = async (req, res) => {
    try {
        const { userId } = req.params;
        const { isActive } = req.body;

        console.log('Updating user status:', { userId, isActive });

        if (typeof isActive !== 'boolean') {
            return res.status(400).json({
                success: false,
                message: 'isActive 必须是布尔值'
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: '用户不存在'
            });
        }

        user.isActive = isActive;
        await user.save();

        console.log('User status updated successfully');

        return res.json({
            success: true,
            message: '用户状态已更新'
        });
    } catch (error) {
        console.error('Error updating user status:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// 内容管理 - 获取文章列表
const getArticles = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';

        const query = search ? {
            title: { $regex: search, $options: 'i' }
        } : {};

        const articles = await Article.find(query)
            .populate('author', 'username')
            .sort('-createdAt')
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await Article.countDocuments(query);

        res.json({
            success: true,
            data: {
                articles,
                pagination: {
                    current: page,
                    pageSize: limit,
                    total
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// 内容管理 - 更新文章状态
const updateArticleStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { isPublished } = req.body;

        const article = await Article.findById(id);
        if (!article) {
            return res.status(404).json({
                success: false,
                message: '文章不存在'
            });
        }

        article.isPublished = isPublished;
        await article.save();

        res.json({
            success: true,
            data: article
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// 获取系统统计
const getSystemStats = async (req, res) => {
    try {
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);

        const [
            userCount,
            articleCount,
            commentCount,
            likeCount,
            newUsers,
            newArticles,
            newComments
        ] = await Promise.all([
            User.countDocuments(),
            Article.countDocuments(),
            Comment.countDocuments(),
            Like.countDocuments(),
            User.countDocuments({ createdAt: { $gte: lastWeek } }),
            Article.countDocuments({ createdAt: { $gte: lastWeek } }),
            Comment.countDocuments({ createdAt: { $gte: lastWeek } })
        ]);

        return res.status(200).json({
            success: true,
            data: {
                userCount,
                articleCount,
                commentCount,
                likeCount,
                recentStats: {
                    newUsers,
                    newArticles,
                    newComments
                }
            }
        });
    } catch (error) {
        console.error('Error getting system stats:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// 获取所有评论
const getComments = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const comments = await Comment.find()
            .populate('author', 'username email')
            .populate('article', 'title')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await Comment.countDocuments();

        return res.json({
            success: true,
            data: {
                list: comments,
                pagination: {
                    current: page,
                    pageSize: limit,
                    total
                }
            }
        });
    } catch (error) {
        console.error('Error getting comments:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// 删除评论
const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: '评论不存在'
            });
        }

        // 软删除
        comment.isDeleted = true;
        await comment.save();

        return res.json({
            success: true,
            message: '评论已删除'
        });
    } catch (error) {
        console.error('Error deleting comment:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// 恢复评论
const restoreComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: '评论不存在'
            });
        }

        comment.isDeleted = false;
        await comment.save();

        return res.json({
            success: true,
            message: '评论已恢复'
        });
    } catch (error) {
        console.error('Error restoring comment:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getDashboard,
    getUsers,
    updateUserStatus,
    getArticles,
    updateArticleStatus,
    getSystemStats,
    getComments,
    deleteComment,
    restoreComment
}; 