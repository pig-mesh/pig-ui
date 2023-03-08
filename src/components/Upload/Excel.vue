<!-- excel 导入组件 -->
<template>
	<el-dialog :title="prop.title" v-model="state.upload.open" :close-on-click-modal="false" draggable>
		<el-upload
			ref="uploadRef"
			:limit="1"
			accept=".xlsx, .xls"
			:headers="headers"
			:action="url"
			:disabled="state.upload.isUploading"
			:on-progress="handleFileUploadProgress"
			:on-success="handleFileSuccess"
			:on-error="handleFileError"
			:auto-upload="false"
			drag
		>
			<i class="el-icon-upload"></i>
			<div class="el-upload__text">
				{{ $t('excel.operationNotice') }}
				<em>{{ $t('excel.clickUpload') }}</em>
			</div>
			<template #tip>
				<div class="el-upload__tip text-center">
					<span>{{ $t('excel.fileFormat') }}</span>
					<el-link type="primary" :underline="false" style="font-size: 12px; vertical-align: baseline" @click="downExcelTemp" v-if="tempUrl"
						>{{ $t('excel.downloadTemplate') }}
					</el-link>
				</div>
			</template>
		</el-upload>
		<template #footer>
			<el-button type="primary" @click="submitFileForm">{{ $t('common.confirmButtonText') }}</el-button>
			<el-button @click="state.upload.open = false">{{ $t('common.cancelButtonText') }}</el-button>
		</template>
	</el-dialog>

	<!--校验失败错误数据-->
	<el-dialog :title="$t('common.validationFailureData')" v-model="state.errorVisible">
		<el-table :data="state.errorData">
			<el-table-column property="lineNum" :label="$t('common.lineNumbers')" width="100"></el-table-column>
			<el-table-column property="errors" :label="$t('common.misDescription')" show-overflow-tooltip>
				<template v-slot="scope">
					<el-tag type="danger" v-for="error in scope.row.errors" :key="error">{{ error }} </el-tag>
				</template>
			</el-table-column>
		</el-table>
	</el-dialog>
</template>

<script setup lang="ts" name="upload-excel">
import { useMessage } from '/@/hooks/message';
import other from '/@/utils/other';
import { Session } from '/@/utils/storage';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const emit = defineEmits(['sizeChange', 'refreshDataList']);
const prop = defineProps({
	url: {
		type: String,
	},
	title: {
		type: String,
	},
	tempUrl: {
		type: String,
	},
});

const uploadRef = ref();

const state = reactive({
	errorVisible: false,
	errorData: [],
	dialog: {
		title: '',
		isShowDialog: false,
	},
	upload: {
		open: false,
		isUploading: false,
	},
});

const downExcelTemp = () => {
	other.downBlobFile(prop.tempUrl, {}, 'temp.xlsx');
};

const handleFileUploadProgress = () => {
	state.upload.isUploading = true;
};

const handleFileError = () => {
	useMessage().error('上传失败,数据格式不合法!');
	state.upload.open = false;
};
const handleFileSuccess = (response: any) => {
	state.upload.isUploading = false;
	state.upload.open = false;
	uploadRef.value.clearFiles();

	// 校验失败
	if (response.code === 1) {
		useMessage().error('导入失败，以下数据不合法');
		state.errorVisible = true;
		state.errorData = response.data;
		uploadRef.value.clearFiles();
		// 刷新表格
		emit('refreshDataList');
	} else {
		useMessage().success(response.msg ? response.msg : '导入成功');
		// 刷新表格
		emit('refreshDataList');
	}
};
const submitFileForm = () => {
	uploadRef.value.submit();
};
const show = () => {
	state.upload.isUploading = false;
	state.upload.open = true;
};

const headers = computed(() => {
	return {
		Authorization: 'Bearer ' + Session.getToken(),
		'TENANT-ID': Session.getTenant(),
	};
});

// 暴露变量
defineExpose({
	show,
});
</script>

<style scoped></style>
