const logger = require('../config/logger');

const logOperation = (operation) => {
    logger.info({
        type: 'operation',
        ...operation
    });
};

// 预定义的操作类型
const OperationType = {
    CREATE: 'create',
    UPDATE: 'update',
    DELETE: 'delete',
    LOGIN: 'login',
    LOGOUT: 'logout'
};

module.exports = {
    logOperation,
    OperationType
}; 