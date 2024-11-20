const mongoose = require('mongoose');
require('dotenv').config();

// 连接数据库
mongoose.connect(process.env.MONGODB_URI);

// 检查集合索引
async function checkIndexes() {
    try {
        // 获取所有集合
        const collections = await mongoose.connection.db.collections();
        
        for (let collection of collections) {
            console.log(`\n检查集合: ${collection.collectionName}`);
            
            // 获取现有索引
            const indexes = await collection.indexes();
            console.log('现有索引:', indexes);
            
            // 检查索引使用情况
            const stats = await mongoose.connection.db.command({
                collStats: collection.collectionName
            });
            console.log('集合统计:', {
                文档数: stats.count,
                索引数: stats.nindexes,
                索引大小: `${(stats.totalIndexSize / 1024 / 1024).toFixed(2)}MB`
            });
        }
    } catch (error) {
        console.error('索引检查失败:', error);
    } finally {
        mongoose.connection.close();
    }
}

checkIndexes(); 