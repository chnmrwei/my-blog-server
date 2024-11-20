const express = require('express');
const router = express.Router();
const { sendVerificationCode, verifyEmail } = require('../controllers/emailController');

/**
 * @swagger
 * /api/email/send-code:
 *   post:
 *     summary: 发送验证码
 *     tags: [邮件]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: 验证码发送成功
 */
router.post('/send-code', sendVerificationCode);

/**
 * @swagger
 * /api/email/verify:
 *   post:
 *     summary: 验证邮箱
 *     tags: [邮件]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - code
 *             properties:
 *               email:
 *                 type: string
 *               code:
 *                 type: string
 *     responses:
 *       200:
 *         description: 邮箱验证成功
 */
router.post('/verify', verifyEmail);

module.exports = router; 