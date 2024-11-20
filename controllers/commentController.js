const Comment = require('../models/Comment');
const Article = require('../models/Article');

// 创建评论
const createComment = async (req, res) => {
    try {
        const { articleId, content, parentId, replyTo } = req.body;

        // 检查文章是否存在
        const article = await Article.findById(articleId);
        if (!article) {
            return res.status(404).json({
                success: false,
                message: '文章不存在'
            });
        }

        // 创建评论
        const comment = await Comment.create({
            content,
            author: req.user._id,
            article: articleId,
            parent: parentId || null,
            replyTo: replyTo || null
        });

        // 如果是回复，增加父评论的回复数
        if (parentId) {
            await Comment.findByIdAndUpdate(parentId, {
                $inc: { replyCount: 1 }
            });
        }

        // 填充作者信息
        await comment.populate('author', 'username avatar');
        if (replyTo) {
            await comment.populate('replyTo', 'username');
        }

        res.status(201).json({
            success: true,
            data: comment
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// 获取文章评论列表
const getComments = async (req, res) => {
    try {
        const { articleId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        // 获取顶层评论（没有父评论的）
        const comments = await Comment.find({
            article: articleId,
            parent: null,
            isDeleted: false
        })
            .populate('author', 'username avatar')
            .sort('-createdAt')
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await Comment.countDocuments({
            article: articleId,
            parent: null,
            isDeleted: false
        });

        res.json({
            success: true,
            data: {
                comments,
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

// 获取评论的回复列表
const getReplies = async (req, res) => {
    try {
        const { commentId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const replies = await Comment.find({
            parent: commentId,
            isDeleted: false
        })
            .populate('author', 'username avatar')
            .populate('replyTo', 'username')
            .sort('createdAt')
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await Comment.countDocuments({
            parent: commentId,
            isDeleted: false
        });

        res.json({
            success: true,
            data: {
                replies,
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

// 删除评论
const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: '评论不存在'
            });
        }

        // 检查是否是评论作者
        if (comment.author.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: '没有权限删除此评论'
            });
        }

        comment.isDeleted = true;
        await comment.save();

        res.json({
            success: true,
            message: '评论已删除'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// 获取文章评论列表
const getArticleComments = async (req, res) => {
    try {
        const comments = await Comment.find({ 
            article: req.params.articleId,
            isDeleted: false 
        })
        .populate('author', 'username avatar')
        .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: comments
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createComment,
    getComments,
    getReplies,
    deleteComment,
    getArticleComments
}; 