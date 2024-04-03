const User = require('../models/User');
const CustomerDetail = require('../models/CustomerDetail');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const TransferRequest = require('../models/TransferRequest');
const notificationService = require('../services/notificationService');
const adminController = {
    // Add a new customer
    async addCustomer(req, res) {
      try {
          const { username, password, email, first_name, last_name, address, phone, user_type } = req.body;
          
          // Check if user already exists
          const existingUser = await User.findOne({ where: { email } });
          if (existingUser) {
              return res.status(400).send('User already exists with this email');
          }
  
          // Create new user
          const newUser = await User.create({
              username,
              password, // Make sure to hash this password before saving
              email,
              user_type: user_type || 'customer' // Default to 'customer' if not provided
          });
  
          // Create customer details
          await CustomerDetail.create({
              user_id: newUser.user_id,
              first_name,
              last_name,
              address,
              phone,
              email
          });
          if (newUser) {
            notificationService.sendEmail(newUser.email, "Welcome to Our Bank", "Your account has been created successfully.");
        }
          res.status(201).send('Customer added successfully');
      } catch (error) {
          console.error('Error adding customer:', error);
          res.status(500).send('Error adding customer');
      }
  },

    // Edit existing customer details
    async editCustomer(req, res) {
      try {
          const { customer_id } = req.params;
          const updatedData = req.body;
  
          // Update customer details
          const [updated] = await CustomerDetail.update(updatedData, {
              where: { customer_id }
          });
  
          if (updated) {
              res.status(200).send('Customer updated successfully');
          } else {
              res.status(404).send('Customer not found');
          }
      } catch (error) {
          console.error('Error updating customer:', error);
          res.status(500).send('Error updating customer');
      }
  },

    // View list of all customers
    async listCustomers(req, res) {
      try {
          // Retrieve all customers with their details
          const customers = await CustomerDetail.findAll({
              include: [User]
          });
  
          res.status(200).json(customers);
      } catch (error) {
          console.error('Error listing customers:', error);
          res.status(500).send('Error listing customers');
      }
  },

    // View specific customer details
    async viewCustomerDetails(req, res) {
        try {
            const { customer_id } = req.params;

            const customer = await CustomerDetail.findOne({
                where: { customer_id },
                include: [{ model: User, attributes: ['username', 'email', 'user_type'] }] // Including associated User data
            });

            if (customer) {
                res.status(200).json(customer);
            } else {
                res.status(404).send('Customer not found');
            }
        } catch (error) {
            console.error('Error viewing customer details:', error);
            res.status(500).send('Internal server error');
        }
    },


    // Add new transaction
    async addTransaction(req, res) {
        try {
            const { account_id, type, amount, related_transaction } = req.body;
            const status = 'pending';

            const newTransaction = await Transaction.create({
                account_id,
                type,
                amount,
                status,
                related_transaction
            });

            res.status(201).json({ message: 'Transaction added successfully', transactionId: newTransaction.transaction_id });
        } catch (error) {
            console.error('Error adding transaction:', error);
            res.status(500).send('Internal server error');
        }
    },

    // Edit existing transaction
    async editTransaction(req, res) {
        try {
            const { transaction_id } = req.params;
            const { status, ...updateData } = req.body;
    
            // Fetch the existing transaction
            const transaction = await Transaction.findByPk(transaction_id);
            if (!transaction) {
                return res.status(404).send('Transaction not found');
            }
    
            // Validate the status transition logic
            if (transaction.status === 'completed' && status !== 'completed') {
                // Prevent changing the status of a completed transaction
                return res.status(400).send('Cannot change status from completed');
            }
    
            // Update the transaction
            await Transaction.update({ status, ...updateData }, { where: { transaction_id } });
            if (transaction.Account && transaction.Account.CustomerDetail) {
                const customerEmail = transaction.Account.CustomerDetail.email;
                const message = `Your transaction with ID: ${transaction_id} has been updated. New status: ${status}`;
                notificationService.sendEmail(customerEmail, "Transaction Update", message);
            }
            res.status(200).send('Transaction updated successfully');
        } catch (error) {
            console.error('Error updating transaction:', error);
            res.status(500).send('Internal server error');
        }
    },

    async viewAccountDetails(req, res) {
        try {
            const { account_id } = req.params;
            const account = await Account.findByPk(account_id, {
                include: [CustomerDetail]
            });
    
            if (!account) {
                return res.status(404).send('Account not found');
            }
    
            res.status(200).json(account);
        } catch (error) {
            console.error('Error fetching account details:', error);
            res.status(500).send('Internal server error');
        }
    },

    // View all transactions
    async listTransactions(req, res) {
        try {
            // Retrieve all transactions
            const transactions = await Transaction.findAll({
                include: [
                    { model: Account, attributes: ['account_number', 'account_type'], 
                    include: [CustomerDetail],}
                ],
                order: [['transaction_date', 'DESC']]
            });
    
            res.status(200).json(transactions);
        } catch (error) {
            console.error('Error listing transactions:', error);
            res.status(500).send('Internal server error');
        }
    },

    // Manage transfer requests and status
    async manageTransferRequests(req, res) {
        try {
            // Retrieve all transfer requests
            const transferRequests = await TransferRequest.findAll({
                include: [
                    { model: Account, as: 'fromAccount', attributes: ['account_number'], include: [CustomerDetail]
                },
                    { model: Account, as: 'toAccount', attributes: ['account_number'],
                    include: [CustomerDetail]}
                ],
                order: [['request_date', 'DESC']]
            });
    
            res.status(200).json(transferRequests);
        } catch (error) {
            console.error('Error managing transfer requests:', error);
            res.status(500).send('Internal server error');
        }
    },
};

module.exports = adminController;
