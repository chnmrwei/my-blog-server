const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    createComment,
    getArticleComments,
    getReplies,
    deleteComment
} = require('../controllers/commentController');

/**
 * @swagger
 * /api/comments:
 *   post:
 *     summary: 发表评论
 *     tags: [评论]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - articleId
 *               - content
 *             properties:
 *               articleId:
 *                 type: string
 *               content:
 *                 type: string
 *               parentId:
 *                 type: string
 *     responses:
 *       201:
 *         description: 评论发表成功
 */

/**
 * @swagger
 * /api/comments/article/{articleId}:
 *   get:
 *     summary: 获取文章评论列表
 *     tags: [评论]
 *     parameters:
 *       - in: path
 *         name: articleId
 *         required: true
 *         schema:
 *           type: string
 *         description: 文章ID
 *     responses:
 *       200:
 *         description: 成功获取评论列表
 */
router.get('/article/:articleId', getArticleComments);

/**
 * @swagger
 * /api/comments/{id}:
 *   delete:
 *     summary: 删除评论
 *     tags: [评论]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 评论ID
 *     responses:
 *       200:
 *         description: 评论删除成功
 */
router.delete('/:id', protect, deleteComment);

/**
 * @swagger
 * /api/likes/comments/{id}/like:
 *   post:
 *     summary: 点赞/取消点赞评论
 *     tags: [点赞]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 评论ID
 *     responses:
 *       200:
 *         description: 操作成功
 */

// 创建评论
router.post('/', protect, createComment);

// 获取评论的回复列表
router.get('/:commentId/replies', getReplies);

module.exports = router; 