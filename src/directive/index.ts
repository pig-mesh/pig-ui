import type { App } from 'vue';
import { authDirective } from '/@/directive/authDirective';
import { wavesDirective } from '/@/directive/customDirective';

/**
 * 导出指令方法：v-xxx
 * @methods authDirective 用户权限指令，用法：v-auth
 * @methods wavesDirective 按钮波浪指令，用法：v-waves
 */
export function directive(app: App) {
	// 用户权限指令
	authDirective(app);
	// 按钮波浪指令
	wavesDirective(app);
	// focus
	app.directive('focus', {
		mounted(el) {
			el.focus();
		},
	});
}
