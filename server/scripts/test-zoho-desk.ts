import dotenv from 'dotenv';
dotenv.config();

const ORG_ID = process.env.ZOHO_DESK_ORG_ID || '60041003425';
const ACCESS_TOKEN = process.env.ZOHO_DESK_ACCESS_TOKEN;

async function testEndpoint(baseUrl: string, path: string) {
    const url = `${baseUrl}${path}`;
    console.log(`Testing: ${url}`);
    try {
        const res = await fetch(url, {
            headers: {
                'Authorization': `Zoho-oauthtoken ${ACCESS_TOKEN}`,
                'orgId': ORG_ID,
                'Content-Type': 'application/json',
            },
        });
        const text = await res.text();
        console.log(`Result (${res.status}): ${text.substring(0, 200)}...`);
        return res.status === 200;
    } catch (e: any) {
        console.log(`Result (Error): ${e.message}`);
        return false;
    }
}

async function run() {
    const dcs = ['https://desk.zoho.com/api/v1', 'https://desk.zoho.in/api/v1', 'https://desk.zoho.eu/api/v1'];
    const paths = ['/agents/me', '/myinfo', '/agents/personalInfo', '/tickets?limit=1'];

    for (const dc of dcs) {
        console.log(`\n--- DC: ${dc} ---`);
        for (const path of paths) {
            const success = await testEndpoint(dc, path);
            if (success && path !== '/tickets?limit=1') {
                console.log(`\n🎉 SUCCESS! Use DC: ${dc} and Path: ${path}`);
                // return; // Keep testing to see if tickets work too
            }
        }
    }
}

run();
