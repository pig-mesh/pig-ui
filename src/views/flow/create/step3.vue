<template>
  <div class="app-container">
    <!-- 流程节点绘制 -->
    <div class="flow-design-area">
      <el-scrollbar ref="scrollbarRef">
        <section class="dingflow-design">
          <div class="box-scale" :style="`transform: scale(${nowVal / 100});`">
            <nodeWrap v-model:nodeConfig="nodeConfig"/>
            <div class="end-node">
              <div class="end-node-circle"></div>
              <div class="end-node-text">{{ $t('flow.end') }}</div>
            </div>
          </div>
        </section>
      </el-scrollbar>
    </div>

    <!-- 缩放控件 - 始终固定在页面右下角 -->
    <div class="fixed right-16 bottom-16 z-50 flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 shadow-md">
        <el-tooltip content="缩小" placement="top">
          <el-button :icon="ZoomOut" :disabled="nowVal <= MIN_ZOOM" circle size="small" @click="zoomOut"/>
        </el-tooltip>
        <span class="inline-block min-w-[42px] text-center text-sm tabular-nums text-gray-600">{{ nowVal }}%</span>
        <el-tooltip content="放大" placement="top">
          <el-button :icon="ZoomIn" :disabled="nowVal >= MAX_ZOOM" circle size="small" @click="zoomIn"/>
        </el-tooltip>
        <el-divider direction="vertical"/>
        <el-tooltip content="重置缩放" placement="top">
          <el-button :icon="RefreshRight" circle size="small" @click="nowVal = 100"/>
        </el-tooltip>
    </div>

    <!-- 发起人 -->
    <promoterDrawer/>
    <!-- 审批人 -->
    <approverDrawer/>
    <!-- 抄送人 -->
    <copyerDrawer/>
    <!-- 条件分支 -->
    <conditionDrawer/>
    <!-- 延时器 -->
    <timerDrawer/>
    <!-- 触发器 -->
    <triggerDrawer/>
  </div>
</template>

<script setup lang="ts">
import nodeWrap from '../workflow/components/nodeWrap.vue';
import promoterDrawer from '../workflow/components/drawer/promoterDrawer.vue';
import approverDrawer from '../workflow/components/drawer/approverDrawer.vue';
import copyerDrawer from '../workflow/components/drawer/copyerDrawer.vue';
import conditionDrawer from '../workflow/components/drawer/conditionDrawer.vue';
import timerDrawer from '../workflow/components/drawer/timerDrawer.vue';
import triggerDrawer from '../workflow/components/drawer/triggerDrawer.vue';
import {ZoomIn, ZoomOut, RefreshRight} from '@element-plus/icons-vue';
import {useI18n} from 'vue-i18n';
import {useEventListener} from '@vueuse/core';
import {useFlowStore} from "../workflow/stores/flow";

const MIN_ZOOM = 50;
const MAX_ZOOM = 300;
const ZOOM_STEP = 10;

const store = useFlowStore();

const {t} = useI18n();

const tipList = ref<string[]>([]);
const nowVal = ref(100);
const nodeConfig = ref<Record<string, any>>({
  nodeName: t('flow.initiator'),
  type: 0,
  id: 'root',
  formPerms: {},
  eventConfig: '',
  nodeUserList: [],
  childNode: {},
});

const props = defineProps({
  nodeConfigObj: {
    type: Object,
  },
});

watch(
    () => props.nodeConfigObj,
    (val) => {
      if (val) {
        nodeConfig.value = val;
      }
    }
);

const reErr = ({childNode}: any) => {
  if (childNode) {
    const {type, error, nodeName, conditionNodes} = childNode;
    if (type === 1 || type === 2) {
      if (error) {
        tipList.value.push(nodeName + ' 未设置人员');
      }
      reErr(childNode);
    } else if (type === 3) {
      reErr(childNode);
    } else if (type === 4) {
      reErr(childNode);
      for (let i = 0; i < conditionNodes.length; i++) {
        const conditionNode = conditionNodes[i];

        // 检查表达式方式（conditionType === 1）的验证
        if (conditionNode.conditionType === 1) {
          // 验证规则名称
          if (!conditionNode.ruleName || !conditionNode.ruleName.trim()) {
            tipList.value.push(conditionNode.nodeName + ' 请输入规则名称');
          }
          // 验证表达式文本
          if (!conditionNode.expressionText || !conditionNode.expressionText.trim()) {
            tipList.value.push(conditionNode.nodeName + ' 请输入条件表达式');
          }
        } else {
          // 原有的条件组方式验证
          if (conditionNode.error) {
            tipList.value.push('请设置' + conditionNode.nodeName + '的条件');
          }
        }

        reErr(conditionNode);
      }
    }
  }
};

watch(() => nodeConfig.value, (v) => {
  store.setStep3(v);
}, {deep: true});
const getProcessData = async () => {
  return nodeConfig.value;
};
const clampZoom = (val: number) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, val));

const zoomIn = () => {
  nowVal.value = clampZoom(nowVal.value + ZOOM_STEP);
};

const zoomOut = () => {
  nowVal.value = clampZoom(nowVal.value - ZOOM_STEP);
};

// Ctrl/Cmd + 滚轮缩放
const scrollbarRef = ref();
useEventListener(scrollbarRef, 'wheel', (e: WheelEvent) => {
  if (e.ctrlKey || e.metaKey) {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
    nowVal.value = clampZoom(nowVal.value + delta);
  }
}, {passive: false});
const validate = async (): Promise<void> => {
  tipList.value = [];
  if (nodeConfig.value.childNode === undefined || nodeConfig.value.childNode.id === undefined) {
    tipList.value = ['请完善流程节点'];
  }

  reErr(nodeConfig.value);
  if (tipList.value.length !== 0) {
    throw tipList.value;
  }
};
defineExpose({validate, getProcessData});
</script>
<style scoped lang="scss">
@import '../workflow/css/workflow.css';

.app-container {
  height: 100%;
}

.flow-design-area {
  height: calc(100vh - 140px);
}
</style>
