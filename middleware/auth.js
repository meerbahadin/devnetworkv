const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req,res,next) => {
    //Get Token From The Header
    const token = req.header('x-auth-token');

    //check token
    if(!token) {
        return res.status(401).json({msg:'No Token , Authoration Denied'});
    }

    //verify token
    try {
        const decoded = jwt.verify(token,config.get('jwtToken'));
        req.user = decoded.user;
        next();
    } catch (err) {
       return res.status(401).json({msg:'Token Not Valid'});
    }
}
