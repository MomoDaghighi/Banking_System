const { DataTypes } = require('sequelize');
const sequelize = require('../../config/dbConfig');

const TransferRequest = sequelize.define('TransferRequest', {
    transfer_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    from_account_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    to_account_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    amount: DataTypes.DECIMAL(10, 2),
    status: DataTypes.ENUM('pending', 'completed', 'cancelled'),
    completed_date: DataTypes.DATE
}, {
    timestamps: true,
    createdAt: 'request_date',
    updatedAt: false
});

module.exports = TransferRequest;
