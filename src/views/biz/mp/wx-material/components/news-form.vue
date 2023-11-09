<template>
	<el-dialog
		:title="operateMaterial === 'add' ? '新建图文' : '修改图文'"
		:before-close="dialogNewsClose"
		:close-on-click-modal="false"
		v-model="dialogNewsVisible"
		:destroy-on-close="true"
		width="80%"
		top="20px"
	>
		<div class="left">
			<div class="select-item">
				<div v-for="(news, index) in articlesAdd" :key="news.id">
					<div v-if="index == 0" class="news-main father" :class="{ activeAddNews: isActiveAddNews === index }" @click="activeNews(index)">
						<div class="news-content">
							<img v-if="news.thumbUrl" class="material-img" :src="news.thumbUrl" />
							<div class="news-content-title">{{ news.title }}</div>
						</div>
						<div v-if="articlesAdd.length > 1" class="child">
							<el-button icon="el-icon-top" @click="downNews(index)">下移</el-button>
							<el-button v-if="operateMaterial == 'add'" icon="el-icon-delete" @click="minusNews(index)">删除 </el-button>
						</div>
					</div>
					<div v-if="index > 0" class="news-main-item father" :class="{ activeAddNews: isActiveAddNews === index }" @click="activeNews(index)">
						<div class="news-content-item">
							<div class="news-content-item-title">{{ news.title }}</div>
							<div class="news-content-item-img">
								<img v-if="news.thumbUrl" class="material-img" :src="news.thumbUrl" height="100%" />
							</div>
						</div>
						<div class="child">
							<el-button v-if="articlesAdd.length > index + 1" icon="el-icon-sort-down" @click="downNews(index)">下移 </el-button>
							<el-button icon="el-icon-sort-up" @click="upNews(index)">上移</el-button>
							<el-button v-if="operateMaterial == 'add'" icon="el-icon-delete" @click="minusNews(index)">删除 </el-button>
						</div>
					</div>
				</div>
				<div v-if="articlesAdd.length < 8 && operateMaterial == 'add'" class="news-main-plus" @click="plusNews">
					<el-icon><Plus /></el-icon>
				</div>
			</div>
		</div>
		<div v-loading="addMaterialLoading" class="right">
			<!--富文本编辑器组件-->
			<el-row>
				<editor v-model:get-html="articlesAdd[isActiveAddNews].content" style="margin-top: 20px"></editor>
			</el-row>
			<br /><br /><br /><br />
			<div class="input-tt">封面和摘要：</div>
			<div>
				<div class="thumb-div">
					<img
						v-if="articlesAdd[isActiveAddNews].thumbUrl"
						class="material-img"
						:src="articlesAdd[isActiveAddNews].thumbUrl"
						:class="isActiveAddNews === 0 ? 'avatar' : 'avatar1'"
					/>
					<i v-else class="el-icon-plus avatar-uploader-icon" :class="isActiveAddNews === 0 ? 'avatar' : 'avatar1'"></i>
					<div class="thumb-but">
						<wx-file-upload :uploadData="uploadData" @success="handleImageChange"></wx-file-upload>
						<el-button type="primary" @click="openMaterial">素材库选择</el-button>
					</div>
				</div>
				<el-input
					v-model="articlesAdd[isActiveAddNews].digest"
					:rows="6"
					type="textarea"
					placeholder="请输入摘要"
					class="digest"
					maxlength="120"
				></el-input>
			</div>
			<div class="input-tt">标题：</div>
			<el-input v-model="articlesAdd[isActiveAddNews].title" placeholder="请输入标题"></el-input>
			<div class="input-tt">作者：</div>
			<el-input v-model="articlesAdd[isActiveAddNews].author" placeholder="请输入作者"></el-input>
			<div class="input-tt">原文地址：</div>
			<el-input v-model="articlesAdd[isActiveAddNews].contentSourceUrl" placeholder="请输入原文地址"></el-input>
		</div>

		<template #footer>
			<span class="dialog-footer">
				<el-button @click="dialogNewsVisible = false">{{ $t('common.cancelButtonText') }}</el-button>
				<el-button type="primary" @click="onSubmit">{{ $t('common.confirmButtonText') }}</el-button>
			</span>
		</template>
	</el-dialog>

	<wx-material-select ref="WxMaterialSelectRef"></wx-material-select>
</template>

<script setup lang="ts" name="wx-news-form">
import { useMessageBox } from '/@/hooks/message';
import { addObj, materialNewsUpdate } from '/@/api/mp/wx-material';

const WxMaterialSelect = defineAsyncComponent(() => import('/@/components/Wechat/wx-material-select/main.vue'));

const WxFileUpload = defineAsyncComponent(() => import('/@/components/Wechat/fileUpload/index.vue'));

const WxMaterialSelectRef = ref();

const dialogNewsVisible = ref(false);

const operateMaterial = ref('add');

const addMaterialLoading = ref(false);

// 定义刷新表格emit
const emit = defineEmits(['ok']);

const dialogNewsClose = () => {
	useMessageBox()
		.confirm('修改内容可能还未保存，确定关闭吗?')
		.then(() => {
			dialogNewsVisible.value = false;
		});
};

// 公众号id
const accountId = ref();

// 文章数据
const articlesAdd = ref([
	{
		title: '',
		thumbMediaId: '',
		author: '',
		digest: '',
		showCoverPic: '',
		content: '',
		contentSourceUrl: '',
		needOpenComment: '',
		onlyFansCanComment: '',
		thumbUrl: '',
	},
]);
// 激活文章
const isActiveAddNews = ref(0);
// 编辑媒体的id
const articlesMediaId = ref();

const openDialog = (data: any, item?: any, mediaId?: any, type: any = 'add') => {
	// 设置组件内不用账号
	accountId.value = data.accountId;
	uploadData.appId = data.accountId;

	dialogNewsVisible.value = true;
	operateMaterial.value = 'add';

	if (item) {
		articlesAdd.value = item;
	}
	if (mediaId) {
		articlesMediaId.value = mediaId || '';
	}
	if (type) {
		operateMaterial.value = type;
	}
};

const uploadData = reactive({
	mediaType: 'image',
	title: '',
	introduction: '',
	appId: '',
});

const openMaterial = () => {
	WxMaterialSelectRef.value.openDialog({
		type: 'image',
		accountId: accountId.value,
	});
};

const handleImageChange = (response) => {
	articlesAdd.value[isActiveAddNews.value].thumbMediaId = response.data.mediaId;
	articlesAdd.value[isActiveAddNews.value].thumbUrl = response.data.url;
};

const onSubmit = () => {
	addMaterialLoading.value = true;
	if (operateMaterial.value === 'add') {
		addObj({
			articles: articlesAdd.value,
			appId: accountId.value,
		})
			.then(() => {
				addMaterialLoading.value = false;
				dialogNewsVisible.value = false;
				isActiveAddNews.value = 0;
				articlesAdd.value = [
					{
						title: '',
						thumbMediaId: '',
						author: '',
						digest: '',
						showCoverPic: '',
						content: '',
						contentSourceUrl: '',
						needOpenComment: '',
						onlyFansCanComment: '',
						thumbUrl: '',
					},
				];
				emit('ok');
			})
			.finally(() => {
				addMaterialLoading.value = false;
			});
	}
	if (operateMaterial.value === 'edit') {
		materialNewsUpdate({
			articles: articlesAdd.value,
			mediaId: articlesMediaId.value,
			appId: accountId.value,
		})
			.then(() => {
				addMaterialLoading.value = false;
				dialogNewsVisible.value = false;
				isActiveAddNews.value = 0;
				articlesAdd.value = [
					{
						title: '',
						thumbMediaId: '',
						author: '',
						digest: '',
						showCoverPic: '',
						content: '',
						contentSourceUrl: '',
						needOpenComment: '',
						onlyFansCanComment: '',
						thumbUrl: '',
					},
				];
				emit('ok');
			})
			.finally(() => {
				addMaterialLoading.value = false;
			});
	}
};

const activeNews = (index) => {
	isActiveAddNews.value = index;
};

const minusNews = (index) => {
	useMessageBox()
		.confirm('确定删除该图文吗?')
		.then(() => {
			articlesAdd.value.splice(index, 1);
			if (isActiveAddNews.value === index) {
				isActiveAddNews.value = 0;
			}
		});
};

const plusNews = () => {
	articlesAdd.value.push({
		title: '',
		thumbMediaId: '',
		author: '',
		digest: '',
		showCoverPic: '',
		content: '',
		contentSourceUrl: '',
		needOpenComment: '',
		onlyFansCanComment: '',
		thumbUrl: '',
	});
	isActiveAddNews.value = articlesAdd.value.length - 1;
};

const downNews = (index) => {
	const temp = articlesAdd.value[index];
	articlesAdd.value[index] = articlesAdd.value[index + 1];
	articlesAdd.value[index + 1] = temp;
	isActiveAddNews.value = index + 1;
};

const upNews = (index) => {
	const temp = articlesAdd[index];
	articlesAdd[index] = articlesAdd[index - 1];
	articlesAdd[index - 1] = temp;
	isActiveAddNews.value = index - 1;
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>

<style lang="scss" scoped>
.tree-position {
	margin: 12px 20px 0 0;
}

.pagination {
	float: right;
	margin-right: 25px;
}

.add_but {
	padding: 10px;
}

.ope-row {
	margin-top: 5px;
	text-align: center;
	border-top: 1px solid #eaeaea;
	padding-top: 5px;
}

.item-name {
	font-size: 12px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	text-align: center;
}

.el-upload__tip {
	margin-left: 5px;
}

/*新增图文*/
.left {
	display: inline-block;
	width: 35%;
	vertical-align: top;
	margin-top: 200px;
}

.right {
	display: inline-block;
	width: 60%;
	margin-top: -40px;
}

.avatar-uploader {
	width: 20%;
	display: inline-block;
}

.avatar-uploader .el-upload {
	border-radius: 6px;
	cursor: pointer;
	position: relative;
	overflow: hidden;
	text-align: unset !important;
}

.avatar-uploader .el-upload:hover {
	border-color: #409eff;
}

.avatar-uploader-icon {
	border: 1px solid #d9d9d9;
	font-size: 28px;
	color: #8c939d;
	width: 120px;
	height: 120px;
	line-height: 120px;
	text-align: center;
}

.avatar {
	width: 230px;
	height: 120px;
}

.avatar1 {
	width: 120px;
	height: 120px;
}

.digest {
	width: 60%;
	display: inline-block;
	vertical-align: top;
}

/*新增图文*/
/*瀑布流样式*/
.waterfall {
	width: 100%;
	column-gap: 10px;
	column-count: 5;
	margin: 0 auto;
}

.waterfall-item {
	padding: 10px;
	margin-bottom: 10px;
	break-inside: avoid;
	border: 1px solid #eaeaea;
}

p {
	line-height: 30px;
}

@media (min-width: 992px) and (max-width: 1300px) {
	.waterfall {
		column-count: 3;
	}
	p {
		color: red;
	}
}

@media (min-width: 768px) and (max-width: 991px) {
	.waterfall {
		column-count: 2;
	}
	p {
		color: orange;
	}
}

@media (max-width: 767px) {
	.waterfall {
		column-count: 1;
	}
}

/*瀑布流样式*/
.news-main {
	background-color: #ffffff;
	width: 100%;
	margin: auto;
	height: 120px;
}

.news-content {
	background-color: #acadae;
	width: 100%;
	height: 120px;
	position: relative;
}

.news-content-title {
	display: inline-block;
	font-size: 15px;
	color: #ffffff;
	position: absolute;
	left: 0px;
	bottom: 0px;
	background-color: black;
	width: 98%;
	padding: 1%;
	opacity: 0.65;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	height: 25px;
}

.news-main-item {
	background-color: #ffffff;
	padding: 5px 0px;
	border-top: 1px solid #eaeaea;
	width: 100%;
	margin: auto;
}

.news-content-item {
	position: relative;
	margin-left: -3px;
}

.news-content-item-title {
	display: inline-block;
	font-size: 12px;
	width: 70%;
}

.news-content-item-img {
	display: inline-block;
	width: 25%;
	background-color: #acadae;
}

.input-tt {
	padding: 5px;
}

.activeAddNews {
	border: 5px solid #2bb673;
}

.news-main-plus {
	width: 280px;
	text-align: center;
	margin: auto;
	height: 50px;
}

.icon-plus {
	margin: 10px;
	font-size: 25px;
}

.select-item {
	width: 60%;
	padding: 10px;
	margin: 0 auto 10px auto;
	border: 1px solid #eaeaea;
}

.father .child {
	display: none;
	text-align: center;
	position: relative;
	bottom: 25px;
}

.father:hover .child {
	display: block;
}

.thumb-div {
	display: inline-block;
	width: 30%;
	text-align: center;
}

.thumb-but {
	display: flex;
	margin: 5px;
	justify-content: space-between;
}

.material-img {
	width: 100%;
	height: 100%;
}
</style>
