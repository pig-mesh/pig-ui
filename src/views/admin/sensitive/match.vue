<template>
  <el-dialog :title="t('sensitive.matchTest')" v-model="visible"
             :close-on-click-modal="false" draggable>
    <el-form ref="dataFormRef" :model="form" :rules="dataRules" formDialogRef label-width="90px" v-loading="loading">
      <el-row :gutter="24">
        <el-col :span="24" class="mb20">
          <el-form-item :label="t('sensitive.sensitiveWord')" prop="sensitiveWord">
            <el-input type="textarea" :rows="3" v-model="form.sensitiveWord" :placeholder="t('sensitive.inputSensitiveWordTip')"
                      @blur="onSubmit"/>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="mb20">
          <el-form-item prop="result">
            <template #label>
              {{ t('sensitive.matchResult') }}
              <tip :content="t('sensitive.matchResultTip')"/>
            </template>
            <div v-html="matchResult" @click="handleChildClick"/>
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

<script setup lang="ts" name="SysSensitiveWordDialog">
import { useMessage } from '/@/hooks/message';
import { testObj, addObj, getObj } from '/@/api/admin/sensitive';
import { rule } from '/@/utils/validate';
import { useI18n } from 'vue-i18n';

/**
 * 定义组件事件
 */
const emit = defineEmits(['refresh']);

/**
 * 国际化工具
 */
const { t } = useI18n();

/**
 * 表单引用
 */
const dataFormRef = ref();

/**
 * 对话框显示状态
 */
const visible = ref(false);

/**
 * 加载状态
 */
const loading = ref(false);

/**
 * 匹配结果HTML内容
 */
const matchResult = ref('');

/**
 * 表单数据
 */
const form = reactive({
	sensitiveId: '',
	sensitiveWord: '',
});

/**
 * 表单验证规则
 */
const dataRules = ref({
	sensitiveWord: [
		{ validator: rule.overLength, trigger: 'blur' },
		{
			required: true,
			message: t('sensitive.sensitiveWordRequired'),
			trigger: 'blur',
		},
	],
});

/**
 * 打开对话框
 * @param id - 预留参数，暂未使用
 */
const openDialog = (id: string): void => {
	visible.value = true;
	form.sensitiveId = '';

	// 重置表单数据
	nextTick(() => {
		dataFormRef.value?.resetFields();
	});
};

/**
 * 处理点击敏感词事件，将其添加到白名单
 * @param event - 点击事件对象
 */
const handleChildClick = async (event: any): Promise<void> => {
	try {
		if (event.target.tagName.toLowerCase() === 'a' && event.target.classList.contains('link-error')) {
			const { data } = await getObj({ sensitiveWord: event.target.innerText, sensitiveType: '1' });
			if (data) {
				useMessage().error(t('sensitive.dataExists'));
				return;
			}
			await addObj({ sensitiveWord: event.target.innerText, sensitiveType: '1' });
			useMessage().success(t('sensitive.whitelistAddSuccess'));
			emit('refresh');
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

/**
 * 提交表单，执行敏感词匹配测试
 */
const onSubmit = async (): Promise<void> => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return;

	try {
		loading.value = true;
		const { data } = await testObj(form);
		// 处理匹配结果
		matchResult.value = data;
		// 遍历关键词数组，并进行替换
		matchResult.value = matchResult.value.map((item: string) => {
			let modifiedItem = item;
			data.forEach((word: string) => {
				let regex = new RegExp(word, 'g');
				modifiedItem = modifiedItem.replace(
					regex,
					`
<div class="tooltip tooltip-open tooltip-bottom" data-tip="${t('sensitive.triggerSensitiveWord')}">
  <a class="link link-error" @click="$emit('click-child','${word}')">${word}</a>
</div>
    `
				);
			});
			return modifiedItem;
		});
		useMessage().success(t('sensitive.operationSuccess'));
		emit('refresh');
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};

/**
 * 暴露方法供父组件调用
 */
defineExpose({
	openDialog,
});
</script>
