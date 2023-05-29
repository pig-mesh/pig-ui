import { createApp } from 'vue';
import pinia from '/@/stores/index';
import App from './App.vue';
import router from './router';
import { directive } from '/@/directive';
import { i18n } from '/@/i18n';
import other from '/@/utils/other';

import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

import VForm3 from 'form-designer-plus'; //引入VForm3库
import 'form-designer-plus/dist/designer.style.css'; //引入VForm3样式

import elementIcons from '/@/components/SvgIcon/svgicon';
import '/@/theme/index.scss';
import { Pagination, RightToolbar, DictTag, UploadExcel, UploadFile, UploadImg, Editor } from '/@/components/index';
import { parseTime, parseDate, dateTimeStr, dateStr, timeStr } from '/@/utils/formatTime';
import 'highlight.js/styles/atom-one-dark.css';
import 'highlight.js/lib/common';
import hljsVuePlugin from '@highlightjs/vue-plugin';

// 布局工具
import { Splitpanes, Pane } from 'splitpanes';
import 'splitpanes/dist/splitpanes.css';

const app = createApp(App);

// 导入通用自定义组件
app.component('DictTag', DictTag);
app.component('Pagination', Pagination);
app.component('RightToolbar', RightToolbar);
app.component('uploadExcel', UploadExcel);
app.component('UploadFile', UploadFile);
app.component('UploadImg', UploadImg);
app.component('Editor', Editor);
// 导入布局插件
app.component('Splitpanes', Splitpanes);
app.component('Pane', Pane);
// 全局方法挂载
app.config.globalProperties.parseTime = parseTime;
app.config.globalProperties.parseDate = parseDate;
app.config.globalProperties.dateTimeStr = dateTimeStr;
app.config.globalProperties.dateStr = dateStr;
app.config.globalProperties.timeStr = timeStr;
app.config.globalProperties.baseURL = import.meta.env.VITE_API_URL;

directive(app);
other.elSvg(app);
app
	.use(pinia) // pinia 存储
	.use(router) // 路由
	.use(ElementPlus, { i18n: i18n.global.t }) // ElementPlus 全局引入
	.use(elementIcons) // elementIcons 图标全局引入
	.use(VForm3) // 表单设计
	.use(i18n) // 国际化
	.use(hljsVuePlugin) // 代码高亮
	.mount('#app');
