const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const {
    getProfile,
    updateProfile,
    updateAvatar,
    toggleFollow,
    getFollowers,
    getFollowing
} = require('../controllers/profileController');

// 获取用户资料
router.get('/:id', getProfile);

// 需要登录的路由
router.put('/me', protect, updateProfile);
router.post('/avatar', protect, upload.single('avatar'), updateAvatar);
router.post('/follow/:id', protect, toggleFollow);

// 关注相关
router.get('/:id/followers', getFollowers);
router.get('/:id/following', getFollowing);

module.exports = router; 