const router = require('express').Router()
const userController = require('../controller/controller') //user controller
const employeeController = require('../fapps/controller/controller') //employee controller
const { tokenValidator } =  require('../middleware/validator') //token middleware

router.get('/view', userController.getAll);
router.post('/create', userController.userCreator);
router.post('/login', userController.loginUser);
router.delete('/delete', userController.dellAll);
router.get('/view-employee', tokenValidator, employeeController.viewAll);
router.post('/create-employee', tokenValidator, employeeController.createEmp);
router.get('/view-employee/:id', tokenValidator, employeeController.viewById);
router.put('/update-employee/:id', tokenValidator, employeeController.updateEmp);
router.delete('/delete-employee/', tokenValidator, employeeController.delAll);
router.delete('/delete-employee/:id', tokenValidator, employeeController.deleteOne);

module.exports = router

