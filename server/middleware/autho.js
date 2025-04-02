import jwt from 'jsonwebtoken';

const authoAdmin = async (req, res, next) => {
  // 1. Check Authorization header exists and is properly formatted
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      success: false, 
      message: "Authorization header missing or malformed" 
    });
  }

  // 2. Extract atoken (admin token)
  const atoken = authHeader.split(' ')[1];
  if (!atoken) {
    return res.status(401).json({ 
      success: false, 
      message: "No admin token provided" 
    });
  }

  try {
    // 3. Verify atoken
    const decoded = jwt.verify(atoken, process.env.JWT_SECRET);

    // 4. Validate atoken payload structure
    if ( !decoded.role) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid admin token payload: Missing required fields" 
      });
    }

    // 5. Check admin role specifically
    if (decoded.role !== "admin") {
      return res.status(403).json({ 
        success: false, 
        message: "Admin privileges required - Your role: " + decoded.role 
      });
    }

    // 6. Attach decoded admin user to request
    req.admin = decoded;  
    next();

  } catch (error) {
    console.error('Admin authentication error:', error);
    
    // Handle specific JWT errors
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: "Admin token expired" 
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid admin token" 
      });
    }

    // Generic error response
    return res.status(500).json({ 
      success: false, 
      message: "Admin authentication failed" 
    });
  }
};

export default authoAdmin;