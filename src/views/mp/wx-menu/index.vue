<template>
	<div class="layout-padding">
		<splitpanes>
			<pane size="20">
				<div class="layout-padding-auto layout-padding-view">
					<el-scrollbar>
						<query-tree class="mt10" :query="deptData.queryList" @node-click="handleNodeClick" placeholder="请输入微信公众号名称" />
					</el-scrollbar>
				</div>
			</pane>
			<pane>
				<div class="layout-padding-auto layout-padding-view">
					<el-scrollbar>
						<div v-loading="loading" class="public-account-management clearfix">
							<div class="left">
								<div class="weixin-hd">
									<div class="weixin-title">{{ name }}</div>
								</div>
								<div class="weixin-menu menu_main clearfix">
									<div v-for="(item, i) of menuList" :key="i" class="menu_bottom">
										<div :class="{ active: isActive === i }" class="menu_item el-icon-s-fold" @click="menuClick(i, item)">
											{{ item.name }}
										</div>
										<!-- 以下为二级菜单-->
										<div v-if="isSubMenuFlag === i" class="submenu">
											<template v-for="(subItem, k) in item.children">
												<div v-if="item.children" :key="k" class="subtitle menu_bottom">
													<div :class="{ active: isSubMenuActive === i + '' + k }" class="menu_subItem" @click="subMenuClick(subItem, i, k)">
														{{ subItem.name }}
													</div>
												</div>
											</template>
											<!-- 二级菜单加号， 当长度 小于 5 才显示二级菜单的加号  -->
											<div v-if="!item.children || item.children.length < 5" class="menu_bottom menu_addicon" @click="addSubMenu(i, item)">
												<el-icon>
													<el-icon-plus />
												</el-icon>
											</div>
										</div>
									</div>
									<!-- 一级菜单加号 -->
									<div v-if="menuList.length < 3" class="menu_bottom menu_addicon" @click="addMenu">
										<el-icon>
											<el-icon-plus />
										</el-icon>
									</div>
								</div>
								<div class="save_div">
									<el-button class="save_btn" type="success" size="small" @click="handleSave">保存并发布菜单</el-button>
									<el-button class="save_btn" type="danger" size="small" @click="handleDelete">清空菜单</el-button>
								</div>
							</div>

							<div v-if="showRightFlag" class="right">
								<div class="configure_page">
									<div class="delete_btn">
										<el-button icon="Delete" size="mini" type="danger" @click="deleteMenu(tempObj)">删除当前菜单 </el-button>
									</div>
									<div>
										<span>菜单名称：</span>
										<el-input v-model="tempObj.name" class="input_width" clearable placeholder="请输入菜单名称" />
									</div>
									<div v-if="showConfigureContent">
										<div class="menu_content">
											<span>菜单标识：</span>
											<el-input v-model="tempObj.key" class="input_width" clearable placeholder="请输入菜单 KEY" />
										</div>
										<div class="menu_content">
											<span>菜单内容：</span>
											<el-select v-model="tempObj.type" class="menu_option" clearable placeholder="请选择">
												<el-option v-for="item in menuOptions" :key="item.value" :label="item.label" :value="item.value" />
											</el-select>
										</div>
										<div class="configur_content" v-if="tempObj.type === 'view'">
											<span>跳转链接：</span>
											<el-input class="input_width" v-model="tempObj.url" placeholder="请输入链接" clearable />
										</div>
										<div class="configur_content" v-if="tempObj.type === 'miniprogram'">
											<div class="applet">
												<span>小程序的 appid ：</span>
												<el-input class="input_width" v-model="tempObj.miniProgramAppId" placeholder="请输入小程序的appid" clearable />
											</div>
											<div class="applet">
												<span>小程序的页面路径：</span>
												<el-input
													class="input_width"
													v-model="tempObj.miniProgramPagePath"
													placeholder="请输入小程序的页面路径，如：pages/index"
													clearable
												/>
											</div>
											<div class="applet">
												<span>小程序的备用网页：</span>
												<el-input class="input_width" v-model="tempObj.url" placeholder="不支持小程序的老版本客户端将打开本网页" clearable />
											</div>
											<p class="blue">tips:需要和公众号进行关联才可以把小程序绑定带微信菜单上哟！</p>
										</div>
										<div class="configur_content" v-if="tempObj.type === 'article_view_limited'">
											<el-row>
												<div class="select-item" v-if="tempObj && tempObj.replyArticles">
													<wx-news :objData="tempObj.replyArticles" />
													<el-row class="ope-row">
														<el-button type="danger" icon="el-icon-delete" circle @click="deleteMaterial" />
													</el-row>
												</div>
												<div v-else>
													<el-row>
														<el-col :span="24" style="text-align: center">
															<el-button type="success" @click="openMaterial"> 素材库选择<i class="fansel-icon--right"></i> </el-button>
														</el-col>
													</el-row>
												</div>
												<wx-material-select ref="dialogNewsRef" @selectMaterial="selectMaterial" />
											</el-row>
										</div>
										<div class="configur_content" v-if="tempObj.type === 'click' || tempObj.type === 'scancode_waitmsg'">
											<wx-reply :objData="tempObj" v-if="hackResetWxReplySelect" />
										</div>
									</div>
								</div>
							</div>
						</div>
					</el-scrollbar>
				</div>
			</pane>
		</splitpanes>
	</div>
</template>

<script lang="ts" name="wx-menu" setup>
import { saveObj, getObj, publishObj } from '/@/api/mp/wx-menu';

// 部门树使用的数据
import { fetchAccountList } from '/@/api/mp/wx-account';
import { useMessage, useMessageBox } from '/@/hooks/message';

const WxMaterialSelect = defineAsyncComponent(() => import('/@/components/Wechat/wx-material-select/main.vue'));

const WxReply = defineAsyncComponent(() => import('/@/components/Wechat/wx-reply/index.vue'));

const QueryTree = defineAsyncComponent(() => import('/@/components/QueryTree/index.vue'));

const WxNews = defineAsyncComponent(() => import('/@/components/Wechat/wx-news/index.vue'));

// 点击树
const handleNodeClick = (node: any) => {
	accountId.value = node.appid;
	name.value = node.name;
	getMenuFun();
};

const deptData = reactive({
	queryList: (name: string) => {
		return fetchAccountList({
			name: name,
		});
	},
});

const loading = ref(false);

const name = ref('测试公众号');

const accountId = ref(''); // 公众号id
// 一级菜单点中样式
const isActive = ref(-1);
// 一级菜单点中样式
const isSubMenuActive = ref('-1');
// 二级菜单显示标志
const isSubMenuFlag = ref(-1);

const menuList = reactive([
	{
		name: '菜单名称',
		children: [],
	},
] as any);

const hackResetWxReplySelect = ref(false);

const menuOptions = ref([
	{
		value: 'view',
		label: '跳转网页',
	},
	{
		value: 'miniprogram',
		label: '跳转小程序',
	},
	{
		value: 'click',
		label: '点击回复',
	},
	{
		value: 'article_view_limited',
		label: '跳转图文消息',
	},
	{
		value: 'scancode_push',
		label: '扫码直接返回结果',
	},
	{
		value: 'scancode_waitmsg',
		label: '扫码回复',
	},
	{
		value: 'pic_sysphoto',
		label: '系统拍照发图',
	},
	{
		value: 'pic_photo_or_album',
		label: '拍照或者相册',
	},
	{
		value: 'pic_weixin',
		label: '微信相册',
	},
	{
		value: 'location_select',
		label: '选择地理位置',
	},
]);

const showRightFlag = ref(false);

let tempObj = ref({
	replyArticles: [] as any,
	articleId: '',
	appId: '',
});

const tempSelfObj = reactive({
	grand: '', // 表示二级菜单
	index: '', // 表示一级菜单索引
	secondIndex: '', // 表示二级菜单索引
});

const getMenuFun = () => {
	getObj(accountId.value).then((res) => {
		if (res.data) {
			const data = JSON.parse(res.data);
			if (data && data.button) {
				Object.assign(menuList, data.button);
			}
		} else {
			menuList.length = 0;
			Object.assign(menuList, {
				name: '菜单名称',
				children: [],
			});
		}
	});
};

const showConfigureContent = ref(true);

// 一级菜单点击事件
const menuClick = (i, item) => {
	hackResetWxReplySelect.value = false;
	nextTick(() => {
		hackResetWxReplySelect.value = true;
	});
	showRightFlag.value = true; // 右边菜单
	tempObj.value = item;
	tempObj.value.appId = accountId.value;
	showConfigureContent.value = !(item.children && item.children.length > 0); // 有子菜单，就不显示配置内容
	isActive.value = i;
	isSubMenuFlag.value = i;
	isSubMenuActive.value = '-1';
	tempSelfObj.grand = '1'; //表示一级菜单
	tempSelfObj.index = i; //表示一级菜单索引
};

// 点击二级菜单
const subMenuClick = (subItem, index, k) => {
	hackResetWxReplySelect.value = false;
	nextTick(() => {
		hackResetWxReplySelect.value = true;
	});
	showRightFlag.value = true; // 右边菜单
	// Object.assign(tempObj, subItem) // 这个如果放在顶部，flag 会没有。因为重新赋值了。
	tempObj.value = subItem;
	tempObj.value.appId = accountId.value;
	showConfigureContent.value = true;
	isActive.value = -1; // 一级菜单去除样式
	isSubMenuActive.value = index + '' + k; // 二级菜单选中样式
	tempSelfObj.grand = '2'; //表示二级菜单
	tempSelfObj.index = index; //表示一级菜单索引
	tempSelfObj.secondIndex = k; //表示二级菜单索引
};

// 添加横向二级菜单；item 表示要操作的父菜单
const addSubMenu = (i, item) => {
	if (!item.children || item.children.length <= 0) {
		item['children'] = [];
		showConfigureContent.value = false;
	}
	let addButton = {
		name: '子菜单名称',
		reply: {
			// 用于存储回复内容
			type: 'text',
			accountId: accountId.value, // 保证组件里，可以使用到对应的公众号
		},
	};
	item.children.push(addButton);
};

// 添加横向一级菜单
const addMenu = () => {
	const addButton = {
		name: '菜单名称',
		children: [],
		reply: {
			// 用于存储回复内容
			type: 'text',
			accountId: accountId.value, // 保证组件里，可以使用到对应的公众号
		},
	};
	menuList.push(addButton);
};

const deleteMenu = () => {
	useMessageBox()
		.confirm('确定要删除吗?')
		.then(() => {
			if (tempSelfObj.grand === '1') {
				menuList.splice(tempSelfObj.index, 1);
			} else if (tempSelfObj.grand === '2') {
				menuList[tempSelfObj.index].children.splice(tempSelfObj.secondIndex, 1);
			}
			useMessage().success('删除成功');
			Object.assign(tempObj, {});
			showRightFlag.value = false;
			isActive.value = -1;
			isSubMenuActive.value = '-1';
		})
		.catch((err) => {
			useMessage().error(err.msg);
		});
};

const handleSave = async () => {
	try {
		await useMessageBox().confirm('确定要保存该菜单吗?');
		await saveObj(accountId.value, { button: menuList });
		await publishObj(accountId.value);
		useMessage().success('发布成功');
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

const deleteMaterial = () => {
	tempObj.value.replyArticles = [];
	tempObj.value.articleId = '';
};

const dialogNewsRef = ref();
const openMaterial = () => {
	dialogNewsRef.value.openDialog({ type: 'news', accountId: accountId.value });
};

const selectMaterial = (item) => {
	const articleId = item.articleId;
	const articles = item.content.newsItem;
	// 提示，针对多图文
	if (articles.length > 1) {
		// this.$alert('您选择的是多图文，将默认跳转第一篇', '提示', {
		//   confirmButtonText: '确定'
		// })
	}

	// 设置菜单的回复
	tempObj.value.articleId = articleId;
	tempObj.value.replyArticles = [];
	articles.forEach((article) => {
		tempObj.value.replyArticles.push({
			title: article.title,
			description: article.digest,
			picUrl: article.picUrl,
			url: article.url,
		});
	});
};

const handleDelete = () => {};
</script>

<style lang="scss" scoped>
@import './assets/wx-menu.scss';
</style>
