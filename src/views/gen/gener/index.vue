<template>
	<div class="layout-padding">
		<el-card class="layout-padding-auto" shadow="hover">
			<el-steps :active="active" finish-status="success" simple>
				<el-step title="基础信息" @click="go(0)">
					<template #icon>
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 0 1-.657.643 48.39 48.39 0 0 1-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 0 1-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 0 0-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 0 1-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 0 0 .657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 0 1-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 0 0 5.427-.63 48.05 48.05 0 0 0 .582-4.717.532.532 0 0 0-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.96.401v0a.656.656 0 0 0 .658-.663 48.422 48.422 0 0 0-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 0 1-.61-.58v0Z"
							/>
						</svg>
					</template>
				</el-step>
				<el-step title="数据修改" @click="go(1)">
					<template #icon>
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5"
							/>
						</svg>
					</template>
				</el-step>
			</el-steps>
		</el-card>

		<el-card class="layout-padding-auto mt5" shadow="hover">
			<!-- 生成基本信息设置 -->
			<generator ref="generatorRef" :tableName="tableName" :dsName="dsName" v-if="active === 0" />
			<!-- 字段编辑设置 -->
			<edit-table ref="editTableRef" :tableName="tableName" :dsName="dsName" v-if="active === 1" />

			<div class="flex justify-center gap-4 mt-6">
				<el-button v-if="active === 0" plain type="primary" size="large" icon="ArrowRight" @click="go(1)"> 下一步 </el-button>
				<el-button v-if="active === 1" plain icon="ArrowLeft" size="large" @click="go(0)"> 上一步 </el-button>
				<el-button v-if="active === 1" type="primary" size="large" icon="View" @click="preview"> 保存并预览 </el-button>
				<el-button v-if="active === 1" plain type="primary" size="large" icon="Download" @click="generatorHandle"> 保存并生成 </el-button>
			</div>
		</el-card>

		<!-- 预览基本信息 -->
		<preview-dialog ref="previewDialogRef" />
	</div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { useGeneratorCodeApi } from '/@/api/gen/table';
import { useMessage } from '/@/hooks/message';
import { downBlobFile } from '/@/utils/other';

const { t } = useI18n();
const Generator = defineAsyncComponent(() => import('../table/generator.vue'));
const EditTable = defineAsyncComponent(() => import('../table/edit.vue'));
const PreviewDialog = defineAsyncComponent(() => import('../table/preview.vue'));
const previewDialogRef = ref();
const generatorRef = ref();

const route = useRoute();
const active = ref(0);
const tableId = ref();
const tableName = ref();
const dsName = ref();
const editTableRef = ref();
const generatorType = ref();

// 跳转
const go = async (activeNum: number) => {
	try {
		if (activeNum === 0) {
			await editTableRef.value.submitHandle();
		} else if (activeNum === 1) {
			const dataform = await generatorRef.value.submitHandle();
			tableId.value = dataform.id;
			generatorType.value = dataform.generatorType;
		}
		if (active.value === activeNum) return;
		active.value = activeNum;
	} catch (e) {
		console.error(e);
	}
};

// 预览代码
const preview = async () => {
	await editTableRef.value.submitHandle();
	previewDialogRef.value.openDialog(tableId.value);
};

// 生成
const generatorHandle = async () => {
	await editTableRef.value.submitHandle();
	// 生成代码，zip压缩包
	if (generatorType.value === '0') {
		downBlobFile(`/gen/generator/download?tableIds=${[tableId.value].join(',')}`, {}, `${tableName.value}.zip`).catch((msg) => {
			useMessage().error(msg);
		});
	}

	// 写入到指定目录
	if (generatorType.value === '1') {
		useGeneratorCodeApi([tableId.value].join(','))
			.then(() => {
				useMessage().success(t('common.optSuccessText'));
			})
			.catch(({ msg }) => {
				useMessage().error(msg);
			});
	}
};

onMounted(() => {
	tableName.value = route.query.tableName;
	dsName.value = route.query.dsName;
});
</script>

<style scoped>
.layout-padding {
	height: auto !important;
}
</style>
