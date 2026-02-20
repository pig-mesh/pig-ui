<template>
  <el-dialog :title="form.id ? $t('common.editBtn') : $t('common.addBtn')" v-model="visible"
             :close-on-click-modal="false" draggable width="600">
    <el-form ref="dataFormRef" :model="form" :rules="dataRules" formDialogRef label-width="90px" v-loading="loading">
      <el-row>
        <el-col :span="24" class="mb20" v-if="!form.id">
          <el-form-item :label="t('area.pid')" prop="pid">
            <china-area class="w-full" :placeholder="t('area.inputPidByTip')" :plus="true" @change="handleChange"/>
          </el-form-item>
        </el-col>

        <el-col :span="24" class="mb20">
          <el-form-item :label="t('area.name')" prop="name">
            <el-input v-model="form.name" :placeholder="t('area.inputNameByTip')"/>
          </el-form-item>
        </el-col>


        <el-col :span="24" class="mb20">
          <el-form-item :label="t('area.adcode')" prop="adcode">
            <el-input v-model="form.adcode" :placeholder="t('area.inputAdCodeByTip')"/>
          </el-form-item>
        </el-col>

        <el-col :span="24" class="mb20">
          <el-form-item :label="t('area.areaType')" prop="areaType">
            <el-select v-model="form.areaType">
              <el-option :key="item.value" :label="item.label" :value="item.value"
                         v-for="item in area_type_dict"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="24" class="mb20">
          <el-form-item :label="t('area.areaSort')" prop="areaSort">
            <el-input-number v-model="form.areaSort" :placeholder="t('area.inputAreaSortByTip')"/>
          </el-form-item>
        </el-col>

        <el-col :span="24" class="mb20">
          <el-form-item :label="t('area.hot')" prop="hot">
            <el-radio-group v-model="form.hot">
              <el-radio :key="index" :label="item.value" border v-for="(item, index) in yes_no_type">{{
                  item.label
                }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>

        <el-col :span="24" class="mb20">
          <el-form-item :label="t('area.areaStatus')" prop="areaStatus">
            <el-radio-group v-model="form.areaStatus">
              <el-radio :key="index" :label="item.value" border v-for="(item, index) in yes_no_type">{{
                  item.label
                }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
        <span class="dialog-footer">
          <el-button @click="visible = false">{{ $t('common.cancelButtonText') }}</el-button>
          <el-button @click="onSubmit" type="primary" :disabled="loading">{{ $t('common.confirmButtonText') }}</el-button>
        </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="SysAreaDialog">
import { useMessage } from '/@/hooks/message';
import { getObj, addObj, putObj, validateExist } from '/@/api/admin/sysArea';
import { useDict } from '/@/hooks/dict';
import { useI18n } from 'vue-i18n';
import { rule } from '/@/utils/validate';

const ChinaArea = defineAsyncComponent(() => import('/@/components/ChinaArea/index.vue'));

const emit = defineEmits(['refresh']);
const { t } = useI18n();

const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);

const { yes_no_type } = useDict('yes_no_type');

const area_type_dict = [
	{ value: '0', label: t('area.country') },
	{ value: '1', label: t('area.province') },
	{ value: '2', label: t('area.city') },
	{ value: '3', label: t('area.county') },
	{ value: '4', label: t('area.street') },
];

const form = reactive({
	id: '',
	pid: '100000',
	name: '',
	letter: '',
	adcode: '0',
	location: '',
	areaSort: 0,
	areaStatus: '1',
	areaType: '2',
	hot: '0',
	cityCode: '',
});

const dataRules = ref({
	name: [
		{ required: true, message: t('area.nameRequired'), trigger: 'blur' },
		{ min: 2, max: 20, message: t('area.nameLengthLimit'), trigger: 'blur' },
		{
			validator: (rule: any, value: any, callback: any) => {
				validateExist(rule, value, callback, form.id !== '');
			},
			trigger: 'blur',
		},
	],
	adcode: [
		{ validator: rule.overLength, trigger: 'blur' },
		{ required: true, message: t('area.adcodeRequired'), trigger: 'blur' },
		{
			validator: (rule: any, value: any, callback: any) => {
				validateExist(rule, value, callback, form.id !== '');
			},
			trigger: 'blur',
		},
	],
});

const openDialog = (id: string): void => {
	visible.value = true;
	form.id = '';

	nextTick(() => {
		dataFormRef.value?.resetFields();
	});

	if (id) {
		form.id = id;
		getAreaData(id);
	}
};

const onSubmit = async (): Promise<void> => {
	if (loading.value) return;
	loading.value = true;

	try {
		const valid = await dataFormRef.value.validate().catch(() => {});
		if (!valid) return;

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

const getAreaData = async (id: string): Promise<void> => {
	loading.value = true;
	try {
		const { data } = await getObj({ id });
		Object.assign(form, data);
		form.areaSort = Number(form.areaSort) || 0;
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};

const handleChange = (data: string): void => {
	form.pid = data.split(',').at(-1) ?? '';
};

defineExpose({
	openDialog,
});
</script>
