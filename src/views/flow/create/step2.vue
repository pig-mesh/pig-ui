<template>
  <div class="p-5 bg-white dark:bg-[var(--next-color-disabled)] rounded-lg transition-colors duration-300">
    <!-- 表单类型选择 -->
    <div class="mb-6 py-4">
      <el-radio-group v-model="flowStore.step2.formType" class="grid grid-cols-2 gap-4 w-full">
        <el-radio
          v-for="option in BpmModelFormTypeOptions"
          :key="option.value"
          :label="option.value"
          class="!m-0"
        >
          <div class="flex items-start gap-3 p-4 border-2 rounded-lg transition-all duration-200
                      border-gray-200 dark:border-[var(--next-border-color)]
                      bg-white dark:bg-[var(--next-color-primary)]
                      hover:border-blue-500 dark:hover:border-[#1d9bf0]
                      hover:shadow-md cursor-pointer">
            <div class="flex-shrink-0 mt-0.5">
              <div class="w-4 h-4 rounded-full border-2 border-gray-300 dark:border-gray-500
                          flex items-center justify-center transition-all">
                <div class="w-2 h-2 rounded-full bg-blue-500 dark:bg-[#1d9bf0] scale-0 transition-transform"></div>
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <div class="font-medium text-gray-900 dark:text-[var(--next-color-white)] mb-1">
                {{ option.label }}
              </div>
              <div class="text-sm text-gray-500 dark:text-[var(--next-text-color-regular)] leading-relaxed">
                {{ option.description }}
              </div>
            </div>
          </div>
        </el-radio>
      </el-radio-group>
    </div>

    <!-- 动态表单配置 -->
    <div v-if="flowStore.step2.formType === BpmModelFormType.NORMAL" class="mb-6">
      <!-- 表单设计器 -->
      <div class="border border-gray-300 dark:border-[var(--next-border-color)] rounded-md overflow-hidden">
        <div class="bg-white dark:bg-[var(--next-color-disabled)]">
          <fc-designer 
            ref="designerRef" 
            height="70vh" 
            :config="designerConfig"
            @save="saveFormDesign"
          />
        </div>
      </div>
    </div>

    <!-- 自定义表单配置 -->
    <div v-if="flowStore.step2.formType === BpmModelFormType.CUSTOM" class="mb-6">
      <div class="flex items-center text-base font-semibold text-gray-800 dark:text-[var(--next-color-white)] mb-4">
        <el-icon class="mr-2 text-blue-500 dark:text-[#1d9bf0]"><Link /></el-icon>
        自定义表单配置
      </div>
      
      <el-form :model="flowStore.step2" :rules="customFormRules" ref="customFormRef" label-width="140px">
        <el-form-item label="表单提交路径" prop="formCustomCreatePath" class="mb-4">
          <el-input
            v-model="flowStore.step2.formCustomCreatePath"
            placeholder="例如：/flow/oaLeave/create.vue"
            class="w-full"
          />
          <div class="flex items-center mt-1 text-xs text-gray-600 dark:text-[var(--next-text-color-regular)]">
            <el-icon class="mr-1 text-gray-500 dark:text-[var(--next-text-color-placeholder)]"><InfoFilled /></el-icon>
            自定义表单的提交路径，使用Vue的路由地址
          </div>
        </el-form-item>
        
        <el-form-item label="表单查看路径" prop="formCustomViewPath" class="mb-4">
          <el-input
            v-model="flowStore.step2.formCustomViewPath"
            placeholder="例如：/flow/oaLeave/detail.vue"
            class="w-full"
          />
          <div class="flex items-center mt-1 text-xs text-gray-600 dark:text-[var(--next-text-color-regular)]">
            <el-icon class="mr-1 text-gray-500 dark:text-[var(--next-text-color-placeholder)]"><InfoFilled /></el-icon>
            自定义表单的查看路径，用于流程详情页面展示
          </div>
        </el-form-item>
      </el-form>

      <!-- 自定义表单示例说明 -->
      <div class="mt-4 p-4 bg-blue-50 dark:bg-[rgba(29,155,240,0.1)] rounded-md transition-colors duration-300">
        <div class="flex items-center font-medium text-gray-800 dark:text-[var(--next-color-white)] mb-3">
          <el-icon class="mr-2 text-blue-500 dark:text-[#1d9bf0]"><QuestionFilled /></el-icon>
          使用说明
        </div>
        <div>
          <ol>
            <li>表单提交路径：用户发起流程时访问的页面路径</li>
            <li>表单查看路径：流程实例详情页面中展示表单的路径</li>
            <li>路径格式：以 "/" 开头的完整页面路径，如：/flow/oaLeave/create.vue</li>
            <li>自定义表单需要在对应路径创建Vue组件</li>
          </ol>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Link, InfoFilled, QuestionFilled } from '@element-plus/icons-vue'
import FcDesigner from 'form-create-designer'
import type { Config, DragRule } from 'form-create-designer'
import { BpmModelFormType, BpmModelFormTypeOptions } from '../form/const/constants'
import type { FormRules } from 'element-plus'
import { rules } from '../form/const/form-rules'
import { useFlowStore } from '../workflow/stores/flow'
import { CommonHeaderEnum } from '/@/utils/request'
import { Session } from '/@/utils/storage'

// Refs
const designerRef = ref<InstanceType<typeof FcDesigner> | null>(null)
const customFormRef = ref()
const flowStore = useFlowStore()

// 初始化标记，防止重复初始化
const isDesignerInitialized = ref(false)

// 设计器配置
const designerConfig: Config = {
  fieldReadonly: false,
  showSaveBtn: true, // 隐藏保存按钮，改为切换步骤时自动保存
  showDevice: false,
  hiddenItem: ['upload'], // 隐藏上传组件
  formOptions: {
    "resetBtn": {
    "show": false,
    "innerText": "重置"
    },
    "submitBtn": {
      "show": false,
      "innerText": "提交"
    }
  }
}

// 自定义表单验证规则
const customFormRules: FormRules = {
  formCustomCreatePath: [
    { required: true, message: '请输入表单提交路径', trigger: 'blur' },
    { pattern: /^\/.*/, message: '路径必须以"/"开头', trigger: 'blur' }
  ],
  formCustomViewPath: [
    { required: true, message: '请输入表单查看路径', trigger: 'blur' },
    { pattern: /^\/.*/, message: '路径必须以"/"开头', trigger: 'blur' }
  ]
}

// 保存表单设计数据到 store
const saveFormDesign = () => {
  if (flowStore.step2.formType === BpmModelFormType.NORMAL && designerRef.value) {
    const rule = designerRef.value.getRule()
    const option = designerRef.value.getOption()
    flowStore.step2.formRule = rule
    flowStore.step2.formOption = option
  }
}

// 表单验证方法
const validate = async (callback: (valid: boolean, errors?: string[]) => void): Promise<void> => {
	try {
		if (flowStore.step2.formType === BpmModelFormType.NORMAL) {
			// 验证动态表单
			if (designerRef.value) {
				const rule = designerRef.value.getRule()
				if (rule.length === 0) {
					callback(false, ['请设计表单内容'])
					return
				}
				flowStore.step2.formRule = rule
			}
			callback(true)
		} else if (flowStore.step2.formType === BpmModelFormType.CUSTOM) {
			// 验证自定义表单
			if (customFormRef.value) {
				await customFormRef.value.validate()
			}
			callback(true)
		} else {
			callback(false, ['请选择表单类型'])
		}
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : '表单验证失败'
		callback(false, [errorMessage])
	}
}

// 配置表单请求拦截器
FcDesigner.designerForm.fetch = FcDesigner.formCreate.fetch = (options: any) => {
	const headers: Record<string, string> = {};

	// 添加认证token
	const token = Session.getToken();
	if (token) {
		headers[CommonHeaderEnum.AUTHORIZATION] = `Bearer ${token}`;
	}

	// 添加租户ID
	const tenantId = Session.getTenant();
	if (tenantId) {
		headers[CommonHeaderEnum.TENANT_ID] = tenantId;
	}

	// 发起请求
	fetch(options.action, {
		headers,
		method: options.method,
	})
		.then(async (res) => {
			const data = await res.json();
			options.onSuccess(data);
		})
		.catch(options.onError);
};

// 初始化表单设计器
const initDesigner = async () => {
  if (!designerRef.value) return
  
  // 等待设计器完全加载
  await nextTick()
  
  try {
    // 如果还没有初始化基础组件，先初始化
    if (!isDesignerInitialized.value) {
      // 添加业务组件菜单
      designerRef.value?.addMenu({ name: 'biz', title: '业务组件', list: [], before: true })

      // 添加自定义组件
      rules.forEach((rule) => {
        designerRef.value?.addComponent(rule as DragRule)
      })
      
      isDesignerInitialized.value = true
    }

    // 如果有 formRule 数据，设置到设计器中
    if (flowStore.step2.formRule && flowStore.step2.formRule.length > 0) {
      designerRef.value.setRule(flowStore.step2.formRule)
    }

    if (flowStore.step2.formOption) {
      designerRef.value.setOption(flowStore.step2.formOption)
    }
  } catch (error) {
    console.error('初始化设计器失败:', error)
  }
}

// 组件挂载后初始化
onMounted(() => {
  // 延迟初始化，确保设计器组件完全加载
  nextTick(() => {
    initDesigner()
  })
})


// 监听 formRule 数据变化和表单类型变化
watch(
  [() => flowStore.step2.formRule, () => flowStore.step2.formType],
  ([newFormRule, newType]) => {
    // 当 formRule 发生变化，或者切换到动态表单时，重新初始化设计器
    if (newFormRule || newType === BpmModelFormType.NORMAL) {
      nextTick(() => {
        initDesigner()
      })
    }
  },
  { deep: true }
)

// 暴露验证方法和保存方法给父组件
defineExpose({ validate, saveFormDesign })
</script>

<style lang="scss" scoped>
:deep(.el-radio__input) {
  display: none;
}

:deep(.el-radio__label) {
  width: 100%;
  padding: 0;
}

:deep(.el-radio.is-checked) {
  .w-4.h-4 {
    border-color: #3b82f6;

    [data-theme='dark'] & {
      border-color: #1d9bf0;
    }
  }

  .w-2.h-2 {
    transform: scale(1);
  }

  .border-2 {
    border-color: #3b82f6 !important;

    [data-theme='dark'] & {
      border-color: #1d9bf0 !important;
    }
  }
}
</style>
