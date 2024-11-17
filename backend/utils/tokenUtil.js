import jwt from 'jsonwebtoken';


const createToken = (res, userID, tokenExpiration = '3d') => {
    let token = jwt.sign({ userID }, process.env.JWT_SECRET, {
      expiresIn: tokenExpiration,
    });
  
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: tokenExpiration === '30d' ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000, // Adjust cookie maxAge based on expiration
    });
  };
  
  export default createToken;
  