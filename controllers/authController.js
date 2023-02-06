const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async (req,res) => {
    const {email, password} = req.body;
    const userFound = await User.findOne({ email }).exec();
    if (!userFound) {
    //    return res.status(401).json({message: `Email ${email} does not exist, please try again`})
       return res.status(401).send();
    }
    // compare password to the password in database
    const pwdMatch = await bcrypt.compare(password, userFound.password);
    try{
        if(pwdMatch){
            // create JWTs if password matches
            // encoding the email into the token by doing jwt.sign()
            const accessToken = jwt.sign(
                { "email": userFound.email },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "5h" }
            );
            const refreshToken = jwt.sign(
                { "email": userFound.email },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: "7d" }
            )
            // Saving the refresh token to the logged in user
            userFound.refreshToken = refreshToken;
            await userFound.save();
            console.log(refreshToken);
            const user = await User.findOne({email}).select(["-password","-refreshToken"]).lean().exec()
            // Save the refresh token in a cookie but only available to HTTP, not available in jS (for security reasons)
            res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure:true, maxAge: 24 * 60 * 60 * 1000 })
            // sending the accesstoken as json to the frontend
            res.status(200).json({message: `User:  ${userFound.email} has successfully logged in`, user, accessToken});
        } else { 
            // res.status(400).json({message: `Password does not match email`});
            res.status(400).send();
        }
    } catch (error){
        res.status(402).json({message: `Could not log in, ${error.message}`})
    }
}

const handleLogout = async (req,res) => {
    // if there are no cookies ? then thats good, we wan to clear that out upon logging out
    if(!req.cookies?.jwt) return res.sendStatus(204);
    const refreshToken = req.cookies.jwt;

    // Check if refresh token exists with user in db
    const user = await User.findOne({refreshToken}).exec();
    if(!user){
        // if user is not found with refresh token, just clear cookie anyways
        // in production set secure:true , no need to do so in development. this is for HTTPS
        res.clearCookie('jwt', { httpOnly: true, maxAge: 24*60*60*1000 });
        return res.sendStatus(204)
    } else {
        // delete refresh token in db and clear cookie
        user.refreshToken = '';
        await user.save();
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        // res.sendStatus(204);
        res.status(200).json({message: `User ${user.email} has successfully logged out`});
    }
}

// --- REFRESH ACCESS TOKEN FUNCTION ------

const handleRefreshToken = async (req,res) => {
    // Use optional chaining to see if cookies object exists
    // if it exsits, then retrieve the refresh token from cookies
    if(!req.cookies?.jwt) return res.sendStatus(401);
    const refreshToken = req.cookies.jwt
    // Find the user via the refresh token
    const user = await User.findOne({refreshToken}).exec();
    // if the user exists, verify its refresh token
    if(user){
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            // check if the user's email is the same as the decoded email from the refreshToken
            (err, decoded) => {
                if( err || user.email !== decoded.email) {
                    return res.sendStatus(403);
                } // if there is no error and the email matches, go ahead and create a new accessToken
                const accessToken = jwt.sign(
                    {"email": decoded.email},
                    process.env.ACCESS_TOKEN_SECRET,
                    {expiresIn: "5h"}
                )
                res.json({ accessToken })
            }
        )
    } else {
        res.sendStatus(403);
    }
}

module.exports = { handleLogin, handleRefreshToken, handleLogout };