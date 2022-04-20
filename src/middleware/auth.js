import jwt from 'jsonwebtoken'

export default function verifyJWT(req, res, next) {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(400).json({ Status:400, auth: false, message: 'Token nao foi enviado.' });
    
    jwt.verify(token, process.env.SECRET, function(err, decoded) {
      if (err) return res.status(401).json({ Status:401, auth: false, messagem: 'Falha ao autentica o token.' });
      req.userId = decoded.userId;
      req.userEmail = decoded.userEmail
      req.userRole = decoded.userRole
      next();
    });
}