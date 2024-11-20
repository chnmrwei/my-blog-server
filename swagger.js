const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Blog API',
        version: '1.0.0',
        description: 'Blog API Documentation'
    },
    servers: [
        {
            url: 'http://localhost:5000',
            description: 'Development server'
        }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT'
            }
        },
        schemas: {
            Error: {
                type: 'object',
                properties: {
                    success: {
                        type: 'boolean',
                        example: false
                    },
                    message: {
                        type: 'string'
                    }
                }
            }
        }
    },
    security: []  // 默认不需要认证
};

const options = {
    swaggerDefinition,
    apis: ['./routes/*.js']
};

module.exports = options; 