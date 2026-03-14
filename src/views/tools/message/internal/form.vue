<template>
	<el-dialog :title="form.id ? $t('common.editBtn') : $t('common.addBtn')" v-model="visible" :close-on-click-modal="false" draggable>
		<el-form ref="dataFormRef" :model="form" :rules="dataRules" formDialogRef label-width="90px" v-loading="loading">
			<el-row :gutter="24">
				<el-col :span="12" class="mb20">
					<el-form-item :label="t('internal.category')" prop="category">
						<el-radio-group v-model="form.category">
							<el-radio :key="index" :label="item.value" border v-for="(item, index) in message_type">{{ item.label }} </el-radio>
						</el-radio-group>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item :label="t('internal.allFlag')" prop="allFlag">
						<el-radio-group v-model="form.allFlag">
							<el-radio :key="index" :label="item.value" border v-for="(item, index) in yes_no_type">{{ item.label }} </el-radio>
						</el-radio-group>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item :label="t('internal.title')" prop="title">
						<el-input v-model="form.title" :placeholder="t('internal.inputTitleTip')" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item prop="sort">
						<template #label
							>{{ t('internal.sort') }}
							<tip :content="t('internal.sortTip')" />
						</template>
						<el-input-number v-model="form.sort" :placeholder="t('internal.inputSortTip')" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20" v-if="form.allFlag !== '1'">
					<el-form-item prop="allFlag">
						<template #label
							>{{ t('internal.scope') }}
							<tip :content="t('internal.scopeTip')" />
						</template>
						<!-- 组织架构   -->
						<org-selector v-model:orgList="form.userList" type="user" :multiple="true" />
					</el-form-item>
				</el-col>

				<el-col :span="24" class="mb20">
					<el-form-item :label="t('internal.content')" prop="content">
						<editor v-if="visible" v-model:get-html="form.content" :placeholder="t('internal.inputContentTip')"></editor>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="visible = false">{{ $t('common.cancelButtonText') }}</el-button>
				<el-button type="primary" @click="onSubmit" :disabled="loading">{{ $t('common.confirmButtonText') }}</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts" name="SysMessageDialog">
import orgSelector from '/@/components/OrgSelector/index.vue';
import { useDict } from '/@/hooks/dict';
import { useMessage } from '/@/hooks/message';
import { addObj, getObj, putObj } from '/@/api/admin/message';
import { useI18n } from 'vue-i18n';

const emit = defineEmits(['refresh']);
const { t } = useI18n();
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);
const { yes_no_type, message_type } = useDict('yes_no_type', 'message_type');

const form = reactive({
	id: '',
	category: '0',
	title: '',
	content: '',
	allFlag: '0',
	sort: 0,
	userList: [] as any,
});

const dataRules = computed(() => ({
	category: [{ required: true, message: t('internal.categoryRequired'), trigger: 'blur' }],
	title: [{ required: true, message: t('internal.titleRequired'), trigger: 'blur' }],
	content: [{ required: true, message: t('internal.contentRequired'), trigger: 'blur' }],
	allFlag: [{ required: true, message: t('internal.allFlagRequired'), trigger: 'blur' }],
	sort: [{ required: true, message: t('internal.sortRequired'), trigger: 'blur' }],
}));

const openDialog = async (id: string): Promise<void> => {
	visible.value = true;
	form.id = '';
	form.content = '';

	nextTick(() => {
		dataFormRef.value?.resetFields();
	});

	if (id) {
		form.id = id;
		await getSysMessageData(id);
	}
};

const onSubmit = async (): Promise<void> => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return;

	try {
		loading.value = true;
		form.id ? await putObj(form) : await addObj(form);
		useMessage().success(form.id ? t('common.editSuccessText') : t('common.addSuccessText'));
		visible.value = false;
		emit('refresh');
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};

const getSysMessageData = async (id: string): Promise<void> => {
	loading.value = true;
	try {
		const { data } = await getObj(id);
		Object.assign(form, data);
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};

defineExpose({
	openDialog,
});
</script>

