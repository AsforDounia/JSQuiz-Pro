const User = require('../models/User');

// Controller: Fetch all users
exports.getAll = async (req, res) => {
    try {
        const users = await User.findAll();
        return res.json(users);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};


