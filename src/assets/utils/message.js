import { ref } from 'vue';
import i18n from './i18n';

// message = {severity: severity, content: 'Dynamic Message'},
// severity default is "info".
// severity type                
// -"success"
// -"info"
// -"warn"
// -"error"
export function addMessage(message){
    messages.value.push(message)
}


const { t } = i18n.global;

const SEVERITY_MAP = {
    "/api": {
        "auth": {
            "login": {
                "success": "success",
                "loginFailed": "warn",
                "unexpectedError": "error",
                "validationError": "error"
            },
            "logout": {
                "success": "success",
                "unexpectedError": "error"
            }
        },
        "model": {
            "load": {
                "success": "success",
                "projectIsTraining": "warn",
                "stillLoadingPreviousModel": "warn",
                "rasaApiConnectionError": "error",
                "noRasaApiUrlProvided": "error",
                "unexpectedError": "error",
                "validationError": "error"
            },
            "train": {
                "success": "success",
                "stillLoadingPreviousModel": "warn",
                "stillTrainingPreviousModel": "warn",
                "rasaApiConnectionError": "error",
                "noRasaApiUrlProvided": "error",
                "noAsarApiUrlProvided": "error",
                "unexpectedError": "error",
                "validationError": "error"
            }
        },
        "project": {
            "create": {
                "success": "success",
                "duplicateNames": "warn",
                "invalidName": "warn",
                "unexpectedError": "error",
                "validationError": "error"
            },
            "delete": {
                "success": "success",
                "invalidName": "warn",
                "targetDoesNotExist": "warn",
                "unexpectedError": "error",
                "validationError": "error"
            }
        },
        "file": { 
            "create": {
                "success": "success",
                "duplicateNames": "warn",
                "invalidName": "warn",
                "unexpectedError": "error",
                "validationError": "error"
            },
            "delete": {
                "success": "success",
                "invalidName": "warn",
                "targetDoesNotExist": "warn",
                "unexpectedError": "error",
                "validationError": "error"
            },
            "update": {
                "success": "success",
                "invalidName": "warn",
                "targetDoesNotExist": "warn",
                "unexpectedError": "error",
                "validationError": "error"
            }
        }
    }
}

const getSeverityValue = (path) => path.split('.').reduce((r, key) => r[key], SEVERITY_MAP);

export function addBackendMessage(path, response, params){
    messages.value.push({
        severity: getSeverityValue(path + response.msgCode) ?? "info",
        content: t(path + response.msgCode, {...response, ...params})
    })
}

export const messages =  ref([])