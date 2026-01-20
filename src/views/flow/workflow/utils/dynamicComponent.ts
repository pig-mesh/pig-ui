/**
 * 动态组件加载工具
 * 用于根据路径动态加载业务表单组件
 */
import { markRaw, defineAsyncComponent } from 'vue'

// 使用 import.meta.glob 在构建时预扫描所有 views 目录下的组件
// Vite 会在构建时将所有匹配的文件打包，确保生产环境可用
const viewsModules: Record<string, any> = import.meta.glob('/src/views/**/*.{vue,tsx}')

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
  // 构建完整路径
  const fullPath = `/src/views${normalizedPath}`

  // 从预构建的组件注册表中查找匹配的组件
  const keys = Object.keys(viewsModules)
  const matchKeys = keys.filter((key) => {
    // 支持精确匹配或后缀匹配
    return key === fullPath || key.endsWith(normalizedPath)
  })

  // 找到唯一匹配
  if (matchKeys?.length === 1) {
    const matchKey = matchKeys[0]
    // 使用 markRaw 避免组件被响应式化
    return markRaw(defineAsyncComponent(viewsModules[matchKey]))
  }

  // 多个匹配，需要更精确的路径
  if (matchKeys?.length > 1) {
    console.error(`多个组件匹配路径 "${normalizedPath}":`, matchKeys)
    console.error('请使用更精确的路径，或检查是否存在重复的组件路径')
    return null
  }

  // 未找到匹配
  console.error(`未找到组件: ${normalizedPath}`)
  console.error('可用的组件路径:', keys)
  return null
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
 * @param processInstanceId 流程实例ID
 * @param readonly 是否只读
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
