const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = {
    // Register a new user
    async register(req, res) {
        const { username, email, password } = req.body;
        try {
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) return res.status(400).json({ message: 'Email already registered' });

            const salt = await bcrypt.genSalt(10);
            const password_hash = await bcrypt.hash(password, salt);

            const user = await User.create({ username, email, password_hash });

            const token = jwt.sign(
                { id: user.id, role: user.role, name: user.username },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            return res.status(201).json({ token, message: 'User created successfully' });
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
            if (!user) return res.status(400).json({ message: 'Invalid credentials' });

            const isMatch = await bcrypt.compare(password, user.password_hash);
            if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

            const token = jwt.sign(
                { id: user.id, role: user.role, name: user.username },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            return res.json({ message: "User login successfully ", token, user: { id: user.id, username: user.username, email: user.email, role: user.role } });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error' });
        }
    }

}

