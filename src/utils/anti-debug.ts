import DisableDevtool from 'disable-devtool';
import { ElMessageBox } from 'element-plus';
import type { MessageBoxOptions } from 'element-plus';

/**
 * 安全警告的HTML模板, 使用Tailwind CSS样式
 */
const SECURITY_WARNING_TEMPLATE = `
<div class="flex flex-col items-center gap-4 p-2">
  <div class="text-red-500 dark:text-red-400">
    <i class="el-icon-warning text-2xl"></i>
  </div>
  <div class="text-center">
    <p class="text-base font-medium text-gray-900 dark:text-gray-100">
      不合规操作，系统将在5秒后自动关闭退出！
    </p>
    <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
      如您频繁此类操作，系统将记录上报。
    </p>
  </div>
</div>`;

/**
 * Element Plus 消息框配置选项
 */
const ALERT_OPTIONS: MessageBoxOptions = {
	type: 'error',
	showClose: false,
	center: true,
	closeOnClickModal: false,
	closeOnPressEscape: false,
	dangerouslyUseHTMLString: true,
} as const;

/**
 * 处理开发者工具打开事件
 * 显示警告消息并在5秒后强制关闭页面
 *
 * @param type - 开发者工具类型（未使用）
 * @param next - DisableDevtool提供的回调函数，用于执行关闭操作
 */
function handleDevToolOpen(_type: any, next: Function): void {
	ElMessageBox.alert(SECURITY_WARNING_TEMPLATE, '安全警告', ALERT_OPTIONS);

	setTimeout(() => {
		next();
	}, 5000);
}

/**
 * 初始化反调试功能
 *
 * 配置说明：
 * - 通过环境变量 VITE_ENABLE_ANTI_DEBUG 控制是否启用
 * - 使用环境变量 VITE_ANTI_DEBUG_KEY 设置调试密钥（默认为'pig'）
 * - URL中添加 ?ddtk=debugKey 可临时绕过检测
 *
 * 功能特点：
 * - 禁用开发者工具
 * - 检测到开发者工具时显示警告并自动关闭页面
 * - 每10秒检查一次（interval: 10000）
 */
export function initAntiDebug(): void {
	if (import.meta.env.VITE_ENABLE_ANTI_DEBUG !== 'true') {
		return;
	}

	const debugKey = import.meta.env.VITE_ANTI_DEBUG_KEY || 'pig';

	DisableDevtool({
		md5: DisableDevtool.md5(debugKey),
		disableMenu: false,
		interval: 10000,
		ondevtoolopen: handleDevToolOpen,
	});
}
