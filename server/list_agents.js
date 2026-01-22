
import fetch from 'node-fetch';

const apiKey = 'key_75f00c2702d709b10c3681aef0cc';

async function listAgents() {
    try {
        const response = await fetch('https://api.retellai.com/v2/agents', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        if (Array.isArray(data)) {
            console.log("AGENT_ID: " + data[0].agent_id);
        } else {
            console.log(JSON.stringify(data, null, 2));
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

listAgents();
