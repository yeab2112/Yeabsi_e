import express from "express"
import { Forgetpassword, Reset } from "../controller/user.js"
import { UserLogin,UserRegister,AdminLogin } from "../controller/user.js"
import { Auth } from "../controller/user.js"
const userRouter=express.Router()

import { body, validationResult } from 'express-validator';

userRouter.post('/register', [
  // Validate and sanitize name
  body('name')
    .trim()
    .notEmpty().withMessage('Name should not be empty')
    .isLength({ min: 3 }).withMessage('Name should be at least 3 characters long'),

  // Validate and sanitize email
  body('email')
    .trim()
    .notEmpty().withMessage('Email should not be empty')
    .isEmail().withMessage('Invalid email address')
    .normalizeEmail(), // Normalize email to handle case sensitivity

  // Validate and sanitize password
  body('password')
    .trim()
    .notEmpty().withMessage('Password should not be empty')
    .isLength({ min: 6, max: 30 }).withMessage('Password should be between 6 and 30 characters'),

  // Handle validation errors
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}, UserRegister); // Proceed to the UserRegister function if validation passes



//  product


userRouter.post('/login', UserLogin)
userRouter.post('/signup', UserRegister)
userRouter.post('/admin_login', AdminLogin)






userRouter.post('/forget-password',Forgetpassword)
userRouter.post('/reset-password/:token',Reset)

 

export default userRouter