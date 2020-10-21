import {GaroonRestAPIClient} from "@miyajan/garoon-rest";
require('dotenv').config();

export interface GaroonScheduleDetail{
    name: string
    date: Date
}

export class GaroxaContloller{
    private readonly client: GaroonRestAPIClient
    constructor() {
        this.client = new GaroonRestAPIClient({
            baseUrl: `https://${process.env.GAROON_DOMAIN}.cybozu.com/g`,
            // Use password authentication
            auth: {
                username: process.env.GAROON_USERNAME,
                password: process.env.GAROON_PASSWORD,
            },
            // Use OAuth token authentication
            // auth: { oAuthToken: process.env.GAROON_OAUTH_TOKEN }

            // Use session authentication if `auth` is omitted (in browser only)
        });
    }

    public async registerSchedule(detail: GaroonScheduleDetail|undefined){
        const result = await this.client.schedule.addEvent({
            eventType: "ALL_DAY",
            start: {
                dateTime: "2020-10-21T00:00:00+09:00",
                timeZone: "Asia/Tokyo"
            },
            end: {
                dateTime: "2020-10-22T23:59:59+09:00",
                timeZone: "Asia/Tokyo"
            },
            attendees: [
                {
                    type: "USER",
                    code: "sato"
                }
            ],
        })
        console.log(result)
        return result
    }
}

(async ()=>{
    const garoxaContloller = new GaroxaContloller()
    await garoxaContloller.registerSchedule(undefined)
})();

