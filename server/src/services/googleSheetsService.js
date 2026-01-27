import { google } from 'googleapis';
import { supabase } from '../config/supabaseClient.js';
import { decryptData } from '../utils/encryption.js';

class GoogleSheetsService {

    async getAuthClient(userId) {
        // Fetch user settings
        const { data: settings, error } = await supabase
            .from('user_settings')
            .select('google_sheet_id, google_service_email, google_private_key')
            .eq('user_id', userId)
            .single();

        if (error || !settings) {
            throw new Error('Google Sheets settings not found for this user');
        }

        const privateKey = decryptData(settings.google_private_key);
        if (!privateKey) throw new Error('Failed to decrypt private key');

        // Fix newline characters in private key if needed
        const formattedKey = privateKey.replace(/\\n/g, '\n');

        const auth = new google.auth.JWT(
            settings.google_service_email,
            null,
            formattedKey,
            ['https://www.googleapis.com/auth/spreadsheets']
        );

        return { auth, spreadsheetId: settings.google_sheet_id };
    }

    async appendRow(userId, rowData) {
        try {
            const { auth, spreadsheetId } = await this.getAuthClient(userId);
            const sheets = google.sheets({ version: 'v4', auth });

            // Ensure header row exists (optional, simplified check)
            // Ideally we'd read first row, but simpler to just append

            await sheets.spreadsheets.values.append({
                spreadsheetId,
                range: 'Sheet1!A:E', // Default range
                valueInputOption: 'USER_ENTERED',
                requestBody: {
                    values: [rowData] // [Niche, Keywords, Title, WP URL, Date]
                }
            });

            return true;
        } catch (error) {
            console.error('Google Sheets Append Error:', error);
            throw error;
        }
    }
}

export default new GoogleSheetsService();
