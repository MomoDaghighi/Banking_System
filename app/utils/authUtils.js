
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authUtils = {
    hashPassword: function(password) {
        return bcrypt.hashSync(password, 8);
    },

    comparePassword: function(password, hashedPassword) {
        return bcrypt.compareSync(password, hashedPassword);
    },

    generateToken: function(user) {
        const expiresIn = 24 * 60 * 60;
        return jwt.sign({ user_id: user.user_id, email: user.email, user_type: user.user_type }, process.env.JWT_SECRET, {
            expiresIn: expiresIn
        });
    },

    verifyTokenMiddleware: function (req, res, next) {
        const token = req.headers['authorization'];

        if (!token) {
            return res.status(403).send({ message: 'No token provided!' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch (error) {
            return res.status(401).send({ message: 'Unauthorized!' });
        }
    },
};

module.exports = authUtils;
