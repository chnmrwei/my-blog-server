const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, '标签名称不能为空'],
        unique: true,
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    articleCount: {
        type: Number,
        default: 0
    },
    color: {
        type: String,
        default: '#666666'  // 默认颜色
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Tag', tagSchema); 