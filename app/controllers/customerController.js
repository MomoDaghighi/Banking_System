const CustomerDetail = require('../models/CustomerDetail');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const TransferRequest = require('../models/TransferRequest');
const notificationService = require('../services/notificationService');
const customerController = {
    // View account details
    async viewAccountDetails(req, res) {
        try {
            const { user_id } = req.user; // Assuming user_id is set in req.user after authentication

            
            const customerDetails = await CustomerDetail.findOne({
                where: { user_id },
                include: [Account]
            });

            if (customerDetails) {
                res.status(200).json(customerDetails);
            } else {
                res.status(404).send('Customer details not found');
            }
        } catch (error) {
            console.error('Error fetching account details:', error);
            res.status(500).send('Internal server error');
        }
    },

    // View transaction report
    async viewTransactions(req, res) {
        try {
            const { user_id } = req.user; // Assuming user_id is set in req.user

            // Fetch transactions for the customer
            const transactions = await Transaction.findAll({
                include: [{
                    model: Account,
                    include: {
                        model: CustomerDetail,
                        where: { user_id }
                    }
                }]
            });

            res.status(200).json(transactions);
        } catch (error) {
            console.error('Error fetching transactions:', error);
            res.status(500).send('Internal server error');
        }
    },

    // Register transfer request
    async registerTransferRequest(req, res) {
        try {
            const { from_account_id, to_account_id, amount } = req.body;

            // Create a new transfer request
            const newTransferRequest = await TransferRequest.create({
                from_account_id,
                to_account_id,
                amount,
                status: 'pending' // Assuming default status is 'pending'
            });
            const account = await Account.findByPk(from_account_id, {
              include: CustomerDetail
          });
            if (account && account.CustomerDetail) {
              const customerEmail = account.CustomerDetail.email;
              const message = `Your transfer request for ${amount} has been registered successfully. Transfer ID: ${newTransferRequest.transfer_id}`;
              notificationService.sendEmail(customerEmail, "Transfer Request Confirmation", message);
          }
            res.status(201).send('Transfer request registered successfully');
        } catch (error) {
            console.error('Error registering transfer request:', error);
            res.status(500).send('Internal server error');
        }
    },

    // View transfer status
    async viewTransferStatus(req, res) {
        try {
            const { transfer_id } = req.params;

            // Fetch the transfer request status
            const transferRequest = await TransferRequest.findByPk(transfer_id);

            if (transferRequest) {
                res.status(200).json({ status: transferRequest.status });
            } else {
                res.status(404).send('Transfer request not found');
            }
        } catch (error) {
            console.error('Error fetching transfer status:', error);
            res.status(500).send('Internal server error');
        }
    },

    async viewMyAccountDetails(req, res) {
      try {
          const { user_id } = req.user;
          const accounts = await Account.findAll({
              include: [{
                  model: CustomerDetail,
                  where: { user_id }
              }]
          });
  
          res.status(200).json(accounts);
      } catch (error) {
          console.error('Error viewing account details:', error);
          res.status(500).send('Internal server error');
      }
  },

};

module.exports = customerController;
