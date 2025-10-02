const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { blacklistToken } = require('../services/auth');

module.exports = {
    // Register a new user
    async register(req, res) {
        const { username, email, password, confirmPassword } = req.body;
        try {
            // Validate password confirmation
            if (password !== confirmPassword) {
                return res.status(400).json({ message: 'Passwords do not match' });
            }

            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) 
                return res.status(400).json({ message: 'Email already registered' });

            const salt = await bcrypt.genSalt(10);
            const password_hash = await bcrypt.hash(password, salt);

            // Determine role: first user is admin
            const userCount = await User.count();
            const role = userCount === 0 ? 'admin' : 'user';

            const user = await User.create({ username, email, password_hash });

            const token = jwt.sign(
                { id: user.id, role: user.role, name: user.username },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            // Set token in HTTP-only cookie
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 3600000 // 1 hour
            });

            if (role === 'admin') {
                return res.redirect('/admin/dashboard');
            } else {
                return res.redirect('/users/dashboard');
            }
            // return res.status(201).json({ 
            //     token, 
            //     message: 'User created successfully' 
            // });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error' });
        }
    },

    // Login existing user
    async login(req, res) {
        const { email, password } = req.body;
        try {
            const user = await User.findOne({ where: { email } });
            if (!user) 
                return res.status(400).json({ message: 'Invalid credentials' });

            const isMatch = await bcrypt.compare(password, user.password_hash);
            if (!isMatch) 
                return res.status(400).json({ message: 'Invalid credentials' });

            const token = jwt.sign(
                { id: user.id, role: user.role, name: user.username },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            // Set token in HTTP-only cookie
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 3600000
            });


            if (user.role === 'admin') {
                return res.redirect('/admin/dashboard'); // Admin dashboard
            } else if (user.role === 'user') {
                return res.redirect('/users/dashboard'); // Regular user dashboard
            } else {
                return res.redirect('/'); // Fallback
            }
            // return res.json({ 
            //     message: "User logged in successfully",
            //     token,
            //     user: { id: user.id, username: user.username, email: user.email, role: user.role } 
            // });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error' });
        }
    },

    // Logout user
    async logout(req, res) {
        try {
            const authHeader = req.headers['authorization'];
            const headerToken = authHeader && authHeader.split(' ')[1];
            const cookieToken = req.cookies && req.cookies.token;
            const token = headerToken || cookieToken;

            if (token) {
                blacklistToken(token);
            }   

            res.clearCookie('token', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                expires: new Date(0)
            });
            return res.redirect('/'); 
            // return res.json({ message: 'User logged out successfully' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error' });
        }
    }
}
