import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

console.log('Testing Supabase Connection...');
console.log('URL:', SUPABASE_URL);
console.log('Key:', SUPABASE_KEY ? 'Set' : 'Missing');

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('❌ Missing credentials');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testConnection() {
    try {
        console.log('Attempting to fetch a row from user_credits...');
        const { data, error } = await supabase.from('user_credits').select('count', { count: 'exact', head: true });

        if (error) {
            console.error('❌ Supabase Request Failed:', error);
        } else {
            console.log('✅ Connection Successful!');
        }
    } catch (err) {
        console.error('❌ Unexpected Error:', err);
    }
}

testConnection();
