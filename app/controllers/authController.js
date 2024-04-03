const User = require('../models/User');
const authUtils = require('../utils/authUtils');

const authController = {
    // User Registration
    async register(req, res) {
        try {
            const { username, password, email, user_type } = req.body;

            // Check if the user already exists
            const userExists = await User.findOne({ where: { email } });
            if (userExists) {
                return res.status(400).send('Email already in use');
            }

            // Hash the password using authUtils
            const hashedPassword = authUtils.hashPassword(password);

            // Create new user
            const newUser = await User.create({
                username,
                password: hashedPassword,
                email,
                user_type: 'customer'
            });

            // Omitting sensitive data in the response
            res.status(201).json({ username: newUser.username, email: newUser.email, user_type: newUser.user_type });
        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).send('Error in registration');
        }
    },

    // User Login
    async login(req, res) {
        try {
            const { email, password } = req.body;

            // Check if user exists
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return res.status(404).send('User not found');
            }

            // Compare hashed password using authUtils
            const passwordIsValid = authUtils.comparePassword(password, user.password);
            if (!passwordIsValid) {
                return res.status(401).send('Invalid password');
            }

            // Generate a token using authUtils
            const token = authUtils.generateToken(user);

            res.status(200).json({ message: 'Login successful', token, user_type: user.user_type });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).send('Error on login');
        }
    },

};

module.exports = authController;
