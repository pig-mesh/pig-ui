import { ElMessage, ElMessageBox } from 'element-plus';
import { i18n } from '../i18n';

const { t } = i18n.global;

const defaultOptions = {
	duration: 3000,
	showClose: true,
	offset: 20,
};

type MessageType = 'info' | 'warning' | 'success' | 'error';

function showMessage(message: string, type: MessageType, overrides?: Record<string, any>) {
	ElMessage({ ...defaultOptions, message, type, ...overrides });
}

export function useMessage() {
	return {
		info: (msg: string) => showMessage(msg, 'info'),
		warning: (msg: string) => showMessage(msg, 'warning'),
		success: (msg: string) => showMessage(msg, 'success'),
		error: (msg: string) => showMessage(msg, 'error', { duration: 2000 }),
	};
}

export function useMessageBox() {
	const { alert, confirm, prompt } = ElMessageBox;
	const title = () => t('message.box.title');
	const buttons = () => ({
		confirmButtonText: t('common.confirmButtonText'),
		cancelButtonText: t('common.cancelButtonText'),
	});

	return {
		info: (msg: string) => alert(msg, title()),
		warning: (msg: string) => alert(msg, title(), { type: 'warning' }),
		success: (msg: string) => alert(msg, title(), { type: 'success' }),
		error: (msg: string) => alert(msg, title(), { type: 'error' }),
		confirm: (msg: string) => confirm(msg, title(), { ...buttons(), type: 'warning' }),
		prompt: (msg: string) => prompt(msg, title(), { ...buttons(), type: 'warning' }),
	};
}
