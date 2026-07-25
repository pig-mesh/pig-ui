<script setup lang="ts" name="SysAreaDialog">
import { addObj, checkAdcodeExists, getObj, putObj } from '/@/api/admin/sysArea';
import { useDict } from '/@/hooks/dict';
import { useMessage } from '/@/hooks/message';
import { rule } from '/@/utils/validate';
import { Location } from '@element-plus/icons-vue';
import type { FormInstance } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { createAreaTypeOptions } from './components/areaTypes';

interface AreaParentContext {
	adcode: string | number;
	name: string;
	areaType: string;
}

interface AreaForm {
	id: string;
	pid: string | number;
	name: string;
	letter: string;
	adcode: string | number;
	location: string;
	areaStatus: string;
	areaType: string;
	hot: string;
	cityCode: string;
}

const emit = defineEmits<{ refresh: [] }>();
const { t } = useI18n();
const { yes_no_type } = useDict('yes_no_type');
const dataFormRef = useTemplateRef<FormInstance>('dataFormRef');
const visible = shallowRef(false);
const loading = shallowRef(false);
const parentName = shallowRef(t('area.nationwide'));

const areaTypeDict = computed(() => createAreaTypeOptions(t));

const createDefaultForm = (): AreaForm => ({
	id: '',
	pid: 100000,
	name: '',
	letter: '',
	adcode: '',
	location: '',
	areaStatus: '1',
	areaType: '1',
	hot: '0',
	cityCode: '',
});

const form = reactive<AreaForm>(createDefaultForm());

const dataRules = {
	name: [
		{ required: true, message: t('area.nameRequired'), trigger: 'blur' },
		{ min: 2, max: 20, message: t('area.nameLengthLimit'), trigger: 'blur' },
	],
	adcode: [
		{ validator: rule.overLength, trigger: 'blur' },
		{ required: true, message: t('area.adcodeRequired'), trigger: 'blur' },
		{
			validator: async (_ruleItem: unknown, value: string | number, callback: (error?: Error) => void) => {
				if (form.id) {
					callback();
					return;
				}
				try {
					const { data } = await checkAdcodeExists(value);
					callback(data === true ? new Error(t('area.adcodeExists')) : undefined);
				} catch (err: any) {
					callback(new Error(err?.msg || t('area.adcodeCheckFailed')));
				}
			},
			trigger: 'blur',
		},
	],
};

const getAreaData = async (id: string): Promise<void> => {
	loading.value = true;
	try {
		const { data } = await getObj(id);
		if (!data) {
			visible.value = false;
			useMessage().error(t('area.notFound'));
			return;
		}
		Object.assign(form, data);
	} catch (err: any) {
		useMessage().error(err?.msg || t('area.loadFailed'));
	} finally {
		loading.value = false;
	}
};

const openDialog = async (id?: string, parent?: AreaParentContext): Promise<void> => {
	Object.assign(form, createDefaultForm());
	parentName.value = parent?.name || t('area.nationwide');
	if (parent) {
		form.pid = parent.adcode;
		form.areaType = String(Math.min(Number(parent.areaType) + 1, 4));
	}

	visible.value = true;
	await nextTick();
	dataFormRef.value?.clearValidate();

	if (id) {
		form.id = id;
		await getAreaData(id);
	}
};

const onSubmit = async (): Promise<void> => {
	if (loading.value) return;
	const valid = await dataFormRef.value?.validate().catch(() => false);
	if (!valid) return;

	loading.value = true;
	try {
		form.id ? await putObj({ id: form.id, name: form.name, hot: form.hot, areaStatus: form.areaStatus }) : await addObj(form);
		useMessage().success(form.id ? t('common.editSuccessText') : t('common.addSuccessText'));
		visible.value = false;
		emit('refresh');
	} catch (err: any) {
		useMessage().error(err?.msg || t('common.optFailText'));
	} finally {
		loading.value = false;
	}
};

defineExpose({ openDialog });
</script>

<template>
	<el-dialog v-model="visible" :title="form.id ? $t('common.editBtn') : $t('common.addBtn')" :close-on-click-modal="false" draggable width="600">
		<el-form ref="dataFormRef" v-loading="loading" :model="form" :rules="dataRules" label-width="90px">
			<el-row>
				<el-col v-if="!form.id" :span="24" class="mb20">
					<el-form-item :label="t('area.pid')">
						<el-input :model-value="parentName" readonly>
							<template #prefix>
								<el-icon><Location /></el-icon>
							</template>
						</el-input>
					</el-form-item>
				</el-col>

				<el-col :span="24" class="mb20">
					<el-form-item :label="t('area.name')" prop="name">
						<el-input v-model="form.name" :placeholder="t('area.inputNameByTip')" />
					</el-form-item>
				</el-col>

				<el-col :span="24" class="mb20">
					<el-form-item :label="t('area.adcode')" prop="adcode">
						<el-input v-model="form.adcode" :placeholder="t('area.inputAdCodeByTip')" :disabled="Boolean(form.id)" />
					</el-form-item>
				</el-col>

				<el-col :span="24" class="mb20">
					<el-form-item :label="t('area.areaType')" prop="areaType">
						<el-select v-model="form.areaType" class="w100" :disabled="Boolean(form.id)">
							<el-option v-for="item in areaTypeDict" :key="item.value" :label="item.label" :value="item.value" />
						</el-select>
					</el-form-item>
				</el-col>

				<el-col :span="24" class="mb20">
					<el-form-item :label="t('area.hot')" prop="hot">
						<el-radio-group v-model="form.hot">
							<el-radio v-for="item in yes_no_type" :key="item.value" :value="item.value" border>
								{{ item.label }}
							</el-radio>
						</el-radio-group>
					</el-form-item>
				</el-col>

				<el-col :span="24" class="mb20">
					<el-form-item :label="t('area.areaStatus')" prop="areaStatus">
						<el-radio-group v-model="form.areaStatus">
							<el-radio v-for="item in yes_no_type" :key="item.value" :value="item.value" border>
								{{ item.label }}
							</el-radio>
						</el-radio-group>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="visible = false">{{ $t('common.cancelButtonText') }}</el-button>
				<el-button type="primary" :disabled="loading" @click="onSubmit">
					{{ $t('common.confirmButtonText') }}
				</el-button>
			</span>
		</template>
	</el-dialog>
</template>
