import jwt from 'jsonwebtoken';
import { JWT_CONFIG } from './constants.js';

/**
 * Generate JWT token
 * @param {Object} payload - Data to encode in token
 * @param {String} payload.id - User ID
 * @param {String} payload.role - User role
 * @param {String} payload.email - User email (optional)
 * @param {String} payload.orgId - Organization ID (optional)
 * @param {String} payload.deptId - Department ID (optional)
 * @returns {String} JWT token
 */
export const generateToken = (payload) => {
  const { id, role, email, orgId, deptId, verified } = payload;

  // Token payload
  const tokenPayload = {
    id,
    role,
    email,
    verified: verified || false,
  };

  // Add orgId and deptId if user is verified
  if (orgId) tokenPayload.orgId = orgId;
  if (deptId) tokenPayload.deptId = deptId;

  // Generate token
  const token = jwt.sign(
    tokenPayload,
    process.env.JWT_SECRET,
    {
      expiresIn: JWT_CONFIG.EXPIRES_IN,
    }
  );

  return token;
};

/**
 * Verify JWT token
 * @param {String} token - JWT token to verify
 * @returns {Object} Decoded token payload
 */
export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

/**
 * Decode token without verification (for debugging)
 * @param {String} token - JWT token
 * @returns {Object} Decoded payload
 */
export const decodeToken = (token) => {
  return jwt.decode(token);
};

export default generateToken;