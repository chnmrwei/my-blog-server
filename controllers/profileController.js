const User = require('../models/User');
const Article = require('../models/Article');

// 获取用户资料
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select('-password')
            .populate('following', 'username avatar')
            .populate('followers', 'username avatar');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: '用户不存在'
            });
        }

        // 获取用户的文章
        const articles = await Article.find({ 
            author: user._id,
            isPublished: true 
        })
            .select('title description createdAt viewCount likeCount')
            .sort('-createdAt')
            .limit(5);

        res.json({
            success: true,
            data: {
                user,
                articles
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// 更新个人资料
const updateProfile = async (req, res) => {
    try {
        const updates = {};
        const allowedUpdates = [
            'profile.nickname',
            'profile.bio',
            'profile.location',
            'profile.website',
            'profile.birthday',
            'profile.gender',
            'profile.social.github',
            'profile.social.twitter',
            'profile.social.weibo'
        ];

        // 只更新允许的字段
        Object.keys(req.body).forEach(key => {
            if (allowedUpdates.includes(key)) {
                updates[key] = req.body[key];
            }
        });

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $set: updates },
            { new: true, runValidators: true }
        ).select('-password');

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// 更新头像
const updateAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: '请选择要上传的头像'
            });
        }

        const avatarUrl = `${req.protocol}://${req.get('host')}/${req.file.path}`;

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { avatar: avatarUrl },
            { new: true }
        ).select('-password');

        res.json({
            success: true,
            data: {
                avatar: user.avatar
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// 关注/取消关注用户
const toggleFollow = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        // 不能关注自己
        if (id === userId.toString()) {
            return res.status(400).json({
                success: false,
                message: '不能关注自己'
            });
        }

        const targetUser = await User.findById(id);
        if (!targetUser) {
            return res.status(404).json({
                success: false,
                message: '用户不存在'
            });
        }

        const user = await User.findById(userId);
        const isFollowing = user.following.includes(id);

        if (isFollowing) {
            // 取消关注
            await User.findByIdAndUpdate(userId, {
                $pull: { following: id },
                $inc: { 'stats.followingCount': -1 }
            });
            await User.findByIdAndUpdate(id, {
                $pull: { followers: userId },
                $inc: { 'stats.followersCount': -1 }
            });
        } else {
            // 添加关注
            await User.findByIdAndUpdate(userId, {
                $addToSet: { following: id },
                $inc: { 'stats.followingCount': 1 }
            });
            await User.findByIdAndUpdate(id, {
                $addToSet: { followers: userId },
                $inc: { 'stats.followersCount': 1 }
            });
        }

        res.json({
            success: true,
            data: {
                following: !isFollowing
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// 获取用户的关注者列表
const getFollowers = async (req, res) => {
    try {
        const { id } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const user = await User.findById(id)
            .populate({
                path: 'followers',
                select: 'username avatar profile.bio stats',
                options: {
                    skip,
                    limit
                }
            });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: '用户不存在'
            });
        }

        res.json({
            success: true,
            data: {
                followers: user.followers,
                pagination: {
                    current: page,
                    pageSize: limit,
                    total: user.stats.followersCount
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

// 获取用户的关注列表
const getFollowing = async (req, res) => {
    try {
        const { id } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const user = await User.findById(id)
            .populate({
                path: 'following',
                select: 'username avatar profile.bio stats',
                options: {
                    skip,
                    limit
                }
            });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: '用户不存在'
            });
        }

        res.json({
            success: true,
            data: {
                following: user.following,
                pagination: {
                    current: page,
                    pageSize: limit,
                    total: user.stats.followingCount
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

module.exports = {
    getProfile,
    updateProfile,
    updateAvatar,
    toggleFollow,
    getFollowers,
    getFollowing
}; 