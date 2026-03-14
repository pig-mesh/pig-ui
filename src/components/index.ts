import Pagination from '/@/components/Pagination/index.vue';
import RightToolbar from '/@/components/RightToolbar/index.vue';
import DictTag from '/@/components/DictTag/index.vue';
import DictSelect from '/@/components/DictTag/Select.vue';
import UploadExcel from '/@/components/Upload/Excel.vue';
import UploadFile from '/@/components/Upload/index.vue';
import UploadImg from '/@/components/Upload/Image.vue';
import UploadImgPaste from '/@/components/Upload/ImagePaste.vue';
import DelWrap from '/@/components/DelWrap/index.vue';
import Editor from '/@/components/Editor/index.vue';
import Tip from '/@/components/Tip/index.vue';
import TagList from '/@/components/TagList/index.vue';
import SvgIcon from '/@/components/SvgIcon/index.vue';
import Sign from '/@/components/Sign/index.vue';
import ChinaArea from '/@/components/ChinaArea/index.vue';
import OrgSelector from '/@/components/OrgSelector/index.vue';

// 第三方组件
import ElementPlus from 'element-plus';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import 'element-plus/dist/index.css';
import { Pane, Splitpanes } from 'splitpanes';
import 'splitpanes/dist/splitpanes.css';
// 日历组件
import { setupCalendar } from 'v-calendar';

// 部门树组件
import vue3TreeOrg from 'vue3-tree-org';
import 'vue3-tree-org/lib/vue3-tree-org.css';

// 导入声明
import { App } from 'vue';

export default {
	install(app: App) {
		app.component('DictTag', DictTag);
		app.component('DictSelect', DictSelect);
		app.component('Pagination', Pagination);
		app.component('RightToolbar', RightToolbar);
		app.component('uploadExcel', UploadExcel);
		app.component('UploadFile', UploadFile);
		app.component('UploadImg', UploadImg);
		app.component('UploadImgPaste', UploadImgPaste);
		app.component('Editor', Editor);
		app.component('Tip', Tip);
		app.component('DelWrap', DelWrap);
		app.component('TagList', TagList);
		app.component('SvgIcon', SvgIcon);
		app.component('ChinaArea', ChinaArea);
		app.component('OrgSelector', OrgSelector);
		app.component('Sign', Sign);

		// 导入全部的elmenet-plus的图标
		for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
			app.component(key, component);
			// 兼容性
			app.component(`ele-${key}`, component);
		}
		// 导入布局插件
		app.component('Splitpanes', Splitpanes);
		app.component('Pane', Pane);
		app.use(ElementPlus); // ELEMENT 组件
		app.use(setupCalendar, {}); // 日历组件
		app.use(vue3TreeOrg); // 组织架构组件
	},
};
