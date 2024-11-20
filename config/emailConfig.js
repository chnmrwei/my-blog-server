const nodemailer = require('nodemailer');

// 添加调试日志
console.log('Email Config:', {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS ? '******' : 'missing'
});

const transporter = nodemailer.createTransport({
    host: 'smtp.88.com',
    port: 465,
    secure: true,  // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS  // 这里使用邮箱密码，不是授权码
    },
    debug: true  // 添加调试信息
});

// 验证连接配置
transporter.verify(function(error, success) {
    if (error) {
        console.log('Email configuration error:', error);
    } else {
        console.log('Email server is ready');
    }
});

// 生成验证码
const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// 发送邮件
const sendEmail = async (to, subject, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"Blog System" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html
        });
        console.log('Email sent:', info.messageId);
        return true;
    } catch (error) {
        console.error('Send email error:', error);
        return false;
    }
};

module.exports = {
    generateVerificationCode,
    sendEmail
}; 