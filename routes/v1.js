const express         = require('express');
const router         = express.Router();

// const custom           = require('./../middleware/custom');
const UserController   = require('./../controllers/userController');

const passport         = require('passport');
const path              = require('path');

// User Routes
router.post('/users', UserController.create); //create

router.get('/users',passport.authenticate('jwt', {session:false}), UserController.get);  //read

router.put('/users',passport.authenticate('jwt', {session:false}), UserController.update); //update

router.delete('/users',passport.authenticate('jwt',{session:false}), UserController.remove); //delete
router.post('/users/login', UserController.login);

module.exports = router;
