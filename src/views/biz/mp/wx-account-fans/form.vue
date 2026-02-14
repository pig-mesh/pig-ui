<template>
	<el-dialog v-model="visible" :close-on-click-modal="false" :title="form.id ? $t('common.editBtn') : $t('common.addBtn')" draggable>
		<el-form ref="dataFormRef" v-loading="loading" :model="form" :rules="dataRules" label-width="90px">
			<el-row :gutter="24">
				<el-col :span="12" class="mb20">
					<el-form-item :label="t('fans.wxAccountName')" prop="wxAccountName">
						<el-input v-model="form.wxAccountName" disabled />
					</el-form-item>
				</el-col>
				<el-col :span="12" class="mb20">
					<el-form-item :label="t('fans.wxAccountAppid')" prop="wxAccountAppid">
						<el-input v-model="form.wxAccountAppid" disabled />
					</el-form-item>
				</el-col>
				<el-col :span="12" class="mb20">
					<el-form-item :label="t('fans.openid')" prop="openid">
						<el-input v-model="form.openid" disabled />
					</el-form-item>
				</el-col>
				<el-col :span="12" class="mb20">
					<el-form-item :label="t('fans.nickname')" prop="nickname">
						<el-input v-model="form.nickname" disabled />
					</el-form-item>
				</el-col>
				<el-col :span="12" class="mb20">
					<el-form-item :label="t('fans.remark')" prop="remark">
						<el-input v-model="form.remark" :placeholder="t('fans.inputremarkTip')" />
					</el-form-item>
				</el-col>
				<el-col :span="12" class="mb20">
					<el-form-item :label="t('fans.tagIds')" prop="tagIds">
						<el-select v-model="form.tagIds" :placeholder="t('fans.inputTagTip')" clearable multiple>
							<el-option v-for="item in tagOption" :key="item.tagId" :label="item.tag" :value="item.tagId" />
						</el-select>
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

<script lang="ts" name="wx-fans" setup>
import { addObj, getObj, putObj } from '/@/api/mp/wx-account-fans';
import { list } from '/@/api/mp/wx-account-tag';
import { useMessage } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const emit = defineEmits(['refresh']);

const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);
const wxAccountAppid = ref();

const form = reactive({
	id: '',
});

const dataRules = ref([]);

const openDialog = (row: any, accountId: string) => {
	visible.value = true;
	form.id = row.id;
	wxAccountAppid.value = accountId;

	if (dataFormRef.value) {
		dataFormRef.value.resetFields();
	}

	if (form.id) {
		getFansData();
	}
	getTagList();
};

const getFansData = () => {
	loading.value = true;
	getObj(form.id)
		.then((res) => {
			Object.assign(form, res.data);
		})
		.finally(() => {
			loading.value = false;
		});
};

const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;

	loading.value = true;
	try {
		if (form.id) {
			await putObj(form);
			useMessage().success(t('common.editSuccessText'));
		} else {
			await addObj(form);
			useMessage().success(t('common.addSuccessText'));
		}
		visible.value = false;
		emit('refresh');
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};

const tagOption = ref([]);
const getTagList = () => {
	list(wxAccountAppid.value).then((res) => {
		tagOption.value = res.data;
	});
};

defineExpose({
	openDialog,
});
</script>
