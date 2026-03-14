<template>
	<transition name="el-zoom-in-center">
		<div
			aria-hidden="true"
			class="el-dropdown__popper el-popper is-light is-pure custom-contextmenu"
			role="tooltip"
			data-popper-placement="bottom"
			:style="`top: ${dropdowns.y + 5}px;left: ${dropdowns.x}px;`"
			:key="Math.random()"
			v-show="state.isShow"
		>
			<ul class="el-dropdown-menu">
				<template v-for="(v, k) in state.dropdownList">
					<li
						class="el-dropdown-menu__item"
						aria-disabled="false"
						tabindex="-1"
						:key="k"
						v-if="!v.affix && v.show"
						@click="onCurrentContextmenuClick(v.contextMenuClickId)"
					>
						<SvgIcon :name="v.icon" />
						<span>{{ $t(v.txt) }}</span>
					</li>
				</template>
			</ul>
			<div class="el-popper__arrow" :style="{ left: `${state.arrowLeft}px` }"></div>
		</div>
	</transition>
</template>

<script setup lang="ts" name="layoutTagsViewContextmenu">
import { computed, reactive, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useTagsViewRoutes } from '/@/stores/tagsViewRoutes';
import { useEventListener } from '@vueuse/core';

const { favoriteRoutes } = storeToRefs(useTagsViewRoutes());

const props = defineProps({
	dropdown: {
		type: Object,
		default: () => ({ x: 0, y: 0 }),
	},
});

const emit = defineEmits(['currentContextmenuClick']);
// 定义变量内容
const state = reactive({
	isShow: false,
	dropdownList: [
		{ contextMenuClickId: 0, txt: 'tagsView.refresh', affix: false, show: true, icon: 'ele-RefreshRight' },
		{ contextMenuClickId: 1, txt: 'tagsView.close', affix: false, show: true, icon: 'ele-Close' },
		{ contextMenuClickId: 2, txt: 'tagsView.closeOther', affix: false, show: true, icon: 'ele-CircleClose' },
		{ contextMenuClickId: 3, txt: 'tagsView.closeAll', affix: false, show: true, icon: 'ele-FolderDelete' },
		{
			contextMenuClickId: 4,
			txt: 'tagsView.fullscreen',
			affix: false,
			show: true,
			icon: 'iconfont icon-fullscreen',
		},
		{
			contextMenuClickId: 5,
			txt: 'tagsView.favorite',
			affix: false,
			show: true,
			icon: 'ele-Star',
		},
	],
	item: {},
	arrowLeft: 10,
});

const dropdowns = computed(() => {
	// 117 为 Dropdown 下拉菜单的宽度
	if (props.dropdown.x + 117 > document.documentElement.clientWidth) {
		return { x: document.documentElement.clientWidth - 117 - 5, y: props.dropdown.y };
	}
	return props.dropdown;
});

const onCurrentContextmenuClick = (contextMenuClickId: number) => {
	emit('currentContextmenuClick', Object.assign({}, { contextMenuClickId }, state.item));
};

// 打开右键菜单：判断是否固定，固定则不显示关闭按钮
const openContextmenu = (item: RouteItem) => {
	state.item = item;
	state.dropdownList[1].affix = !!item.meta?.isAffix;
	state.dropdownList[5].show = !favoriteRoutes.value.find((route) => route.path === item.path);

	closeContextmenu();
	setTimeout(() => {
		state.isShow = true;
	}, 10);
};

const closeContextmenu = () => {
	state.isShow = false;
};

useEventListener(document.body, 'click', closeContextmenu);

// 监听下拉菜单位置
watch(
	() => props.dropdown,
	({ x }) => {
		if (x + 117 > document.documentElement.clientWidth) state.arrowLeft = 117 - (document.documentElement.clientWidth - x);
		else state.arrowLeft = 10;
	},
	{
		deep: true,
	}
);

defineExpose({ openContextmenu });
</script>

<style scoped lang="scss">
.custom-contextmenu {
	transform-origin: center top;
	z-index: 2190;
	position: fixed;
	.el-dropdown-menu__item {
		font-size: 12px !important;
		white-space: nowrap;
		i {
			font-size: 12px !important;
		}
	}
}
</style>
