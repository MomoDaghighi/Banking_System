const { DataTypes } = require('sequelize');
const sequelize = require('../../config/dbConfig');

const Transaction = sequelize.define('Transaction', {
    transaction_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    account_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    type: DataTypes.ENUM('deposit', 'withdrawal', 'transfer'),
    amount: DataTypes.DECIMAL(10, 2),
    status: DataTypes.ENUM('pending', 'completed', 'cancelled'),
    related_transaction: DataTypes.INTEGER
}, {
    timestamps: true,
    createdAt: 'transaction_date',
    updatedAt: false
});

module.exports = Transaction;
