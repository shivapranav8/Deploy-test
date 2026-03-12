import { CommunityResponseData } from './communityResponseTemplate.js';

/**
 * Generate HTML email response matching the full Zoho community template
 * (Includes footer widgets and social media links)
 */
export function generateSimplifiedEmailResponse(data: CommunityResponseData & {
    similarResponses?: Array<{ url: string; title: string; similarity: number }>;
}): string {
    const { userName, mainContent, closingStatement, responderName = 'Shiva Pranav S' } = data;

    // Similar responses are NOT included in the HTML - they're only shown in the UI

    return `
<div style="font-family: Arial, Helvetica, sans-serif; max-width: 750px; margin: 0 auto; background-color: #fff;">
    <!-- Colored header bars -->
    <table style="width: 100%; border-collapse: collapse;" cellspacing="0" cellpadding="0">
        <tr>
            <td style="background-color: #c82538; height: 3px; width: 25%;"></td>
            <td style="background-color: #19994f; height: 3px; width: 25%;"></td>
            <td style="background-color: #1a84c4; height: 3px; width: 25%;"></td>
            <td style="background-color: #fccf38; height: 3px; width: 25%;"></td>
        </tr>
    </table>

    <!-- Header with logo and responder info -->
    <div style="padding: 30px 40px 20px;">
        <table style="width: 100%;" cellspacing="0" cellpadding="0">
            <tr>
                <td style="text-align: left; vertical-align: middle;">
                    <img src="https://www.zoho.com/sites/zweb/images/commonroot/zoho-logo-web.svg" 
                         alt="ZOHO" style="width: 100px; height: auto;">
                </td>
                <td style="text-align: right; vertical-align: middle;">
                    <div style="display: inline-block; text-align: right;">
                        <div style="color: #929292; font-size: 12px; margin-bottom: 5px;">Answered by</div>
                        <div style="color: #333; font-size: 14px; font-weight: 500;">${responderName}</div>
                    </div>
                </td>
            </tr>
        </table>
    </div>

    <!-- Main content -->
    <div style="padding: 0 40px 40px; font-family: verdana, sans-serif; font-size: 13px; color: #333; line-height: 1.6;">
        <div style="margin-bottom: 15px;">Hello ${userName},</div>
        
        <div style="margin-bottom: 15px; white-space: pre-wrap;">${mainContent}</div>
        
        ${closingStatement ? `<div style="margin-bottom: 20px;">${closingStatement}</div>` : ''}
        
        <div style="margin-top: 30px;">
            <div style="color: #5d5d5d; margin-bottom: 5px;">Regards,</div>
            <div style="color: #5d5d5d; font-weight: 500;">${responderName}</div>
            <div style="color: #5d5d5d;">Zoho Cares</div>
        </div>
    </div>

    <!-- Footer widgets -->
    <div style="font-family: 'lucida grande', 'lucida sans', 'lucida sans unicode', arial, helvetica, verdana, sans-serif; font-size: 12px; color: #000; background: #fff; padding: 30px 5px;">
        <table style="width: 100%; max-width: 100%;">
            <tbody>
                <tr>
                    <td>
                        <div style="border-radius: 33px; background-color: #fdf4e7; padding: 30px 0;">
                            <div style="margin: 0 auto; width: 40px; padding-bottom: 15px;">
                                <a rel="noreferrer noopener" target="_blank" href="https://www.zoho.com/analytics/webinars.html">
                                    <img width="40" alt="" src="https://www.zohowebstatic.com/sites/zweb/images/analytics/newsletter/weekly-webinar-icon.jpg" style="max-width: 100%;">
                                </a>
                            </div>
                            <div style="text-align: center; font-family: verdana, sans-serif; font-size: 13px; color: #000; line-height: 18px;">Register for</div>
                            <div style="text-align: center; font-family: verdana, sans-serif; font-size: 13px; color: #000; line-height: 18px;">
                                Weekly <b><a rel="noreferrer noopener" target="_blank" style="color: #000; text-decoration: none;" href="https://www.zoho.com/analytics/webinars.html">Webinars</a></b>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div style="border-radius: 33px; background-color: #eef6f9; padding: 30px 0;">
                            <div style="margin: 0 auto; width: 40px; padding-bottom: 15px;">
                                <a rel="noreferrer noopener" target="_blank" href="https://www.zoho.com/analytics/whats-new/release-notes.html">
                                    <img width="40" alt="" src="https://www.zohowebstatic.com/sites/zweb/images/analytics/newsletter/whats-new-icon.jpg" style="max-width: 100%;">
                                </a>
                            </div>
                            <div style="text-align: center; font-family: verdana, sans-serif; font-size: 13px; color: #000; line-height: 18px;">
                                <b><a rel="noreferrer noopener" target="_blank" style="color: #000; text-decoration: none;" href="https://www.zoho.com/analytics/whats-new/release-notes.html">What's New</a></b> in
                            </div>
                            <div style="text-align: center; font-family: verdana, sans-serif; font-size: 13px; color: #000; line-height: 18px;">Zoho Analytics</div>
                        </div>
                    </td>
                    <td>
                        <div style="border-radius: 33px; background-color: #fdf2ef; padding: 30px 0;">
                            <div style="margin: 0 auto; width: 30px; padding-bottom: 15px;">
                                <a rel="noreferrer noopener" target="_blank" href="https://www.zoho.com/analytics/analyst-speak.html">
                                    <img width="30" alt="" src="https://www.zohowebstatic.com/sites/zweb/images/analytics/newsletter/analytics-speaks-icon.jpg" style="max-width: 100%;">
                                </a>
                            </div>
                            <div style="text-align: center; font-family: verdana, sans-serif; font-size: 13px; color: #000; line-height: 18px;">
                                <b><a rel="noreferrer noopener" target="_blank" style="color: #000; text-decoration: none;" href="https://www.zoho.com/analytics/analyst-speak.html">Analysts Speaks</a></b>
                            </div>
                            <div style="text-align: center; font-family: verdana, sans-serif; font-size: 13px; color: #000; line-height: 18px;">On Zoho Analytics</div>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- Footer with social links -->
    <div style="font-family: 'lucida grande', 'lucida sans', 'lucida sans unicode', arial, helvetica, verdana, sans-serif; font-size: 13px; padding: 1% 2%; clear: both; background: #d85a63; margin: auto;">
        <table style="width: 100%; max-width: 100%;" cellspacing="0" cellpadding="0">
            <tbody>
                <tr>
                    <td style="text-align: left;">
                        <a rel="noreferrer noopener" style="vertical-align: middle; display: inline-table; cursor: pointer;" href="https://www.linkedin.com/showcase/zohoanalytics/" target="_blank">
                            <img width="20" height="20" src="https://www.zoho.com/reports/images/linkedin.png" style="max-width: 100%;" alt="linkedIn">
                        </a>
                        <a rel="noreferrer noopener" style="vertical-align: middle; display: inline-table; cursor: pointer;" href="https://twitter.com/ZohoAnalytics" target="_blank">
                            <img width="20" height="20" src="https://www.zoho.com/reports/images/twitter.png" style="max-width: 100%;" alt="twitter">
                        </a>
                        <a rel="noreferrer noopener" style="margin-right: 8px; vertical-align: middle; display: inline-table; cursor: pointer;" href="https://www.youtube.com/@ZohoAnalytics" target="_blank">
                            <img width="20" height="20" src="https://www.zohowebstatic.com/sites/zweb/images/analytics/youtube.png" style="height: 20px; width: 20px; max-width: 100%;" alt="youtube">
                        </a>
                    </td>
                    <td style="text-align: center; position: relative; left: 40px;">
                        <a rel="noreferrer noopener" style="vertical-align: middle; display: inline-table; cursor: pointer; text-decoration: none; color: #fff; font-weight: 600;" href="https://www.zoho.com/analytics/" target="_blank">
                            www.zoho.com/analytics
                        </a>
                    </td>
                    <td style="text-align: right;">
                        <a rel="noreferrer noopener" target="_blank" style="font-size: 12px; color: #fff; text-decoration: none; cursor: pointer; border-right: 1px solid #fff; padding: 0 5px;" href="https://www.zoho.com/blog/analytics">Blogs</a>
                        <a rel="noreferrer noopener" style="font-size: 12px; color: #fff; text-decoration: none; cursor: pointer; border-right: 1px solid #fff; padding: 0 5px;" href="https://help.zoho.com/portal/en/community/zoho-analytics/" target="_blank">Forums</a>
                        <a rel="noreferrer noopener" style="font-size: 12px; color: #fff; text-decoration: none; cursor: pointer; padding: 0 5px;" href="https://reports.wiki.zoho.com/" target="_blank">Help</a>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</div>
`.trim();
}
