<template>
  <div class="layout-padding">
    <el-card class="layout-padding-auto" shadow="hover">
      <el-steps :active="active" finish-status="success" simple style="margin-top: 20px">
        <el-step title="基础信息" />
        <el-step title="数据修改" />
      </el-steps>
    </el-card>
    <el-card class="layout-padding-auto" style="margin-top: 20px" shadow="hover" v-if="active === 0">
      <generator ref="generatorRef" :tableName="tableName" :dsName="dsName"></generator>
    </el-card>

    <el-card class="layout-padding-auto" style="margin-top: 20px" shadow="hover" v-if="active === 1">
      <edit-table ref="editTableRef" :tableName="tableName" :dsName="dsName"></edit-table>
    </el-card>
    <el-space wrap style="justify-content: center">
      <el-button style="margin-top: 12px" @click="pre" v-if="active > 0">上一步</el-button>
      <el-button style="margin-top: 12px" @click="next" v-if="active < 1">下一步</el-button>
      <el-button style="margin-top: 12px" @click="preview" v-if="active === 1">保存并预览</el-button>
      <el-button style="margin-top: 12px" @click="generatorHandle" v-if="active === 1">保存并生成</el-button>
    </el-space>
    <preview-dialog ref="previewDialogRef"></preview-dialog>
  </div>
</template>

<script lang="ts" setup>
import { useGeneratorCodeApi } from "/@/api/gen/table";
import { useRoute } from "vue-router";
import { downBlobFile } from "/@/utils/other";
import { useMessage } from "/@/hooks/message";
import { useI18n } from "vue-i18n";

const Generator = defineAsyncComponent(() => import('../table/generator.vue'))
const EditTable = defineAsyncComponent(() => import('../table/edit.vue'))
const PreviewDialog = defineAsyncComponent(() => import('../table/preview.vue'));
const previewDialogRef = ref()
const generatorRef = ref()

const route = useRoute()
const { t } = useI18n()

const active = ref(0)

const tableId = ref()
const generatorType = ref()

const next = async () => {
  if (active.value === 0) {
    try {
      const dataform = await generatorRef.value.submitHandle()
      tableId.value = dataform.id
      generatorType.value = dataform.generatorType
    } catch (e) {
      return
    }
  }
  if (active.value === 1) {
    try {
      await editTableRef.value.submitHandle()
    } catch (e) {
      return
    }
  }

  if (active.value++ >= 2) {
    active.value = 2
    return
  }
}

const pre = () => {
  if (active.value-- <= 0) {
    active.value = 0
    return
  }
}

const tableName = ref()
const dsName = ref()

const editTableRef = ref()

const preview = async () => {
  await editTableRef.value.submitHandle()
  previewDialogRef.value.openDialog(tableId.value)
}


// 生成
const generatorHandle = async () => {
  await editTableRef.value.submitHandle()
  // 生成代码，zip压缩包
  if (generatorType.value === 0) {
    downBlobFile('/gen/generator/download?tableIds=' + [tableId.value].join(','), {}, `${tableName.value}.zip`)
  }

  // 写入到指定目录
  if (generatorType.value === 1) {
    useGeneratorCodeApi([tableId.value].join(',')).then(() => {
      useMessage().success(t('common.optSuccessText'))
    })
  }
}




onMounted(() => {
  tableName.value = route.query.tableName
  dsName.value = route.query.dsName
})


</script>
