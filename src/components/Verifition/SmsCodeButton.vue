<template>
	<el-button v-waves v-bind="attrs" :loading="counting" :disabled="counting" @click="handleClick">
		<span class="font-semibold">{{ buttonText }}</span>
	</el-button>

	<Verify
		v-if="behaviorCaptchaEnable"
		ref="verifyRef"
		:mode="'pop'"
		:captchaType="normalizedCaptchaType"
		:imgSize="{ width: '330px', height: '155px' }"
		@success="handleBehaviorCaptchaSuccess"
	/>

	<MathCaptcha
		v-else
		ref="mathRef"
		:placeholder="t('mobile.placeholder2')"
		:emptyMessage="codeRequiredText"
		:loading="sending"
		@success="handleMathSuccess"
	/>
</template>

<script setup lang="ts" name="SmsCodeButton">
import { sendMobileCode } from '/@/api/login';
import { useMessage } from '/@/hooks/message';
import { CaptchaType, useSiteConfig } from '/@/stores/siteConfig';
import { useIntervalFn } from '@vueuse/core';
import { useI18n } from 'vue-i18n';

defineOptions({
	inheritAttrs: false,
});

const Verify = defineAsyncComponent(() => import('/@/components/Verifition/Verify.vue'));
const MathCaptcha = defineAsyncComponent(() => import('/@/components/Verifition/MathCaptcha.vue'));

const props = withDefaults(
	defineProps<{
		mobile?: string;
		registered?: boolean;
		textKey?: string;
		validate: () => Promise<unknown> | unknown;
	}>(),
	{
		registered: true,
		textKey: 'mobile',
	}
);

const { t } = useI18n();
const attrs = useAttrs();
const { siteConfig } = storeToRefs(useSiteConfig());

const verifyRef = ref();
const mathRef = ref();
const sending = ref(false);
const counting = ref(false);
const countSeconds = ref(60);

const normalizedCaptchaType = computed(() => {
	const type = siteConfig.value.captchaType;
	if (type === CaptchaType.BlockPuzzle || type === CaptchaType.ClickWord || type === CaptchaType.Math) {
		return type;
	}
	return CaptchaType.ClickWord;
});

const behaviorCaptchaEnable = computed(() => normalizedCaptchaType.value !== CaptchaType.Math);
const codeText = computed(() => t(`${props.textKey}.codeText`));
const secondsText = computed(() => t(`${props.textKey}.seconds`));
const sendSuccessText = computed(() => t(`${props.textKey}.sendSuccess`));
const sendFailedText = computed(() => t(`${props.textKey}.sendFailed`));
const codeRequiredText = computed(() => t(`${props.textKey}.codeRequired`));
const buttonText = computed(() => (counting.value ? `${countSeconds.value}${secondsText.value}` : codeText.value));

const { pause, resume } = useIntervalFn(
	() => {
		countSeconds.value--;
		if (countSeconds.value === 0) {
			resetCountdown();
		}
	},
	1000,
	{ immediate: false }
);

const resetCountdown = () => {
	pause();
	countSeconds.value = 60;
	counting.value = false;
};

const startCountdown = () => {
	countSeconds.value = 60;
	counting.value = true;
	resume();
};

const sendCode = async (captchaVerification: string) => {
	if (!props.mobile) return;

	try {
		sending.value = true;
		const { msg, ok } = await sendMobileCode({
			mobile: props.mobile,
			registered: props.registered,
			captchaType: normalizedCaptchaType.value,
			captchaVerification,
		});
		if (ok) {
			useMessage().success(sendSuccessText.value);
			if (normalizedCaptchaType.value === CaptchaType.Math) {
				mathRef.value?.close();
			}
			startCountdown();
		} else {
			useMessage().error(msg || sendFailedText.value);
			if (normalizedCaptchaType.value === CaptchaType.Math) {
				mathRef.value?.refresh();
			}
		}
	} catch (error: any) {
		const errorMsg = error?.msg || error?.message || sendFailedText.value;
		useMessage().error(errorMsg);
		if (normalizedCaptchaType.value === CaptchaType.Math) {
			mathRef.value?.refresh();
		}
	} finally {
		sending.value = false;
	}
};

const handleBehaviorCaptchaSuccess = async (params: { captchaVerification: string }) => {
	await sendCode(params.captchaVerification);
};

const handleMathSuccess = async (params: { captchaVerification: string }) => {
	await sendCode(params.captchaVerification);
};

const handleClick = async () => {
	if (counting.value || sending.value) return;

	try {
		await props.validate();
		if (normalizedCaptchaType.value === CaptchaType.Math) {
			mathRef.value?.show();
			return;
		}
		verifyRef.value?.show();
	} catch (error) {
		// 表单项会展示自身校验错误。
	}
};
</script>
