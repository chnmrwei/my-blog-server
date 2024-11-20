const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/adminMiddleware');
const User = require('../models/User');

/**
 * @swagger
 * tags:
 *   name: 管理员
 *   description: 管理员专用接口
 */

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: 获取所有用户列表
 *     tags: [管理员]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 成功获取用户列表
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       username:
 *                         type: string
 *                       email:
 *                         type: string
 *                       role:
 *                         type: string
 */
router.get('/users', protect, isAdmin, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json({
            success: true,
            data: users
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

/**
 * @swagger
 * /api/admin/user/{id}:
 *   get:
 *     summary: 获取指定用户信息
 *     tags: [管理员]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 成功获取用户信息
 */
router.get('/user/:id', protect, isAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: '用户不存在'
            });
        }
        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

/**
 * @swagger
 * /api/admin/user/{id}:
 *   delete:
 *     summary: 删除用户
 *     tags: [管理员]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 用户ID
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
 *                   example: 用户已删除
 *       404:
 *         description: 用户不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/user/:id', protect, isAdmin, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: '用户不存在'
            });
        }
        res.json({
            success: true,
            message: '用户已删除'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

/**
 * @swagger
 * /api/admin/make-admin:
 *   post:
 *     summary: 设置用户为管理员
 *     tags: [管理员]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 description: 要设置为管理员的用户ID
 *     responses:
 *       200:
 *         description: 设置成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/UserResponse'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.post('/make-admin', protect, isAdmin, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.body.userId,
            { role: 'admin' },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: '用户不存在'
            });
        }

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

/**
 * @swagger
 * /api/admin/remove-admin:
 *   post:
 *     summary: 移除管理员权限
 *     tags: [管理员]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 description: 要移除管理员权限的用户ID
 *     responses:
 *       200:
 *         description: 移除成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/UserResponse'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.post('/remove-admin', protect, isAdmin, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.body.userId,
            { role: 'user' },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: '用户不存在'
            });
        }

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

/**
 * @swagger
 * components:
 *   schemas:
 *     UserResponse:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "672f6915e1265794479b65a9"
 *         username:
 *           type: string
 *           example: "没验证码的3"
 *         email:
 *           type: string
 *           example: "iu28@qq.com"
 *         avatar:
 *           type: string
 *           example: ""
 *         role:
 *           type: string
 *           example: "admin"
 *         profile:
 *           type: object
 *           properties:
 *             gender:
 *               type: string
 *               example: ""
 *         stats:
 *           type: object
 *           properties:
 *             articleCount:
 *               type: number
 *               example: 0
 *             followersCount:
 *               type: number
 *               example: 0
 *             followingCount:
 *               type: number
 *               example: 0
 *         following:
 *           type: array
 *           items:
 *             type: string
 *         followers:
 *           type: array
 *           items:
 *             type: string
 *         isActive:
 *           type: boolean
 *           example: true
 *         isVerified:
 *           type: boolean
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-11-09T13:52:21.930Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2024-11-09T16:21:49.104Z"
 *   
 *   responses:
 *     NotFound:
 *       description: 用户不存在
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               success:
 *                 type: boolean
 *                 example: false
 *               message:
 *                 type: string
 *                 example: 用户不存在
 */

module.exports = router; 