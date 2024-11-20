const User = require('../models/User');
const TempVerification = require('../models/TempVerification');
const jwt = require('jsonwebtoken');

// 生成 JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// 注册
const register = async (req, res) => {
    try {
        console.log('Registration attempt with:', { ...req.body, password: '***' });

        const { username, email, password } = req.body;

        // 检查邮箱验证状态
        const tempVerification = await TempVerification.findOne({ 
            email,
            isVerified: true
        });
        console.log('Verification status:', tempVerification);

        if (!tempVerification) {
            console.log('Email not verified');
            return res.status(400).json({
                success: false,
                message: '请先完成邮箱验证',
                step: 'email_verification_required'
            });
        }

        // 检查用户是否已存在
        const existingUser = await User.findOne({ 
            $or: [{ email }, { username }] 
        });
        console.log('Existing user check:', existingUser ? 'Found' : 'Not found');

        if (existingUser) {
            console.log('User already exists');
            return res.status(400).json({
                success: false,
                message: '用户名或邮箱已存在'
            });
        }

        // 创建新用户
        const user = await User.create({
            username,
            email,
            password,
            isVerified: true  // 邮箱已验证
        });
        console.log('User created:', { id: user._id, username: user.username });

        // 生成 token
        const token = generateToken(user._id);
        console.log('Token generated');

        // 删除验证记录
        await TempVerification.deleteMany({ email });
        console.log('Verification records cleaned');

        // 准备响应数据
        const responseData = {
            success: true,
            data: {
                _id: user._id,
                username: user.username,
                email: user.email,
                token
            }
        };
        console.log('Sending response:', { ...responseData, data: { ...responseData.data, token: '***' } });

        // 发送响应
        return res.status(201).json(responseData);

    } catch (error) {
        console.error('Register error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || '注册失败，请稍后重试'
        });
    }
};

// 登录
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({
                success: false,
                message: '邮箱或密码错误'
            });
        }

        const token = generateToken(user._id);

        res.json({
            success: true,
            data: {
                _id: user._id,
                username: user.username,
                email: user.email,
                token
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// 获取个人资料
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// 更新个人资料
const updateProfile = async (req, res) => {
    try {
        const { username, email } = req.body;
        const user = await User.findById(req.user.id);

        if (username) user.username = username;
        if (email) user.email = email;

        const updatedUser = await user.save();

        res.json({
            success: true,
            data: {
                _id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email
            }
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// 修改密码
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);

        if (!(await user.matchPassword(currentPassword))) {
            return res.status(401).json({
                success: false,
                message: '当前密码错误'
            });
        }

        user.password = newPassword;
        await user.save();

        res.json({
            success: true,
            message: '密码修改成功'
        });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// 删除用户
const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({
            success: true,
            message: '用户已删除'
        });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    register,
    login,
    getProfile,
    updateProfile,
    changePassword,
    deleteUser,
    generateToken
}; 