<script lang="ts">
export default {
	title: '系统公告',
	icon: 'MuteNotification',
	description: '系统公告展示',
};
</script>
<template>
	<el-card class="h-96">
		<template #header>
			<div class="flex justify-between items-center">
				<span class="text-[15px] font-semibold text-gray-800 dark:text-gray-100">{{ $t('home.newsletterTip') }}</span>
				<el-button text class="button" @click="openList">
					{{ $t('home.moreTip') }}
					<el-icon class="ml-1"><ArrowRight /></el-icon>
				</el-button>
			</div>
		</template>
		<div class="flex flex-col gap-1" v-if="newsList.length > 0">
			<div
				v-for="(item, index) in newsList"
				:key="index"
				class="py-2.5 px-2 rounded-lg cursor-pointer transition-colors hover:bg-fill"
				@click="contentRef.openDialog(item)"
			>
				<div class="flex items-center gap-3">
					<div class="w-1 h-8 rounded-full flex-shrink-0" :class="item.readFlag === '1' ? 'bg-gray-200 dark:bg-gray-600' : 'bg-primary'"></div>
					<div class="flex-1 min-w-0">
						<p class="text-[13px] text-gray-700 dark:text-gray-300 truncate">{{ item.title }}</p>
						<p class="text-xs text-gray-400 mt-0.5">{{ item.createTime }}</p>
					</div>
					<el-tag size="small" :type="item.readFlag === '1' ? 'info' : 'warning'" effect="plain" round class="text-xs flex-shrink-0">
						{{ item.readFlag === '1' ? $t('msg.readed') : $t('msg.unread') }}
					</el-tag>
				</div>
			</div>
		</div>
		<el-empty :image-size="120" v-else />
	</el-card>

	<!-- 消息列表 -->
	<news-lists ref="listRef"/>

	<!-- 消息内容 -->
	<news-content ref="contentRef" @refresh="getUserMessage" />
</template>

<script setup lang="ts" name="newsLetter">
import { fetchUserMessageList } from '/@/api/admin/message';

import NewsContent from '/@/views/home/news/content.vue';
import NewsLists from '/@/views/home/news/list.vue';

const listRef = ref();
const contentRef = ref();
const newsList = ref([]);

// 获取用户的信息
const getUserMessage = () => {
	// 取前三条数据
	return fetchUserMessageList({ current: 1, size: 3, category: '0' }).then((res) => {
		newsList.value = res.data.records;
	});
};

const openList = () => {
	listRef.value.openDialog('0');
};

onMounted(() => {
	getUserMessage();
});
</script>
<style scoped lang="scss">
</style>
