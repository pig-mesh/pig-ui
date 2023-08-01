<script setup lang="ts">
import { computed, defineExpose } from 'vue';

let props = defineProps({
	id: {
		type: String,
		default: '',
	},
});

import { useFlowStore } from '../../workflow/stores/flow';

let flowStore = useFlowStore();

var config = computed(() => {
	let step2 = flowStore.step2;
	var idObjList = step2.filter((res) => res.id === props.id);
	if (idObjList.length > 0) {
		return idObjList[0];
	}

	let list = step2.filter((res) => res.type === 'Layout');
	for (var item of list) {
		let value = item.props.value;
		var valueList = value.filter((res) => res.id === props.id);
		if (valueList.length > 0) {
			return valueList[0];
		}
	}

	return undefined;
});
var options = computed(() => {
	return config.value.props.options;
});

const { proxy } = getCurrentInstance();

import { Delete, Edit, Search, Share, Upload } from '@element-plus/icons-vue';

const addOption = () => {
	options.value.push({
		key: '',
		value: '',
	});
};
const deleteOption = (index) => {
	options.value.splice(index, 1);
};

import { fetchList, getDicts } from '/@/api/admin/dict';

const dictOptions = ref([]);
onMounted(() => {
	fetchList({}).then((res) => {
		dictOptions.value = res.data;
	});

	if (config.value.props.dictValue) {
		handleDictValue(config.value.props.dictValue);
	}
});
const activeName = ref('static');

const handleDictValue = (val: any) => {
	getDicts(val).then((res) => {
		config.value.props.options = res.data.map(({ description, value }) => {
			return { key: value, value: description };
		});
	});
};
</script>

<template>
	<div>
		<el-tabs v-model="activeName">
			<el-tab-pane label="静态数据" name="static">
				<el-form-item label="选项" required>
					<div v-for="(item, index) in options" :key="index" class="class_option" v-if="activeName === 'static'">
						<div class="f1">
							<el-input v-model="item.key" placeholder="选项值key" />
						</div>
						<div class="f2">
							<el-input v-model="item.value" placeholder="选项标签value" />
						</div>
						<div class="f3">
							<el-icon :size="20" @click.stop="deleteOption(index)">
								<Delete />
							</el-icon>
						</div>
					</div>
					<el-link type="primary" @click.stop="addOption">添加选项</el-link>
				</el-form-item>
			</el-tab-pane>
			<el-tab-pane label="动态数据" name="dynamic">
				<el-form-item label="选择字典">
					<el-select v-model="config.props.dictValue" filterable placeholder="" style="width: 100%" @change="handleDictValue">
						<el-option v-for="item in dictOptions" :key="item.id" :label="item.description" :value="item.dictType" />
					</el-select>
				</el-form-item>
			</el-tab-pane>
		</el-tabs>

		<el-form-item label="默认值">
			<el-select v-model="config.props.value" multiple collapse-tags collapse-tags-tooltip placeholder="" style="width: 100%">
				<el-option v-for="item in options" :key="item.key" :label="item.value" :value="item.key" />
			</el-select>
		</el-form-item>
	</div>
</template>

<style scoped lang="sass">
$F1-width: 150px
$F3-width: 40px

.class_option
  display: flex
  flex-direction: row
  width: 100%

  .f1
    width: $F1-width

  .f2
    margin-left: 5px
    width: calc(100% - #{$F1-width} - #{$F3-width} - 5px)

  .f3
    width: $F3-width
    text-align: center
    padding-top: 5px
    height: 35.6px
</style>
