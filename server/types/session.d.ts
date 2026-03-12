import 'cookie-session';

declare module 'cookie-session' {
    interface CookieSessionObject {
        zoho?: {
            accessToken: string;
            refreshToken: string;
            user: {
                name: string;
                email: string;
                accountId: string;
            };
        };
    }
}

// Also extend Express Request so req.session.zoho is typed everywhere
declare global {
    namespace Express {
        interface Request {
            session: CookieSessionInterfaces.CookieSessionObject & {
                zoho?: {
                    accessToken: string;
                    refreshToken: string;
                    user: {
                        name: string;
                        email: string;
                        accountId: string;
                    };
                };
            };
        }
    }
}
