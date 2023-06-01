import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from '../router/router.js'
import axios from './axiosInstance.js'
import moment from 'moment'
const app = createApp(App);

app.config.globalProperties.$axios=axios;  //配置axios的全局引用
app.config.globalProperties.$moment=moment;
app.use(router);
app.use(ElementPlus);
// app.use(axios);
app.mount('#app');