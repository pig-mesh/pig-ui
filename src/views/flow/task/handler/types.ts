// First let's create types for our form data
export interface FlowFormItem {
  id: string
  type: string
  props: {
    value: any
    [key: string]: any
  }
}

export interface TaskData {
  taskId: string
  nodeId: string
}

export interface TaskSubmitParam {
  paramMap: Record<string, any>
  taskId: string
  taskLocalParamMap: {
    approveDesc: string
  }
} 