import {createApp} from 'vue'
import pinia from '/@/stores/index'
import App from './App.vue'
import router from './router'
import {directive} from '/@/directive/index'
import {i18n} from '/@/i18n/index'
import other from '/@/utils/other'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import VForm3 from 'form-designer'  //引入VForm3库
import 'form-designer/dist/designer.style.css'  //引入VForm3样式

import elementIcons from '/@//components/svgIcon/svgicon'
import '/@/theme/index.scss'
import 'vxe-table/lib/style.css'
import 'xe-utils'
import VXETable from 'vxe-table'
import {Pagination, RightToolbar, DictTag, UploadExcel} from '/@/components/index'
import {parseTime, parseDate, dateTimeStr, dateStr} from '/@/utils/formatTime'


const app = createApp(App);

// 导入通用自定义组件
app.component('DictTag', DictTag)
app.component('Pagination', Pagination)
app.component('RightToolbar', RightToolbar)
app.component('uploadExcel', UploadExcel)

// 全局方法挂载
app.config.globalProperties.parseTime = parseTime
app.config.globalProperties.parseDate = parseDate
app.config.globalProperties.dateTimeStr = dateTimeStr
app.config.globalProperties.dateStr = dateStr


directive(app);
other.elSvg(app);
app.use(pinia) // pinia 存储
    .use(router) // 路由
    .use(ElementPlus, {i18n: i18n.global.t}) // ElementPlus 全局引入
    .use(VXETable) // VXETable 全局引入
    .use(elementIcons) // elementIcons 图标全局引入
    .use(VForm3) // 表单设计
    .use(i18n) // 国际化
    .mount('#app');
