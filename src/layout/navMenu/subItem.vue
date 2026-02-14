<template>
	<template v-for="val in chils">
		<el-sub-menu :index="val.path" :key="val.path" v-if="val.children && val.children.length > 0">
			<template #title>
				<SvgIcon :name="val.meta.icon" />
				<span>{{ $t(val.meta.title || val.name) }}</span>
			</template>
			<sub-item :chil="val.children" />
		</el-sub-menu>
		<template v-else>
			<el-menu-item :index="val.path" :key="val.path">
				<template v-if="!val.meta.isLink || (val.meta.isLink && val.meta.isIframe)">
					<SvgIcon :name="val.meta.icon" />
					<span>{{ $t(val.meta.title || val.name) }}</span>
				</template>
				<template v-else>
					<a class="w100" @click.prevent="onALinkClick(val)">
						<SvgIcon :name="val.meta.icon" />
						{{ $t(val.meta.title || val.name) }}
					</a>
				</template>
			</el-menu-item>
		</template>
	</template>
</template>

<script setup lang="ts" name="navMenuSubItem">
import { computed } from 'vue';
import { RouteRecordRaw } from 'vue-router';
import other from '/@/utils/other';

const props = defineProps({
	chil: {
		type: Array<RouteRecordRaw>,
		default: () => [],
	},
});

const chils = computed(() => <RouteItems>props.chil);

const onALinkClick = (val: RouteItem) => {
	other.handleOpenLink(val);
};
</script>
