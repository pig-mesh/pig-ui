<template>
  <el-drawer v-model="visible" size="50%" direction="rtl" :title="t('home.announcement')">
    <div class="flex justify-center">
      <div class="w-full max-w-[680px]">
        <h1 class="mb-4 text-2xl font-bold leading-tight text-gray-900 dark:text-gray-50">
          {{ currentNew.title }}
        </h1>

        <div class="flex items-center mb-8 space-x-4 text-sm text-gray-400">
          <span>{{ currentNew.createBy }}</span>
          <span>·</span>
          <span>{{ currentNew.createTime }}</span>
          <span v-if="currentNew.readFlag === '0'" class="text-orange-400">· {{ $t('msg.unread') }}</span>
        </div>

        <div class="mb-8 border-t border-gray-100 dark:border-gray-800"></div>

        <div class="text-base leading-relaxed text-gray-700 dark:text-gray-300" v-html="currentNew.content"></div>

        <div class="pt-6 mt-12 text-center border-t border-gray-100 dark:border-gray-800">
          <span class="text-xs text-gray-400 dark:text-gray-600">{{ t('home.thanksForReading') }}</span>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script setup lang="ts" name="newsLetter">
import { readUserMessage } from '/@/api/admin/message';
import { useI18n } from 'vue-i18n';

const emit = defineEmits(['refresh']);
const { t } = useI18n();
const currentNew = ref();
const visible = ref(false);

const openDialog = (item: any): void => {
	visible.value = true;
	currentNew.value = item;
	readMessage(item);
};

const readMessage = async (item: any): Promise<void> => {
	if (item.readFlag === '1') {
		return;
	}
	await readUserMessage({ id: item.id });
	emit('refresh');
};

defineExpose({
	openDialog,
});
</script>
