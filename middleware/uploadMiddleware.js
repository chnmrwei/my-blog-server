const multer = require('multer');
const path = require('path');

// 配置存储
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // 根据请求路径决定存储目录
        let uploadPath = 'uploads/avatars/';  // 默认存储路径
        
        // 根据路由路径选择存储目录
        if (req.path.includes('/articles')) {
            uploadPath = 'uploads/articles/';
        }
        
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// 文件过滤器
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('请上传图片文件'), false);
    }
};

// 创建 multer 实例
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024  // 限制 5MB
    }
});

module.exports = upload; 