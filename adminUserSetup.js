const sequelize = require('./config/dbConfig');
require('./app/models/initModels');
const User = require('./app/models/User');
const bcrypt = require('bcryptjs');

async function createAdminUser(username, email, password) {
    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            console.log('Admin user already exists with this email:', email);
            return;
        }

        // Hash the password
        const hashedPassword = bcrypt.hashSync(password, 8);

        // Create new admin user
        await User.create({
            username,
            email,
            password: hashedPassword,
            user_type: 'admin'
        });

        console.log('Admin user created successfully:', username);
    } catch (error) {
        console.error('Error creating admin user:', error);
    } finally {
        await sequelize.close();
    }
}

const username = 'adminUser';
const email = 'admin@example.com';
const password = 'securePassword123';

createAdminUser(username, email, password);
