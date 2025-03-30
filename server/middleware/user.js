import jwt from 'jsonwebtoken';

const authenticateUser = async (req, res, next) => {
  try {
    // 1. Check Authorization header exists
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ 
        success: false, 
        message: "Authorization header missing" 
      });
    }

    // 2. Verify header format is "Bearer <token>"
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ 
        success: false, 
        message: "Authorization format should be: Bearer <token>" 
      });
    }

    // 3. Extract the token
    const token = parts[1];
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: "Authentication token missing" 
      });
    }

    // 4. Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5. Basic user verification (no admin check)
    if (!decoded._id) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid token payload" 
      });
    }

    // 6. Attach user to request
    req.user = decoded;
    next();

  } catch (error) {
    console.error('Authentication error:', error.message);

    // Specific error responses
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid or malformed token" 
      });
    }

    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ 
        success: false, 
        message: "Token expired. Please log in again." 
      });
    }

    return res.status(500).json({ 
      success: false, 
      message: "Authentication failed" 
    });
  }
};

export default authenticateUser;