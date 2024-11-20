const QRCode = require('qrcode');
const Article = require('../models/Article');
const User = require('../models/User');

// 生成分享数据
const generateShareData = async (req, res) => {
    try {
        const { articleId } = req.params;
        
        // 获取文章信息
        const article = await Article.findById(articleId)
            .populate('author', 'username');
        
        if (!article) {
            return res.status(404).json({
                success: false,
                message: '文章不存在'
            });
        }

        // 生成分享链接
        const shareUrl = `${req.protocol}://${req.get('host')}/articles/${articleId}`;
        
        // 生成二维码
        const qrCode = await QRCode.toDataURL(shareUrl);

        // 生成分享文本
        const shareText = `${article.title} - 作者：${article.author.username}\n${article.description}\n阅读全文：${shareUrl}`;

        res.json({
            success: true,
            data: {
                title: article.title,
                description: article.description,
                author: article.author.username,
                shareUrl,
                qrCode,
                shareText
            }
        });
    } catch (error) {
        console.error('生成分享数据错误:', error);
        res.status(500).json({
            success: false,
            message: error.message || '生成分享数据失败'
        });
    }
};

// 获取分享文章信息
const getSharedArticle = async (req, res) => {
    try {
        const { articleId } = req.params;
        
        const article = await Article.findById(articleId)
            .populate('author', 'username avatar')
            .select('title content createdAt views likes author');

        if (!article) {
            return res.status(404).json({
                success: false,
                message: '文章不存在'
            });
        }

        // 增加浏览次数
        article.views = (article.views || 0) + 1;
        await article.save();

        return res.status(200).json({
            success: true,
            data: {
                title: article.title,
                content: article.content,
                author: article.author,
                createdAt: article.createdAt,
                views: article.views,
                likes: article.likes
            }
        });
    } catch (error) {
        console.error('Error getting shared article:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// 生成分享链接
const generateShareLink = async (req, res) => {
    try {
        const { articleId } = req.params;
        const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
        
        const shareLink = `${baseUrl}/api/share/articles/${articleId}`;
        
        return res.status(200).json({
            success: true,
            data: {
                shareLink
            }
        });
    } catch (error) {
        console.error('Error generating share link:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    generateShareData,
    getSharedArticle,
    generateShareLink
}; 