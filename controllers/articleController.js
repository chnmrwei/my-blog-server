const Article = require('../models/Article');
const MarkdownService = require('../services/markdownService');

// 获取文章列表
const getArticles = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const query = {};

        // 搜索功能
        if (req.query.search) {
            const keyword = req.query.search.trim();
            query.$or = [
                { title: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } }
            ];
        }

        // 分类筛选
        if (req.query.category) {
            query.category = req.query.category;
        }

        // 标签筛选
        if (req.query.tag) {
            query.tags = req.query.tag;
        }

        console.log('搜索关键词:', req.query.search);
        console.log('查询条件:', JSON.stringify(query, null, 2));

        const articles = await Article.find(query)
            .populate('author', 'username avatar')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        console.log('找到的文章:', articles);

        const total = await Article.countDocuments(query);

        res.json({
            success: true,
            data: {
                articles,
                pagination: {
                    current: page,
                    pageSize: limit,
                    total
                }
            }
        });
    } catch (error) {
        console.error('获取文章列表错误:', error);
        res.status(500).json({
            success: false,
            message: error.message || '获取文章列表失败'
        });
    }
};

// 获取单篇文章
const getArticle = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id)
            .populate('author', 'username avatar');

        if (!article) {
            return res.status(404).json({
                success: false,
                message: '文章不存在'
            });
        }

        res.json({
            success: true,
            data: article
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// 创建文章
const createArticle = async (req, res) => {
    try {
        const article = await Article.create({
            ...req.body,
            author: req.user._id
        });

        res.status(201).json({
            success: true,
            data: article
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// 更新文章
const updateArticle = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);

        if (!article) {
            return res.status(404).json({
                success: false,
                message: '文章不存在'
            });
        }

        // 检查是否是文章作者
        if (article.author.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: '没有权限更新此文章'
            });
        }

        const updatedArticle = await Article.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('author', 'username avatar');

        res.json({
            success: true,
            data: updatedArticle
        });
    } catch (error) {
        console.error('更新文章错误:', error);
        res.status(500).json({
            success: false,
            message: error.message || '更新文章失败'
        });
    }
};

// 删除文章
const deleteArticle = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);

        if (!article) {
            return res.status(404).json({
                success: false,
                message: '文章不存在'
            });
        }

        if (article.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: '没有权限删除此文章'
            });
        }

        await article.deleteOne();

        res.json({
            success: true,
            message: '文章已删除'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// 上传图片
const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: '请选择要上传的图片'
            });
        }

        const imageUrl = `/uploads/${req.file.filename}`;
        
        res.json({
            success: true,
            data: {
                url: imageUrl
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getArticles,
    getArticle,
    createArticle,
    updateArticle,
    deleteArticle,
    uploadImage
}; 