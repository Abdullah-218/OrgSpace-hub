import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { MESSAGES } from '../utils/constants.js';

/**
 * Protect routes - Verify JWT token and attach user to request
 * Usage: router.get('/protected', authenticate, controller)
 */
export const authenticate = async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token from "Bearer <token>"
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from database (exclude password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not found',
        });
      }

      // Check if user's role matches token role (in case role was changed)
      if (req.user.role !== decoded.role) {
        return res.status(401).json({
          success: false,
          message: 'Your role has changed. Please login again.',
        });
      }

      next(); // Continue to next middleware/controller
    } catch (error) {
      console.error('Token verification error:', error.message);
      
      let message = MESSAGES.ERROR.UNAUTHORIZED;
      
      if (error.name === 'TokenExpiredError') {
        message = 'Token has expired. Please login again.';
      } else if (error.name === 'JsonWebTokenError') {
        message = 'Invalid token. Please login again.';
      }

      return res.status(401).json({
        success: false,
        message,
      });
    }
  }

  // No token provided
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized. No token provided.',
    });
  }
};

/**
 * Optional authentication - Attach user if token exists, otherwise continue
 * Useful for routes that work differently for logged-in vs guest users
 * Usage: router.get('/public-with-user-context', optionalAuthenticate, controller)
 */
export const optionalAuthenticate = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    } catch (error) {
      // If token verification fails, just continue without user
      console.log('Optional auth: Invalid token, continuing as guest');
    }
  }

  next(); // Always continue, even if no user
};

export default authenticate;