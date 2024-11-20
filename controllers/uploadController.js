const path = require('path');
const fs = require('fs').promises;

// 上传单个文件
const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: '请选择要上传的文件'
            });
        }

        // 构建文件URL
        const fileUrl = `${req.protocol}://${req.get('host')}/${req.file.path.replace(/\\/g, '/')}`;

        res.status(200).json({
            success: true,
            message: '文件上传成功',
            data: {
                filename: req.file.filename,
                path: req.file.path,
                url: fileUrl
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// 删除文件
const deleteFile = async (req, res) => {
    try {
        const { filename } = req.params;
        const filepath = path.join('uploads', filename);

        // 检查文件是否存在
        await fs.access(filepath);
        // 删除文件
        await fs.unlink(filepath);

        res.json({
            success: true,
            message: '文件删除成功'
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: '文件不存在或删除失败'
        });
    }
};

module.exports = {
    uploadFile,
    deleteFile
}; 