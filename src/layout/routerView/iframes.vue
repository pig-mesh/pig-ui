<template>
	<div class="layout-padding layout-padding-unset layout-iframe">
		<div class="layout-padding-auto layout-padding-view">
			<div class="w100" v-for="v in setIframeList" :key="v.path" v-loading="v.meta.loading" element-loading-background="white">
				<transition-group :name="name">
					<iframe
						:src="v.meta.isLink"
						:key="v.path"
						frameborder="0"
						height="100%"
						width="100%"
						style="position: absolute"
						:data-url="v.path"
						v-show="getRoutePath === v.path"
						ref="iframeRef"
					/>
				</transition-group>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="layoutIframeView">
const props = defineProps({
	refreshKey: {
		type: String,
		default: () => '',
	},
	name: {
		type: String,
		default: () => 'slide-right',
	},
	list: {
		type: Array,
		default: () => [],
	},
});

const iframeRef = ref();
const route = useRoute();

const setIframeList = computed(() => {
	return (<RouteItems>props.list).filter((v: RouteItem) => v.meta?.isIframeOpen);
});

const getRoutePath = computed(() => route.path);

const closeIframeLoading = (val: string, item: RouteItem) => {
	nextTick(() => {
		if (!iframeRef.value) return;
		iframeRef.value.forEach((v: HTMLElement) => {
			if (v.dataset.url === val) {
				v.onload = () => {
					if (item.meta?.isIframeOpen && item.meta.loading) item.meta.loading = false;
				};
			}
		});
	});
};
// 监听路由变化，初始化 iframe 数据
watch(
	() => route.fullPath,
	(val) => {
		const item: any = props.list.find((v: any) => v.path === val);
		if (!item) return;
		if (!item.meta.isIframeOpen) item.meta.isIframeOpen = true;
		closeIframeLoading(val, item);
	},
	{ immediate: true }
);

// 监听 iframe refreshKey 变化，用于 tagsView 右键菜单刷新
watch(
	() => props.refreshKey,
	() => {
		const item: any = props.list.find((v: any) => v.path === route.path);
		if (!item) return;
		if (item.meta.isIframeOpen) item.meta.isIframeOpen = false;
		setTimeout(() => {
			item.meta.isIframeOpen = true;
			item.meta.loading = true;
			closeIframeLoading(route.fullPath, item);
		});
	},
	{
		deep: true,
	}
);
</script>
