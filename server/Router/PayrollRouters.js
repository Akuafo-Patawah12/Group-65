const express = require('express');
const { newPayroll ,myPayroll, payroll} = require('../Controllers/Payroll');
const router = express.Router();

router.post('/',newPayroll )
router.get('/myPayroll/:userId', myPayroll);
router.get('/:id', payroll);

module.exports = router;
// This code sets up an Express router for handling payroll-related API requests. It imports the `newPayroll` function from the `Payroll` module and defines a POST route at the root URL ("/") that triggers the `newPayroll` function when accessed. Finally, it exports the router for use in other parts of the application.