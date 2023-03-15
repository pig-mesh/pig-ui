<template>
	<div class="el-tree-select">
		<el-select
			style="width: 100%"
			v-model="valueId"
			ref="treeSelect"
			:filterable="true"
			:clearable="true"
			@clear="clearHandle"
			:filter-method="selectFilterData"
			:placeholder="placeholder"
		>
			<el-option :value="valueId" :label="valueTitle">
				<el-tree
					id="tree-option"
					ref="selectTree"
					:accordion="accordion"
					:data="options"
					:props="objMap"
					:node-key="objMap.value"
					:expand-on-click-node="false"
					:default-expanded-keys="defaultExpandedKey"
					:filter-node-method="filterNode"
					@node-click="handleNodeClick"
				></el-tree>
			</el-option>
		</el-select>
	</div>
</template>

<script setup>
const { proxy } = getCurrentInstance();

const props = defineProps({
	/* 配置项 */
	objMap: {
		type: Object,
		default: () => {
			return {
				value: 'id', // ID字段名
				label: 'label', // 显示名称
				children: 'children', // 子级字段名
			};
		},
	},
	/* 自动收起 */
	accordion: {
		type: Boolean,
		default: () => {
			return false;
		},
	},
	/**当前双向数据绑定的值 */
	value: {
		type: [String, Number],
		default: '',
	},
	/**当前的数据 */
	options: {
		type: Array,
		default: () => [],
	},
	/**输入框内部的文字 */
	placeholder: {
		type: String,
		default: '',
	},
});

const emit = defineEmits(['update:value']);

const valueId = computed({
	get: () => props.value,
	set: (val) => {
		emit('update:value', val);
	},
});
const valueTitle = ref('');
const defaultExpandedKey = ref([]);

/**
 * 初始化下拉菜单选择器的默认值，并设置默认选中和默认展开。
 */
function initHandle() {
	nextTick(() => {
		const selectedValue = valueId.value;
		if (selectedValue !== null && typeof selectedValue !== 'undefined') {
			const node = proxy.$refs.selectTree.getNode(selectedValue);
			if (node) {
				valueTitle.value = node.data[props.objMap.label];
				proxy.$refs.selectTree.setCurrentKey(selectedValue); // 设置默认选中
				defaultExpandedKey.value = [selectedValue]; // 设置默认展开
			}
		} else {
			clearHandle();
		}
	});
}

/**
 * 点击某一节点时触发的事件，更新当前的选中值和展开状态。
 * @param {Object} node - 被点击的节点对象
 */
function handleNodeClick(node) {
	valueTitle.value = node[props.objMap.label];
	valueId.value = node[props.objMap.value];
	defaultExpandedKey.value = [];
	proxy.$refs.treeSelect.blur();
	selectFilterData('');
}

/**
 * 搜索过滤函数，根据输入的值来过滤显示的节点。
 * @param {String} val - 输入框内的搜索关键字
 */
function selectFilterData(val) {
	proxy.$refs.selectTree.filter(val);
}

/**
 * 根据输入的值来判断节点是否需要显示。
 * @param {String} value - 输入框内的搜索关键字
 * @param {Object} data - 当前处理的节点数据
 * @returns {Boolean} - 是否需要显示此节点
 */
function filterNode(value, data) {
	if (!value) return true;
	return data[props.objMap['label']].indexOf(value) !== -1;
}
/**
 * 清空当前的选中状态，并重置展开状态。
 */
function clearHandle() {
	valueTitle.value = '';
	valueId.value = '';
	defaultExpandedKey.value = [];
	clearSelected();
}
/**
 * 删除所有选中状态的节点。
 */
function clearSelected() {
	const allNode = document.querySelectorAll('#tree-option .el-tree-node');
	allNode.forEach((element) => element.classList.remove('is-current'));
}

onMounted(() => {
	initHandle();
});

watch(valueId, () => {
	initHandle();
});
</script>

<style lang="scss" scoped>
@import '/@/assets/styles/variables.module.scss';
.el-scrollbar .el-scrollbar__view .el-select-dropdown__item {
	padding: 0;
	background-color: #fff;
	height: auto;
}

.el-select-dropdown__item.selected {
	font-weight: normal;
}

ul li .el-tree .el-tree-node__content {
	height: auto;
	padding: 0 20px;
	box-sizing: border-box;
}

:deep(.el-tree-node__content:hover),
:deep(.el-tree-node__content:active),
:deep(.is-current > div:first-child),
:deep(.el-tree-node__content:focus) {
	background-color: mix(#fff, $--color-primary, 90%);
	color: $--color-primary;
}
</style>
