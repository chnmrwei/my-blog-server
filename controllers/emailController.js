const User = require('../models/User');
const { generateVerificationCode, sendEmail } = require('../config/emailConfig');
const TempVerification = require('../models/TempVerification');

// 发送验证码
const sendVerificationCode = async (req, res) => {
    try {
        const { email } = req.body;
        
        // 检查邮箱是否已被注册
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: '该邮箱已被注册'
            });
        }

        // 生成新验证码
        const code = generateVerificationCode();
        
        // 删除旧的验证码
        await TempVerification.deleteMany({ email });

        // 存储新验证码
        await TempVerification.create({
            email,
            code,
            isVerified: false
        });

        // 发送邮件
        const html = `
            <h1>验证码</h1>
            <p>您的验证码是：<strong>${code}</strong></p>
            <p>验证码有效期为5分钟。</p>
        `;

        const sent = await sendEmail(email, '注册验证码', html);
        
        if (!sent) {
            return res.status(500).json({
                success: false,
                message: '邮件发送失败'
            });
        }

        res.json({
            success: true,
            message: '验证码已发送到邮箱'
        });
    } catch (error) {
        console.error('Send verification code error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// 验证邮箱
const verifyEmail = async (req, res) => {
    try {
        const { email, code } = req.body;
        console.log('Verifying email:', { email, code });

        // 查找验证码
        const tempVerification = await TempVerification.findOne({ 
            email,
            code
        });
        console.log('Found verification:', tempVerification);

        if (!tempVerification) {
            console.log('Verification not found');
            return res.status(400).json({
                success: false,
                message: '验证码不存在或已过期'
            });
        }

        // 检查是否过期
        const now = new Date();
        const codeAge = now - tempVerification.createdAt;
        if (codeAge > 5 * 60 * 1000) {  // 5分钟
            console.log('Code expired');
            await TempVerification.deleteOne({ _id: tempVerification._id });
            return res.status(400).json({
                success: false,
                message: '验证码已过期'
            });
        }

        // 标记验证成功
        tempVerification.isVerified = true;
        await tempVerification.save();
        console.log('Verification successful');

        res.json({
            success: true,
            message: '邮箱验证成功',
            data: {
                email,
                isVerified: true
            }
        });

    } catch (error) {
        console.error('Verify email error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// 重置密码
const resetPassword = async (req, res) => {
    try {
        const { email, code, newPassword } = req.body;

        const user = await User.findOne({ email });
        if (!user || !user.verificationCode) {
            return res.status(400).json({
                success: false,
                message: '验证码不存在或已过期'
            });
        }

        if (user.verificationCode.code !== code) {
            return res.status(400).json({
                success: false,
                message: '验证码错误'
            });
        }

        user.password = newPassword;
        user.verificationCode = null;
        await user.save();

        res.json({
            success: true,
            message: '密码重置成功'
        });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    sendVerificationCode,
    verifyEmail,
    resetPassword
}; 