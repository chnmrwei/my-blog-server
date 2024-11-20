const Joi = require('joi');
const { AppError } = require('./errorMiddleware');

// 创建验证中间件
const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, {
            abortEarly: false,  // 返回所有错误
            stripUnknown: true  // 删除未定义的字段
        });

        if (error) {
            const errorMessage = error.details
                .map(detail => detail.message)
                .join(', ');
            return next(new AppError(errorMessage, 400));
        }

        next();
    };
};

// 验证模式
const schemas = {
    // 用户注册验证
    userRegister: Joi.object({
        username: Joi.string()
            .min(2)
            .max(30)
            .required()
            .messages({
                'string.min': '用户名至少2个字符',
                'string.max': '用户名最多30个字符',
                'any.required': '用户名不能为空'
            }),
        email: Joi.string()
            .email()
            .required()
            .messages({
                'string.email': '邮箱格式不正确',
                'any.required': '邮箱不能为空'
            }),
        password: Joi.string()
            .min(6)
            .max(30)
            .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
            .required()
            .messages({
                'string.min': '密码至少6个字符',
                'string.max': '密码最多30个字符',
                'string.pattern.base': '密码必须包含大小写字母和数字',
                'any.required': '密码不能为空'
            })
    }),

    // 文章创建验证
    articleCreate: Joi.object({
        title: Joi.string()
            .min(2)
            .max(100)
            .required()
            .messages({
                'string.min': '标题至少2个字符',
                'string.max': '标题最多100个字符',
                'any.required': '标题不能为空'
            }),
        content: Joi.string()
            .min(10)
            .required()
            .messages({
                'string.min': '内容至少10个字符',
                'any.required': '内容不能为空'
            }),
        category: Joi.string()
            .required()
            .messages({
                'any.required': '分类不能为空'
            }),
        tags: Joi.array()
            .items(Joi.string())
            .min(1)
            .messages({
                'array.min': '至少选择一个标签'
            })
    })
};

module.exports = {
    validate,
    schemas
}; 