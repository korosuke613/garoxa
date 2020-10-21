import {GaroonRestAPIClient} from "@miyajan/garoon-rest";
require('dotenv').config();

export interface GaroonScheduleDetail{
    name: string
    date: Date
}

export interface GaroonLoginInformation{
    username: string
    password: string
    domain: string
    timezone: string
}

export class GaroxaContloller{
    private readonly client: GaroonRestAPIClient
    private readonly garoonLoginInformation: GaroonLoginInformation

    constructor() {
        this.garoonLoginInformation = {
            username: process.env.GAROON_USERNAME,
            password: process.env.GAROON_PASSWORD,
            domain: process.env.GAROON_DOMAIN,
            timezone: process.env.GAROON_TIMEZONE || 'Asia/Tokyo'
        }

        this.client = new GaroonRestAPIClient({
            baseUrl: `https://${this.garoonLoginInformation.domain}.cybozu.com/g`,
            // Use password authentication
            auth: {
                username: this.garoonLoginInformation.username,
                password: this.garoonLoginInformation.password,
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
                timeZone: this.garoonLoginInformation.timezone
            },
            end: {
                dateTime: "2020-10-22T23:59:59+09:00",
                timeZone: this.garoonLoginInformation.timezone
            },
            attendees: [
                {
                    type: "USER",
                    code: this.garoonLoginInformation.username
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

