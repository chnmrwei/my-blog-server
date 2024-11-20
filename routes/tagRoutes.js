const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
    createTag,
    getTags,
    getHotTags,
    getTagDetails,
    updateTag,
    deleteTag
} = require('../controllers/tagController');

// 公开路由
router.get('/', getTags);
router.get('/hot', getHotTags);
router.get('/:id', getTagDetails);

// 需要管理员权限的路由
router.post('/', protect, admin, createTag);
router.put('/:id', protect, admin, updateTag);
router.delete('/:id', protect, admin, deleteTag);

module.exports = router; 