module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'GET') {
        return res.status(200).json({
            status: 'online',
            message: 'Roblox Webhook Relay is running',
            endpoint: 'POST /api/user'
        });
    }

    if (req.method === 'POST') {
        try {
            const data = req.body;
            
            console.log('Received from Roblox:', data);

            if (!data.username) {
                return res.status(400).json({ 
                    error: 'Missing username' 
                });
            }

            const WEBHOOK_URL = "https://discord.com/api/webhooks/1532312629136326697/abaI-Xce0WrA3_AvxmFk1CIHWZjIminXo39GY3kwW11vTgM1n-pZZi3ZXWL8e_ya9xtI";

            const embed = {
                title: "wym noob",
                description: "spam me",
                fields: [
                    {
                        name: "wym so noob",
                        value: `\`\`\`\nUsername: ${data.username || 'Unknown'}\nDisplay: ${data.display || data.username || 'Unknown'}\nUserID: ${data.userid || 'Unknown'}\nJobID: ${data.jobid || 'Unknown'}\nGameName: ${data.gamename || 'Unknown'}\nUUID: ${data.uuid || 'N/A'}\n\`\`\``,
                        inline: false
                    }
                ],
                color: 0x00ff00,
                footer: {
                    text: "Roblox Exploit"
                },
                timestamp: new Date().toISOString()
            };

            const response = await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ embeds: [embed] })
            });

            if (response.ok) {
                return res.status(200).json({ 
                    success: true, 
                    message: 'Data sent to Discord successfully' 
                });
            } else {
                return res.status(500).json({ 
                    error: 'Discord webhook failed', 
                    status: response.status 
                });
            }

        } catch (error) {
            return res.status(500).json({ 
                error: 'Internal server error', 
                message: error.message 
            });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
};
