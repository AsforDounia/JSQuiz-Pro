const Theme = require('../models/Theme');

module.exports = {

    // Get all themes
    async getAll(req, res){
        try {
            const themes = await Theme.findAll();
            return res.json(themes);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error' });
        }
    },

    // Get a single theme
    async getThemeById(req, res) {
        try {
            const { id } = req.params;
            const themeId = Number(id);
            if (!Number.isInteger(themeId) || themeId <= 0) {
                return res.status(400).json({ message: 'Invalid theme ID' });
            }

            const theme = await Theme.findByPk(themeId);
            if (!theme) {
                return res.status(404).json({ message: 'Theme not found' });
            }
            return res.json(theme);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error' });
        }
    },

    // Create a new theme
    async createTheme(req, res) {
        try {
            const { name } = req.body;

            if (!name || typeof name !== 'string' || name.trim().length === 0) {
                return res.status(400).json({ message: 'Theme name is required' });
            }

            const existing = await Theme.findOne({ where: { name: name } });
            if (existing) {
                return res.status(409).json({ message: 'Theme already exists' });
            }

            const theme = await Theme.create({ name: name });
            return res.status(201).json({ message: 'Theme created', data: theme });
        } catch (error) {
            console.error('Failed to create theme:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },

    // Update a theme
    async updateTheme(req, res){
        try {
            const { id } = req.params;
            const { name } = req.body;

            if(!name || typeof name !== 'string' || name.trim().length === 0){
                return res.status(400).json({ message: 'Theme name is required' });
            };

            const theme = await Theme.findByPk(id);
            if (!theme) {
                return res.status(404).json({ message: 'Theme not found' });
            }

            // Prevent duplicate names
            const existing = await Theme.findOne({ where: { name: name } });
            if (existing && existing.id !== theme.id) {
                return res.status(409).json({ message: 'Theme already exists' });
            }

            theme.name = name;
            await theme.save();

            res.json({ message: 'Theme updated successfully', theme });
        } catch (error) {
            console.error('Failed to update the theme:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },

    // Delete a theme
    async deleteTheme(req, res){
            try {
            const { id } = req.params;

            const theme = await Theme.findByPk(id);
            if (!theme) {
                return res.status(404).json({ message: 'Theme not found' });
            }

            await theme.destroy();

            res.json({ message: 'Theme deleted successfully' });
        } catch (error) {
            console.error('Failed to delete the theme:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}

