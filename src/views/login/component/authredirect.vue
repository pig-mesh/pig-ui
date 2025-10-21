<script setup lang="ts" name="authredirect">
import request from '/@/utils/request';
import { Session } from '/@/utils/storage';
import { useUserInfo } from '/@/stores/userInfo';
import { useMessageBox } from '/@/hooks/message';
import { useUrlSearchParams } from '@vueuse/core';
import { SocialLoginEnum } from '/@/api/login';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

// 使用 VueUse 获取 URL 参数 - 兼容两种URL格式
const hashParams = useUrlSearchParams('hash');
const queryParams = useUrlSearchParams('history');

/**
 * 获取参数值，优先从hash获取，如果没有则从query string获取
 */
const getParam = (key: string): string => {
	return (hashParams[key] || queryParams[key]) as string;
};

/**
 * 获取授权码，支持多种参数名
 */
const getAuthCode = (): string => {
	return getParam('code') || getParam('ticket') || getParam('authCode');
};

/**
 * 解析登录状态参数
 */
const parseState = (stateParam: string) => {
	const [state, type] = stateParam.split('-');
	return { state, type };
};

/**
 * 使用 VueUse 向父窗口发送消息
 */
const notifyParentWindow = (message: Record<string, any>) => {
	if (window.opener && !window.opener.closed) {
		window.opener.postMessage(message, window.location.origin);
	}
};

/**
 * 绑定社交账号
 */
const bindSocialAccount = async (state: string, code: string) => {
		await request({
			url: '/admin/social/bind',
			method: 'post',
			params: { state, code },
		});

		await useMessageBox().confirm(t('socialLogin.bindSuccess'));

		// 通知父窗口绑定成功
		notifyParentWindow({ type: 'social-bind-success' });

		window.close();
};

/**
 * 处理社交登录
 */
const handleSocialLogin = async (state: string, code: string) => {
	Session.clear();
	await useUserInfo().loginBySocial(state as SocialLoginEnum, code);

	// 通知父窗口登录成功
	notifyParentWindow({ type: 'social-login-success' });

	// 延迟关闭窗口，确保消息已发送
	setTimeout(() => window.close(), 100);
};

/**
 * 主处理函数
 */
onMounted(async () => {
	const code = getAuthCode();
	const stateParam = getParam('state');

	if (!code || !stateParam) {
		console.error(t('socialLogin.missingParams'));
		return;
	}

	const { state, type } = parseState(stateParam);

	if (type === 'LOGIN') {
		await handleSocialLogin(state, code);
	} else {
		await bindSocialAccount(state, code);
	}
});
</script>
