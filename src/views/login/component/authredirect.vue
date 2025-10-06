<script setup lang="ts" name="authredirect">
import request from '/@/utils/request';
import { Session } from '/@/utils/storage';
import { useUserInfo } from '/@/stores/userInfo';
import { useMessageBox } from '/@/hooks/message';
import { useUrlSearchParams } from '@vueuse/core';
import { SocialLoginEnum } from '/@/api/login';

// 使用 VueUse 获取 URL 参数
const params = useUrlSearchParams('hash');

/**
 * 获取授权码，支持多种参数名
 */
const getAuthCode = (): string => {
	return (params.code || params.ticket || params.authCode) as string;
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

		await useMessageBox().confirm('社交账号绑定成功');
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
	const stateParam = params.state as string;

	if (!code || !stateParam) {
		console.error('Missing required parameters: code or state');
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
