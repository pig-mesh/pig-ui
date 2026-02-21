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
		<div class="inline-block w-[35%] align-top mt-[200px]">
			<div class="w-3/5 p-2.5 mx-auto mb-2.5 border border-gray-200 rounded-lg">
				<div v-for="(news, index) in articlesAdd" :key="news.id">
					<div v-if="index == 0" class="group relative w-full h-[120px] bg-white cursor-pointer" :class="{ 'ring-2 ring-green-500': isActiveAddNews === index }" @click="activeNews(index)">
						<div class="relative w-full h-[120px] bg-gray-400">
							<img v-if="news.thumbUrl" class="w-full h-full object-cover" :src="news.thumbUrl" />
							<div class="absolute left-0 bottom-0 w-[98%] p-[1%] text-[15px] text-white bg-black/65 truncate h-[25px]">{{ news.title }}</div>
						</div>
						<div v-if="articlesAdd.length > 1" class="hidden group-hover:block text-center relative bottom-[25px]">
							<el-button icon="top" @click="downNews(index)">下移</el-button>
							<el-button v-if="operateMaterial == 'add'" icon="delete" @click="minusNews(index)">删除 </el-button>
						</div>
					</div>
					<div v-if="index > 0" class="group relative w-full py-1.5 border-t border-gray-200 bg-white cursor-pointer" :class="{ 'ring-2 ring-green-500': isActiveAddNews === index }" @click="activeNews(index)">
						<div class="relative -ml-0.5 flex items-center justify-between">
							<div class="text-xs w-[70%]">{{ news.title }}</div>
							<div class="w-1/4 bg-gray-400">
								<img v-if="news.thumbUrl" class="w-full h-full object-cover" :src="news.thumbUrl" />
							</div>
						</div>
						<div class="hidden group-hover:block text-center relative bottom-[25px]">
							<el-button v-if="articlesAdd.length > index + 1" icon="sort-down" @click="downNews(index)">下移 </el-button>
							<el-button icon="sort-up" @click="upNews(index)">上移</el-button>
							<el-button v-if="operateMaterial == 'add'" icon="delete" @click="minusNews(index)">删除 </el-button>
						</div>
					</div>
				</div>
				<div v-if="articlesAdd.length < 8 && operateMaterial == 'add'" class="w-[280px] h-[50px] text-center mx-auto cursor-pointer hover:text-green-500" @click="plusNews">
					<el-icon class="m-2.5 text-2xl"><Plus /></el-icon>
				</div>
			</div>
		</div>
		<div v-loading="addMaterialLoading" class="inline-block w-3/5 -mt-10 align-top">
			<!--富文本编辑器组件-->
			<el-row>
				<editor v-model:get-html="articlesAdd[isActiveAddNews].content" class="mt-5"></editor>
			</el-row>
			<div class="mt-16 py-1.5 font-medium text-gray-700">封面和摘要：</div>
			<div>
				<div class="inline-block w-[30%] text-center align-top">
					<img
						v-if="articlesAdd[isActiveAddNews].thumbUrl"
						class="object-cover rounded"
						:src="articlesAdd[isActiveAddNews].thumbUrl"
						:class="isActiveAddNews === 0 ? 'w-[230px] h-[120px]' : 'w-[120px] h-[120px]'"
					/>
					<i v-else class="el-icon-plus border border-dashed border-gray-300 text-[28px] text-gray-400 leading-[120px] text-center" :class="isActiveAddNews === 0 ? 'w-[230px] h-[120px]' : 'w-[120px] h-[120px]'"></i>
					<div class="flex justify-between m-1.5">
						<wx-file-upload :uploadData="uploadData" @success="handleImageChange"></wx-file-upload>
						<el-button type="primary" @click="openMaterial">素材库选择</el-button>
					</div>
				</div>
				<el-input
					v-model="articlesAdd[isActiveAddNews].digest"
					:rows="6"
					type="textarea"
					placeholder="请输入摘要"
					class="!w-3/5 !inline-block align-top"
					maxlength="120"
				></el-input>
			</div>
			<div class="py-1.5 font-medium text-gray-700">标题：</div>
			<el-input v-model="articlesAdd[isActiveAddNews].title" placeholder="请输入标题"></el-input>
			<div class="py-1.5 font-medium text-gray-700">作者：</div>
			<el-input v-model="articlesAdd[isActiveAddNews].author" placeholder="请输入作者"></el-input>
			<div class="py-1.5 font-medium text-gray-700">原文地址：</div>
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

const emit = defineEmits(['ok']);

const dialogNewsClose = () => {
	useMessageBox()
		.confirm('修改内容可能还未保存，确定关闭吗?')
		.then(() => {
			dialogNewsVisible.value = false;
		});
};

const accountId = ref();

const emptyArticle = () => ({
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

const articlesAdd = ref([emptyArticle()]);
const isActiveAddNews = ref(0);
const articlesMediaId = ref();

const openDialog = (data: any, item?: any, mediaId?: any, type: any = 'add') => {
	accountId.value = data.accountId;
	uploadData.appId = data.accountId;

	dialogNewsVisible.value = true;
	operateMaterial.value = type;

	if (item) {
		articlesAdd.value = item;
	}
	if (mediaId) {
		articlesMediaId.value = mediaId;
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

const resetAfterSubmit = () => {
	dialogNewsVisible.value = false;
	isActiveAddNews.value = 0;
	articlesAdd.value = [emptyArticle()];
	emit('ok');
};

const onSubmit = () => {
	addMaterialLoading.value = true;
	const payload = operateMaterial.value === 'add'
		? addObj({ articles: articlesAdd.value, appId: accountId.value })
		: materialNewsUpdate({ articles: articlesAdd.value, mediaId: articlesMediaId.value, appId: accountId.value });

	payload
		.then(() => {
			resetAfterSubmit();
		})
		.finally(() => {
			addMaterialLoading.value = false;
		});
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
	articlesAdd.value.push(emptyArticle());
	isActiveAddNews.value = articlesAdd.value.length - 1;
};

const downNews = (index) => {
	const temp = articlesAdd.value[index];
	articlesAdd.value[index] = articlesAdd.value[index + 1];
	articlesAdd.value[index + 1] = temp;
	isActiveAddNews.value = index + 1;
};

const upNews = (index) => {
	const temp = articlesAdd.value[index];
	articlesAdd.value[index] = articlesAdd.value[index - 1];
	articlesAdd.value[index - 1] = temp;
	isActiveAddNews.value = index - 1;
};

defineExpose({
	openDialog,
});
</script>
