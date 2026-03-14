const { onRequest } = require('firebase-functions/v2/https');

// server.bundle.cjs is copied here by the predeploy hook in firebase.json
// Build it first with: npm run build (from project root)
const serverModule = require('./server.bundle.cjs');
const app = serverModule.default || serverModule;

exports.api = onRequest(
  {
    memory: '1GiB',
    timeoutSeconds: 300,
    region: 'us-central1',
    minInstances: 0,
    secrets: [
      'OPENAI_API_KEY',
      'ANTHROPIC_API_KEY',
      'TAVILY_API_KEY',
      'ZOHO_CLIENT_ID',
      'ZOHO_CLIENT_SECRET',
      'ZOHO_DESK_ORG_ID',
      'ZOHO_MEETING_ORG_ID',
      'SESSION_SECRET',
    ],
  },
  app
);
