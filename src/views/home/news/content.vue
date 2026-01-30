<template>
  <!-- 消息内容 -->
  <el-drawer v-model="visible" size="50%" direction="rtl" :title="t('home.announcement')">
    <div class="flex justify-center">
      <div class="w-full max-w-[680px]">
        <!-- 标题 -->
        <h1 class="mb-4 text-2xl font-bold leading-tight text-gray-900">
          {{ currentNew.title }}
        </h1>

        <!-- 元信息 - 淡色小字 -->
        <div class="flex items-center mb-8 space-x-4 text-sm text-gray-400">
          <span>{{ currentNew.createBy }}</span>
          <span>·</span>
          <span>{{ currentNew.createTime }}</span>
          <span v-if="currentNew.readFlag === '0'" class="text-orange-400">· {{ $t('msg.unread') }}</span>
        </div>

        <!-- 分隔线 -->
        <div class="mb-8 border-t border-gray-100"></div>

        <!-- 正文内容 -->
        <div class="text-base leading-relaxed text-gray-700" v-html="currentNew.content"></div>

        <!-- 底部提示 -->
        <div class="pt-6 mt-12 text-center border-t border-gray-100">
          <span class="text-xs text-gray-300">{{ t('home.thanksForReading') }}</span>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script setup lang="ts" name="newsLetter">
import { readUserMessage } from '/@/api/admin/message';
import { useI18n } from 'vue-i18n';

/**
 * 定义组件事件
 */
const emit = defineEmits(['refresh']);

/**
 * 国际化工具
 */
const { t } = useI18n();

/**
 * 当前消息数据
 */
const currentNew = ref();

/**
 * 抽屉显示状态
 */
const visible = ref(false);

/**
 * 打开消息详情抽屉
 * @param item - 消息数据
 */
const openDialog = (item: any): void => {
	visible.value = true;
	currentNew.value = item;
	readMessage(item);
};

/**
 * 标记消息为已读
 * @param item - 消息数据
 */
const readMessage = async (item: any): Promise<void> => {
	if (item.readFlag === '1') {
		return;
	}
	await readUserMessage({ id: item.id });
	emit('refresh');
};

/**
 * 暴露方法供父组件调用
 */
defineExpose({
	openDialog,
});
</script>