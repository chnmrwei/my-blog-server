const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getArticleStats,
    getUserStats,
    getOverallStats,
    getHotStats
} = require('../controllers/statisticsController');

/**
 * @swagger
 * /api/statistics/articles/{articleId}:
 *   get:
 *     summary: 获取文章统计信息
 *     tags: [统计]
 *     parameters:
 *       - in: path
 *         name: articleId
 *         schema:
 *           type: string
 *         required: true
 *         description: 文章ID
 *     responses:
 *       200:
 *         description: 成功
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
 *                     views:
 *                       type: number
 *                     likes:
 *                       type: number
 *                     comments:
 *                       type: number
 */
router.get('/articles/:articleId', getArticleStats);

/**
 * @swagger
 * /api/statistics/users/{userId}:
 *   get:
 *     summary: 获取用户统计信息
 *     tags: [统计]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: 用户ID
 *     responses:
 *       200:
 *         description: 成功
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
 *                     articles:
 *                       type: number
 *                     likes:
 *                       type: number
 *                     comments:
 *                       type: number
 */
router.get('/users/:userId', getUserStats);

/**
 * @swagger
 * /api/statistics/overall:
 *   get:
 *     summary: 获取总体统计信息
 *     tags: [统计]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 成功
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
 *                     total:
 *                       type: object
 *                       properties:
 *                         users:
 *                           type: number
 *                         articles:
 *                           type: number
 *                         comments:
 *                           type: number
 *                         likes:
 *                           type: number
 *                     recent:
 *                       type: object
 *                       properties:
 *                         newUsers:
 *                           type: number
 *                         newArticles:
 *                           type: number
 *                         newComments:
 *                           type: number
 */
router.get('/overall', protect, getOverallStats);

/**
 * @swagger
 * /api/statistics/hot:
 *   get:
 *     summary: 获取热门统计信息
 *     tags: [统计]
 *     responses:
 *       200:
 *         description: 成功
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
 *                     hotArticles:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           title:
 *                             type: string
 *                           views:
 *                             type: number
 *                           likes:
 *                             type: number
 *                     activeUsers:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           username:
 *                             type: string
 *                           stats:
 *                             type: object
 */
router.get('/hot', getHotStats);

module.exports = router; 