import { Ref, ShallowRef } from 'vue';
import { setupDynamicFormRule } from '/@/views/flow/workflow/utils/formUtils';
import { createDynamicFormComponent, type DynamicFormComponent } from '/@/views/flow/workflow/utils/dynamicComponent';

/**
 * 任务表单配置接口
 */
export interface TaskFormConfig {
	/** 表单规则 */
	rule: Ref<any[]>;
	/** 表单数据 */
	formData: Ref<any>;
	/** 表单选项配置 */
	option: Ref<any>;
	/** 动态表单组件 */
	dynamicFormComponent: ShallowRef<DynamicFormComponent | null>;
	/** 当前打开的表单 */
	currentOpenFlowForm: Ref<any>;
}

/**
 * 加载表单选项
 */
export interface LoadFormOptions {
	/** 是否解析formData (默认false) */
	parseFormData?: boolean;
	/** 是否只读模式 (默认true，用于查看；false用于编辑/重新提交) */
	readonly?: boolean;
	/** 成功回调 */
	onSuccess?: () => void;
	/** 错误回调 */
	onError?: (error: any) => void;
}

/**
 * 通用任务表单加载器
 *
 * 处理任务表单的查询和渲染,支持:
 * - 动态表单 (form-create)
 * - 自定义业务表单
 * - 权限控制
 * - 表单数据解析
 *
 * @param config 表单配置对象
 * @returns 表单加载方法
 *
 * @example
 * ```typescript
 * const { loadForm } = useTaskFormLoader({
 *   rule, formData, option, dynamicFormComponent, currentOpenFlowForm
 * });
 *
 * // 加载待办任务表单
 * loadForm(() => queryTask(taskId, false), {
 *   parseFormData: false,
 *   onSuccess: () => { drawer.value = true; }
 * });
 * ```
 */
export function useTaskFormLoader(config: TaskFormConfig) {
	const { rule, formData, option, dynamicFormComponent, currentOpenFlowForm } = config;

	/**
	 * 处理表单响应数据
	 * 根据响应数据中的formConfig判断使用动态表单还是自定义表单
	 */
	const handleFormResponse = (responseData: any, options: LoadFormOptions = {}) => {
		const { formItems, formPerms, formData: responseFormData, formConfig, processInstanceId } = responseData;

		// 重置动态表单组件
		dynamicFormComponent.value = null;

		// 检查是否有formConfig，判断表单类型
		if (formConfig) {
			// 解析表单配置选项
			option.value = JSON.parse(formConfig).formOption;

			// 根据 readonly 参数决定使用详情路径还是提交路径
			// readonly=true（默认）：使用 formCustomViewPath（详情路径）
			// readonly=false：使用 formCustomCreatePath（提交路径，用于重新提交等场景）
			const isReadonly = options.readonly !== false;

			// 尝试创建自定义业务表单组件
			const dynamicComponent = createDynamicFormComponent(formConfig, processInstanceId, isReadonly);

			if (dynamicComponent) {
				// 使用自定义业务表单
				dynamicFormComponent.value = dynamicComponent;
			} else {
				// 使用动态表单
				setupDynamicFormInternal(formItems, formPerms, responseFormData, options.parseFormData || false);
			}
		} else {
			// 兼容旧版本，使用动态表单
			setupDynamicFormInternal(formItems, formPerms, responseFormData, options.parseFormData || false);
		}

		// 执行成功回调
		if (options.onSuccess) {
			options.onSuccess();
		}
	};

	/**
	 * 内部方法: 设置动态表单
	 */
	const setupDynamicFormInternal = (formItems: any, formPerms: any, responseFormData: any, parseFormData: boolean) => {
		const { rule: processedRule, parsedFormData } = setupDynamicFormRule(formItems, formPerms, responseFormData, parseFormData);

		rule.value = processedRule;
		formData.value = parsedFormData;
		currentOpenFlowForm.value = formItems;
	};

	/**
	 * 加载并渲染表单
	 *
	 * @param queryFn API查询函数,返回Promise
	 * @param options 加载选项
	 *
	 * @example
	 * ```typescript
	 * // 示例1: 加载待办任务
	 * loadForm(() => queryTask(row.taskId, false), {
	 *   parseFormData: false,
	 *   onSuccess: () => { rightDrawerVisible.value = true; }
	 * });
	 *
	 * // 示例2: 加载已发起的流程
	 * loadForm(() => detail({ processInstanceId: row.processInstanceId }), {
	 *   parseFormData: true,
	 *   onSuccess: () => { drawer.value = true; },
	 *   onError: (err) => { console.error(err); }
	 * });
	 * ```
	 */
	const loadForm = async (queryFn: () => Promise<any>, options: LoadFormOptions = {}) => {
		try {
			const res = await queryFn();
			handleFormResponse(res.data, options);
		} catch (error) {
			// 执行错误回调
			if (options.onError) {
				options.onError(error);
			} else {
				// 默认错误处理: 抛出错误让调用方处理
				throw error;
			}
		}
	};

	return {
		loadForm,
		handleFormResponse,
	};
}
