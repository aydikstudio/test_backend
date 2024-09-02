const Router = require('express');
const router = new Router();
const controller = require('./authController');
const authMiddleware = require('./middlewaree/authMiddleware');

router.post('/registration', controller.registration);
router.post('/login', controller.login);
router.post('/logintelegram', controller.loginTelegram);
router.get('/users/me', authMiddleware, controller.getUsers );




module.exports = router;