const express = require('express');
const path = require('path');
const connectDb = require('./config/db');
const errorHandler = require('./middleware/errorMiddleware');
const verifyJwt = require('./middleware/verifyJwt');
const cookieParser = require('cookie-parser');
// Handle cross origin resource sharing (CORS)
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
// const allowedOrigins = require('./config/allowedOrigins');
const credentials = require('./middleware/credentials');
const app = express();

// Connect database
connectDb();
// Setting the port for localhost
const PORT = process.env.PORT || 5000; 

// handle options credentials check - must set before CORS!!
// and to fetch cookies credentials requirement
app.use(credentials);

// using cors for app - cross origin resource sharing
app.use(cors(corsOptions));

// !!! MIDDLEWARE FUNCTIONS FOR HANDLING JSON MUST BE DECLARED BEFORE THE ROUTE IF NOT THERE'LL BE ERRORS
// for handling JSON
app.use(express.json());
// for handling form submission (POST method)
app.use(express.urlencoded({ extended: false }));

// Middleware for cookies
app.use(cookieParser());

// --- ROUTES---
// Making a users route
app.use('/api/users', require('./routes/userRoutes'));
// Making an auth (login/logout/refreshtoken) route
app.use('/api/auth', require('./routes/authRoutes'));
// use jwt verification for routes below here
app.use(verifyJwt);
// Making a tasks route 
app.use('/api/tasks', require('./routes/taskRoutes'));

// for static pages
app.use(express.static(path.join(__dirname, 'public')));

// Wrap the app around errorHandler ; it will overwrite the expressJS default error handler
app.use(errorHandler);

app.listen(PORT, () => console.log(`This server is running on port ${PORT}`));