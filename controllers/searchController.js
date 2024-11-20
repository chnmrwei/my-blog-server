const Article = require('../models/Article');
const User = require('../models/User');

// 搜索文章
const searchArticles = async (req, res) => {
    try {
        const { keyword, page = 1, limit = 10 } = req.query;
        
        if (!keyword) {
            return res.status(400).json({
                success: false,
                message: '请输入搜索关键词'
            });
        }

        // 创建搜索条件
        const searchRegex = new RegExp(keyword, 'i');
        const query = {
            $or: [
                { title: searchRegex },
                { content: searchRegex },
                { tags: searchRegex }
            ]
        };

        // 执行搜索
        const articles = await Article.find(query)
            .populate('author', 'username avatar')
            .select('title content createdAt views likes tags')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await Article.countDocuments(query);

        return res.json({
            success: true,
            data: {
                list: articles,
                pagination: {
                    current: parseInt(page),
                    pageSize: parseInt(limit),
                    total
                }
            }
        });
    } catch (error) {
        console.error('Search articles error:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// 搜索用户
const searchUsers = async (req, res) => {
    try {
        const { keyword, page = 1, limit = 10 } = req.query;

        if (!keyword) {
            return res.status(400).json({
                success: false,
                message: '请输入搜索关键词'
            });
        }

        // 创建搜索条件
        const searchRegex = new RegExp(keyword, 'i');
        const query = {
            $or: [
                { username: searchRegex },
                { email: searchRegex }
            ]
        };

        // 执行搜索
        const users = await User.find(query)
            .select('username email avatar createdAt')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await User.countDocuments(query);

        return res.json({
            success: true,
            data: {
                list: users,
                pagination: {
                    current: parseInt(page),
                    pageSize: parseInt(limit),
                    total
                }
            }
        });
    } catch (error) {
        console.error('Search users error:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// 综合搜索
const searchAll = async (req, res) => {
    try {
        const { keyword, page = 1, limit = 10 } = req.query;

        if (!keyword) {
            return res.status(400).json({
                success: false,
                message: '请输入搜索关键词'
            });
        }

        const searchRegex = new RegExp(keyword, 'i');

        // 并行执行搜索
        const [articles, users] = await Promise.all([
            Article.find({ 
                $or: [
                    { title: searchRegex },
                    { content: searchRegex },
                    { tags: searchRegex }
                ]
            })
            .populate('author', 'username avatar')
            .select('title content createdAt views likes tags')
            .limit(5),

            User.find({
                $or: [
                    { username: searchRegex },
                    { email: searchRegex }
                ]
            })
            .select('username email avatar')
            .limit(5)
        ]);

        return res.json({
            success: true,
            data: {
                articles,
                users
            }
        });
    } catch (error) {
        console.error('Search all error:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    searchArticles,
    searchUsers,
    searchAll
}; 