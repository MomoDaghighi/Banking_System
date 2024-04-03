const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const authenticateToken = require('../utils/authUtils').verifyTokenMiddleware;

router.use(authenticateToken);

router.get('/account-details', customerController.viewAccountDetails);
router.get('/transaction-report', customerController.viewTransactions);
router.post('/transfer-request', customerController.registerTransferRequest);
router.get('/transfer-status/:transfer_id', customerController.viewTransferStatus);
router.get('/my-accounts', customerController.viewMyAccountDetails);

module.exports = router;
