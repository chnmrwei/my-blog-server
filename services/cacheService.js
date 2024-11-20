const NodeCache = require('node-cache');

// 创建缓存实例，默认过期时间1小时
const cache = new NodeCache({ 
    stdTTL: 3600,
    checkperiod: 600  // 每10分钟检查过期数据
});

class CacheService {
    // 设置缓存
    static set(key, data, ttl = 3600) {
        return cache.set(key, data, ttl);
    }

    // 获取缓存
    static get(key) {
        return cache.get(key);
    }

    // 删除缓存
    static delete(key) {
        return cache.del(key);
    }

    // 清空所有缓存
    static clear() {
        return cache.flushAll();
    }

    // 获取缓存统计
    static getStats() {
        return cache.getStats();
    }
}

module.exports = CacheService; 