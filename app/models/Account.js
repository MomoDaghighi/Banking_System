const { DataTypes } = require('sequelize');
const sequelize = require('../../config/dbConfig');

const Account = sequelize.define('Account', {
    account_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    customer_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    account_number: {
        type: DataTypes.STRING,
        unique: true
    },
    account_type: DataTypes.ENUM('savings', 'checking'),
    balance: DataTypes.DECIMAL(10, 2)
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Account;
