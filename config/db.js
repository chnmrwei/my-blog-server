const mongoose = require('mongoose');
const chalk = require('chalk');

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is not defined in environment variables');
        }

        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
        });

        console.log(
            chalk.cyan.bold(
                `🚀 Server running in ${process.env.NODE_ENV || 'development'} mode`
            )
        );
        console.log(
            chalk.yellow.bold(
                `📦 Connected to MongoDB @ ${conn.connection.host}`
            )
        );

        // 监听连接事件
        mongoose.connection.on('connected', () => {
            console.log(chalk.green.bold('✅ MongoDB connected'));
        });

        // 监听断开事件
        mongoose.connection.on('disconnected', () => {
            console.log(chalk.red.bold('❌ MongoDB disconnected'));
        });

        // 监听重连事件
        mongoose.connection.on('reconnected', () => {
            console.log(chalk.green.bold('🔄 MongoDB reconnected'));
        });

        // 监听错误
        mongoose.connection.on('error', (err) => {
            console.error(chalk.red.bold('MongoDB error: '), err);
        });

        // 监听进程终止
        process.on('SIGINT', async () => {
            try {
                await mongoose.connection.close();
                console.log(chalk.yellow.bold('📴 MongoDB connection closed through app termination'));
                process.exit(0);
            } catch (err) {
                console.error(chalk.red.bold('Error closing MongoDB connection: '), err);
                process.exit(1);
            }
        });

    } catch (error) {
        console.error(chalk.red.bold('Error: ') + error.message);
        process.exit(1);
    }
};

module.exports = connectDB;