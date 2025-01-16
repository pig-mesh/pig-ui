<template>
	<div class="select-none">
		<img :src="bg" class="wave" />
		<div class="flex-c absolute right-5 top-3">
			<div id="translate"><!-- 这里是语种切换的select，不需要时直接删掉这个div即可。这里最好是动态的，因为不同的翻译通道支持的语种的种类是不一样的，这个下周一我来优化动态赋予切换语种这个 --></div>
			<el-select v-model="language" @change="handleLanguageChange">
				<el-option label="简体中文" value="chinese_simplified" />
				<el-option label="日语" value="japanese" />
				<el-option label="韩语" value="korean" />
			</el-select>
		</div>
		<div class="login-container">
			<div class="img">
				<img :src="illustration" />
			</div>
			<div class="login-box">
				<div class="login-form">
					<div class="login-title">{{ getThemeConfig.globalTitle }}</div>
					<el-tabs v-model="tabsActiveName">
						<!-- 用户名密码登录 -->
						<el-tab-pane :label="$t('label.one1')" name="account">
							<Password @signInSuccess="signInSuccess" />
						</el-tab-pane>
						<!-- 手机号登录 -->
						<el-tab-pane :label="$t('label.two2')" name="mobile">
							<Mobile @signInSuccess="signInSuccess" />
						</el-tab-pane>
						<!-- 注册 -->
						<el-tab-pane :label="$t('label.register')" name="register" v-if="registerEnable">
							<Register @afterSuccess="tabsActiveName = 'account'" />
						</el-tab-pane>
					</el-tabs>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="loginIndex">
import { useThemeConfig } from '/@/stores/themeConfig';
import { NextLoading } from '/@/utils/loading';
import illustration from '/@/assets/login/login_bg.svg';
import bg from '/@/assets/login/bg.png';
import miniQr from '/@/assets/login/mini_qr.png';
import { useI18n } from 'vue-i18n';
import { formatAxis } from '/@/utils/formatTime';
import { useMessage } from '/@/hooks/message';
import { Session } from '/@/utils/storage';
import { initBackEndControlRoutes } from '/@/router/backEnd';

// 引入组件
const Password = defineAsyncComponent(() => import('./component/password.vue'));
const Mobile = defineAsyncComponent(() => import('./component/mobile.vue'));
const Register = defineAsyncComponent(() => import('./component/register.vue'));

// 定义变量内容
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);
const { t, locale } = useI18n();
const route = useRoute();
const router = useRouter();

// 是否开启注册
const registerEnable = ref(import.meta.env.VITE_REGISTER_ENABLE === 'true');

// 默认选择账号密码登录方式
const tabsActiveName = ref('account');

// 获取布局配置信息
const getThemeConfig = computed(() => {
	return themeConfig.value;
});

// 添加语言相关变量和方法
const language = ref(locale.value);

// 语言切换处理函数开始
import translate from 'i18n-jsautotranslate'
window.translate = translate; //方便审核元素用控制台调试
translate.service.use('client.edge'); //翻译通道
translate.whole.enableAll(); //整体翻译
//自定义术语
//原本i18n的 login 
translate.nomenclature.append('chinese_simplified','english',`
用户名登录=Account login
手机号登录=SMS login
社交登录=Social login
注册账号=Create account
第三方登录=Third party login
友情链接=Links
请输入用户名=The username "admin" is common, please use another
请输入密码=Password
请输入验证码=Please enter the verification code
请输入手机号=Please enter your phone number
登 录=Sign in
注 册=Create account
我已仔细阅读并接受=I have read and accept
《隐私政策》=the Privacy Policy
请输入手机号=Please enter your mobile number
请输入验证码=Please enter the verification code
获取验证码=Get verification code
登 录=Sign in
打开手机扫一扫，快速登录/注册=Use your mobile device to scan and quickly log in or create an account
微信扫码体验移动端=Scan with WeChat app for quick access
请选择租户，点击此处=Please select a tenant by clicking here
请选择租户，只需要在第一次使用时进行选择。=You only need to select a tenant once for future use
欢迎回来！=Welcome back!
* 温馨提示：建议使用谷歌、Microsoft Edge，版本 79.0.1072.62 及以上浏览器，360浏览器请使用极速模式=Tip: For best results, we recommend using Google Chrome, Microsoft Edge (version 79.0.1072.62 or higher), or the 360 browser with speed mode enabled.
`);
//原本i18n的form
translate.nomenclature.append('chinese_simplified','english',`
查询=Query
新 增=Add
修 改=Edit
展开/折叠=Export
删除=Delete
查看=View
详情=Details
刷新缓存=Refresh cache
导出=expand/phrase
导入=Import
请输入部门名称=Enter department name
重置=Reset
操作=Action
操作成功=Operation successful
修改成功=Successfully edited
添加成功=Successfully added
删除成功=Successfully deleted
此操作将永久删除=This operation will permanently delete
是否确认本操作=Confirm this operation?
确认=Confirm
取消=Cancel
下载=Download
系统提示=System prompt
`);
//原本i18n的 lang
translate.nomenclature.append('chinese_simplified','english',`
首页=Home
系统设置=System
菜单管理=System Menu
角色管理=System Role
用户管理=System User
部门管理=System Department
字典管理=System Dictionary
权限管理=Permissions
前端控制=Front End
页面权限=Front End Page
按钮权限=Front End Button
后端控制=Back End
页面权限=Back End Page
功能=Functions
tagsView 操作=Tags View
数字滚动=Count Up
Editor 编辑器=Wang Editor
图片裁剪=Cropper
二维码生成=QR Code
地理坐标/地图=Echarts Map
页面打印=PrintJS
复制剪切=Copy and Cut
拖拽布局=Drag Layout
窗格拆分器=Split Pane
验证器=Validator
页面=Pages
过滤筛选组件=Filtering
过滤筛选组件详情=Filtering Details
过滤筛选组件详情111=Filtering Details 1
ali 字体图标=Icon Font Icon
ele 字体图标=Element Icon
awe 字体图标=Awesome Icon
表单自适应=Form Adapt
表单表格验证=Table Rules
表单国际化=Form I18n
多表单验证=Multi-Form Validation
动态复杂表单=Dynamic Complex Form
工作流=Workflow
列表自适应=List Adapt
瀑布屏=Waterfall
步骤条=Steps
大图预览=Large Preview
波浪效果=Wave Effect
树形改表格=Tree Alter Table
拖动指令=Drag Command
图片懒加载=Image Lazy Loading
组件封装=Make Index
图标选择器=Icon Selector
滚动通知栏=Notification Bar
svgIcon 演示=Svgicon Demo
表格封装演示=Table Demo
路由参数=Routing Parameters
普通路由=General Routing
动态路由=Dynamic Routing
普通路由详情=paramsCommonDetails
动态路由详情=Dynamic Routing Details
大数据图表=Chart Index
数据可视化=Visualizing Index
数据可视化演示1=Visualizing Link Demo 1
数据可视化演示2=Visualizing Link Demo 2
个人中心=Personal
工具类集合=Tools
外链=Link View
内嵌 iframe1=Iframe View One
内嵌 iframe2=Iframe View Two
登录=Login
回调页=Auth Redirect
登录=Sign In
找不到此页面=Not Found
没有权限=No Power
组件大小=Component Size
语言切换=Language Switching
菜单搜索=Menu Search
布局配置=Layout Configuration
消息=News
开全屏=Full Screen On
关全屏=Full Screen Off
大型=Large
默认=Default
小型=Small
首页=Home Page
个人中心=Personal Center
退出登录=Log Out
菜单搜索：支持中文、路由路径=Menu Search: Supports Chinese and Routing Path
通知=Notice
全部已读=All Read
前往通知中心=Go to the Notification Center
暂无通知=No Notice
提示=Tips
此操作将退出登录, 是否继续?=This Operation Will Log Out. Do You Want to Continue?
确定=Determine
取消=Cancel
退出中=Exiting
刷新=Refresh
关闭=Close
关闭其它=Close Other
全部关闭=Close All
当前页全屏=Fullscreen
关闭全屏=Close Fullscreen
收藏=Favorite
地址输入错误，请重新输入地址~=Wrong Address Input, Please Re-enter the Address~
您可以先检查网址，然后重新输入或给我们反馈问题。=You Can Check the Web Address First, and Then Re-enter or Give Us Feedback.
返回首页=Back to Home Page
您未被授权，没有操作权限~=You Are Not Authorized to Operate~
联系方式：加QQ群探讨 665452019=Contact Information: Add QQ Group Discussion 665452019
重新授权=Reauthorization
布局配置=Layout Configuration
全局主题=Global Themes
顶栏设置=Top Bar Set Up
菜单设置=Menu Set Up
分栏设置=Columns Set Up
顶栏背景=Top Bar Background
顶栏默认字体颜色=Top Bar Default Font Color
顶栏背景渐变=Top Bar Gradient
菜单背景=Menu Background
菜单默认字体颜色=Menu Default Font Color
菜单高亮背景色=Menu Highlight Color
菜单背景渐变=Menu Gradient
分栏菜单背景=Column Menu Background
分栏菜单默认字体颜色=Default Font Color Bar Menu
分栏菜单背景渐变=Column Gradient
分栏菜单鼠标悬停预加载=Column Menu Hover Preload
界面设置=Interface Settings
菜单水平折叠=Menu Horizontal Collapse
菜单手风琴=Menu Accordion
固定 Header=Fixed Header
经典布局顶部菜单=Classic Layout Split Menu
开启锁屏=Open the Lock Screen
自动锁屏(s/秒)=Screen Locking (s/s)
界面显示=Interface Display
侧边栏 Logo=Sidebar Logo
开启 Breadcrumb=Open Breadcrumb
开启 Breadcrumb 图标=Open Breadcrumb Icon
开启 Tagsview=Open Tagsview
开启 Tagsview 图标=Open Tagsview Icon
开启 TagsView 缓存=Enable Tagsview Cache
开启 TagsView 拖拽=Enable Tagsview Drag
开启 TagsView 共用=Enable Tagsview Sharing
开启 Footer=Open Footer
灰色模式=Grey Model
色弱模式=Color Weak Mode
深色模式=Dark Mode
开启水印=Turn on Watermark
水印文案=Watermark Copy
其它设置=Other Settings
Tagsview 风格=Tagsview Style
主页面切换动画=Page Animation
分栏高亮风格=Column Style
分栏布局风格=Column Layout
布局切换=Layout Switch
默认=One
经典=Two
横向=Three
分栏=Four
点击下方按钮，复制布局配置去 \`src/stores/themeConfig.ts\` 中修改。=Click the Button Below to Copy the Layout Configuration to \`/src/stores/themeConfig.ts\`. It Has Been Modified In.
一键复制配置=Replication Configuration
一键恢复默认=Restore Default
复制成功！=Copy Succeeded!
复制失败！=Copy Failed!
新版本升级=New Version
新版本来啦，马上更新尝鲜吧！不用担心，更新很快的哦！=The New Version is Available, Please Update It Now! Dont Worry, the Update is Fast!
提示：更新会还原默认配置=Prompt: Update Will Restore the Default Configuration
残忍拒绝=Cruel Refusal
马上更新=Update Now
更新中=Updating
`);
nextTick(() => {
    translate.execute();
    setTimeout(function(){
    	//vue的input中的placeholder属性会在nextTick之后延迟渲染，而这个属性是没有别的方式来监听的，所以额外加一个定时器
    	//针对这个问题，最新的 translate.js 增加了翻译队列控制翻译的并行执行，同一时间只允许执行一次，多次执行会进入等待期，执行完一个才会执行下一个，所以不会对页面造成阻塞，从而对页面性能造成影响
    	translate.execute();
    }, 500);
    translate.listener.start();    //开启html页面变化的监控
});
onUpdated(() => {
	translate.execute();
});
const handleLanguageChange = (val: string) => {
	locale.value = val;
	// 如果使用了 i18n-jsautotranslate，也可以调用它的方法
	translate.changeLanguage(val);
};
// 语言切换处理函数结束

// 登录成功后的跳转处理事件
const signInSuccess = async () => {
	const isNoPower = await initBackEndControlRoutes();
	if (isNoPower) {
		useMessage().wraning('抱歉，您没有登录权限');
		Session.clear();
	} else {
		// 初始化登录成功时间问候语
		let currentTimeInfo = formatAxis(new Date());
		if (route.query?.redirect) {
			router.push({
				path: <string>route.query?.redirect,
				query: Object.keys(<string>route.query?.params).length > 0 ? JSON.parse(<string>route.query?.params) : '',
			});
		} else {
			router.push('/');
		}
		// 登录成功提示
		const signInText = t('signInText');
		useMessage().success(`${currentTimeInfo}，${signInText}`);
		// 添加 loading，防止第一次进入界面时出现短暂空白
		NextLoading.start();
	}
};

// 页面加载时
onMounted(() => {
	NextLoading.done();
});
</script>

<style scoped>
.el-select {
	width: 120px;
}
</style>
