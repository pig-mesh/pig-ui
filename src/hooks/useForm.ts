import { Ref } from 'vue';

export interface BasicFormProps {
	// 是否显示
	visible?: Boolean;
	// 表单 ref
	dataFormRef?: Ref;
	// loading
	loading?: Boolean;
}

interface Props {
	[key: string]: any;
}

export function useTable(dataFormRef: Props | Ref<Props>) {
	const resetFields = () => {
		dataFormRef?.value?.resetFields();
	};

	const validate = () => {
		return new Promise((resolve, reject) => {
			dataFormRef?.value.validate((prop: any, isValid: boolean, message: string) => {
				if (!isValid) {
					reject(message);
				}
				resolve(prop);
			});
		});
	};

	return {
		resetFields,
		validate,
	};
}
