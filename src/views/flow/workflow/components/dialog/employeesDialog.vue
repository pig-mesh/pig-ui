<template>
	<el-dialog title="选择成员" v-model="visibleDialog" :width="600" append-to-body class="promoter_person">
		<div class="person_body clear">
			<div class="person_tree l">
				<selectBox ref="selectBoxRef" :selectSelf="selectSelf" :list="list" :multiple="multiple" v-model:selectedList="selectedList" :type="type" />
			</div>
			<selectResult :total="total" @del="delList" :list="resList" />
		</div>
		<template #footer>
			<el-button @click="$emit('update:visible', false)">取 消</el-button>
			<el-button type="primary" @click="saveDialog">确 定</el-button>
		</template>
	</el-dialog>
</template>

<script setup>
import selectBox from '../selectBox.vue';
import selectResult from '../selectResult.vue';
import { computed, watch, ref, onMounted } from 'vue';
import { departments, searchVal } from './common';
import other from '/@/utils/other';

const selectBoxRef = ref();

let props = defineProps({
	visible: {
		type: Boolean,
		default: false,
	},
	data: {
		type: Array,
		default: () => [],
	},
	type: {
		type: String,
		default: 'org',
	},
	multiple: {
		type: Boolean,
		default: true,
	},
	selectSelf: {
		type: Boolean,
		default: true,
	},
});

//已选择的集合
let selectedList = ref([]);

let emits = defineEmits(['update:visible', 'change']);
let visibleDialog = computed({
	get() {
		return props.visible;
	},
	set() {
		closeDialog();
	},
});
const isChecked = (id, type) => {
	return selectedList.value.filter((res) => res.id === id && res.type === type).length > 0;
};

let list = computed(() => {
	let value = departments.value;
	return [
		{
			type: 'dept',
			data: value == undefined ? [] : value.childDepartments,
		},
		{
			type: 'role',
			data: value == undefined ? [] : value.roleList,
		},
		{
			type: 'user',
			data: value == undefined ? [] : value.employees,
			change: (item) => {
				if (!isChecked(item.id, item.type)) {
					if (!props.multiple) {
						//单选
						selectedList.value = [];
					}

					selectedList.value.push(item);
				} else {
					selectedList.value = selectedList.value.filter((res) => !(res.id === item.id && res.type === item.type));
				}
			},
		},
	];
});
let resList = computed(() => {
	let userData = selectedList.value.filter((res) => res.type === 'user');
	let deptData = selectedList.value.filter((res) => res.type === 'dept');
	let roleData = selectedList.value.filter((res) => res.type === 'role');

	let data = [
		{
			type: 'user',
			data: userData,
			cancel: (item) => {
				item.selected = false;
				selectBoxRef.value.changeEvent(item);
			},
		},
	];
	if (props.type === 'org' || props.type === 'dept') {
		data.unshift({
			type: 'dept',
			data: deptData,
			cancel: (item) => {
				item.selected = false;
				selectBoxRef.value.changeEvent(item);
			},
		});
	}
	if (props.type === 'role') {
		data.unshift({
			type: 'role',
			data: roleData,
			cancel: (item) => {
				item.selected = false;
				selectBoxRef.value.changeEvent(item);
			},
		});
	}
	return data;
});

watch(
	() => props.visible,
	(val) => {
		if (val) {
			selectedList.value = props.data;

			searchVal.value = '';
		}
	}
);

const closeDialog = () => {
	emits('update:visible', false);
};

let total = computed(() => {
	let v = departments.value;
	if (!v) {
		return 0;
	}
	return selectedList.value.length;
});

const { proxy } = getCurrentInstance();

let saveDialog = () => {
	var v = selectedList.value;

	let checkedList = other.deepClone(v).map((item) => ({
		type: item.type,
		id: item.id,
		name: item.name,
		avatar: item.avatar,
	}));
	emits('change', checkedList);
	//selectedList.value=[]
};
const delList = () => {
	for (var item of other.deepClone(selectedList.value)) {
		item.selected = false;
		selectBoxRef.value.changeEvent(item);
	}
	selectedList.value = [];
};

onMounted(() => {});
</script>
<style scoped>
@import '../../css/dialog.css';
</style>
