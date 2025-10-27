/**
 * 工作流工具集统一导出
 * @description 将所有工作流相关的工具函数和常量集中导出,方便引用
 */

// 导出常量
export * from './const';

// 导出表单工具
export * from './formUtils';

// 导出表单权限工具
export * from './formPermissions';

// 导出动态组件工具
export * from './dynamicComponent';

// 导出工作流辅助函数
export * from './workflowHelpers';

// 默认导出 (向后兼容)
export { default } from './workflowHelpers';
export { default as workflowHelpers } from './workflowHelpers';

/**
 * @deprecated 请使用具名导出替代 index.js 的导入
 *
 * 旧的导入方式:
 * import $func from '../utils/index'
 *
 * 新的推荐方式:
 * import { checkApproval, setApproverStr } from '../utils'
 * 或
 * import * as workflowUtils from '../utils'
 */
