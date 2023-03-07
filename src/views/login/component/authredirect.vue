<script setup lang="ts" name="authredirect">
import request from '/@/utils/request';
import other from '/@/utils/other';
import { validateNull } from '/@/utils/validate';
import { Session } from '/@/utils/storage';
import { useUserInfo } from '/@/stores/userInfo';
import { useMessageBox } from '/@/hooks/message';

onMounted(async () => {
	const url = window.location.search.replace('#/authredirect', '').replaceAll('/', '');

	// 优先获取 code 参数，获取不到 则换成 ticket
	let code = other.getQueryString(url, 'code');
	if (validateNull(code)) {
		code = other.getQueryString(url, 'ticket');
	}

	//  分割登录参数
	let state = other.getQueryString(url, 'state');
	let type = state.split('-')[1];
	state = state.split('-')[0];

	// 登录请求
	if (type === 'LOGIN') {
		Session.clear();
		await useUserInfo().loginBySocial(state, code);
		window.close();
	} else {
		bind(state, code);
	}
});

const bind = (state: string, code: string) => {
	request({
		url: '/admin/social/bind',
		method: 'post',
		params: { state, code },
	}).then(() => {
		useMessageBox()
			.confirm('社交账号绑定成功')
			.then(() => {
				window.close();
			});
	});
};
</script>
