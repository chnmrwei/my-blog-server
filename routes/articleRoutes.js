const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const {
    createArticle,
    getArticles,
    getArticle,
    updateArticle,
    deleteArticle,
    uploadImage
} = require('../controllers/articleController');

/**
 * @swagger
 * /api/articles:
 *   get:
 *     summary: 获取文章列表
 *     tags: [文章]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: 页码（默认1）
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: 每页数量（默认10）
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: 搜索关键词
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: 分类筛选
 *       - in: query
 *         name: tag
 *         schema:
 *           type: string
 *         description: 标签筛选
 *     responses:
 *       200:
 *         description: 成功获取文章列表
 *   post:
 *     summary: 创建文章
 *     tags: [文章]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: 文章创建成功
 *       401:
 *         description: 未授权
 */

/**
 * @swagger
 * /api/articles/{id}:
 *   get:
 *     summary: 获取单篇文章详情
 *     tags: [文章]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 文章ID
 *     responses:
 *       200:
 *         description: 成功获取文章详情
 *   put:
 *     summary: 更新文章
 *     tags: [文章]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 文章ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               content:
 *                 type: string
 *               category:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: 文章更新成功
 *       401:
 *         description: 未授权
 *       404:
 *         description: 文章不存在
 */

// 公开路由
router.get('/', getArticles);
router.get('/:id', getArticle);

// 需要认证的路由
router.post('/', protect, createArticle);
router.put('/:id', protect, updateArticle);
router.delete('/:id', protect, deleteArticle);

// 图片上传
router.post('/upload', protect, upload.single('image'), uploadImage);

module.exports = router; 