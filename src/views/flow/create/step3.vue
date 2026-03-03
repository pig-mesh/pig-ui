<template>
  <div class="app-container">
    <!-- 流程节点绘制 -->
    <div class="fd-nav-content">
      <el-scrollbar style="height: 600px">
        <section class="dingflow-design">
          <div class="zoom">
            <div class="zoom-out" :class="nowVal === 50 && 'disabled'" @click="zoomSize(1)"></div>
            <span>{{ nowVal }}%</span>
            <div class="zoom-in" :class="nowVal === 300 && 'disabled'" @click="zoomSize(2)"></div>
          </div>
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
  </div>
</template>

<script setup lang="ts">
import nodeWrap from '../workflow/components/nodeWrap.vue';
import promoterDrawer from '../workflow/components/drawer/promoterDrawer.vue';
import approverDrawer from '../workflow/components/drawer/approverDrawer.vue';
import copyerDrawer from '../workflow/components/drawer/copyerDrawer.vue';
import conditionDrawer from '../workflow/components/drawer/conditionDrawer.vue';
import timerDrawer from '../workflow/components/drawer/timerDrawer.vue';
import {useI18n} from 'vue-i18n';
import {useFlowStore} from "../workflow/stores/flow";

const store = useFlowStore();

const {t} = useI18n();

const tipList = ref<string[]>([]);
const nowVal = ref(100);
const nodeConfig = ref({
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
      nodeConfig.value = val;
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
const zoomSize = (type: number) => {
  if (type === 1) {
    if (nowVal.value === 50) {
      return;
    }
    nowVal.value -= 10;
  } else {
    if (nowVal.value === 300) {
      return;
    }
    nowVal.value += 10;
  }
};
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

.error-modal-list {
  width: 455px;
}
</style>
