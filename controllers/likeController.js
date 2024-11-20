const Like = require('../models/Like');
const Article = require('../models/Article');
const Comment = require('../models/Comment');

// 点赞/取消点赞文章
const toggleLike = async (req, res) => {
    try {
        const { articleId } = req.params;
        const userId = req.user.id;

        // 检查文章是否存在
        const article = await Article.findById(articleId);
        if (!article) {
            return res.status(404).json({
                success: false,
                message: '文章不存在'
            });
        }

        // 查找是否已经点赞
        const existingLike = await Like.findOne({
            user: userId,
            article: articleId
        });

        if (existingLike) {
            // 如果已经点赞，则取消点赞
            await Like.findByIdAndDelete(existingLike._id);
            res.json({
                success: true,
                message: '取消点赞成功',
                data: { liked: false }
            });
        } else {
            // 如果未点赞，则添加点赞
            const like = new Like({
                user: userId,
                article: articleId
            });
            await like.save();
            res.json({
                success: true,
                message: '点赞成功',
                data: { liked: true }
            });
        }
    } catch (error) {
        console.error('点赞操作错误:', error);
        res.status(500).json({
            success: false,
            message: error.message || '点赞操作失败'
        });
    }
};

// 获取点赞状态
const getLikeStatus = async (req, res) => {
    try {
        const { articleId } = req.params;
        const userId = req.user.id;

        const like = await Like.findOne({
            user: userId,
            article: articleId
        });

        res.json({
            success: true,
            data: {
                liked: !!like
            }
        });
    } catch (error) {
        console.error('获取点赞状态错误:', error);
        res.status(500).json({
            success: false,
            message: error.message || '获取点赞状态失败'
        });
    }
};

// 点赞/取消点赞评论
const toggleCommentLike = async (req, res) => {
    try {
        const { commentId } = req.params;
        const userId = req.user.id;

        // 检查评论是否存在
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: '评论不存在'
            });
        }

        // 查找是否已经点赞
        const existingLike = await Like.findOne({
            user: userId,
            comment: commentId
        });

        if (existingLike) {
            // 如果已经点赞，则取消点赞
            await Like.findByIdAndDelete(existingLike._id);
            res.json({
                success: true,
                message: '取消点赞成功',
                data: { liked: false }
            });
        } else {
            // 如果未点赞，则添加点赞
            const like = new Like({
                user: userId,
                comment: commentId
            });
            await like.save();
            res.json({
                success: true,
                message: '点赞成功',
                data: { liked: true }
            });
        }
    } catch (error) {
        console.error('评论点赞操作错误:', error);
        res.status(500).json({
            success: false,
            message: error.message || '点赞操作失败'
        });
    }
};

module.exports = {
    toggleLike,
    getLikeStatus,
    toggleCommentLike
}; 