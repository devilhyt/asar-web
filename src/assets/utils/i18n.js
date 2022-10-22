import { createI18n } from 'vue-i18n'
import en_US from '../../locales/en_US.json'
import zh_TW from '../../locales/zh_TW.json'
    
if(localStorage.getItem("locale") === null){
    localStorage.setItem("locale", "en_US")
}

const i18n = createI18n({
    legacy: false,
    locale: window.localStorage.getItem("locale"),
    fallbackLocale: 'en_US',
    messages: {
        en_US,
        zh_TW
    }
})

export default i18n