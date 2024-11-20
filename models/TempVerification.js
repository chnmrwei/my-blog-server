const mongoose = require('mongoose');

const tempVerificationSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300 // 5分钟后自动删除
    }
});

// 添加索引
tempVerificationSchema.index({ email: 1, code: 1 });
tempVerificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 300 });

module.exports = mongoose.model('TempVerification', tempVerificationSchema); 