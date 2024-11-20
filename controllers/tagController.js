const Tag = require('../models/Tag');
const Article = require('../models/Article');

// 创建标签
const createTag = async (req, res) => {
    try {
        const { name, description, color } = req.body;

        // 检查标签是否已存在
        const existingTag = await Tag.findOne({ name });
        if (existingTag) {
            return res.status(400).json({
                success: false,
                message: '该标签已存在'
            });
        }

        const tag = await Tag.create({
            name,
            description,
            color
        });

        res.status(201).json({
            success: true,
            data: tag
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// 获取所有标签
const getTags = async (req, res) => {
    try {
        const tags = await Tag.find().sort('-articleCount name');
        
        res.json({
            success: true,
            data: tags
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// 获取热门标签
const getHotTags = async (req, res) => {
    try {
        const tags = await Tag.find()
            .sort('-articleCount')
            .limit(10);

        res.json({
            success: true,
            data: tags
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// 获取标签详情及相关文章
const getTagDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const tag = await Tag.findById(id);
        if (!tag) {
            return res.status(404).json({
                success: false,
                message: '标签不存在'
            });
        }

        // 获取带有该标签的文章
        const articles = await Article.find({ 
            tags: tag.name,
            isPublished: true 
        })
            .populate('author', 'username avatar')
            .populate('category', 'name')
            .sort('-createdAt')
            .skip(skip)
            .limit(limit);

        const total = await Article.countDocuments({ 
            tags: tag.name,
            isPublished: true 
        });

        res.json({
            success: true,
            data: {
                tag,
                articles,
                pagination: {
                    current: page,
                    pageSize: limit,
                    total
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// 更新标签
const updateTag = async (req, res) => {
    try {
        const { name, description, color } = req.body;
        
        // 如果要更改名称，检查新名称是否已存在
        if (name) {
            const existingTag = await Tag.findOne({ 
                name, 
                _id: { $ne: req.params.id } 
            });
            if (existingTag) {
                return res.status(400).json({
                    success: false,
                    message: '该标签名已存在'
                });
            }
        }

        const tag = await Tag.findByIdAndUpdate(
            req.params.id,
            { name, description, color },
            { new: true, runValidators: true }
        );

        if (!tag) {
            return res.status(404).json({
                success: false,
                message: '标签不存在'
            });
        }

        res.json({
            success: true,
            data: tag
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// 删除标签
const deleteTag = async (req, res) => {
    try {
        const tag = await Tag.findById(req.params.id);
        if (!tag) {
            return res.status(404).json({
                success: false,
                message: '标签不存在'
            });
        }

        // 检查是否有文章使用此标签
        const articleCount = await Article.countDocuments({ tags: tag.name });
        if (articleCount > 0) {
            return res.status(400).json({
                success: false,
                message: `该标签下还有 ${articleCount} 篇文章，无法删除`
            });
        }

        await tag.remove();

        res.json({
            success: true,
            message: '标签已删除'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createTag,
    getTags,
    getHotTags,
    getTagDetails,
    updateTag,
    deleteTag
}; 