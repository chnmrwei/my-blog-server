const express = require('express');
const router = express.Router();
const { searchArticles, searchUsers, searchAll } = require('../controllers/searchController');
const { protect } = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/search/articles:
 *   get:
 *     summary: 搜索文章
 *     tags: [搜索]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         required: true
 *         schema:
 *           type: string
 *         description: 搜索关键词
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: 页码
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: 每页数量
 *     responses:
 *       200:
 *         description: 搜索结果
 */
router.get('/articles', searchArticles);

/**
 * @swagger
 * /api/search/users:
 *   get:
 *     summary: 搜索用户
 *     tags: [搜索]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: keyword
 *         required: true
 *         schema:
 *           type: string
 *         description: 搜索关键词
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: 页码
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: 每页数量
 *     responses:
 *       200:
 *         description: 搜索结果
 */
router.get('/users', protect, searchUsers);

/**
 * @swagger
 * /api/search/all:
 *   get:
 *     summary: 综合搜索
 *     tags: [搜索]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         required: true
 *         schema:
 *           type: string
 *         description: 搜索关键词
 *     responses:
 *       200:
 *         description: 搜索结果
 */
router.get('/all', searchAll);

module.exports = router; 