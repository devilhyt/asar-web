import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import i18n from './assets/utils/i18n'

import PrimeVue from 'primevue/config'
import 'primevue/resources/themes/nova-vue/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'

import components from './components/'

const app = createApp(App);
app.config.productionTip = false;

function componentsRegistration(folder){
    for (var obj in folder){
        app.component(obj, folder[obj])
    }
}

componentsRegistration(components)

app.use(PrimeVue)
app.use(i18n)
app.use(router).mount('#app')