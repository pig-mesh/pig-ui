<template>
	<el-drawer
		v-model="visible"
		:append-to-body="true"
		title="审批人设置"
		:show-close="false"
		:size="550"
		:before-close="saveApprover"
		@open="openEvent"
	>
		<el-tabs type="border-card">
			<el-tab-pane label="设置审批人">
				<el-radio-group v-model="approverConfig.assignedType" class="ml-4" @change="assignedTypeChangeEvent">
					<el-row>
						<el-col v-for="{ value, label } in setTypes" :key="value" :span="8">
							<el-radio :label="value">{{ label }}</el-radio>
						</el-col>
					</el-row>
				</el-radio-group>

				<el-divider />
				<template v-if="approverConfig.assignedType === 2">
					<h4>选择部门</h4>
					<select-show v-model:orgList="approverConfig.nodeUserList" type="dept"></select-show>
				</template>
				<template v-if="approverConfig.assignedType === 3">
					<h4>选择角色</h4>

					<select-show v-model:orgList="approverConfig.nodeUserList" type="role" :multiple="true"></select-show>
				</template>
				<template v-if="approverConfig.assignedType === 1">
					<h4>选择成员</h4>

					<select-show v-model:orgList="approverConfig.nodeUserList" type="user" :multiple="true"></select-show>
				</template>
				<template v-if="approverConfig.assignedType === 8">
					<h4>人员控件</h4>
					<el-select v-model="approverConfig.formUserId" clearable class="m-2" placeholder="请选择审批表单" size="large">
						<el-option v-for="item in step2FormUserList" :key="item.id" :label="item.name" :value="item.id" />
					</el-select>
				</template>
				<template v-if="approverConfig.assignedType === 7">
					<h4>审批终点</h4>
					<span style="margin-right: 5px; font-size: 14px">到第</span>
					<el-input-number v-model="approverConfig.deptLeaderLevel" :step="1" :min="1" :max="20" step-strictly size="small" />
					<span style="margin-left: 5px; font-size: 14px">级部门主管终止</span>
				</template>
				<template v-if="approverConfig.assignedType === 4">
					<h4>选择方式</h4>
					<el-radio-group v-model="approverConfig.multiple" class="ml-4">
						<el-radio :label="false" size="large">单选</el-radio>
						<el-radio :label="true" size="large">多选</el-radio>
					</el-radio-group>
				</template>
				<template
					v-if="
						((approverConfig.multiple === true && approverConfig.assignedType === 4) ||
							(approverConfig.assignedType === 1 && approverConfig.nodeUserList.length > 1) ||
							approverConfig.assignedType === 2 ||
							approverConfig.assignedType === 3 ||
							(approverConfig.assignedType === 7 && approverConfig.deptLeaderLevel > 1) ||
							(approverConfig.assignedType === 8 && isMultiUserForm(approverConfig.formUserId))) &&
						approverConfig.assignedType != 5
					"
				>
					<h4>多人审批时采用的审批方式</h4>
					<el-radio-group v-model="approverConfig.multipleMode" class="ml-4">
						<p style="display: block; width: 100%">
							<el-radio :label="1" size="large">会签(需要所有审批人同意)</el-radio>
						</p>
						<p style="display: block; width: 100%">
							<el-radio :label="2" size="large">或签(一名审批人同意即可)</el-radio>
						</p>
						<p style="display: block; width: 100%">
							<el-radio :label="3" size="large">依次审批(按顺序依次审批)</el-radio>
						</p>
					</el-radio-group>
				</template>
				<el-divider />

				<h4>审批人为空时</h4>
				<el-radio-group v-model="approverConfig.nobody.handler" class="ml-4">
					<el-radio label="TO_PASS" size="large">自动通过</el-radio>
					<el-radio label="TO_END" size="large">自动结束</el-radio>
					<el-radio label="TO_ADMIN" size="large">转交给管理员</el-radio>
					<el-radio label="TO_USER" size="large">指定人员</el-radio>
				</el-radio-group>
				<select-show
					v-if="approverConfig.nobody.handler === 'TO_USER'"
					v-model:orgList="approverConfig.nobody.assignedUser"
					type="user"
					:multiple="false"
				></select-show>
			</el-tab-pane>
			<el-tab-pane label="表单权限">
				<form-perm :form-perm="approverConfig.formPerms"></form-perm>
			</el-tab-pane>
		</el-tabs>
	</el-drawer>
</template>
<script setup type="ts">
import {setTypes} from '../../utils/const'
import {useStore} from '../../stores/index'
import {useFlowStore} from '../../stores/flow'

let flowStore = useFlowStore();

import FormPerm from './components/formPerm.vue'


const step2FormList = computed(() => {
	let step2 = flowStore.step2;

	return step2;
})

const step2FormUserList = computed(() => {


	return step2FormList.value.filter(res => res.type === 'SelectUser');
})

const openEvent = () => {
	let value = step2FormList.value;
	var arr = {};
	let formPerms = approverConfig.value.formPerms;

	for (var item of value) {
		arr[item.id] = "R"
		if (item.type === 'Layout') {
			arr[item.id] = "E"
		}
		if (formPerms[item.id]) {
			arr[item.id] = formPerms[item.id]
		}
		if (item.type === 'Layout') {
			let value1 = item.props.value;
			for (var it of value1) {
				arr[it.id] = "R"
				if (formPerms[it.id]) {
					arr[it.id] = formPerms[it.id]
				}
			}
		}
	}
	approverConfig.value.formPerms = arr;
}

import selectShow from "/@/views/flow/workflow/components/dialog/selectAndShow.vue";


let approverConfig = ref({})


let store = useStore()
let {setApproverConfig, setApprover} = store
let approverConfigData = computed(() => store.approverConfigData)
let approverDrawer = computed(() => store.approverDrawer)
let visible = computed({
	get() {
		return approverDrawer.value
	},
	set() {
		closeDrawer()
	}
})
watch(approverConfigData, (val) => {
	approverConfig.value = val.value
})
//用户表单是否是多选
const isMultiUserForm = (id) => {
	if (!(id)) {
		return false
	}
	let t = step2FormUserList.value.filter(res => res.id === id)[0].props.multi;
	return t;
}
//监听用户选择表单值变化
watch(() => approverConfig.value.formUserId, (val) => {
	if (val) {
		approverConfig.value.formUserName = step2FormUserList.value.filter(res => res.id === val)[0].name

	}


})

//审批人类型变化
const assignedTypeChangeEvent = (e) => {
	approverConfig.value.nodeUserList = [];
}

const saveApprover = () => {
	approverConfig.value.error = !checkApproval(approverConfig.value);

	setApproverConfig({
		value: approverConfig.value,
		flag: true,
		id: approverConfigData.value.id
	})
	closeDrawer()
}
const closeDrawer = () => {
	setApprover(false)
}

const 	checkApproval = (nodeConfig) =>{
	if (nodeConfig.assignedType == 1 || nodeConfig.assignedType == 2 || nodeConfig.assignedType == 3) {

//指定成员
if (nodeConfig.nodeUserList.length == 0) {
	return false;

}
} else if (nodeConfig.assignedType == 8 && nodeConfig.formUserId.length == 0) {
//表单
return false;
}

//审批人为空
if (nodeConfig.nobody.handler === 'TO_USER' && nodeConfig.nobody.assignedUser.length == 0) {
return false;
}
//操作权限
let operList = nodeConfig.operList;
let length = operList?.filter(res => res.checked).length;
if (length == 0) {
return false;
}

return true;
}
</script>
<style scoped></style>
