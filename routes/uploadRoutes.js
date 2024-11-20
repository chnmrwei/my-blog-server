const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const uploads = require('../middleware/uploadMiddleware');
const { uploadFile, deleteFile } = require('../controllers/uploadController');

/**
 * @swagger
 * /api/uploads/avatars:
 *   post:
 *     summary: 上传用户头像
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: 上传成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 文件上传成功
 *                 data:
 *                   type: object
 *                   properties:
 *                     filename:
 *                       type: string
 *                       example: 1234567890-123456789.jpg
 *                     path:
 *                       type: string
 *                       example: uploads/avatars/1234567890-123456789.jpg
 *                     url:
 *                       type: string
 *                       example: http://localhost:3000/uploads/avatars/1234567890-123456789.jpg
 *       400:
 *         description: 请求错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/avatars', protect, uploads.single('avatar'), uploadFile);

/**
 * @swagger
 * /api/uploads/articles:
 *   post:
 *     summary: 上传文章图片
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               article:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: 上传成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 文件上传成功
 *                 data:
 *                   type: object
 *                   properties:
 *                     filename:
 *                       type: string
 *                     path:
 *                       type: string
 *                     url:
 *                       type: string
 */
router.post('/articles', protect, uploads.single('article'), uploadFile);

/**
 * @swagger
 * /api/uploads/{filename}:
 *   delete:
 *     summary: 删除上传的文件
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         description: 要删除的文件名
 *     responses:
 *       200:
 *         description: 删除成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 文件删除成功
 *       404:
 *         description: 文件不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:filename', protect, deleteFile);

module.exports = router; 