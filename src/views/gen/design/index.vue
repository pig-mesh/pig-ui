<template>
  <div class="layout-padding">
    <el-card class="layout-padding-auto">
      <v-form-designer ref="vfDesignerRef" :banned-widgets="bannedWidgets" :designer-config="designerConfig">
        <template #customToolButtons>
          <el-button link type="primary" @click="exportJsonConfig">
            导出
          </el-button>
        </template>
      </v-form-designer>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { useGeneratorVFormApi } from '/@/api/gen/table';

const route = useRoute()

const vfDesignerRef = ref()

const bannedWidgets = reactive(['tab', 'card', 'table', 'cascader'])

const designerConfig = reactive({
  //是否显示语言切换菜单
  languageMenu: false,

  //是否显示GitHub、文档等外部链接
  externalLink: false,

  //是否显示表单模板
  formTemplates: false,

  //是否禁止修改唯一名称
  widgetNameReadonly: false,

  //是否显示组件事件属性折叠面板
  eventCollapse: false,

  //是否显示清空设计器按钮
  clearDesignerButton: true,

  //是否显示预览表单按钮
  previewFormButton: true,

  //是否显示导入JSON按钮
  importJsonButton: true,

  //是否显示导出JSON器按钮
  exportJsonButton: true,

  //是否显示导出代码按钮
  exportCodeButton: true,

  //是否显示生成SFC按钮
  generateSFCButton: false,
})


onMounted(() => {
  importJsonConfig()
})

// 根据当前表，获取json配置信息
const importJsonConfig = () => {
  const tableName = route.query.tableName
  const dsName = route.query.dsName

  if (tableName && dsName) {
    useGeneratorVFormApi(dsName, tableName).then(res => {
      vfDesignerRef.value.loadJson(res)
    })
  }
}

const exportJsonConfig = () => {
}
</script>
<style lang="scss">
body {
  margin: 0;
}
</style>