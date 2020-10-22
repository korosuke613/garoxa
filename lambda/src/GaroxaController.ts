import {GaroonRestAPIClient} from "@miyajan/garoon-rest";
import dayjs = require("dayjs");
require('dotenv').config();

export interface GaroonScheduleDetail{
    name: string
    date: string
}

export interface GaroonLoginInformation{
    username: string
    password: string
    domain: string
    timezone: string
}

export class GaroxaController{
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

    public getRegisterScheduleParams(detail: GaroonScheduleDetail){
        const startDate = dayjs(detail.date).toISOString()
        const params = {
            subject: detail.name,
            eventType: "ALL_DAY",
            start: {
                dateTime: startDate,
                timeZone: this.garoonLoginInformation.timezone
            },
            end: {
                dateTime: startDate,
                timeZone: this.garoonLoginInformation.timezone
            },
            attendees: [
                {
                    type: "USER",
                    code: this.garoonLoginInformation.username
                }
            ],
        }
        console.log(params)
        return params
    }

    public async registerSchedule(detail: GaroonScheduleDetail){
        const params = this.getRegisterScheduleParams(detail)
        const result = await this.client.schedule.addEvent(params as any)
        console.log(result)
        return result
    }
}

// (async ()=>{
//     const garoxaController = new GaroxaController()
//     await garoxaController.registerSchedule({
//         name: "test2",
//         date: "2020-10-22"
//     })
// })();

