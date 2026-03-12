import { CommunityResponseData } from './communityResponseTemplate.js';

/**
 * Generate HTML response matching the EXACT Zoho Community native format
 * with all the nested divs, sign holders, and span wrappers
 */
export function generateZohoNativeResponse(data: CommunityResponseData & {
    similarResponses?: Array<{ url: string; title: string; similarity: number }>;
}): string {
    const { userName, mainContent, closingStatement, responderName = 'Shiva Pranav S' } = data;

    return `<div style="direction: ltr; font-size: 13px; font-family: Arial, Helvetica, sans-serif;">
    <div style="direction: ltr;">
        <div style="font-family: Arial, Helvetica, sans-serif; font-size: 13px;"><br></div>
        <div style="font-family: Arial, Helvetica, sans-serif; font-size: 13px;"><br></div>
        <div title="sign_holder::start" style="font-family: Arial, Helvetica, sans-serif; font-size: 13px;"></div>
        <div style="">
            <div style="">
                <div style="">
                    <div style="direction: ltr;">
                        <div style="direction: ltr;">
                            <div style="font-family: Arial, Helvetica, sans-serif; font-size: 13px;"><br></div>
                            <div style="font-family: Arial, Helvetica, sans-serif; font-size: 13px;"><br></div>
                            <div title="sign_holder::start" style="font-family: Arial, Helvetica, sans-serif; font-size: 13px;"></div>
                            <div style="">
                                <div style="">
                                    <div style="">
                                        <div style="">
                                            <div style="">
                                                <div style="">
                                                    <div style="">
                                                        <div style="">
                                                            <div style="">
                                                                <div style="">
                                                                    <div style="">
                                                                        <div style="">
                                                                            <div style="">
                                                                                <div style="">
                                                                                    <div style="">
                                                                                        <div style="">
                                                                                            <div style="">
                                                                                                <div style="">
                                                                                                    <div style="">
                                                                                                        <div style="">
                                                                                                            <div style="">
                                                                                                                <div style="">
                                                                                                                    <div style="padding: 30px 1%; background: rgb(87, 93, 100);">
                                                                                                                        <div style="margin: 0px auto; max-width: 750px; width: 100%; background-color: rgb(255, 255, 255);">
                                                                                                                            <div style="font-family: &quot;lucida grande&quot;, &quot;lucida sans&quot;, &quot;lucida sans unicode&quot;, arial, helvetica, verdana, sans-serif; font-size: 13px;">
                                                                                                                                <table style="display: table; width: 100%; max-width: 100%" cellspacing="0" cellpadding="0">
                                                                                                                                    <tbody>
                                                                                                                                        <tr>
                                                                                                                                            <td style="background-color: rgb(200, 37, 56); height: 2px; width: 25%"><span style="font-size: 16px" class="size"><br></span><span style="font-family: verdana, sans-serif" class="font"><span style="font-size: 13px" class="size"><br></span></span></td>
                                                                                                                                            <td style="background-color: rgb(25, 153, 79); height: 2px; width: 25%"><span style="font-family: verdana, sans-serif" class="font"><span style="font-size: 13px" class="size"><br></span></span></td>
                                                                                                                                            <td style="background-color: rgb(26, 132, 196); height: 2px; width: 25%"><span style="font-family: verdana, sans-serif" class="font"><span style="font-size: 13px" class="size"><br></span></span></td>
                                                                                                                                            <td style="background-color: rgb(252, 207, 56); height: 2px; width: 25%"><span style="font-family: verdana, sans-serif" class="font"><span style="font-size: 13px" class="size"><br></span></span></td>
                                                                                                                                        </tr>
                                                                                                                                    </tbody>
                                                                                                                                </table>
                                                                                                                            </div>
                                                                                                                            <div style="padding: 5% 7% 0px;">
                                                                                                                                <div style="font-family: Arial, Helvetica, Verdana, sans-serif; font-size: 13px; border-width: 0px; border-style: solid; border-color: rgb(243, 243, 243) rgb(243, 243, 243) rgb(255, 255, 255);">
                                                                                                                                    <table style="width: 100%; max-width: 100%; height: 59px;" cellspacing="0">
                                                                                                                                        <tbody>
                                                                                                                                            <tr>
                                                                                                                                                <td style="text-align: left">
                                                                                                                                                    <div style="margin-left: 0px"><img src="https://www.zoho.com/sites/zweb/images/commonroot/zoho-logo-web.svg" style="width: 100px; max-width: 100%" alt="ZOHO"> <span style="font-family: verdana, sans-serif" class="font"> <span style="font-size: 13px" class="size"> </span> <span style="font-size: 13px" class="size"> <br></span></span></div>
                                                                                                                                                </td>
                                                                                                                                                <td style="width: 200px">
                                                                                                                                                    <div>
                                                                                                                                                        <table style="display: inline-table; width: 100%; max-width: 100%">
                                                                                                                                                            <tbody>
                                                                                                                                                                <tr>
                                                                                                                                                                    <td style="padding-right: 10px; height: 53px;">
                                                                                                                                                                        <div style="color: rgb(146, 146, 146)"><span style="font-family: verdana, sans-serif" class="font"><span style="font-size: 13px" class="size">Answered by </span> <span style="font-size: 13px" class="size"> <br></span></span></div>
                                                                                                                                                                        <div style="color: rgb(51, 51, 51); padding-top: 7px"><span style="font-family: verdana, sans-serif" class="font"><span style="font-size: 13px" class="size">${responderName} </span> <span style="font-size: 13px" class="size"> <br></span></span></div>
                                                                                                                                                                    </td>
                                                                                                                                                                    <td style="height: 53px;"><img src="https://contacts.zoho.com/file?ID=687517402&amp;fs=thumb" style="width: 47px; height: auto; max-width: 100%" alt="Image" data-zdeskdocid="img_45475013303826284" class="x_569183501docsimage" data-zdeskdocselectedclass="original"> <span style="font-family: verdana, sans-serif" class="font"> <span style="font-size: 13px" class="size"> </span> <span style="font-size: 13px" class="size"> <br></span></span></td>
                                                                                                                                                                </tr>
                                                                                                                                                            </tbody>
                                                                                                                                                        </table>
                                                                                                                                                    </div>
                                                                                                                                                </td>
                                                                                                                                            </tr>
                                                                                                                                        </tbody>
                                                                                                                                    </table>
                                                                                                                                </div>
                                                                                                                                <div style="font-family: Arial, Helvetica, Verdana, sans-serif; font-size: 13px;"><span style="font-family: verdana, sans-serif" class="font"><span style="font-size: 13px" class="size"><br></span></span></div>
                                                                                                                                <div style="font-family: Arial, Helvetica, Verdana, sans-serif; font-size: 13px; padding: 3px 5px 0px; color: rgb(51, 51, 51);"><span style="font-family: verdana, sans-serif" class="font"><span style="font-size: 13px" class="size"><br></span></span></div>
                                                                                                                                <div style="padding: 0px 5px;">
                                                                                                                                    <div style=""><br></div>
                                                                                                                                    <div style="font-family: &quot;lucida grande&quot;, &quot;lucida sans&quot;, &quot;lucida sans unicode&quot;, arial, helvetica, verdana, sans-serif; font-size: 13px;"><span style="font-family: verdana, sans-serif" class="font"><span style="font-size: 13px" class="size">Hello ${userName},</span></span></div>
                                                                                                                                    <div style="font-family: &quot;lucida grande&quot;, &quot;lucida sans&quot;, &quot;lucida sans unicode&quot;, arial, helvetica, verdana, sans-serif; font-size: 13px;"><span style="font-size: 13px" class="size"><span style="font-family: verdana, sans-serif" class="font"><br></span></span></div>
                                                                                                                                    <div style="font-family: &quot;lucida grande&quot;, &quot;lucida sans&quot;, &quot;lucida sans unicode&quot;, arial, helvetica, verdana, sans-serif; font-size: 13px;"><span style="font-family: verdana, sans-serif" class="font"><span style="font-size: 13px" class="size">${mainContent}</span></span></div>
                                                                                                                                    <div style="font-family: &quot;lucida grande&quot;, &quot;lucida sans&quot;, &quot;lucida sans unicode&quot;, arial, helvetica, verdana, sans-serif; font-size: 13px;"><span style="font-family: verdana, sans-serif" class="font"><span style="font-size: 13px" class="size"><br></span></span></div>
                                                                                                                                </div>
                                                                                                                                <div style="font-family: &quot;lucida grande&quot;, &quot;lucida sans&quot;, &quot;lucida sans unicode&quot;, arial, helvetica, verdana, sans-serif; font-size: 13px; padding: 0px 5px; color: rgb(51, 51, 51);"></div>
                                                                                                                                <div style="font-family: &quot;lucida grande&quot;, &quot;lucida sans&quot;, &quot;lucida sans unicode&quot;, arial, helvetica, verdana, sans-serif; font-size: 13px; padding: 0px 5px; color: rgb(51, 51, 51);">
                                                                                                                                    <div>
                                                                                                                                        <div><span style="font-size: 13px" class="size"><span style="font-family: verdana, sans-serif" class="font">${closingStatement || 'Hope this helps!'}</span></span></div>
                                                                                                                                        <div><span style="font-family: verdana, sans-serif" class="font"><span style="font-size: 13px" class="size"><br></span></span></div>
                                                                                                                                        <div><span style="font-size: 13px" class="size"><span style="font-family: verdana, sans-serif" class="font"><br></span></span></div>
                                                                                                                                    </div>
                                                                                                                                    <div><span style="font-size: 13px" class="size"><span style="font-family: verdana, sans-serif" class="font"><br></span></span></div>
                                                                                                                                    <table style="width: 100%; max-width: 100%; height: 29px">
                                                                                                                                        <tbody>
                                                                                                                                            <tr>
                                                                                                                                                <td style="height: 25px"><span style="font-size: 13px" class="size"><span style="font-family: verdana, sans-serif" class="font"><br></span></span>
                                                                                                                                                    <div style="float: left"><span style="font-size: 13px" class="size"><span style="font-family: verdana, sans-serif" class="font"><br></span></span>
                                                                                                                                                        <div><span style="color: rgb(93, 93, 93)" class="colour"><span style="font-family: verdana, sans-serif" class="font"><span style="font-size: 13px" class="size">Regards, </span></span></span></div>
                                                                                                                                                        <div><span style="font-family: verdana, sans-serif" class="font"><span style="color: rgb(93, 93, 93)" class="colour"><span style="font-size: 13px" class="size">${responderName}</span></span></span></div>
                                                                                                                                                        <div><span style="color: rgb(93, 93, 93)" class="colour"><span style="font-family: verdana, sans-serif" class="font"><span style="font-size: 13px" class="size">Zoho Cares&nbsp; </span></span></span></div>
                                                                                                                                                    </div>
                                                                                                                                                </td>
                                                                                                                                            </tr>
                                                                                                                                        </tbody>
                                                                                                                                    </table>
                                                                                                                                </div>
                                                                                                                            </div>
                                                                                                                            <div style="font-family: &quot;lucida grande&quot;, &quot;lucida sans&quot;, &quot;lucida sans unicode&quot;, arial, helvetica, verdana, sans-serif; font-size: 12px; color: rgb(0, 0, 0); background: rgb(255, 255, 255); padding: 30px 5px;">
                                                                                                                                <table style="width: 100%; max-width: 100%">
                                                                                                                                    <tbody>
                                                                                                                                        <tr>
                                                                                                                                            <td>
                                                                                                                                                <div style="border-radius: 33px; background-color: rgb(253, 244, 231); padding: 30px 0">
                                                                                                                                                    <div style="margin: 0 auto; width: 40px; padding-bottom: 15px"><a rel="noreferrer noopener" target="_blank" href="https://www.zoho.com/analytics/webinars.html"><img width="40" alt="" src="https://www.zohowebstatic.com/sites/zweb/images/analytics/newsletter/weekly-webinar-icon.jpg" style="max-width: 100%"></a></div>
                                                                                                                                                    <div style="text-align: center; font-family: verdana, sans-serif; font-size: 13px; color: rgb(0, 0, 0); line-height: 18px">Register for</div>
                                                                                                                                                    <div style="text-align: center; font-family: verdana, sans-serif; font-size: 13px; color: rgb(0, 0, 0); line-height: 18px">Weekly <b> <a rel="noreferrer noopener" target="_blank" style="color: rgb(0, 0, 0); text-decoration: none" href="https://www.zoho.com/analytics/webinars.html"> Webinars</a></b></div>
                                                                                                                                                </div>
                                                                                                                                            </td>
                                                                                                                                            <td>
                                                                                                                                                <div style="border-radius: 33px; background-color: rgb(238, 246, 249); padding: 30px 0">
                                                                                                                                                    <div style="margin: 0 auto; width: 40px; padding-bottom: 15px"><a rel="noreferrer noopener" target="_blank" href="https://www.zoho.com/analytics/whats-new/release-notes.html"><img width="40" alt="" src="https://www.zohowebstatic.com/sites/zweb/images/analytics/newsletter/whats-new-icon.jpg" style="max-width: 100%"></a></div>
                                                                                                                                                    <div style="text-align: center; font-family: verdana, sans-serif; font-size: 13px; color: rgb(0, 0, 0); line-height: 18px"><b><a rel="noreferrer noopener" target="_blank" style="color: rgb(0, 0, 0); text-decoration: none" href="https://www.zoho.com/analytics/whats-new/release-notes.html">What's New </a> </b> in</div>
                                                                                                                                                    <div style="text-align: center; font-family: verdana, sans-serif; font-size: 13px; color: rgb(0, 0, 0); line-height: 18px">Zoho Analytics</div>
                                                                                                                                                </div>
                                                                                                                                            </td>
                                                                                                                                            <td>
                                                                                                                                                <div style="border-radius: 33px; background-color: rgb(253, 242, 239); padding: 30px 0">
                                                                                                                                                    <div style="margin: 0 auto; width: 30px; padding-bottom: 15px"><a rel="noreferrer noopener" target="_blank" href="https://www.zoho.com/analytics/analyst-speak.html"><img width="30" alt="" src="https://www.zohowebstatic.com/sites/zweb/images/analytics/newsletter/analytics-speaks-icon.jpg" style="max-width: 100%"></a></div>
                                                                                                                                                    <div style="text-align: center; font-family: verdana, sans-serif; font-size: 13px; color: rgb(0, 0, 0); line-height: 18px"><b><a rel="noreferrer noopener" target="_blank" style="color: rgb(0, 0, 0); text-decoration: none" href="https://www.zoho.com/analytics/analyst-speak.html">Analysts Speaks</a></b></div>
                                                                                                                                                    <div style="text-align: center; font-family: verdana, sans-serif; font-size: 13px; color: rgb(0, 0, 0); line-height: 18px">On Zoho Analytics</div>
                                                                                                                                                </div>
                                                                                                                                            </td>
                                                                                                                                        </tr>
                                                                                                                                    </tbody>
                                                                                                                                </table>
                                                                                                                            </div>
                                                                                                                            <div style="font-family: &quot;lucida grande&quot;, &quot;lucida sans&quot;, &quot;lucida sans unicode&quot;, arial, helvetica, verdana, sans-serif; font-size: 13px; padding: 1% 2%; clear: both; background: rgb(216, 90, 99); margin: auto;">
                                                                                                                                <table style="width: 100%; max-width: 100%" cellspacing="0" cellpadding="0">
                                                                                                                                    <tbody>
                                                                                                                                        <tr>
                                                                                                                                            <td style="text-align: left"><a rel="noreferrer noopener" style="vertical-align: middle; display: inline-table; cursor: pointer" href="https://www.linkedin.com/showcase/zohoanalytics/" target="_blank"><img width="20" height="20" src="https://www.zoho.com/reports/images/linkedin.png" style="max-width: 100%" alt="linkedIn"> </a> <a rel="noreferrer noopener" style="vertical-align: middle; display: inline-table; cursor: pointer" href="https://twitter.com/ZohoAnalytics" target="_blank"> <img width="20" height="20" src="https://www.zoho.com/reports/images/twitter.png" style="max-width: 100%" alt="twitter"> </a> <a rel="noreferrer noopener" style="margin-right: 8px; vertical-align: middle; display: inline-table; cursor: pointer" href="https://www.youtube.com/@ZohoAnalytics" target="_blank"> <img width="20" height="20" src="https://www.zohowebstatic.com/sites/zweb/images/analytics/youtube.png" style="height: 20px; width: 20px; max-width: 100%" alt="youtube"> </a></td>
                                                                                                                                            <td style="text-align: center; position: relative; left: 40px"><a rel="noreferrer noopener" style="vertical-align: middle; display: inline-table; cursor: pointer; text-decoration: none; color: rgb(255, 255, 255); font-weight: 600" href="https://www.zoho.com/analytics/" target="_blank">www.zoho.com/analytics </a></td>
                                                                                                                                            <td style="text-align: right"><a rel="noreferrer noopener" target="_blank" style="font-size: 12px; color: rgb(255, 255, 255); text-decoration: none; cursor: pointer; border-right: 1px solid rgb(255, 255, 255); padding: 0 5px" href="https://www.zoho.com/blog/analytics">Blogs </a> <a rel="noreferrer noopener" style="font-size: 12px; color: rgb(255, 255, 255); text-decoration: none; cursor: pointer; border-right: 1px solid rgb(255, 255, 255); padding: 0 5px" href="https://help.zoho.com/portal/en/community/zoho-analytics/" target="_blank"> Forums </a> <a rel="noreferrer noopener" style="font-size: 12px; color: rgb(255, 255, 255); text-decoration: none; cursor: pointer; padding: 0 5px" href="https://reports.wiki.zoho.com/" target="_blank"> Help </a></td>
                                                                                                                                        </tr>
                                                                                                                                    </tbody>
                                                                                                                                </table>
                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div style="font-family: Arial, Helvetica, Verdana, sans-serif; font-size: 13px;"><span style="font-family: verdana, sans-serif" class="font"><span style="font-size: 13px" class="size"><br></span></span></div>
                                                                                </div>
                                                                                <div style="font-family: Arial, Helvetica, Verdana, sans-serif; font-size: 13px;"><span style="font-family: verdana, sans-serif" class="font"><span style="font-size: 13px" class="size"><br></span></span></div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div style="font-family: Arial, Helvetica, Verdana, sans-serif; font-size: 13px;"><span style="font-family: verdana, sans-serif" class="font"><span style="font-size: 13px" class="size"><br></span></span></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div style="font-family: Arial, Helvetica, Verdana, sans-serif; font-size: 13px;"><br></div>
                                    </div>
                                </div>
                            </div>
                            <div title="sign_holder::end" style="font-family: Arial, Helvetica, sans-serif; font-size: 13px;"></div>
                        </div>
                        <div style="font-family: Arial, Helvetica, sans-serif; font-size: 13px;"><br></div>
                    </div>
                    <div style="font-family: Arial, Helvetica, Verdana, sans-serif; font-size: 13px;"><br></div>
                </div>
                <div style="font-family: Arial, Helvetica, Verdana, sans-serif; font-size: 13px;"><br><br></div>
            </div>
        </div>
        <div title="sign_holder::end" style="font-family: Arial, Helvetica, sans-serif; font-size: 13px;"></div>
    </div>
</div>`;
}
