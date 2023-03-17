import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import './assets/main.css'

import i18nPlugin from './plulgin/i18n'

const app = createApp(App)
app.use(i18nPlugin,{
    greetings:{
        hello:'Bonjour'
    }
})
app.use(createPinia())
app.use(router)

app.mount('#app')
