<template>
  <div class="layout-padding">
    <el-card class="layout-padding-auto" shadow="hover">
      <el-steps :active="active" finish-status="success" simple style="margin-top: 20px">
        <el-step title="基础信息" />
        <el-step title="数据修改" />
        <el-step title="生成预览" />
      </el-steps>
    </el-card>
    <el-card class="layout-padding-auto" style="margin-top: 20px" shadow="hover" v-if="active === 0">
      <generator ref="generatorRef" :tableName="tableName" :dsName="dsName"></generator>
    </el-card>

    <el-card class="layout-padding-auto" style="margin-top: 20px" shadow="hover" v-if="active === 1">
      <edit-table ref="editTableRef" :tableName="tableName" :dsName="dsName"></edit-table>
    </el-card>

    <el-card class="layout-padding-auto" style="margin-top: 20px" shadow="hover" v-if="active === 2">
      <el-form ref="dataFormRef"  label-width="120px" :model="dataForm">
        <el-form-item label="生成方式" prop="generatorType">
          <el-radio-group v-model="dataForm.generatorType">
            <el-radio-button :label="1">自定义路径</el-radio-button>
            <el-radio-button :label="0">ZIP 压缩包</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="dataForm.generatorType === 1" label="后端生成路径" prop="backendPath">
          <el-input v-model="dataForm.backendPath" placeholder="后端生成路径"></el-input>
        </el-form-item>
        <el-form-item v-if="dataForm.generatorType === 1" label="前端生成路径" prop="frontendPath">
          <el-input v-model="dataForm.frontendPath" placeholder="前端生成路径"></el-input>
        </el-form-item>
        <el-form-item>
          <el-space wrap>
            <el-button style="margin-top: 12px" @click="previewDialogRef.openDialog(tableId)">预览</el-button>
            <el-button style="margin-top: 12px" @click="generatorHandle">生成</el-button>
          </el-space>
        </el-form-item>
      </el-form>
    </el-card>
    <el-space wrap>
      <el-button style="margin-top: 12px" @click="pre" v-if="active > 0">上一步</el-button>
      <el-button style="margin-top: 12px" @click="next" v-if="active < 2">下一步</el-button>
    </el-space>
    <preview-dialog ref="previewDialogRef"></preview-dialog>
  </div>
</template>

<script lang="ts" setup>
import {useGeneratorCodeApi} from "/@/api/gen/table";

const Generator = defineAsyncComponent(() => import('../table/generator.vue'))
const EditTable = defineAsyncComponent(() => import('../table/edit.vue'))
const PreviewDialog = defineAsyncComponent(() => import('../table/preview.vue'));
const previewDialogRef = ref()
const generatorRef = ref()
import { useRoute } from "vue-router";
import {downBlobFile} from "/@/utils/other";
import {useMessage} from "/@/hooks/message";
import {useI18n} from "vue-i18n";
const route = useRoute()
const { t } = useI18n()

const active = ref(0)

const tableId = ref()
const dataForm = reactive({
  generatorType: 0,
  frontendPath: ''
})

const next = async () => {
  if(active.value === 0){
    try {
      await generatorRef.value.submitHandle()
    }catch (e) {
      return
    }
  }
  if(active.value === 1){
    try {
      const table =  await editTableRef.value.submitHandle()
      tableId.value = table
    }catch (e) {
      return
    }
  }

  if (active.value++ >= 2){
    active.value = 2
    return
  }
}

const pre = () => {
  if (active.value-- <=0){
    active.value = 0
    return
  }
}

const tableName = ref()
const dsName = ref()

const editTableRef = ref()

// 生成
const generatorHandle = () => {
    // 生成代码，zip压缩包
    if (dataForm.generatorType === 0) {
      downBlobFile('/gen/generator/download?tableIds=' + [tableId.value].join(','), {}, `${tableName.value}.zip`)
    }

    // 写入到指定目录
    if (dataForm.generatorType === 1) {
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
