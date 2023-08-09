<template>
	<div>

			<el-select style="width: 100%"
					   v-if="mode==='D'"
					   :disabled="true"
					   :placeholder="!form?'':form.placeholder"
					   size="large">

			</el-select>
			<el-select v-else style="width: 100%"
				 multiple
				 collapse-tags
				 collapse-tags-tooltip
					   v-model="formValue"
					   :disabled="form.perm === 'R'"
					   :placeholder="form.placeholder"
					   size="large"
			>
				<el-option
						v-for="item in form.props.options"
						:key="item.key"
						:label="item.value"
						:value="item.key"
				/>
			</el-select>

	</div>
</template>
<script lang="ts" setup>
import {defineExpose,computed} from "vue";
var formValue = computed({
	get() {
		let value = props.form.props.value;
	  return (value&&value.length>0)?(value.map(res=>res.key)):undefined;

  },
	set(t) {
		let filterElement = props.form.props.options.filter(res=>t.indexOf(res.key)>=0);
		props.form.props.value = filterElement
	}
})
let props = defineProps({

	mode:{
		type:String,
		default:'D'
	},


	form: {
		type: Object, default: () => {

		}
	}

});


const {proxy} = getCurrentInstance();


const getValidateRule = () => {

	var item = props.form;

	var checkConfig = (rule: any, value: any, callback: any) => {

		if (item.required) {
			if (value==undefined||value.length==0) {
				return callback(new Error("请选择" + item.name))
			}
		}
		if (value==undefined) {
			return callback()
		}


		return callback()


	}
	let ruleArray = [{
		validator: checkConfig, trigger: 'change'
	}];
	if (item.required) {
		ruleArray.push(
			{required: true, message: '请选择' + item.name, trigger: 'change'}
		)
	}
	return ruleArray


}
defineExpose({getValidateRule});

</script>
