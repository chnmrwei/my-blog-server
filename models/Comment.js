const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true, '评论内容不能为空'],
        trim: true
    },
    article: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article',
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        default: null  // 如果是回复其他评论，这里存储父评论的ID
    },
    replyTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    replyCount: {
        type: Number,
        default: 0
    },
    likeCount: {
        type: Number,
        default: 0
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// 索引配置
commentSchema.index({ article: 1, createdAt: -1 });   // 文章评论列表
commentSchema.index({ author: 1, createdAt: -1 });    // 用户评论列表
commentSchema.index({ parent: 1, createdAt: 1 });     // 评论回复列表

module.exports = mongoose.model('Comment', commentSchema); 