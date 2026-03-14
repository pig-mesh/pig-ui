<template>
	<div class="layout-search-dialog">
		<el-dialog v-model="state.isShowSearch" destroy-on-close :show-close="false">
			<template #footer>
				<el-autocomplete
					v-model="state.menuQuery"
					:fetch-suggestions="menuSearch"
					:placeholder="$t('user.searchPlaceholder')"
					ref="layoutMenuAutocompleteRef"
					@select="onHandleSelect"
					:fit-input-width="true"
				>
					<template #prefix>
						<el-icon class="el-input__icon">
							<ele-Search />
						</el-icon>
					</template>
					<template #default="{ item }">
						<div>
							<SvgIcon :name="item.meta.icon" class="mr5" />
							{{ $t(item.meta?.title || item.name) }}
						</div>
					</template>
				</el-autocomplete>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="layoutBreadcrumbSearch">
import { useI18n } from 'vue-i18n';
import { useTagsViewRoutes } from '/@/stores/tagsViewRoutes';

const { tagsViewRoutes } = storeToRefs(useTagsViewRoutes());
const layoutMenuAutocompleteRef = ref();
const { t } = useI18n();
const router = useRouter();
const state = reactive<SearchState>({
	isShowSearch: false,
	menuQuery: '',
	tagsViewList: [],
});

const openSearch = () => {
	state.menuQuery = '';
	state.isShowSearch = true;
	initTageView();
	nextTick(() => {
		setTimeout(() => {
			layoutMenuAutocompleteRef.value.focus();
		});
	});
};

const closeSearch = () => {
	state.isShowSearch = false;
};

const menuSearch = (queryString: string, cb: Function) => {
	const results = queryString ? state.tagsViewList.filter(createFilter(queryString)) : state.tagsViewList;
	cb(results);
};
// 菜单搜索过滤
const createFilter = (queryString: string) => {
	return (restaurant: RouteItem) => {
		const title = restaurant.meta?.title || restaurant.name;
		return restaurant.path.toLowerCase().indexOf(queryString.toLowerCase()) > -1 || t(title as string).indexOf(queryString.toLowerCase()) > -1;
	};
};

const initTageView = () => {
	if (state.tagsViewList.length > 0) return;
	tagsViewRoutes.value.map((v: RouteItem) => {
		if (!v.meta?.isHide) state.tagsViewList.push({ ...v });
	});
};

const onHandleSelect = (item: RouteItem) => {
	const { path, redirect } = item;
	if (item.meta?.isLink && !item.meta?.isIframe) window.open(item.meta?.isLink);
	else if (redirect) router.push(redirect);
	else router.push(path);
	closeSearch();
};

defineExpose({ openSearch });
</script>

<style scoped lang="scss">
.layout-search-dialog {
	position: relative;
	:deep(.el-dialog) {
    width: 560px;
		.el-dialog__header,
		.el-dialog__body {
			display: none;
		}
		.el-dialog__footer {
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
			top: -53vh;
		}
	}
	:deep(.el-autocomplete) {
    position: absolute;
    width: 560px;
		top: 53vh;
		left: 50%;
		transform: translateX(-50%);
	}
}
</style>
