require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const connectDB = require('./config/db');
const chalk = require('chalk');
const swaggerOptions = require('./swagger');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();

// 基本中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// 测试路由
app.get('/', (req, res) => {
    res.json({ message: 'API is running' });
});

// Swagger UI 设置
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    swaggerOptions: {
        persistAuthorization: true,
        docExpansion: 'none'  // 默认折叠所有接口
    }
}));

// API 路由
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/articles', require('./routes/articleRoutes'));
app.use('/api/comments', require('./routes/commentRoutes'));
app.use('/api/likes', require('./routes/likeRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/statistics', require('./routes/statisticsRoutes'));
app.use('/api/share', require('./routes/shareRoutes'));
app.use('/api/search', require('./routes/searchRoutes'));
app.use('/api/email', require('./routes/emailRoutes'));
app.use('/api/uploads', require('./routes/uploadRoutes'));

// 添加响应处理中间件
app.use((req, res, next) => {
    // 确保所有响应都是 JSON
    res.setHeader('Content-Type', 'application/json');
    next();
});

// 错误处理中间件
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || '服务器内部错误'
    });
});

// 处理未捕获的异常
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});

// 处理未处理的 Promise 拒绝
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    process.exit(1);
});

// 连接数据库
console.log('Starting database connection...');
connectDB().then(() => {
    // 只有在数据库连接成功后才启动服务器
    const PORT = process.env.PORT;
    app.listen(PORT, () => {
        console.log(
            chalk.green.bold(
                `🌍 API is listening on port ${PORT}`
            )
        );
        console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
    });
}).catch(error => {
    console.error('Failed to connect to database:', error);
    process.exit(1);
});

app.use(express.static('public'));