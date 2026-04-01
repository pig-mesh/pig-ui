<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-tabs v-model="activeTab">
				<el-tab-pane name="external">
					<template #label>
						<span>{{ $t('social.externalTab') }}</span>
						<tip :content="$t('social.externalTip')" class="ml4" />
					</template>
					<ExternalKeys />
				</el-tab-pane>
				<el-tab-pane name="internal">
					<template #label>
						<span>{{ $t('social.internalTab') }}</span>
						<tip :content="$t('social.internalTip')" class="ml4" />
					</template>
					<InternalKeys />
				</el-tab-pane>
			</el-tabs>
		</div>
	</div>
</template>

<script lang="ts" name="systemAppSocialDetails" setup>
const ExternalKeys = defineAsyncComponent(() => import('./ExternalKeys.vue'));
const InternalKeys = defineAsyncComponent(() => import('./InternalKeys.vue'));

const activeTab = ref('external');
</script>
