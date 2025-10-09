/**
 * 动态组件加载工具
 * 用于根据路径动态加载业务表单组件
 */
import { markRaw } from 'vue'

/**
 * 注册并获取组件
 * @param path 组件路径，如 '/business/contract/form/DetailForm.vue'
 * @returns Promise<Component> 返回异步组件
 */
export function registerComponent(path: string): any {
  if (!path) {
    console.warn('组件路径不能为空')
    return null
  }

  // 处理路径，确保以 / 开头
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  
  try {
    // 动态导入组件
    // 这里使用动态导入，Vite会自动处理路径解析
    // 使用 markRaw 来避免组件被响应式化
    return markRaw(defineAsyncComponent(() => import(/* @vite-ignore */ `/src/views${normalizedPath}`)))
  } catch (error) {
    console.error(`动态加载组件失败: ${normalizedPath}`, error)
    return null
  }
}

// 动态表单组件类型定义
export interface DynamicFormComponent {
  component: any
  props: {
    id?: string
    businessKey?: string
    readonly?: boolean
    processInstanceId?: string
    [key: string]: any
  }
}

/**
 * 根据formConfig动态创建表单组件
 * @param formConfig 表单配置
 * @param businessKey 业务键值
 * @param readonly 是否只读
 * @param processInstanceId 流程实例ID
 * @returns 组件配置对象
 */
export function createDynamicFormComponent(formConfig: any, processInstanceId?: string, readonly?: boolean): DynamicFormComponent | null {
  if (!formConfig) {
    console.warn('formConfig不能为空')
    return null
  }

  let config: any = {}
  
  // 如果是字符串，尝试解析为JSON
  if (typeof formConfig === 'string') {
    try {
      config = JSON.parse(formConfig)
    } catch (error) {
      console.error('解析formConfig失败:', error)
      return null
    }
  } else {
    config = formConfig
  }

  const { formType, formCustomViewPath, formCustomCreatePath } = config

  // 判断表单类型
  if (formType === 20) { // 自定义业务表单
    // 优先使用查看路径，如果没有则使用创建路径
    const componentPath = readonly ? formCustomViewPath: formCustomCreatePath
    
    if (!componentPath) {
      console.warn('自定义表单路径不能为空')
      return null
    }

    const component = registerComponent(componentPath)
    
    return {
      component,
      props: {
        processInstanceId,
        readonly: readonly !== undefined ? readonly : true // 查看模式
      }
    }
  } else if (formType === 10) { // 动态表单
    // 返回null，表示使用默认的动态表单渲染逻辑
    return null
  }

  console.warn('未知的表单类型:', formType)
  return null
}
