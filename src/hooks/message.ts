import { ElMessage, ElMessageBox } from 'element-plus';
import { i18n } from '../i18n';

const { t } = i18n.global;

const defaultOptions = {
	duration: 3000, // 显示时间为3秒
	showClose: true, // 显示关闭按钮
	offset: 20, // 消息距离顶部的偏移量
};

interface MessageImplements {
	info(title: string): void;
	warning(title: string): void;
	success(title: string): void;
	error(title: string): void;
}

export function useMessage() {
	class MessageClass implements MessageImplements {
		// 普通提示
		info(title: string): void {
			ElMessage({
				...defaultOptions,
				message: title,
				type: 'info',
			});
		}

		// 警告提示
		warning(title: string): void {
			ElMessage({
				...defaultOptions,
				message: title,
				type: 'warning',
			});
		}

		// 成功提示
		success(title: string): void {
			ElMessage({
				...defaultOptions,
				message: title,
				type: 'success',
			});
		}

		// 错误提示
		error(title: string): void {
			ElMessage({
				...defaultOptions,
				message: title,
				type: 'error',
				duration: 2000, // 错误提示显示时间延长到5秒
			});
		}
	}

	return new MessageClass();
}

export function useMessageBox() {
	class MessageBoxClass implements MessageImplements {
		// 普通提示
		info(msg: string): void {
			ElMessageBox.alert(msg, t('message.box.title'));
		}

		// 警告提示
		warning(msg: string): void {
			ElMessageBox.alert(msg, t('message.box.title'), { type: 'warning' });
		}

		// 成功提示
		success(msg: string): void {
			ElMessageBox.alert(msg, t('message.box.title'), { type: 'success' });
		}

		// 错误提示
		error(msg: string): void {
			ElMessageBox.alert(msg, t('message.box.title'), { type: 'error' });
		}

		// 确认窗体
		confirm(msg: string) {
			return ElMessageBox.confirm(msg, t('message.box.title'), {
				confirmButtonText: t('common.confirmButtonText'),
				cancelButtonText: t('common.cancelButtonText'),
				type: 'warning',
			});
		}
		// 提交内容
		prompt(msg: string) {
			return ElMessageBox.prompt(msg, t('message.box.title'), {
				confirmButtonText: t('common.confirmButtonText'),
				cancelButtonText: t('common.cancelButtonText'),
				type: 'warning',
			});
		}
	}

	return new MessageBoxClass();
}
