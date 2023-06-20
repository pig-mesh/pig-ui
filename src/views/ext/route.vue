<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-alert title="路由配置是非常专业的事情，不建议非工程师操作" type="warning" />

			<el-scrollbar class="mt10">
				<vue-jsoneditor mode="table" :queryLanguagesIds="queryLanguages" v-model:json="jsonData" v-if="show" v-loading="loading" />
				<div align="center" class="copy_btn">
					<el-button type="primary" @click="edit()" :disabled="loading">更新</el-button>
				</div>
				<div align="center">
					<el-button type="primary" @click="edit()" :disabled="loading">更新</el-button>
				</div>
			</el-scrollbar>
		</div>
	</div>
</template>

<script lang="ts" name="routeConfig" setup>
import VueJsoneditor from 'vue3-ts-jsoneditor';
import { fetchList, putObj, refreshObj } from '/@/api/admin/route';
import type { QueryLanguageId } from 'vue3-ts-jsoneditor';
import { useMessage } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const jsonData = ref({});
const loading = ref(false);
const show = ref(false);
const queryLanguages = ref<QueryLanguageId[]>(['javascript', 'lodash', 'jmespath']);

const edit = async () => {
	loading.value = true;

	try {
		await putObj(jsonData.value);
		await refreshObj();
		useMessage().success(t('common.optSuccessText'));
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};

onMounted(() => {
	fetchList().then((response) => {
		const result = response.data;
		for (var i = 0; i < result.length; i++) {
			const route = result[i];
			if (route.predicates) {
				const predicates = route.predicates;
				route.predicates = JSON.parse(predicates);
			}
			if (route.filters) {
				const filters = route.filters;
				route.filters = JSON.parse(filters);
			}
		}
		jsonData.value = result;
		// 准备好数据再去渲染jsoneditor 组件，避免个别情况下渲染失败 #I7890E
		show.value = true;
	});
});
</script>

<style lang="scss" scoped>
.copy_btn {
	position: absolute;
	top: 60px;
	right: 20px;
	z-index: 9;
	color: rgb(255, 255, 255);
}
</style>
