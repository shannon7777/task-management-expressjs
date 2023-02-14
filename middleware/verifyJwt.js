const jwt = require("jsonwebtoken");

// ----- VERIFYING ACCESS TOKENS ----

const verifyJwt = (req, res, next) => {
  // Check to see if there are any headers being sent, if there are then..
  // Get the access token from the headers in authorization,
  const header = req.headers["authorization"];
  if (!header) return res.sendStatus(401);
  const token = header.split(" ")[1];
  const secretKey = process.env.ACCESS_TOKEN_SECRET;
  // Verify the access token from the header
  jwt.verify(token, secretKey, (error, decoded) => {
    if (error) return res.sendStatus(403); // invalid token
    console.log("jwt is verified");
    // set the user as the decoded email
    req.email = decoded.email;
    next();
  });
};

module.exports = verifyJwt;
