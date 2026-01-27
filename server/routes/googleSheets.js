const express = require('express');
const router = express.Router();
const { google } = require('googleapis');
const path = require('path');

// Google Sheets API setup
const auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, '../config/google-credentials.json'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

// Add data to Google Sheets
router.post('/add-to-google-sheet', async (req, res) => {
    try {
        const { niche, keywords, title, wordpressUrl } = req.body;

        // Your Google Sheet ID (you'll need to replace this)
        const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID || 'YOUR_SHEET_ID_HERE';

        // Prepare the row data
        const values = [[niche, keywords, title]];

        const request = {
            spreadsheetId: SPREADSHEET_ID,
            range: 'Sheet1!A:C', // Adjust sheet name if needed
            valueInputOption: 'USER_ENTERED',
            resource: {
                values,
            },
        };

        const response = await sheets.spreadsheets.values.append(request);

        console.log('Data added to Google Sheets:', response.data);

        res.json({
            success: true,
            message: 'Data successfully added to Google Sheets',
            data: response.data
        });

    } catch (error) {
        console.error('Error adding to Google Sheets:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;
