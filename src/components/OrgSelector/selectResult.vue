<!--
 * @Date: 2022-08-26 16:29:24
 * @LastEditors: StavinLi 495727881@qq.com
 * @LastEditTime: 2022-09-21 14:36:30
 * @FilePath: /Workflow-Vue3/src/components/selectResult.vue
-->
<template>
	<div class="select-result l">
		<p class="clear">
			已选（{{ total }}）
			<a @click="emits('del')">清空</a>
		</p>
		<ul>
			<template v-for="{ type, data, cancel } in list" :key="type">
				<template v-if="type === 'role'">
					<li v-for="item in data" :key="item.id">
						<div style="display: flex; flex-direction: row">
							<div class="f11">
								<el-icon style="font-size: 20px">
									<Share />
								</el-icon>
							</div>
							<div class="f12">{{ item.name }}</div>
							<div class="f13">
								<el-button size="small" text @click="cancel(item)" :icon="CircleClose"></el-button>
							</div>
						</div>
					</li>
				</template>
				<template v-if="type === 'dept'">
					<li v-for="item in data" :key="item.id">
						<div style="display: flex; flex-direction: row">
							<div class="f11">
								<el-icon style="font-size: 20px">
									<Grid />
								</el-icon>
							</div>
							<div class="f12">{{ item.name }}</div>
							<div class="f13">
								<el-button size="small" text @click="cancel(item)" :icon="CircleClose"></el-button>
							</div>
						</div>
					</li>
				</template>
				<template v-if="type === 'user'">
					<li v-for="item in data" :key="item.id">
						<div style="display: flex; flex-direction: row">
							<div class="f11">
								<upload-img v-model:image-url="item.avatar" disabled width="20px" height="20px" />
							</div>
							<div class="f12">{{ item.name }}</div>
							<div class="f13">
								<el-button size="small" text @click="cancel(item)" :icon="CircleClose"></el-button>
							</div>
						</div>
					</li>
				</template>
			</template>
		</ul>
	</div>
</template>
<script setup>
import { CircleClose, Grid, Share } from '@element-plus/icons-vue';
import UploadImg from '/@/components/Upload/Image.vue';

defineProps({
	total: {
		type: Number,
		default: 0,
	},
	list: {
		type: Array,
		default: () => [{ type: 'role', data, cancel }],
	},
});
let emits = defineEmits(['del']);
</script>

<style scoped lang="scss">
.select-result {
	width: 276px;
	height: 100%;
	font-size: 12px;

	ul {
		height: 460px;
		overflow-y: auto;

		li {
			margin: 11px 26px 13px 19px;
			line-height: 17px;

			span {
				vertical-align: middle;
			}

			img:first-of-type {
				width: 14px;
				vertical-align: middle;
				margin-right: 5px;
			}

			img:last-of-type {
				float: right;
				margin-top: 2px;
				width: 14px;
			}
		}
	}

	p {
		padding-left: 19px;
		padding-right: 20px;
		line-height: 37px;
		border-bottom: 1px solid #f2f2f2;

		a {
			float: right;
		}
	}
}

.f11 {
	width: 30px;
}

.f12 {
	width: calc(100% - 60px);
	height: 25px;
	line-height: 25px;
}

.f13 {
	width: 30px;
}
</style>
