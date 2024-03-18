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
			<div class="card-header">
				<span>{{ $t('home.newsletterTip') }}</span>
				<el-button link class="button" text @click="openList">{{ $t('home.moreTip') }}</el-button>
			</div>
		</template>
		<el-timeline v-if="newsList.length > 0">
			<div class="relative">
				<el-timeline-item v-for="(item, index) in newsList" :key="index" :timestamp="item.createTime" @click="contentRef.openDialog(item)">
					<button class="absolute right-0 px-3 rotate-[10deg] -top-2 border bg-primary text-white font-bold">
						{{ item.readFlag === '1' ? $t('msg.readed') : $t('msg.unread') }}
					</button>
					<div class="p-2 border border-gray-400 purple_border">
						{{ item.title }}
					</div>
				</el-timeline-item>
			</div>
		</el-timeline>
		<el-empty :image-size="120" v-else />
	</el-card>

	<!-- 消息列表 -->
	<news-lists ref="listRef"/>

	<!-- 消息内容 -->
	<news-content ref="contentRef" @refresh="getUserMessage" />
</template>

<script setup lang="ts" name="newsLetter">
import { fetchUserMessageList } from '/@/api/admin/message';

const NewsContent = defineAsyncComponent(() => import('/@/views/home/news/content.vue'));
const NewsLists = defineAsyncComponent(() => import('/@/views/home/news/list.vue'));

const listRef = ref();
const contentRef = ref();
const visible = ref(false);
const showList = ref(false);
const newsList = ref([]);

// 获取用户的信息
const getUserMessage = () => {
	// 取前三条数据
	return fetchUserMessageList({ current: 1, size: 3, category: '0' }).then((res) => {
		newsList.value = res.data.records;
	});
};

const openList = () => {
	showList.value = true;
	listRef.value.openDialog('0');
};

onMounted(() => {
	getUserMessage();
});
</script>
<style scoped lang="scss">
.card-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
}
</style>
