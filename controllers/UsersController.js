const User = require('../models/User');

module.exports = {
    // Fetch all users
    async getAll(req, res) {
        try {
            const users = await User.findAll();
            return res.json(users);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error' });
        }
    }

}


