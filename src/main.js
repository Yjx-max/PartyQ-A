import './assets/main.css'

import App from './App.vue'
import { createApp } from 'vue'

import router from './router'
import axios from 'axios'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import '@varlet/ui/es/style'
import Varlet from '@varlet/ui'

const app = createApp(App)

app.config.globalProperties.axios = axios;

app.use(Varlet)
app.use(ElementPlus)
app.use(router);
app.mount('#app');
