<!--图片上传组件-->

<template>
	<div>
		<el-upload
			ref="fileUpload"
			class="avatar-uploader"
			:action="other.adaptationUrl(props.uploadFileUrl)"
			:show-file-list="false"
			:on-success="handleAvatarSuccess"
			:before-upload="beforeAvatarUpload"
			:headers="headers"
			:limit="props.limit"
		>
			<slot>
				<img v-if="imageUrl" :src="imageUrl" class="avatar" />
				<el-icon v-else class="avatar-uploader-icon">
					<Plus />
				</el-icon>
			</slot>
		</el-upload>
	</div>
</template>

<script setup lang="ts" name="upload-image">
import { useMessage } from '/@/hooks/message';
import { Session } from '/@/utils/storage';
import { watch } from 'vue';
import other from '/@/utils/other';

const imageUrl = ref('');
const fileUpload = ref();
const emit = defineEmits(['update:modelValue', 'change']);

const props = defineProps({
	modelValue: [String, Array],
	// 大小限制(MB)
	fileSize: {
		type: Number,
		default: 5,
	},
	limit: {
		type: Number,
		default: 1,
	},
	uploadFileUrl: {
		type: String,
		default: '/admin/sys-file/upload',
	},
});

// 监听 modelValue 的变化，使 imageUrl 与 modelValue 同步
watch(
	() => props.modelValue,
	(val: string) => {
		if (val) {
			imageUrl.value = val;
		}
	},
	{ deep: true, immediate: true }
);

// 上传成功事件处理
const handleAvatarSuccess = (res, file) => {
	if (res.code === 0) {
		imageUrl.value = res.data.url;
		emit('change', imageUrl.value);
		emit('update:modelValue', imageUrl.value);
	} else {
		fileUpload.value.handleRemove(file);
	}
};

// 上传前校验
const beforeAvatarUpload = (rawFile: any) => {
	// 校检文件格式
	if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
		useMessage().error(`文件格式不正确, 请上传 jpeg/png格式文件!`);
		return false;
	}
	// 校检文件大小
	if (props.fileSize) {
		const isLt = rawFile.size / 1024 / 1024 < props.fileSize;
		if (!isLt) {
			useMessage().error(`上传文件大小不能超过 ${props.fileSize} MB!`);
			return false;
		}
	}
	return true;
};

// 计算请求头部信息
const headers = computed(() => {
	const tenantId = Session.getTenant();
	return {
		Authorization: 'Bearer ' + Session.getToken(),
		'TENANT-ID': tenantId,
	};
});
</script>

<style scoped>
.avatar-uploader .el-upload {
	border: 1px dashed var(--el-border-color);
	border-radius: 6px;
	cursor: pointer;
	position: relative;
	overflow: hidden;
	transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
	border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
	font-size: 28px;
	color: #8c939d;
	width: 178px;
	height: 178px;
	text-align: center;
}

.avatar {
	width: 178px;
	height: 100%;
}
</style>
