// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.
import * as Alexa from 'ask-sdk-core';
import {IntentRequest, interfaces} from "ask-sdk-model";
import {GaroxaController} from "./GaroxaController";
import ListItem = interfaces.display.ListItem;

const garoxaController = new GaroxaController()

const LaunchRequestHandler: Alexa.RequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'ガルーン予定管理Alexaスキル。通称Garoxaへようこそ。予定を教えてください';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
const HelloWorldIntentHandler: Alexa.RequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'HelloWorldIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Hello World!';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

// const RegisterScheduleIntentHandler: Alexa.RequestHandler = {
//     canHandle(handlerInput) {
//         return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
//             && Alexa.getIntentName(handlerInput.requestEnvelope) === 'RegisterScheduleIntent'
//             //&& Alexa.getDialogState(handlerInput.requestEnvelope) === 'COMPLETED';
//     },
//     handle(handlerInput) {
//         const speakOutput = '予定を登録します';
//         const repromptOutput = '予定の名前を言ってください';
//         return handlerInput.responseBuilder
//             .speak(speakOutput)
//             .reprompt(repromptOutput)
//             .getResponse();
//     }
// };

const RegisterScheduleIntent: Alexa.RequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'RegisterScheduleIntent'
    },
    async handle(handlerInput) {
        const dialogState = Alexa.getDialogState(handlerInput.requestEnvelope)

        if (dialogState !== 'COMPLETED') {
            // ダイアログモデルのスロット質問中の場合
            return handlerInput.responseBuilder
                .addDelegateDirective()
                .getResponse();
        } else {
            if(Alexa.getSlot(handlerInput.requestEnvelope, "ScheduleType").resolutions.resolutionsPerAuthority[0].values[0].value.id === "ALL_DAY"){
                // 予約確認Alexa応答に対して「はい」発話時
                return handlerInput.responseBuilder
                    .speak("期間予定を登録します。予定の詳細を教えてください")
                    .addDelegateDirective({
                        name: "RegisterAllDayScheduleIntent",
                        confirmationStatus: "NONE"
                    })
                    .getResponse();
            }
            // 予約確認Alexa応答に対して「はい」発話時
            return handlerInput.responseBuilder
                .speak("通常予定を登録します。予定の詳細を教えてください")
                .addDelegateDirective({
                    name: "RegisterRegularScheduleIntent",
                    confirmationStatus: "NONE"
                })
                .getResponse();
        }
    }
};

/**
 * OrderIntentHandlerHandler
 * ユーザ発話：「＜渋谷＞／予約したい／ホテルを探して」
 */
const RegisterAllDayScheduleIntent: Alexa.RequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'RegisterAllDayScheduleIntent'
    },
    async handle(handlerInput) {
        const dialogState = Alexa.getDialogState(handlerInput.requestEnvelope)
        const confirmationStatus = (handlerInput.requestEnvelope.request as IntentRequest).intent.confirmationStatus
        console.log(handlerInput)

        if (dialogState !== 'COMPLETED') {
            // ダイアログモデルのスロット質問中の場合
            return handlerInput.responseBuilder
                .addDelegateDirective()
                .getResponse();
        } else {
            // ダイアログモデルのスロットが全て埋まった場合
            if (confirmationStatus !== 'CONFIRMED') {
                // 予約確認Alexa応答に対して「いいえ」発話時
                // 予定登録キャンセル
                return handlerInput.responseBuilder
                    .speak('予定の登録をキャンセルします')
                    .withShouldEndSession(true)
                    .getResponse();
            }

            const garoxaContloller = new GaroxaController()
            await garoxaContloller.registerAllDaySchedule({
                name: Alexa.getSlotValue(handlerInput.requestEnvelope, "Name"),
                date: Alexa.getSlotValue(handlerInput.requestEnvelope, "CheckInDate")
            })

            // 予約確認Alexa応答に対して「はい」発話時
            return handlerInput.responseBuilder
                .speak('予定を登録しました')
                .withShouldEndSession(true)
                .getResponse();
        }
    }
};

/**
 * OrderIntentHandlerHandler
 * ユーザ発話：「＜渋谷＞／予約したい／ホテルを探して」
 */
const RegisterRegularScheduleIntent: Alexa.RequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'RegisterRegularScheduleIntent'
    },
    async handle(handlerInput) {
        const dialogState = Alexa.getDialogState(handlerInput.requestEnvelope)
        const confirmationStatus = (handlerInput.requestEnvelope.request as IntentRequest).intent.confirmationStatus
        console.log(handlerInput)

        if (dialogState !== 'COMPLETED') {
            // ダイアログモデルのスロット質問中の場合
            return handlerInput.responseBuilder
                .addDelegateDirective()
                .getResponse();
        } else {
            // ダイアログモデルのスロットが全て埋まった場合
            if (confirmationStatus !== 'CONFIRMED') {
                // 予約確認Alexa応答に対して「いいえ」発話時
                // 予定登録キャンセル
                return handlerInput.responseBuilder
                    .speak('予定の登録をキャンセルします')
                    .withShouldEndSession(true)
                    .getResponse();
            }
            const detail = {
                name: Alexa.getSlotValue(handlerInput.requestEnvelope, "Name"),
                date: Alexa.getSlotValue(handlerInput.requestEnvelope, "CheckInDate"),
                time: {
                    start: Alexa.getSlotValue(handlerInput.requestEnvelope, "TimeStart"),
                    end: Alexa.getSlotValue(handlerInput.requestEnvelope, "TimeEnd")
                }
            }

            const currentRegularSchedules = await garoxaController.getCurrentRegularSchedule(detail)
            if(currentRegularSchedules.length > 0){
                const speakFirst = `かぶっている予定が${currentRegularSchedules.length}件あります。`
                let speakSchedules = ""
                currentRegularSchedules.forEach((value)=>{
                    const speakSchedule = `${value.startTime}から${value.endTime}まで${value.subject}があります。\n`
                    speakSchedules += speakSchedule
                })

                garoxaController.detail = detail

                return handlerInput.responseBuilder
                    .speak(speakFirst + speakSchedules + "予定を登録しても大丈夫ですか？")
                    .addConfirmIntentDirective({
                        name: "ConfirmRegisterRegularScheduleIntent",
                        confirmationStatus: "NONE"
                    })
                    .getResponse();
            }

            await garoxaController.registerRegularSchedule(detail)

            // 予約確認Alexa応答に対して「はい」発話時
            return handlerInput.responseBuilder
                .speak('予定を登録しました')
                .withShouldEndSession(true)
                .getResponse();
        }
    }
};

const ConfirmRegisterRegularScheduleIntent: Alexa.RequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ConfirmRegisterRegularScheduleIntent'
    },
    async handle(handlerInput) {
        const confirmationStatus = (handlerInput.requestEnvelope.request as IntentRequest).intent.confirmationStatus
        if (confirmationStatus === 'CONFIRMED') {

            const speakOutput = '予定を登録しました';

            await garoxaController.registerRegularSchedule(garoxaController.detail)

            return handlerInput.responseBuilder
                .speak(speakOutput)
                .withShouldEndSession(true)
                .getResponse();
        }

        return handlerInput.responseBuilder
            .speak('予定の登録をキャンセルします')
            .withShouldEndSession(true)
            .getResponse();
    }
};

const CheckScheduleIntent: Alexa.RequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'CheckScheduleIntent'
    },
    async handle(handlerInput) {
        const dialogState = Alexa.getDialogState(handlerInput.requestEnvelope)
        const date = Alexa.getSlotValue(handlerInput.requestEnvelope, "Date")

        const detail = {
            date: date,
            time: {
                start: "00:00",
                end: "23:59"
            }
        }

        if (dialogState !== 'COMPLETED') {
            // ダイアログモデルのスロット質問中の場合
            return handlerInput.responseBuilder
                .addDelegateDirective()
                .getResponse();
        } else {
            const currentRegularSchedules = await garoxaController.getCurrentRegularSchedule(detail)
            const currentAllDaySchedules = await garoxaController.getCurrentAllDaySchedule(detail)
            const speakFirst = `${date}は、通常予定が${currentRegularSchedules.length}件、期間予定が${currentAllDaySchedules.length}件あります。`

            let speakRegularSchedules: string = ""
            let speakAllDaySchedules: string = ""

            currentRegularSchedules.forEach((value)=>{
                const speakSchedule = `${value.startTime}から${value.endTime}まで${value.subject}があります。\n`
                speakRegularSchedules += speakSchedule
            })
            currentAllDaySchedules.forEach((value)=>{
                const speakSchedule = `${value.subject}があります。\n`
                speakAllDaySchedules += speakSchedule
            })

            return handlerInput.responseBuilder
                .speak(speakFirst + speakRegularSchedules + speakAllDaySchedules)
                .withShouldEndSession(true)
                .getResponse();
        }
    }
}

const HelpIntentHandler: Alexa.RequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
const CancelAndStopIntentHandler: Alexa.RequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
const SessionEndedRequestHandler: Alexa.RequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler: Alexa.RequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler: Alexa.ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.stack}`);
        const speakOutput = `Sorry, I had trouble doing what you asked. Please try again.`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

// The SkillBuilder acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
export const handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        HelloWorldIntentHandler,
        RegisterScheduleIntent,
        RegisterAllDayScheduleIntent,
        RegisterRegularScheduleIntent,
        ConfirmRegisterRegularScheduleIntent,
        CheckScheduleIntent,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler, // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
        ) 
    .addErrorHandlers(
        ErrorHandler,
        )
    .lambda();
