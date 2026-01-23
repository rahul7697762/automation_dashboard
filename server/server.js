
import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(cors());

const API_KEY = process.env.RETELL_API_KEY;

// Initialize Supabase client
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Endpoint to create a web call
app.post('/api/create-web-call', async (req, res) => {
    try {
        const { user_phone } = req.body;
        // 1. Get the list of agents
        console.log('Fetching agents from Retell AI...');
        const agentsResponse = await fetch('https://api.retellai.com/list-agents', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
            },
        });

        // Check if response is OK before parsing
        if (!agentsResponse.ok) {
            const errorText = await agentsResponse.text();
            console.error('Agents API Error:', agentsResponse.status, errorText);
            return res.status(agentsResponse.status).json({
                error: `Failed to fetch agents: ${agentsResponse.status} ${agentsResponse.statusText}`,
                details: errorText.substring(0, 200)
            });
        }

        // Check content type before parsing
        const contentType = agentsResponse.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const errorText = await agentsResponse.text();
            console.error('Unexpected content type:', contentType);
            console.error('Response body:', errorText.substring(0, 200));
            return res.status(500).json({
                error: 'Unexpected response format from Retell API',
                details: 'Expected JSON but received: ' + contentType
            });
        }

        const agents = await agentsResponse.json();

        if (!Array.isArray(agents) || agents.length === 0) {
            console.error('Agents response:', JSON.stringify(agents));
            return res.status(404).json({ error: 'No agents found or invalid response from Retell.' });
        }

        const agentId = agents[0].agent_id;
        console.log(`Starting call with Agent ID: ${agentId}`);

        // 2. Create the web call
        console.log('Creating web call...');
        const callResponse = await fetch('https://api.retellai.com/v2/create-web-call', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                agent_id: agentId,
                metadata: {
                    user_phone: user_phone
                }
            }),
        });

        // Check if response is OK before parsing
        if (!callResponse.ok) {
            const errorText = await callResponse.text();
            console.error('Create call API Error:', callResponse.status, errorText);
            return res.status(callResponse.status).json({
                error: `Failed to create web call: ${callResponse.status} ${callResponse.statusText}`,
                details: errorText.substring(0, 200)
            });
        }

        // Check content type before parsing
        const callContentType = callResponse.headers.get('content-type');
        if (!callContentType || !callContentType.includes('application/json')) {
            const errorText = await callResponse.text();
            console.error('Unexpected content type:', callContentType);
            console.error('Response body:', errorText.substring(0, 200));
            return res.status(500).json({
                error: 'Unexpected response format from Retell API',
                details: 'Expected JSON but received: ' + callContentType
            });
        }

        const callData = await callResponse.json();
        console.log('Web call created successfully:', callData.call_id);

        res.json(callData);

    } catch (error) {
        console.error('Error creating web call:', error);
        res.status(500).json({ error: error.message });
    }
});

// Endpoint to create a phone call
app.post('/api/create-phone-call', async (req, res) => {
    try {
        const { to_number } = req.body;

        if (!to_number) {
            return res.status(400).json({ error: 'To number is required' });
        }

        // 1. Get the list of agents to find the specific one
        console.log('Fetching agents from Retell AI...');
        const agentsResponse = await fetch('https://api.retellai.com/list-agents', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
            },
        });

        if (!agentsResponse.ok) throw new Error('Failed to fetch agents');
        const agents = await agentsResponse.json();

        // 2. Find "Conversation Flow Agent" or default to first
        let agent = agents.find(a => a.agent_name === 'Conversation Flow Agent');
        if (!agent && agents.length > 0) {
            console.log('Specific agent not found, using first available.');
            agent = agents[0];
        }

        if (!agent) {
            return res.status(404).json({ error: 'No agents found.' });
        }

        console.log(`Selected Agent: ${agent.agent_name} (${agent.agent_id})`);

        // 3. Get the list of phone numbers
        console.log('Fetching phone numbers from Retell AI...');
        const numbersResponse = await fetch('https://api.retellai.com/list-phone-numbers', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
            },
        });

        if (!numbersResponse.ok) throw new Error('Failed to fetch phone numbers');
        const numbers = await numbersResponse.json();

        // 4. Select a valid number (assuming first one is valid for outbound)
        if (!numbers || numbers.length === 0) {
            return res.status(404).json({ error: 'No phone numbers found in Retell account.' });
        }

        const fromNumber = numbers[0].phone_number;
        console.log(`Using From Number: ${fromNumber}`);

        // 5. Create the phone call
        console.log(`Initiating phone call to ${to_number}...`);
        const callResponse = await fetch('https://api.retellai.com/v2/create-phone-call', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from_number: fromNumber,
                to_number: to_number,
                agent_id: agent.agent_id,
            }),
        });

        if (!callResponse.ok) {
            const errorText = await callResponse.text();
            throw new Error(`Failed to create call: ${callResponse.status} ${errorText}`);
        }

        const callData = await callResponse.json();
        console.log('Phone call created successfully:', callData.call_id);

        res.json(callData);

    } catch (error) {
        console.error('Error creating phone call:', error);
        res.status(500).json({ error: error.message });
    }
});

// Endpoint to retrieve call details
app.get('/api/call/:callId', async (req, res) => {
    try {
        const { callId } = req.params;
        console.log(`Fetching call details for: ${callId}`);

        const response = await fetch(`https://api.retellai.com/v2/get-call/${callId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Get call API Error:', response.status, errorText);
            return res.status(response.status).json({
                error: `Failed to fetch call: ${response.status} ${response.statusText}`,
                details: errorText.substring(0, 200)
            });
        }

        const callData = await response.json();
        res.json(callData);

    } catch (error) {
        console.error('Error fetching call:', error);
        res.status(500).json({ error: error.message });
    }
});

// Webhook endpoint to receive Retell AI events
app.post('/api/webhook/retell', async (req, res) => {
    try {
        const event = req.body;
        console.log('Received Retell webhook event:', event.event);
        console.log('Call ID:', event.call?.call_id);

        // Handle different event types
        switch (event.event) {
            case 'call_started':
                await handleCallStarted(event.call);
                break;
            case 'call_ended':
                await handleCallEnded(event.call);
                break;
            case 'call_analyzed':
                await handleCallAnalyzed(event.call);
                break;
            default:
                console.log('Unhandled event type:', event.event);
        }

        res.json({ received: true });

    } catch (error) {
        console.error('Error processing webhook:', error);
        res.status(500).json({ error: error.message });
    }
});



// Endpoint to sync calls from Retell
app.get('/api/sync-calls', async (req, res) => {
    try {
        console.log('Syncing calls from Retell AI...');

        // 1. Fetch calls from Retell
        const response = await fetch('https://api.retellai.com/v2/list-calls', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                limit: 50,
                sort_order: 'descending'
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch calls from Retell: ${response.status} ${errorText}`);
        }

        const calls = await response.json();
        console.log(`Fetched ${calls.length} calls from Retell.`);

        // 2. Upsert into Supabase
        let syncedCount = 0;
        let errors = 0;

        for (const call of calls) {
            try {
                const durationMs = call.end_timestamp && call.start_timestamp ? call.end_timestamp - call.start_timestamp : 0;
                const durationSeconds = Math.floor(durationMs / 1000);

                // Determine Contact Name based on call type and direction
                let contactName = 'Web User';
                if (call.call_type === 'phone_call') {
                    if (call.direction === 'inbound') {
                        contactName = call.from_number || 'Unknown Caller';
                    } else if (call.direction === 'outbound') {
                        contactName = call.to_number || 'Unknown Number';
                    }
                }

                const { error } = await supabase
                    .from('sales_calls')
                    .upsert({
                        call_id: call.call_id,
                        agent_id: call.agent_id,
                        contact_name: contactName,
                        status: call.call_status === 'ended' ? 'Completed' : 'Active', // Map status roughly
                        duration_seconds: durationSeconds,
                        transcript: call.transcript || null,
                        recording_url: call.recording_url || null,
                        disconnection_reason: call.disconnection_reason || null,
                        call_summary: call.call_analysis?.call_summary || null,
                        user_sentiment: call.call_analysis?.user_sentiment || null,
                        call_successful: call.call_analysis?.call_successful || false,
                        direction: call.direction || null,
                        call_type: call.call_type || null,
                        from_number: call.from_number || null,
                        to_number: call.to_number || null,
                        created_at: new Date(call.start_timestamp).toISOString()
                    }, { onConflict: 'call_id' });

                if (error) {
                    console.error(`Error syncing call ${call.call_id}:`, error);
                    errors++;
                } else {
                    syncedCount++;
                }

            } catch (err) {
                console.error(`Exception processing call ${call.call_id}:`, err);
                errors++;
            }
        }

        console.log(`Sync complete. Synced: ${syncedCount}, Errors: ${errors}`);
        res.json({ success: true, count: syncedCount, errors });

    } catch (error) {
        console.error('Error syncing calls:', error);
        res.status(500).json({ error: error.message });
    }
});

// Helper function to handle call_started event
async function handleCallStarted(call) {
    try {
        console.log(`Call started: ${call.call_id}`);

        // Determine Contact Name
        let contactName = 'Web Call User';
        let fromNumber = call.from_number || null;

        if (call.call_type === 'phone_call') {
            if (call.direction === 'inbound') {
                contactName = call.from_number || 'Unknown Caller';
            } else if (call.direction === 'outbound') {
                contactName = call.to_number || 'Unknown Number';
            }
        } else if (call.call_type === 'web_call') {
            // Check metadata for phone number
            if (call.metadata?.user_phone) {
                fromNumber = call.metadata.user_phone;
                contactName = `Web User (${fromNumber})`;
            }
        }

        const { error } = await supabase
            .from('sales_calls')
            .insert({
                call_id: call.call_id,
                agent_id: call.agent_id,
                contact_name: contactName,
                status: 'Active',
                duration_seconds: 0,
                transcript: null,
                recording_url: null,
                direction: call.direction || null,
                call_type: call.call_type || null,
                from_number: fromNumber,
                to_number: call.to_number || null,
                created_at: new Date(call.start_timestamp).toISOString()
            });

        if (error) {
            console.error('Error inserting call to Supabase:', error);
        } else {
            console.log('Call record created in Supabase');
        }
    } catch (error) {
        console.error('Error handling call started:', error);
    }
}

// Helper function to handle call_ended event
async function handleCallEnded(call) {
    try {
        console.log(`Call ended: ${call.call_id}`);

        const durationMs = call.end_timestamp - call.start_timestamp;
        const durationSeconds = Math.floor(durationMs / 1000);

        const { error } = await supabase
            .from('sales_calls')
            .update({
                status: 'Completed',
                duration_seconds: durationSeconds,
                transcript: call.transcript || null,
                recording_url: call.recording_url || null,
                disconnection_reason: call.disconnection_reason || null
            })
            .eq('call_id', call.call_id);

        if (error) {
            console.error('Error updating call in Supabase:', error);
        } else {
            console.log('Call record updated in Supabase');
        }
    } catch (error) {
        console.error('Error handling call ended:', error);
    }
}

// Helper function to handle call_analyzed event
async function handleCallAnalyzed(call) {
    try {
        console.log(`Call analyzed: ${call.call_id}`);

        const analysis = call.call_analysis || {};

        const { error } = await supabase
            .from('sales_calls')
            .update({
                call_summary: analysis.call_summary || null,
                user_sentiment: analysis.user_sentiment || null,
                call_successful: analysis.call_successful || false
            })
            .eq('call_id', call.call_id);

        if (error) {
            console.error('Error updating call analysis in Supabase:', error);
        } else {
            console.log('Call analysis updated in Supabase');
        }
    } catch (error) {
        console.error('Error handling call analyzed:', error);
    }
}

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/dist')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Webhook endpoint: /api/webhook/retell`);
});
