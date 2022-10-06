import { createApp } from 'vue'
import 'element-plus/dist/index.css'
import '@smallwei/avue/lib/index.css';
import animate from 'animate.css'
import 'styles/common.scss';
import website from '@/config/website.js'
import axios from '@/router/axios.js';
import router from '@/router/index.js';
import store from '@/store/index.js';
import i18n from '@/lang/index.js';
import { getScreen, downBlobFile } from '@/util/index.js'
import { baseUrl } from "@/config/env.js";
import dict from '@/util/dict.js'
import '@/permission.js';
import error from '@/error.js';
import ElementPlus from 'element-plus'
import Avue from '@smallwei/avue';
import AvueFormDesign from 'avue-form-design';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import basicBlock from 'components/BasicBlock/main.vue'
import basicContainer from 'components/BasicContainer/main.vue'
import DictTag from '@/components/DictTag/index.vue'
import App from './App.vue'
window.axios = axios;
const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
//注册全局容器
app.component('basicContainer', basicContainer)
app.component('basicBlock', basicBlock)
app.component('DictTag', DictTag)

app.config.globalProperties.website = website
app.config.globalProperties.baseUrl = baseUrl
app.config.globalProperties.getScreen = getScreen
app.config.globalProperties.downBlobFile = downBlobFile
dict(app);
app.use(error);
app.use(i18n)
app.use(animate)
app.use(store)
app.use(router)
app.use(ElementPlus)
app.use(Avue, {
  axios,
  tableSize: 'small'
})
app.use(AvueFormDesign)
app.mount('#app')
