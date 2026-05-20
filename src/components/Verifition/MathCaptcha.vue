<template>
	<el-dialog v-model="visible" width="360px" :title="t('verify.complete')" append-to-body destroy-on-close>
		<div class="flex gap-3">
			<el-input v-model="code" maxlength="4" :placeholder="placeholder" clearable autocomplete="off" @keyup.enter="handleConfirm" />
			<img :src="imgSrc" class="w-[120px] h-11 rounded-md cursor-pointer object-cover" alt="验证码" @click="refresh" />
		</div>
		<template #footer>
			<el-button native-type="button" @click="close">{{ t('common.cancelButtonText') }}</el-button>
			<el-button native-type="button" type="primary" :loading="loading" @click="handleConfirm">{{ t('common.confirmButtonText') }}</el-button>
		</template>
	</el-dialog>
</template>

<script setup lang="ts" name="MathCaptcha">
import { useMessage } from '/@/hooks/message';
import { generateUUID } from '/@/utils/other';
import { useI18n } from 'vue-i18n';

const props = withDefaults(
	defineProps<{
		placeholder?: string;
		emptyMessage?: string;
		loading?: boolean;
	}>(),
	{
		placeholder: '',
		emptyMessage: '',
		loading: false,
	}
);

const emit = defineEmits<{
	(e: 'success', params: { captchaVerification: string }): void;
}>();

const { t } = useI18n();

const visible = ref(false);
const randomStr = ref('');
const code = ref('');
const imgSrc = ref('');

const refresh = (): void => {
	randomStr.value = generateUUID();
	code.value = '';
	imgSrc.value = `${baseURL}${import.meta.env.VITE_IS_MICRO == 'false' ? '/admin' : '/auth'}/code/image?randomStr=${randomStr.value}`;
};

const show = (): void => {
	refresh();
	visible.value = true;
};

const close = (): void => {
	visible.value = false;
};

const handleConfirm = (): void => {
	if (props.loading) return;

	if (!code.value) {
		if (props.emptyMessage) {
			useMessage().error(props.emptyMessage);
		}
		return;
	}
	emit('success', { captchaVerification: `${randomStr.value}---${code.value}` });
};

defineExpose({
	show,
	close,
	refresh,
});
</script>
