import { ElMessageBox } from 'element-plus';

export function showMobileSuccessConfirm(message: string) {
	return ElMessageBox.alert(message, '提示', {
		type: 'success',
		confirmButtonText: '确定',
		showClose: false,
		closeOnClickModal: false,
		closeOnPressEscape: false,
	});
}
