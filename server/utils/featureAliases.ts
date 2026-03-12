/**
 * Feature Alias Mapping
 * Maps Zoho Analytics internal feature names to industry terms and vice versa
 */

export const FEATURE_ALIASES: Record<string, string[]> = {
    // Workspace & Collaboration
    'Linked Workspace': ['Sandbox', 'Linked Workspace 2.0', 'Template Workspace', 'Master-Client Workspace', 'Workspace Template'],
    'Sandbox': ['Linked Workspace', 'Linked Workspace 2.0', 'Template Workspace', 'Test Environment'],

    // Ask Zia / AI Features
    'Ask Zia': ['Conversational Analytics', 'NL Query', 'Natural Language Query', 'AI Assistant', 'ChatGPT for Analytics'],
    'Zia Agent': ['AI Agent', 'Data Agent', 'Autonomous Agent', 'Agentic AI'],
    'Zia Copilot': ['AI Copilot', 'Code Assistant', 'AI Code Generator'],

    // Data Sources
    'Live Connect': ['Live Connection', 'Direct Query', 'Real-time Connection', 'Live Data'],
    'Cloud DB': ['Cloud Database', 'Cloud Data Source', 'Managed Database'],
    'Databridge': ['Data Bridge', 'On-premise Connector', 'Secure Gateway'],

    // Imports & Data Prep
    'Essential Imports': ['Data Import', 'Data Source Connection', 'Database Connector'],
    'DataPrep': ['Data Preparation', 'Data Cleaning', 'ETL', 'Data Transformation'],

    // DSML
    'DSML': ['Data Science', 'Machine Learning', 'ML Studio', 'AutoML'],
    'Model Registry': ['ML Model Registry', 'Model Management', 'Model Store'],
    'Code Studio': ['Notebook', 'Code Editor', 'Development Environment'],
    'Jupyter': ['JupyterLab', 'Jupyter Notebook', 'Interactive Notebook'],

    // Geo & Maps
    'Geo Maps': ['Maps', 'Geographic Visualization', 'Location Analytics', 'Mapping'],
    'Map Layering': ['Map Layers', 'Overlay Maps', 'Multi-layer Maps'],
    'Route Map': ['Routing', 'Path Visualization', 'Route Planning'],

    // Sharing & Collaboration
    'Share to Slack': ['Slack Integration', 'Slack Sharing', 'Team Collaboration'],
    'Share to Cliq': ['Cliq Integration', 'Zoho Cliq', 'Internal Chat Sharing'],
    'Share to Teams': ['Microsoft Teams', 'Teams Integration'],

    // Client Framework
    'Export to PPT': ['PowerPoint Export', 'Presentation Export', 'PPT Generation'],
    'Image Library': ['Asset Library', 'Image Gallery', 'Media Library'],
    'Infographics': ['Data Visualization', 'Visual Storytelling', 'Graphic Reports'],

    // Security & Access
    'Access Restriction': ['Permissions', 'Access Control', 'Security Settings', 'User Access'],
    'IP Restriction': ['IP Allowlist', 'IP Whitelist', 'Network Security'],
    'SSL Certificate': ['TLS', 'Security Certificate', 'HTTPS'],

    // General Terms
    'Workspace': ['Project', 'Dashboard Space', 'Analytics Workspace'],
    'View': ['Report', 'Dashboard', 'Visualization', 'Analytics View'],
    'Table': ['Dataset', 'Data Table', 'Database Table'],
};

/**
 * Query expansion using aliases
 * Expands a query by adding known aliases for Zoho Analytics features
 */
export function expandQueryWithAliases(query: string): string {
    const lowercaseQuery = query.toLowerCase();
    const expansions: string[] = [query];

    // Find matching aliases
    for (const [term, aliases] of Object.entries(FEATURE_ALIASES)) {
        if (lowercaseQuery.includes(term.toLowerCase())) {
            expansions.push(...aliases);
        }

        // Check if query matches any alias
        for (const alias of aliases) {
            if (lowercaseQuery.includes(alias.toLowerCase())) {
                expansions.push(term);
                expansions.push(...aliases.filter(a => a !== alias));
                break;
            }
        }
    }

    // Remove duplicates and join
    const uniqueExpansions = [...new Set(expansions)];
    return uniqueExpansions.join(' ');
}
