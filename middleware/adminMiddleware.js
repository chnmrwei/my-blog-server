const isAdmin = async (req, res, next) => {
    try {
        console.log('Admin middleware - User:', req.user);
        
        if (!req.user || req.user.role !== 'admin') {
            console.log('User is not admin - Role:', req.user?.role);
            return res.status(403).json({
                success: false,
                message: '需要管理员权限'
            });
        }

        console.log('Admin access granted');
        next();
    } catch (error) {
        console.error('Admin middleware error:', error);
        res.status(500).json({
            success: false,
            message: '服务器错误'
        });
    }
};

module.exports = { isAdmin }; 