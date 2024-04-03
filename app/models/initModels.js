const User = require('./User');
const CustomerDetail = require('./CustomerDetail');
const Account = require('./Account');
const Transaction = require('./Transaction');
const TransferRequest = require('./TransferRequest');

// User to CustomerDetail (One-to-One)
User.hasOne(CustomerDetail, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});
CustomerDetail.belongsTo(User, {
    foreignKey: 'user_id'
});

// CustomerDetail to Accounts (One-to-Many)
CustomerDetail.hasMany(Account, {
    foreignKey: 'customer_id',
    onDelete: 'CASCADE'
});
Account.belongsTo(CustomerDetail, {
    foreignKey: 'customer_id'
});

// Accounts to Transactions (One-to-Many)
Account.hasMany(Transaction, {
    foreignKey: 'account_id',
    onDelete: 'CASCADE'
});
Transaction.belongsTo(Account, {
    foreignKey: 'account_id'
});

// Accounts to TransferRequests (One-to-Many) with Aliases
Account.hasMany(TransferRequest, {
    foreignKey: 'from_account_id',
    onDelete: 'CASCADE',
    as: 'fromRequests'
});
Account.hasMany(TransferRequest, {
    foreignKey: 'to_account_id',
    as: 'toRequests'
});
TransferRequest.belongsTo(Account, {
    foreignKey: 'from_account_id',
    as: 'fromAccount'
});
TransferRequest.belongsTo(Account, {
    foreignKey: 'to_account_id',
    as: 'toAccount'
});

module.exports = {
    User,
    CustomerDetail,
    Account,
    Transaction,
    TransferRequest
};
