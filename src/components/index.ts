import ElementIcons from '/@/components/SvgIcon/svgicon';
import Pagination from '/@/components/Pagination/index.vue';
import RightToolbar from '/@/components/RightToolbar/index.vue';
import DictTag from '/@/components/DictTag/index.vue';
import UploadExcel from '/@/components/Upload/Excel.vue';
import UploadFile from '/@/components/Upload/index.vue';
import UploadImg from '/@/components/Upload/Image.vue';
import DelWrap from '/@/components/DelWrap/index.vue';
import Editor from '/@/components/Editor/index.vue';
import Tip from '/@/components/Tip/index.vue';
import TagList from '/@/components/TagList/index.vue';

// 第三方组件
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import {Pane, Splitpanes} from 'splitpanes';
import 'splitpanes/dist/splitpanes.css';
// 日历组件
import {setupCalendar} from 'v-calendar';
// @ts-ignore 引入VForm3库
import VForm3 from 'form-designer-plus'; //
import 'form-designer-plus/dist/designer.style.css'; //引入VForm3样式
// 部门树组件
import vue3TreeOrg from 'vue3-tree-org';
import 'vue3-tree-org/lib/vue3-tree-org.css';


// 导入声明
import {App} from "vue";
import other from "/@/utils/other";

export default {
    install(app: App) {
        // 全局注册ELEMENT图标
        other.elSvg(app);
        app.component('ElementIcons', ElementIcons);
        app.component('DictTag', DictTag);
        app.component('Pagination', Pagination);
        app.component('RightToolbar', RightToolbar);
        app.component('uploadExcel', UploadExcel);
        app.component('UploadFile', UploadFile);
        app.component('UploadImg', UploadImg);
        app.component('Editor', Editor);
        app.component('Tip', Tip);
        app.component('DelWrap', DelWrap);
        app.component('TagList', TagList);
        // 导入布局插件
        app.component('Splitpanes', Splitpanes);
        app.component('Pane', Pane);
        app.use(ElementPlus) // ELEMENT 组件
        app.use(setupCalendar, {}) // 日历组件
        app.use(VForm3) // 表单设计
        app.use(vue3TreeOrg) // 组织架构组件
    }
}
