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
			<pane size="80">
				<div class="layout-padding-auto layout-padding-view">
					<el-tabs v-model="materialType" @tab-click="handleClick">
						<el-tab-pane name="image" label="image">
							<template #label><i class="el-icon-picture"></i> 图片</template>
							<div class="add_but">
								<wx-file-upload
									@success="getDataList"
									:uploadData="uploadData"
									:type="['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/jpg']"
								></wx-file-upload>
							</div>
							<div v-loading="state.loading" class="waterfall">
								<div v-for="item in state.dataList" :key="item.id" class="waterfall-item">
									<a target="_blank" :href="item.url">
										<img class="material-img" :src="item.url" />
										<div class="item-name">{{ item.name }}</div>
									</a>
									<el-row class="ope-row">
										<el-button type="danger" icon="el-icon-delete" circle @click="delMaterial(item)"></el-button>
									</el-row>
								</div>
							</div>
							<div v-if="state.dataList.length <= 0 && !state.loading" class="el-table__empty-block">
								<span class="el-table__empty-text">暂无数据</span>
							</div>
							<pagination v-bind="state.pagination" @size-change="sizeChangeHandle" @current-change="currentChangeHandle" />
						</el-tab-pane>
						<el-tab-pane name="voice" label="voice">
							<template #label><i class="el-icon-microphone"></i> 语音</template>
							<div class="add_but">
								<wx-file-upload @success="getDataList" :uploadData="uploadData" :type="['mp3', 'wma', 'wav', 'amr']"></wx-file-upload>
							</div>
							<el-table v-loading="state.loading" :data="state.dataList" stripe border max-height="600px">
								<el-table-column prop="mediaId" label="media_id"> </el-table-column>
								<el-table-column prop="name" label="名称"> </el-table-column>
								<el-table-column prop="updateTime" label="更新时间"> </el-table-column>
								<el-table-column fixed="right" label="操作">
									<template v-slot="scope">
										<el-button type="text" icon="el-icon-download" plain @click="handleDown(scope.row)">下载 </el-button>
										<el-button type="text" icon="el-icon-delete" plain @click="delMaterial(scope.row)">删除 </el-button>
									</template>
								</el-table-column>
							</el-table>
							<pagination v-bind="state.pagination" @size-change="sizeChangeHandle" @current-change="currentChangeHandle" />
						</el-tab-pane>
						<el-tab-pane name="video" label="video">
							<template #label><i class="el-icon-video-play"></i> 视频</template>
							<div class="add_but">
								<el-button type="primary" @click="handleAddVideo">新建</el-button>
							</div>
							<el-dialog title="新建视频" v-model="dialogVideoVisible">
								<wx-file-upload
									@success="getDataList"
									:uploadData="uploadData"
									:auto-upload="false"
									ref="uploadFileVideo"
									:type="['video/mp4']"
								></wx-file-upload>
								<el-form ref="uploadForm" :model="uploadData" v-loading="addMaterialLoading" :rules="uploadRules">
									<el-form-item label="标题" prop="title">
										<el-input v-model="uploadData.title" placeholder="标题将展示在相关播放页面，建议填写清晰、准确、生动的标题"></el-input>
									</el-form-item>
									<el-form-item label="描述" prop="introduction">
										<el-input
											v-model="uploadData.introduction"
											:rows="3"
											type="textarea"
											placeholder="介绍语将展示在相关播放页面，建议填写简洁明确、有信息量的内容"
										></el-input>
									</el-form-item>
								</el-form>
								<template #footer>
									<el-button @click="dialogVideoVisible = false">取 消</el-button>
									<el-button type="primary" @click="subVideo">提 交</el-button>
								</template>
							</el-dialog>
							<el-table
								v-loading="state.loading"
								:data="state.dataList"
								stripe
								border
								max-height="600px"
								:cell-style="tableStyle.cellStyle"
								:header-cell-style="tableStyle.headerCellStyle"
							>
								<el-table-column prop="mediaId" label="media_id"> </el-table-column>
								<el-table-column prop="name" label="名称"> </el-table-column>
								<el-table-column prop="updateTime" label="更新时间"> </el-table-column>
								<el-table-column fixed="right" label="操作">
									<template v-slot="scope">
										<el-button type="text" icon="el-icon-view" @click="handleInfo(scope.row)">查看 </el-button>
										<el-button type="text" icon="el-icon-delete" @click="delMaterial(scope.row)">删除 </el-button>
									</template>
								</el-table-column>
							</el-table>
							<pagination v-bind="state.pagination" @size-change="sizeChangeHandle" @current-change="currentChangeHandle" />
						</el-tab-pane>
						<el-tab-pane name="news" label="news">
							<template #label><i class="el-icon-news"></i> 图文</template>
							<div class="add_but">
								<el-button type="primary" @click="handleAddNews">新 增</el-button>
							</div>
							<news-form ref="dialogNewsRef" @ok="getDataList"></news-form>
							<div v-loading="state.loading" class="waterfall">
								<div v-for="item in state.dataList" :key="item.id" class="waterfall-item">
									<wx-news :obj-data="item.content.newsItem"></wx-news>
									<el-row class="ope-row">
										<el-button type="primary" icon="el-icon-edit" circle @click="handleEditNews(item)"></el-button>
										<el-button type="danger" icon="el-icon-delete" circle @click="delMaterial(item)"></el-button>
									</el-row>
								</div>
							</div>
							<div v-if="state.dataList.length <= 0 && !state.loading" class="el-table__empty-block">
								<span class="el-table__empty-text">暂无数据</span>
							</div>
						</el-tab-pane>
					</el-tabs>
				</div>
			</pane>
		</splitpanes>
	</div>
</template>

<script setup lang="ts" name="wx-material">
import { fetchAccountList } from '/@/api/mp/wx-account';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { delObj, getMaterialOther, getMaterialVideo, getPage } from '/@/api/mp/wx-material';

const QueryTree = defineAsyncComponent(() => import('/@/components/QueryTree/index.vue'));
const NewsForm = defineAsyncComponent(() => import('./components/news-form.vue'));
const WxFileUpload = defineAsyncComponent(() => import('/@/components/Wechat/fileUpload/index.vue'));
const WxNews = defineAsyncComponent(() => import('/@/components/Wechat/wx-news/index.vue'));

const deptData = reactive({
	queryList: (name: string) => {
		return fetchAccountList({
			name: name,
		});
	},
});

const checkAppId = ref();

const uploadData = ref({
	appId: '',
	mediaType: 'image',
	title: '',
	introduction: '',
});

const materialType = ref('image');

// 点击树
const handleNodeClick = (data: any) => {
	checkAppId.value = data.appid;
	uploadData.value.appId = data.appid;
	state.queryForm.appId = data.appid;
	state.queryForm.type = materialType.value;
	getDataList();
};

const handleClick = (tab) => {
	if (checkAppId.value) {
		// getPage(this.page)
	} else {
		useMessage().error('请选择公众号');
	}
	materialType.value = tab.paneName;
	uploadData.value.mediaType = tab.paneName;
	state.queryForm.type = materialType.value;
	getDataList();
};

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		appId: '',
		type: '',
	},
	pageList: getPage,
	createdIsNeed: false,
	props: {
		item: 'items',
		totalCount: 'totalCount',
	},
});

const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

const delMaterial = (item: any) => {
	useMessageBox()
		.confirm('此操作将永久删除该文件, 是否继续?')
		.then(() => {
			delObj({
				id: item.mediaId,
				appId: checkAppId.value,
			})
				.then(() => {
					getDataList();
				})
				.catch((err) => {
					useMessage().error(err.msg);
				});
		});
};

// 视频

const dialogVideoVisible = ref(false);

const addMaterialLoading = ref(false);

const handleAddVideo = () => {
	dialogVideoVisible.value = true;
};

const uploadRules = reactive({
	title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
	introduction: [{ required: true, message: '请输入描述', trigger: 'blur' }],
});

const uploadForm = ref();

const uploadFileVideo = ref();

const subVideo = () => {
	uploadForm.value.validate((valid: boolean) => {
		if (!valid) {
			return false;
		}
		uploadFileVideo.value.submit().then(() => {
			dialogVideoVisible.value = false;
		});
	});
};

const handleDown = (row: any) => {
	getMaterialOther({
		mediaId: row.mediaId,
		fileName: row.name,
		appId: checkAppId.value,
	}).then((response) => {
		const url = window.URL.createObjectURL(new Blob([response.data]));
		const link = document.createElement('a');
		link.style.display = 'none';
		link.href = url;
		link.setAttribute('download', row.name);
		document.body.appendChild(link);
		link.click();
	});
};

// 图文

const dialogNewsRef = ref();

const handleAddNews = () => {
	dialogNewsRef.value.openDialog({
		accountId: checkAppId.value,
	});
};

const handleEditNews = (item) => {
	dialogNewsRef.value.openDialog(
		{
			accountId: checkAppId.value,
		},
		JSON.parse(JSON.stringify(item.content.newsItem)),
		item.mediaId,
		'edit'
	);
};

const handleInfo = (row) => {
	getMaterialVideo({
		mediaId: row.mediaId,
		appId: checkAppId.value,
	})
		.then((response) => {
			const downUrl = response.data.downUrl;
			window.open(downUrl, '_blank');
		})
		.catch((err) => {
			useMessage().error(err.msg);
		});
};
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
	margin: 5px;
}

.material-img {
	width: 100%;
	height: 100%;
}
</style>
