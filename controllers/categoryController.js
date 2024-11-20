const Category = require('../models/Category');

// 创建分类
const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        
        // 检查分类名是否已存在
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: '该分类名已存在'
            });
        }

        const category = await Category.create({
            name,
            description
        });

        res.status(201).json({
            success: true,
            data: category
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// 获取所有分类
const getCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort('name');
        
        res.json({
            success: true,
            data: categories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// 获取单个分类及其文章
const getCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: '分类不存在'
            });
        }

        // 获取该分类下的文章
        const articles = await Article.find({ category: req.params.id })
            .populate('author', 'username avatar')
            .sort('-createdAt');

        res.json({
            success: true,
            data: {
                category,
                articles
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// 更新分类
const updateCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        
        // 如果要更改名称，检查新名称是否已存在
        if (name) {
            const existingCategory = await Category.findOne({ 
                name, 
                _id: { $ne: req.params.id } 
            });
            if (existingCategory) {
                return res.status(400).json({
                    success: false,
                    message: '该分类名已存在'
                });
            }
        }

        const category = await Category.findByIdAndUpdate(
            req.params.id,
            { name, description },
            { new: true, runValidators: true }
        );

        if (!category) {
            return res.status(404).json({
                success: false,
                message: '分类不存在'
            });
        }

        res.json({
            success: true,
            data: category
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// 删除分类
const deleteCategory = async (req, res) => {
    try {
        // 检查分类下是否有文章
        const articleCount = await Article.countDocuments({ category: req.params.id });
        if (articleCount > 0) {
            return res.status(400).json({
                success: false,
                message: '该分类下还有文章，无法删除'
            });
        }

        const category = await Category.findByIdAndDelete(req.params.id);
        
        if (!category) {
            return res.status(404).json({
                success: false,
                message: '分类不存在'
            });
        }

        res.json({
            success: true,
            message: '分类已删除'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory
}; 