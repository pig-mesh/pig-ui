<template>
	<div class="layout-padding">
		<splitpanes>
			<pane size="20">
				<div class="layout-padding-auto layout-padding-view">
					<el-scrollbar>
						<query-tree class="mt-2.5" :query="deptData.queryList" @node-click="handleNodeClick" placeholder="请输入微信公众号名称" />
					</el-scrollbar>
				</div>
			</pane>
			<pane size="80">
				<div class="layout-padding-auto layout-padding-view">
					<el-tabs v-model="materialType" @tab-click="handleClick">
						<el-tab-pane name="image" label="image">
							<template #label><i class="picture"></i> 图片</template>
							<div class="p-2.5">
								<wx-file-upload
									@success="getDataList"
									:uploadData="uploadData"
									:type="['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/jpg']"
								></wx-file-upload>
							</div>
							<div v-loading="state.loading" class="w-full columns-5 gap-2.5 max-xl:columns-3 max-lg:columns-2 max-md:columns-1">
								<div v-for="item in state.dataList" :key="item.id" class="p-2.5 mb-2.5 break-inside-avoid border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
									<a target="_blank" :href="item.url">
										<img class="w-full h-full rounded" :src="item.url" />
										<div class="text-xs text-center truncate mt-1 text-gray-600">{{ item.name }}</div>
									</a>
									<div class="mt-1.5 text-center border-t border-gray-200 pt-1.5">
										<el-button type="danger" icon="delete" circle size="small" @click="delMaterial(item)"></el-button>
									</div>
								</div>
							</div>
							<el-empty v-if="state.dataList.length <= 0 && !state.loading" description="暂无数据" />
							<pagination v-bind="state.pagination" @size-change="sizeChangeHandle" @current-change="currentChangeHandle" />
						</el-tab-pane>
						<el-tab-pane name="voice" label="voice">
							<template #label><i class="microphone"></i> 语音</template>
							<div class="p-2.5">
								<wx-file-upload @success="getDataList" :uploadData="uploadData" :type="['mp3', 'wma', 'wav', 'amr']"></wx-file-upload>
							</div>
							<el-table v-loading="state.loading" :data="state.dataList" stripe border max-height="600px">
								<el-table-column prop="mediaId" label="media_id"> </el-table-column>
								<el-table-column prop="name" label="名称"> </el-table-column>
								<el-table-column prop="updateTime" label="更新时间"> </el-table-column>
								<el-table-column fixed="right" label="操作">
									<template v-slot="scope">
										<el-button text icon="download" type="primary" @click="handleDown(scope.row)">下载 </el-button>
										<el-button text icon="delete" type="danger" @click="delMaterial(scope.row)">删除 </el-button>
									</template>
								</el-table-column>
							</el-table>
							<pagination v-bind="state.pagination" @size-change="sizeChangeHandle" @current-change="currentChangeHandle" />
						</el-tab-pane>
						<el-tab-pane name="video" label="video">
							<template #label><i class="video-play"></i> 视频</template>
							<div class="p-2.5">
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
										<el-button text icon="view" type="primary" @click="handleInfo(scope.row)">查看 </el-button>
										<el-button text icon="delete" type="danger" @click="delMaterial(scope.row)">删除 </el-button>
									</template>
								</el-table-column>
							</el-table>
							<pagination v-bind="state.pagination" @size-change="sizeChangeHandle" @current-change="currentChangeHandle" />
						</el-tab-pane>
						<el-tab-pane name="news" label="news">
							<template #label><i class="news"></i> 图文</template>
							<div class="p-2.5">
								<el-button type="primary" @click="handleAddNews">新 增</el-button>
							</div>
							<news-form ref="dialogNewsRef" @ok="getDataList"></news-form>
							<div v-loading="state.loading" class="w-full columns-5 gap-2.5 max-xl:columns-3 max-lg:columns-2 max-md:columns-1">
								<div v-for="item in state.dataList" :key="item.id">
									<div v-if="item.content && item.content.newsItem" class="p-2.5 mb-2.5 break-inside-avoid border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
										<wx-news :obj-data="item.content.newsItem"></wx-news>
										<div class="mt-1.5 text-center border-t border-gray-200 pt-1.5 space-x-2">
											<el-button type="primary" icon="edit" circle size="small" @click="handleEditNews(item)"></el-button>
											<el-button type="danger" icon="delete" circle size="small" @click="delMaterial(item)"></el-button>
										</div>
									</div>
								</div>
							</div>
							<el-empty v-if="state.dataList.length <= 0 && !state.loading" description="暂无数据" />
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
	queryList: (name?: string) => {
		return fetchAccountList({ name });
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

const handleNodeClick = (data: any) => {
	checkAppId.value = data.appid;
	uploadData.value.appId = data.appid;
	state.queryForm.appId = data.appid;
	state.queryForm.type = materialType.value;
	getDataList();
};

const handleClick = (tab) => {
	if (!checkAppId.value) {
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

const dialogVideoVisible = ref(false);
const addMaterialLoading = ref(false);
const uploadForm = ref();
const uploadFileVideo = ref();

const handleAddVideo = () => {
	dialogVideoVisible.value = true;
};

const uploadRules = reactive({
	title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
	introduction: [{ required: true, message: '请输入描述', trigger: 'blur' }],
});

const subVideo = async () => {
	try {
		await uploadForm.value.validate();
		uploadFileVideo.value.submit().then(() => {
			dialogVideoVisible.value = false;
		});
	} catch {
		return false;
	}
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

const dialogNewsRef = ref();

const handleAddNews = () => {
	dialogNewsRef.value.openDialog({
		accountId: checkAppId.value,
	});
};

const handleEditNews = (item) => {
	dialogNewsRef.value.openDialog(
		{ accountId: checkAppId.value },
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
			window.open(response.data.downUrl, '_blank');
		})
		.catch((err) => {
			useMessage().error(err.msg);
		});
};

onMounted(async () => {
	const { data } = await deptData.queryList();
	if (data?.length > 0) {
		handleNodeClick(data[0]);
	}
});
</script>
