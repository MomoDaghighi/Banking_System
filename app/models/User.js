const { DataTypes } = require('sequelize');
const sequelize = require('../../config/dbConfig');

const User = sequelize.define('User', {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        unique: true
    },
    password: DataTypes.STRING,
    email: {
        type: DataTypes.STRING,
        unique: true
    },
    user_type: DataTypes.ENUM('admin', 'customer')
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = User;
