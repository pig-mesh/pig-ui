// 流程模型表单类型枚举
export enum BpmModelFormType {
  NORMAL = 10, // 动态表单
  CUSTOM = 20  // 自定义表单
}

// 表单类型选项
export const BpmModelFormTypeOptions = [
  {
    label: '动态表单',
    value: BpmModelFormType.NORMAL,
    description: '使用可视化表单设计器创建表单'
  },
  {
    label: '自定义表单',
    value: BpmModelFormType.CUSTOM,
    description: '使用自定义页面作为表单'
  }
]

// 表单数据接口
export interface FormDesignData {
  formType: BpmModelFormType
  formId?: string | number  // 动态表单ID
  formCustomCreatePath?: string  // 自定义表单创建路径
  formCustomViewPath?: string    // 自定义表单查看路径
  formRule?: any[]  // 表单规则（动态表单使用）
  formOption?: any  // 表单选项（动态表单使用）
}
