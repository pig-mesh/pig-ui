<template>
	<el-dialog :title="form.postId ? $t('common.editBtn') : $t('common.addBtn')" v-model="visible" :close-on-click-modal="false" draggable>
		<el-form ref="dataFormRef" :model="form" :rules="dataRules" label-width="90px">
			<el-row :gutter="20">
				<el-col :span="12" class="mb20">
					<el-form-item :label="t('post.postCode')" prop="postCode">
						<el-input v-model="form.postCode" :placeholder="t('post.inputpostCodeTip')" />
					</el-form-item>
				</el-col>
				<el-col :span="12" class="mb20">
					<el-form-item :label="t('post.postName')" prop="postName">
						<el-input v-model="form.postName" :placeholder="t('post.inputpostNameTip')" />
					</el-form-item>
				</el-col>
				<el-col :span="12" class="mb20">
					<el-form-item :label="t('post.postSort')" prop="postSort">
						<el-input-number v-model="form.postSort" :placeholder="t('post.inputpostSortTip')" />
					</el-form-item>
				</el-col>
				<el-col :span="12" class="mb20">
					<el-form-item :label="t('post.remark')" prop="remark">
						<el-input v-model="form.remark" :placeholder="t('post.inputremarkTip')" />
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="visible = false">{{ $t('common.cancelButtonText') }}</el-button>
				<el-button type="primary" @click="onSubmit">{{ $t('common.confirmButtonText') }}</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts" name="systemPostDialog">
// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);
import { useMessage } from '/@/hooks/message';
import { getObj, addObj, putObj } from '/@/api/admin/post';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false);

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
	postCode: [{ required: true, message: '岗位编码不能为空', trigger: 'blur' }],
	postName: [{ required: true, message: '岗位名称不能为空', trigger: 'blur' }],
	postSort: [{ required: true, message: '岗位排序不能为空', trigger: 'blur' }],
	remark: [{ required: true, message: '岗位描述不能为空', trigger: 'blur' }],
	delFlag: [{ required: true, message: '是否删除  -1：已删除  0：正常不能为空', trigger: 'blur' }],
	createTime: [{ required: true, message: '创建时间不能为空', trigger: 'blur' }],
	createBy: [{ required: true, message: '创建人不能为空', trigger: 'blur' }],
	updateTime: [{ required: true, message: '更新时间不能为空', trigger: 'blur' }],
	updateBy: [{ required: true, message: '更新人不能为空', trigger: 'blur' }],
	tenantId: [{ required: true, message: '租户ID不能为空', trigger: 'blur' }],
});

// 打开弹窗
const openDialog = (id: string) => {
	visible.value = true;
	form.postId = '';

	// 重置表单数据
	if (dataFormRef.value) {
		dataFormRef.value.resetFields();
	}

	// 获取Post信息
	if (id) {
		form.postId = id;
		getPostData(id);
	}
};

// 提交
const onSubmit = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false;
		}

		// 更新
		if (form.postId) {
			putObj(form)
				.then(() => {
					useMessage().success(t('common.editSuccessText'));
					visible.value = false; // 关闭弹窗
					emit('refresh');
				})
				.catch((err: any) => {
					useMessage().error(err.msg);
				});
		} else {
			addObj(form)
				.then(() => {
					useMessage().success(t('common.addSuccessText'));
					visible.value = false; // 关闭弹窗
					emit('refresh');
				})
				.catch((err: any) => {
					useMessage().error(err.msg);
				});
		}
	});
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
