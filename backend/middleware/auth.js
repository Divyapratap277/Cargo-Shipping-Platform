const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // 1. Check for token in the Authorization header (standard practice)
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Extract the token from 'Bearer <token>'
    const token = authHeader.split(' ')[1];

    // 2. Verify token
    try {
        // The token payload should contain the user object (we used { user: { id: user.id } } in authController)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Attach the decoded user object to the request
        // The controller can access user ID via req.user.id
        req.user = decoded.user; 
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};
