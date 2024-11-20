const express = require('express');
const router = express.Router();
const { getSharedArticle, generateShareLink } = require('../controllers/shareController');
const { protect } = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/share/articles/{articleId}:
 *   get:
 *     summary: 获取分享文章信息
 *     tags: [分享]
 *     parameters:
 *       - in: path
 *         name: articleId
 *         required: true
 *         schema:
 *           type: string
 *         description: 文章ID
 *     responses:
 *       200:
 *         description: 成功获取文章信息
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                     content:
 *                       type: string
 *                     author:
 *                       type: object
 *                       properties:
 *                         username:
 *                           type: string
 *                         avatar:
 *                           type: string
 *                     createdAt:
 *                       type: string
 *                     views:
 *                       type: number
 *                     likes:
 *                       type: number
 */
router.get('/articles/:articleId', getSharedArticle);

/**
 * @swagger
 * /api/share/articles/{articleId}/link:
 *   get:
 *     summary: 生成分享链接
 *     tags: [分享]
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
 *         description: 成功生成分享链接
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     shareLink:
 *                       type: string
 */
router.get('/articles/:articleId/link', protect, generateShareLink);

module.exports = router; 