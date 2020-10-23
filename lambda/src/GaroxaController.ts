import {GaroonRestAPIClient} from "@miyajan/garoon-rest";
import dayjs = require("dayjs");
require('dayjs/locale/ja')
require('dotenv').config();

export interface GaroonScheduleDetail{
    name?: string
    date: string
    time?: {
        start: string
        end: string
    }
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
    public detail: GaroonScheduleDetail

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

    public getRegisterAllDayScheduleParams(detail: GaroonScheduleDetail){
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

    public async registerAllDaySchedule(detail: GaroonScheduleDetail){
        const params = this.getRegisterAllDayScheduleParams(detail)
        const result = await this.client.schedule.addEvent(params as any)
        console.log(result)
        return result
    }

    public getRegisterRegularScheduleParams(detail: GaroonScheduleDetail){
        console.log(detail)
        const startTimeString = `${detail.date} ${detail.time.start}`
        const startTime = dayjs(startTimeString, {locale: "ja"}).format("YYYY-MM-DDTHH:mm:00.000")
        const endTimeString = `${detail.date} ${detail.time.end}`
        const endTime = dayjs(endTimeString, {locale:"ja"}).format("YYYY-MM-DDTHH:mm:00.000")

        const params = {
            subject: detail.name,
            eventType: "REGULAR",
            start: {
                dateTime: startTime,
                timeZone: this.garoonLoginInformation.timezone
            },
            end: {
                dateTime: endTime,
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

    public async registerRegularSchedule(detail: GaroonScheduleDetail){
        const params = this.getRegisterRegularScheduleParams(detail)
        const result = await this.client.schedule.addEvent(params as any)
        console.log(result)
        return result
    }

    public getCurrentScheduleParams(detail: GaroonScheduleDetail){
        console.log(detail)
        const startTimeString = `${detail.date} ${detail.time.start}`
        const startTime = dayjs(startTimeString, {locale: "ja"}).format("YYYY-MM-DDTHH:mm:00.000+09:00")
        const endTimeString = `${detail.date} ${detail.time.end}`
        const endTime = dayjs(endTimeString, {locale:"ja"}).format("YYYY-MM-DDTHH:mm:00.000+09:00")

        const params = {
            limit: 10,
            rangeStart: startTime,
            rangeEnd: endTime
        }
        console.log(params)
        return params
    }

    public async getCurrentRegularScheduleRowData(detail: GaroonScheduleDetail){
        const params = this.getCurrentScheduleParams(detail)
        const result = await this.client.schedule.getEvents(params as any)
        const regularSchedules = result.events.filter((event)=>{
            return event.eventType === "REGULAR"
        })

        console.log(JSON.stringify(regularSchedules, null, 2))
        return regularSchedules
    }

    public async getCurrentRegularSchedule(detail: GaroonScheduleDetail){
        const regularSchedules = await this.getCurrentRegularScheduleRowData(detail)
        const regularScheduleDescriptions: {
            startTime: string,
            endTime: string,
            subject: string
        }[] = []

        regularSchedules.forEach((event)=>{
            const startTime = dayjs(event.start.dateTime.slice(0, -6), {locale: "ja"}).format("HH時mm分") // 2020-10-23T12:00:00+09:00 → 2020-10-23T12:00:00
            const endTime = dayjs(event.end.dateTime.slice(0, -6), {locale: "ja"}).format("HH時mm分")
            const subject = event.subject

            regularScheduleDescriptions.push({
                startTime: startTime,
                endTime: endTime,
                subject: subject
            })
        })

        console.log(regularScheduleDescriptions)
        return regularScheduleDescriptions
    }

    public async getCurrentAllDayScheduleRowData(detail: GaroonScheduleDetail){
        const params = this.getCurrentScheduleParams(detail)
        const result = await this.client.schedule.getEvents(params as any)
        const regularSchedules = result.events.filter((event)=>{
            return event.eventType === "ALL_DAY"
        })

        console.log(JSON.stringify(regularSchedules, null, 2))
        return regularSchedules
    }

    public async getCurrentAllDaySchedule(detail: GaroonScheduleDetail){
        const allDaySchedules = await this.getCurrentAllDayScheduleRowData(detail)
        const allDayScheduleDescriptions: {
            subject: string
        }[] = []

        allDaySchedules.forEach((event)=>{
            const subject = event.subject

            allDayScheduleDescriptions.push({
                subject: subject
            })
        })

        console.log(allDayScheduleDescriptions)
        return allDayScheduleDescriptions
    }
}

// (async ()=>{
//     const garoxaController = new GaroxaController()
//     await garoxaController.getCurrentRegularSchedule({
//         date: "2020-10-24",
//         time: {
//             start: "12:00",
//             end: "18:00"
//         }
//     })
// })();
//
// const startDate = dayjs("2020-10-22 22:00").locale("ja")
// console.log(startDate)
// console.log(startDate.set("hour", 10))

