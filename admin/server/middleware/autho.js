import jwt from 'jsonwebtoken';

const authoAdmin = async (req, res, next) => {
  console.log('\n--- New Auth Request ---');
  console.log('Request URL:', req.originalUrl);
  console.log('Request Headers:', JSON.stringify(req.headers, null, 2));

  // 1. Check Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.error('❌ Authorization header missing or malformed');
    return res.status(401).json({ 
      success: false, 
      message: "Authorization header missing or malformed" 
    });
  }

  // 2. Extract token
  const atoken = authHeader.split(' ')[1];
  console.log('Extracted Token:', atoken ? `${atoken.substring(0, 15)}...` : 'NULL');
  
  if (!atoken) {
    console.error('❌ No token found after Bearer');
    return res.status(401).json({ 
      success: false, 
      message: "No admin token provided" 
    });
  }

  try {
    console.log('\n--- Verification Stage ---');
    console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
    console.log('Token Length:', atoken.length, 'characters');
    console.log('Token Parts:', atoken.split('.').length);

    // 3. Verify token
    const decoded = jwt.verify(atoken, process.env.JWT_SECRET);
    console.log('✅ Token successfully decoded:', {
      email: decoded.email,
      role: decoded.role,
      iat: decoded.iat ? new Date(decoded.iat * 1000) : null,
      exp: decoded.exp ? new Date(decoded.exp * 1000) : null
    });

    // 4. Validate payload
    if (!decoded.role) {
      console.error('❌ Missing role in payload');
      return res.status(401).json({ 
        success: false, 
        message: "Invalid admin token payload: Missing required fields" 
      });
    }

    // 5. Check admin role
    if (decoded.role !== "admin") {
      console.error(`❌ Invalid role: ${decoded.role}`);
      return res.status(403).json({ 
        success: false, 
        message: "Admin privileges required - Your role: " + decoded.role 
      });
    }

    // 6. Attach to request
    req.admin = decoded;
    console.log('✔️ Authentication successful, proceeding to route handler');
    next();

  } catch (error) {
    console.error('\n--- Verification Failed ---');
    console.error('Error Type:', error.name);
    console.error('Error Message:', error.message);
    console.error('Stack Trace:', error.stack);

    if (error.name === 'TokenExpiredError') {
      console.error('❌ Token expired at:', error.expiredAt);
      return res.status(401).json({ 
        success: false, 
        message: "Admin token expired" 
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      console.error('❌ JWT Error:', error.message);
      console.log('Current JWT_SECRET:', process.env.JWT_SECRET ? 'exists' : 'MISSING');
      return res.status(401).json({ 
        success: false, 
        message: "Invalid admin token" 
      });
    }

    console.error('❌ Unexpected error:', error);
    return res.status(500).json({ 
      success: false, 
      message: "Admin authentication failed" 
    });
  }
};

export default authoAdmin;