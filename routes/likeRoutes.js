const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { toggleLike, getLikeStatus, toggleCommentLike } = require('../controllers/likeController');

/**
 * @swagger
 * /api/likes/articles/{articleId}/like:
 *   post:
 *     summary: 点赞/取消点赞文章
 *     tags: [点赞]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: articleId
 *         required: true
 *         schema:
 *           type: string
 *         description: 文章ID
 *     responses:
 *       200:
 *         description: 操作成功
 */
router.post('/articles/:articleId/like', protect, toggleLike);

/**
 * @swagger
 * /api/likes/articles/{articleId}/status:
 *   get:
 *     summary: 获取文章点赞状态
 *     tags: [点赞]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: articleId
 *         required: true
 *         schema:
 *           type: string
 *         description: 文章ID
 *     responses:
 *       200:
 *         description: 成功获取点赞状态
 */
router.get('/articles/:articleId/status', protect, getLikeStatus);

/**
 * @swagger
 * /api/likes/comments/{commentId}/like:
 *   post:
 *     summary: 点赞/取消点赞评论
 *     tags: [点赞]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: 评论ID
 *     responses:
 *       200:
 *         description: 操作成功
 */
router.post('/comments/:commentId/like', protect, toggleCommentLike);

module.exports = router; 