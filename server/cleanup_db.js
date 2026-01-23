import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function clean() {
    console.log('Cleaning sales_calls table...');

    // Check if table exists and has data first
    const { count, error: countError } = await supabase
        .from('sales_calls')
        .select('*', { count: 'exact', head: true });

    if (countError) {
        console.error('Error checking table:', countError.message);
        return;
    }

    console.log(`Found ${count} records.`);

    if (count > 0) {
        // Delete all records
        const { error } = await supabase
            .from('sales_calls')
            .delete()
            .neq('created_at', '1970-01-01'); // Delete all rows

        if (error) console.error('Error deleting data:', error.message);
        else console.log('✅ Successfully removed all dummy data.');
    } else {
        console.log('Table is already empty.');
    }
}

clean();
