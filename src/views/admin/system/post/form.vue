<template>
	<el-dialog :title="form.postId ? $t('common.editBtn') : $t('common.addBtn')" v-model="visible" width="600" :close-on-click-modal="false" draggable>
		<el-form ref="dataFormRef" :model="form" :rules="dataRules" label-width="90px" v-loading="loading">
			<el-form-item :label="t('post.postCode')" prop="postCode">
				<el-input v-model="form.postCode" :placeholder="t('post.inputpostCodeTip')" />
			</el-form-item>
			<el-form-item :label="t('post.postName')" prop="postName">
				<el-input v-model="form.postName" :placeholder="t('post.inputpostNameTip')" />
			</el-form-item>
			<el-form-item :label="t('post.postSort')" prop="postSort">
				<el-input-number v-model="form.postSort" :placeholder="t('post.inputpostSortTip')" />
			</el-form-item>
			<el-form-item :label="t('post.remark')" prop="remark">
				<el-input type="textarea" maxlength="100" row="3" v-model="form.remark" :placeholder="t('post.inputremarkTip')" />
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="visible = false">{{ $t('common.cancelButtonText') }}</el-button>
				<el-button type="primary" @click="onSubmit" :disabled="loading">{{ $t('common.confirmButtonText') }}</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts" name="systemPostDialog">
import { useMessage } from '/@/hooks/message';
import { getObj, addObj, putObj, validatePostCode, validatePostName } from '/@/api/admin/post';
import { useI18n } from 'vue-i18n';

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

const { t } = useI18n();

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);

// 提交表单数据
const form = reactive({
	postId: '',
	postCode: '',
	postName: '',
	postSort: 0,
	remark: '',
	delFlag: '',
	createTime: '',
	createBy: '',
	updateTime: '',
	updateBy: '',
});

// 定义校验规则
const dataRules = ref({
	postCode: [
		{ required: true, message: '岗位编码不能为空', trigger: 'blur' },
		{
			validator: (rule: any, value: any, callback: any) => {
				validatePostCode(rule, value, callback, form.postId !== '');
			},
			trigger: 'blur',
		},
	],
	postName: [
		{ required: true, message: '岗位名称不能为空', trigger: 'blur' },
		{
			validator: (rule: any, value: any, callback: any) => {
				validatePostName(rule, value, callback, form.postId !== '');
			},
			trigger: 'blur',
		},
	],
	postSort: [{ required: true, message: '岗位排序不能为空', trigger: 'blur' }],
	remark: [{ required: true, message: '岗位描述不能为空', trigger: 'blur' }],
});

// 打开弹窗
const openDialog = (id: string) => {
	visible.value = true;
	form.postId = '';

	// 重置表单数据
	nextTick(() => {
		dataFormRef.value?.resetFields();
	});

	// 获取Post信息
	if (id) {
		form.postId = id;
		getPostData(id);
	}
};

// 提交
const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;

	try {
		loading.value = true;
		form.postId ? await putObj(form) : await addObj(form);
		useMessage().success(t(form.postId ? 'common.editSuccessText' : 'common.addSuccessText'));
		visible.value = false;
		emit('refresh');
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};

// 初始化表格数据
const getPostData = (id: string) => {
	// 获取部门数据
	getObj(id).then((res: any) => {
		Object.assign(form, res.data);
	});
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>
