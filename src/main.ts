import { createApp } from 'vue';
import pinia from '/@/stores/index';
import App from './App.vue';
import router from './router';
import { directive } from '/@/directive/index';
import { i18n } from '/@/i18n/index';
import other from '/@/utils/other';

import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import elementIcons from '/@//components/svgIcon/svgicon'
import '/@/theme/index.scss';
import VueGridLayout from 'vue-grid-layout';
import { Pagination,RightToolbar, DictTag } from '/@/components/index'



const app = createApp(App);

app.component('DictTag', DictTag)
app.component('Pagination', Pagination)
app.component('RightToolbar', RightToolbar)

directive(app);
other.elSvg(app);
app.use(pinia) // pinia 存储
    .use(router) // 路由
    .use(ElementPlus, { i18n: i18n.global.t }) // ElementPlus 全局引入
    .use(elementIcons) // elementIcons 图标全局引入
    .use(i18n) // 国际化
    .use(VueGridLayout)
    .mount('#app');
