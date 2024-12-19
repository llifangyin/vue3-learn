import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import './assets/main.css'

import i18nPlugin from './plulgin/i18n'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
const app = createApp(App)
app.config.performance = true
app.use(i18nPlugin,{
    greetings:{
        hello:'Bonjour'
    }
})
app.use(createPinia())
app.use(ElementPlus)
app.use(router)

app.mount('#app')
