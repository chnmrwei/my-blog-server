const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, '标题不能为空'],
        trim: true
    },
    description: {
        type: String,
        required: [true, '描述不能为空'],
        trim: true
    },
    content: {
        type: String,
        required: [true, '内容不能为空']
    },
    category: {
        type: String,
        required: [true, '分类不能为空'],
        enum: ['技术', '生活', '随笔', '其他']  // 可选的分类
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tags: [{
        type: String,
        trim: true
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Article', articleSchema);
