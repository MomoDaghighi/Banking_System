const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const engine = require('ejs-mate');
require('dotenv').config();
const sequelize = require('./config/dbConfig');
const adminRoutes = require('./app/routes/adminRoutes');
const customerRoutes = require('./app/routes/customerRoutes');
const authRoutes = require('./app/routes/authRoutes');
const path = require('path');
const app = express();
require('./app/models/initModels');
app.use(cors()); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
// Main Page Routes
app.get('/', (req, res) => {
 // or just user if you have it defined
    res.render('index', { user: req.user });
});
app.get('/login', (req, res) => res.render('auth/login' , { user: req.user }));
app.get('/register', (req, res) => res.render('auth/register' , { user: req.user }));
// API Routes
app.use('/api/admin', adminRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/auth', authRoutes);

// 404 Handler - Moved to the end
// app.use((req, res) => res.status(404).render('404'));

// Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { user: req.user || null });
});

sequelize.authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.error('Error: ' + err));

// Start the server only after Sequelize syncs
sequelize.sync().then(() => {
    console.log('Database synced');
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});

module.exports = app;
