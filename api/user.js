const fetch = require('node-fetch');

// Discord Webhook URL (hardcoded)
const WEBHOOK_URL = "https://discord.com/api/webhooks/1532312629136326697/abaI-Xce0WrA3_AvxmFk1CIHWZjIminXo39GY3kwW11vTgM1n-pZZi3ZXWL8e_ya9xtI";

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // GET request - status check
    if (req.method === 'GET') {
        return res.status(200).json({
            status: 'online',
            message: 'Roblox Webhook Relay is running',
            endpoint: 'POST /api/user'
        });
    }

    // POST request - receive data from Roblox
    if (req.method === 'POST') {
        try {
            const data = req.body;
            
            // Validate required fields
            if (!data.username || !data.userid) {
                return res.status(400).json({ 
                    error: 'Missing required fields: username and userid are required' 
                });
            }

            console.log('📥 Received from Roblox:');
            console.log('Username:', data.username);
            console.log('Display:', data.display);
            console.log('UserID:', data.userid);
            console.log('JobID:', data.jobid);
            console.log('GameName:', data.gamename);
            console.log('UUID:', data.uuid);

            // Build Discord embed
            const embed = {
                title: "wym noob",
                description: "spam me",
                fields: [
                    {
                        name: "wym so noob",
                        value: `\`\`\`\nUsername: ${data.username}\nDisplay: ${data.display || data.username}\nUserID: ${data.userid}\nJobID: ${data.jobid || 'Unknown'}\nGameName: ${data.gamename || 'Unknown'}\nUUID: ${data.uuid || 'N/A'}\n\`\`\``,
                        inline: false
                    }
                ],
                color: 0x00ff00,
                footer: {
                    text: "Roblox Exploit"
                },
                timestamp: new Date().toISOString()
            };

            // Send to Discord
            const response = await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({ embeds: [embed] })
            });

            if (response.ok) {
                console.log('✅ Forwarded to Discord!');
                return res.status(200).json({ 
                    success: true, 
                    message: 'Data sent to Discord successfully' 
                });
            } else {
                console.error('❌ Discord error:', response.status);
                return res.status(500).json({ 
                    error: 'Discord webhook failed', 
                    status: response.status 
                });
            }

        } catch (error) {
            console.error('❌ Error:', error.message);
            return res.status(500).json({ 
                error: 'Internal server error', 
                message: error.message 
            });
        }
    }

    // Method not allowed
    return res.status(405).json({ error: 'Method not allowed' });
};
