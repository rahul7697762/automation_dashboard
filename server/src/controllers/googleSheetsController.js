import GoogleSheetsService from '../services/googleSheetsService.js';

export const addToSheet = async (req, res) => {
    try {
        const userId = req.user.id;
        const { niche, keywords, title, wordpressUrl } = req.body;

        if (!niche || !title) {
            return res.status(400).json({ success: false, error: 'Niche and Title are required' });
        }

        const rowData = [
            niche,
            keywords || '',
            title,
            wordpressUrl || '',
            new Date().toLocaleDateString()
        ];

        await GoogleSheetsService.appendRow(userId, rowData);

        res.json({ success: true, message: 'Added to Google Sheet' });
    } catch (error) {
        console.error('Add to Sheet Error:', error);
        res.status(500).json({ success: false, error: 'Failed to add to Google Sheet' });
    }
};
