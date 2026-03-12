// Community Response HTML Template (Charanya's style)

export interface CommunityResponseData {
    userName?: string;
    greetingContext?: string;
    mainContent: string;
    additionalInfo?: string;
    closingStatement?: string;
    responderName?: string;
    responderTitle?: string;
    responderImage?: string;
}

export interface CommunityResponseData {
    userName?: string;
    greetingContext?: string;
    mainContent: string;
    additionalInfo?: string;
    closingStatement?: string;
    responderName?: string;
    responderTitle?: string;
    responderImage?: string;
}

export function generateCommunityResponse(data: CommunityResponseData): string {
    const userName = data.userName && data.userName !== 'There' ? data.userName : 'there';
    const mainContent = data.mainContent;
    const responderName = data.responderName || 'Shiva Pranav';
    const responderTitle = data.responderTitle || 'Zoho Cares';
    // Using a generic placeholder for now, or the user can provide a specific ID later
    const responderImage = data.responderImage || 'https://contacts.zoho.com/file?ID=0&fs=thumb';

    return `
<div style="direction: ltr; font-size: 13px; font-family: Arial, Helvetica, sans-serif">
    <div style="padding: 30px 1%; background: rgb(87, 93, 100)">
        <div style="margin: 0px auto; max-width: 750px; width: 100%; background-color: rgb(255, 255, 255)">
            <div style="font-family: 'lucida grande', 'lucida sans', 'lucida sans unicode', arial, helvetica, verdana, sans-serif; font-size: 13px">
                <table style="display: table; width: 100%; max-width: 100%" cellspacing="0" cellpadding="0">
                    <tbody>
                        <tr>
                            <td style="background-color: rgb(200, 37, 56); height: 2px; width: 25%"><br></td>
                            <td style="background-color: rgb(25, 153, 79); height: 2px; width: 25%"><br></td>
                            <td style="background-color: rgb(26, 132, 196); height: 2px; width: 25%"><br></td>
                            <td style="background-color: rgb(252, 207, 56); height: 2px; width: 25%"><br></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div style="padding: 5% 7% 0px">
                <div style="border-width: 0px; border-style: solid; border-color: rgb(243, 243, 243) rgb(243, 243, 243) rgb(255, 255, 255)">
                    <table style="width: 100%; max-width: 100%" cellspacing="0">
                        <tbody>
                            <tr>
                                <td style="text-align: left">
                                    <div style="margin-left: 0px"><img src="https://www.zoho.com/sites/zweb/images/commonroot/zoho-logo-web.svg" style="width: 100px; max-width: 100%" alt="ZOHO"></div>
                                </td>
                                <td style="width: 200px">
                                    <div>
                                        <table style="display: inline-table; width: 100%; max-width: 100%">
                                            <tbody>
                                                <tr>
                                                    <td style="padding-right: 10px">
                                                        <div style="color: rgb(146, 146, 146); font-family: verdana, sans-serif; font-size: 13px">Answered by</div>
                                                        <div style="color: rgb(51, 51, 51); padding-top: 7px; font-family: verdana, sans-serif; font-size: 13px">${responderName}</div>
                                                    </td>
                                                    <td><img src="${responderImage}" style="width: 47px; height: auto; max-width: 100%" alt="Responder Image"></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div style="font-family: verdana, sans-serif; font-size: 13px; padding: 20px 5px; color: #333; line-height: 1.5;">
                    <div>Hello ${userName},</div>
                    <div style="margin-top: 15px">
                        ${mainContent}
                    </div>
                    <div style="margin-top: 25px">
                        <div style="color: rgb(93, 93, 93)">Regards,</div>
                        <div style="color: rgb(93, 93, 93); font-weight: bold; margin-top: 5px">${responderName}</div>
                        <div style="color: rgb(93, 93, 93)">${responderTitle}</div>
                    </div>
                </div>
            </div>
            
            <div style="font-family: verdana, sans-serif; font-size: 12px; color: rgb(0, 0, 0); background: rgb(255, 255, 255); padding: 30px 5px">
                <table style="width: 100%; max-width: 100%" cellspacing="5">
                    <tbody>
                        <tr>
                            <td style="width: 33%">
                                <div style="border-radius: 33px; background-color: rgb(253, 244, 231); padding: 30px 0; text-align: center">
                                    <div style="margin: 0 auto; width: 40px; padding-bottom: 15px"><a href="https://www.zoho.com/analytics/webinars.html"><img width="40" alt="" src="https://www.zohowebstatic.com/sites/zweb/images/analytics/newsletter/weekly-webinar-icon.jpg" style="max-width: 100%"></a></div>
                                    <div style="line-height: 18px">Register for</div>
                                    <div style="line-height: 18px">Weekly <b><a style="color: rgb(0, 0, 0); text-decoration: none" href="https://www.zoho.com/analytics/webinars.html">Webinars</a></b></div>
                                </div>
                            </td>
                            <td style="width: 33%">
                                <div style="border-radius: 33px; background-color: rgb(238, 246, 249); padding: 30px 0; text-align: center">
                                    <div style="margin: 0 auto; width: 40px; padding-bottom: 15px"><a href="https://www.zoho.com/analytics/whats-new/release-notes.html"><img width="40" alt="" src="https://www.zohowebstatic.com/sites/zweb/images/analytics/newsletter/whats-new-icon.jpg" style="max-width: 100%"></a></div>
                                    <div style="line-height: 18px"><b><a style="color: rgb(0, 0, 0); text-decoration: none" href="https://www.zoho.com/analytics/whats-new/release-notes.html">What’s New</a></b> in</div>
                                    <div style="line-height: 18px">Zoho Analytics</div>
                                </div>
                            </td>
                            <td style="width: 33%">
                                <div style="border-radius: 33px; background-color: rgb(253, 242, 239); padding: 30px 0; text-align: center">
                                    <div style="margin: 0 auto; width: 30px; padding-bottom: 15px"><a href="https://www.zoho.com/analytics/analyst-speak.html"><img width="30" alt="" src="https://www.zohowebstatic.com/sites/zweb/images/analytics/newsletter/analytics-speaks-icon.jpg" style="max-width: 100%"></a></div>
                                    <div style="line-height: 18px"><b><a style="color: rgb(0, 0, 0); text-decoration: none" href="https://www.zoho.com/analytics/analyst-speak.html">Analysts Speak</a></b></div>
                                    <div style="line-height: 18px">On Zoho Analytics</div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <div style="font-family: verdana, sans-serif; font-size: 13px; padding: 12px 2%; background: rgb(216, 90, 99); color: white; border-bottom-left-radius: 4px; border-bottom-right-radius: 4px;">
                <table style="width: 100%; max-width: 100%" cellspacing="0" cellpadding="0">
                    <tbody>
                        <tr>
                            <td style="text-align: left">
                                <a href="https://www.linkedin.com/showcase/zohoanalytics/" style="margin-right: 8px text-decoration: none;"><img width="18" height="18" src="https://www.zoho.com/reports/images/linkedin.png" alt="linkedIn" style="vertical-align: middle"></a>
                                <a href="https://twitter.com/ZohoAnalytics" style="margin-right: 8px; text-decoration: none;"><img width="18" height="18" src="https://www.zoho.com/reports/images/twitter.png" alt="twitter" style="vertical-align: middle"></a>
                                <a href="https://www.youtube.com/@ZohoAnalytics" style="text-decoration: none;"><img width="18" height="18" src="https://www.zohowebstatic.com/sites/zweb/images/analytics/youtube.png" alt="youtube" style="vertical-align: middle"></a>
                            </td>
                            <td style="text-align: center"><a style="text-decoration: none; color: rgb(255, 255, 255); font-weight: 600" href="https://www.zoho.com/analytics/">www.zoho.com/analytics</a></td>
                            <td style="text-align: right">
                                <a style="color: rgb(255, 255, 255); text-decoration: none; padding: 0 8px; border-right: 1px solid rgba(255,255,255,0.3)" href="https://www.zoho.com/blog/analytics">Blogs</a>
                                <a style="color: rgb(255, 255, 255); text-decoration: none; padding: 0 8px; border-right: 1px solid rgba(255,255,255,0.3)" href="https://help.zoho.com/portal/en/community/zoho-analytics/">Forums</a>
                                <a style="color: rgb(255, 255, 255); text-decoration: none; padding: 0 8px" href="https://reports.wiki.zoho.com/">Help</a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
`.trim();
}



// Helper to extract plain text from HTML response
export function htmlToPlainText(html: string): string {
    return html
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/\n\s*\n/g, '\n\n') // Normalize line breaks
        .trim();
}
