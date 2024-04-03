const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authenticateToken = require('../utils/authUtils').verifyTokenMiddleware;
const roleCheckMiddleware = require('../utils/roleCheckMiddleware');

router.use(authenticateToken);
router.use(roleCheckMiddleware(['admin']));

router.post('/add-customer', adminController.addCustomer);
router.put('/edit-customer/:customer_id', adminController.editCustomer);
router.get('/list-customers', adminController.listCustomers);
router.get('/customer/:customer_id', adminController.viewCustomerDetails);
router.post('/add-transaction', adminController.addTransaction);
router.put('/edit-transaction/:transaction_id', adminController.editTransaction);
router.get('/account/:account_id', adminController.viewAccountDetails);
router.get('/list-transactions', adminController.listTransactions);
router.get('/manage-transfer-requests', adminController.manageTransferRequests);

module.exports = router;
