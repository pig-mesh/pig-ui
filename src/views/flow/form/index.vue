<template>
	<el-container>
		<el-aside width="400px">
			<div effect="dark">
				<h4 style="text-align: center">{{ $t('flow.componentLibrary') }}</h4>
				<div v-for="item in oriFormList" :key="item.id">
					<h5 style="padding-left: 60px">{{ $i18n.locale === 'en' ? item.type : item.name }}</h5>
					<draggable
						v-model="item.formList"
						ghost-class="ghost"
						:force-fallback="true"
						item-key="index"
						:sort="false"
						@end="dragEnd"
						@start="drag = true"
						class="leftItem"
						:animation="300"
						:group="{ name: 'dragFormList', pull: 'clone', put: false }"
						:clone="cloneFunc"
					>
						<template #item="{ element }">
							<div class="zj">
								<el-button size="large" style="width: 100%" :icon="element.icon">{{ $i18n.locale === 'en' ? element.type : element.name }}</el-button>
							</div>
						</template>
					</draggable>
				</div>
			</div>
		</el-aside>
		<el-main>
			<div style="display: flex; flex-direction: row">
				<div class="f11">
					<el-form label-position="top">
						<draggable
							v-model="targetList"
							class="drag-content"
							item-key="index"
							:sort="true"
							effect="dark"
							:group="{ name: 'dragFormList', pull: true, put: true }"
							@change="dragChanged"
						>
							<template #item="{ element, index }">
								<div class="border okcomponent line" effect="dark" @click.stop="showCurrentPageConfigPanel(element.id)">
									<el-icon v-if="element.type != 'Empty'" class="deleteIcon" @click.stop="deleteForm(element.id)">
										<Delete />
									</el-icon>
									<el-form-item :label="step2Object[element.id]?.name" :required="step2Object[element.id]?.required">
										<component
											style="width: 100%"
											@showPanel="showPanel"
											:index="index"
											:is="getFormWidget(element.type)"
											:id="element.id"
											v-model:form="step2Object[element.id]"
										></component>
									</el-form-item>
								</div>
							</template>
						</draggable>
					</el-form>
				</div>

				<el-drawer v-model="drawer">
					<template #header>
						<div class="card-header">
							{{ currentForm?.typeName }}
						</div>
					</template>
					<el-form label-width="120px" label-position="top">
						<el-form-item required :label="$t('flow.title')">
							<el-input v-model="currentForm.name" maxlength="10" />
						</el-form-item>

						<el-form-item :label="$t('flow.tips')" :required="currentForm?.type === 'Description'">
							<el-input v-model="currentForm.placeholder" maxlength="50" />
						</el-form-item>

						<component :is="getFormConfigWidget(currentForm?.type)" :id="currentForm?.id" ref="currentFormConfigRef"></component>
						<el-form-item :label="$t('flow.other')">
							<el-checkbox v-model="currentForm.required" :label="$t('flow.required')" />
						</el-form-item>
					</el-form>
				</el-drawer>
			</div>
		</el-main>
	</el-container>
</template>
<script lang="ts" setup name="flow-form-designer">
import getFormName from '/@/views/flow/form/tools/utils/getFormWidget';
import getFormConfigName from '/@/views/flow/form/tools/utils/getFormConfigWidget';
import { formValidateDict } from '/@/views/flow/form/tools/utils/formValidate';
import { Delete } from '@element-plus/icons-vue';
import { useFlowStore } from '../workflow/stores/flow';
import draggable from 'vuedraggable';
import { FormGroupVO } from '/@/views/flow/form/const/types';
import { formGroupConfig } from '/@/views/flow/form/const/data';
import { computed } from 'vue';
import other from '/@/utils/other';

const drag = ref(false);
const currentForm = ref();
const drawer = ref(false);
let oriFormList = ref<FormGroupVO[]>(formGroupConfig);

const flowStore = useFlowStore();

const currentFormConfigRef = ref();
const step2List = computed(() => flowStore.step2);
const step2Object = computed(() => {
	const obj = {};

	step2List.value.forEach((res) => (obj[res.id] = res));

	return obj;
});

const cloneFunc = (el) => {
	el.id = other.getNonDuplicateID();
	return el;
};
const deleteForm = (id) => {
	const existForm = flowStore.step2.find((res) => res.id === id);
	if (existForm?.type === 'Layout' && currentForm.value) {
		//明细
		const value = existForm.props.value;
		const filter = value.filter((res) => res.id === currentForm.value.id);
		if (filter.length > 0) {
			currentForm.value = undefined;
		}
	}

	flowStore.setStep2(flowStore.step2.filter((res) => res.id !== id));

	if (currentForm.value && currentForm.value?.id === id) {
		currentForm.value = undefined;
	}
};

const showCurrentPageConfigPanel = (id) => {
	currentForm.value = flowStore.step2.find((res) => res.id === id);
	drawer.value = true;
};
const showPanel = (form) => {
	currentForm.value = form;
};

const getFormWidget = (name) => {
	//写的时候，组件的起名一定要与dragList中的element名字一模一样，不然会映射不上
	return getFormName[name];
};

const getFormConfigWidget = (name) => {
	//写的时候，组件的起名一定要与dragList中的element名字一模一样，不然会映射不上
	return getFormConfigName[name];
};

const { proxy } = getCurrentInstance();

const dragEnd = (a) => {
	drag.value = false;
	oriFormList.value = other.deepClone(oriFormList.value);
};

const dragChanged = (a) => {};

const targetList = computed({
	get: () => {
		const value = flowStore.step2;
		if (value?.length == 0) {
			return [
				{
					type: 'Empty',
					name: '',
				},
			];
		}
		return value;
	},
	set: (v) => {
		const value = v.filter((res) => res.type != 'Empty');
		flowStore.setStep2(value);
	},
});

const validate = (f) => {
	const err = [];

	const formList = step2List.value;
	if (formList.length == 0) {
		err.push('表单不能为空');
	}
	for (let form of formList) {
		const formValidateDictElement = formValidateDict[form.type];
		if (formValidateDictElement) {
			const result = formValidateDictElement(form, proxy);

			if (!result.valid) {
				err.push(result.msg);
			}
		}
	}

	const newList = Array.from(new Set(formList.map((res) => res.name)));

	if (newList.length < formList.length) {
		err.push('表单名称不能重复');
	}

	f(err.length == 0, err);
};
defineExpose({ validate });
</script>
<style scoped lang="scss">
$width: 140px;
$f22_width: 400px;
$center_width: 360px;

.leftItem {
	padding-left: 50px;
}

.zj {
	display: inline-block;
	width: $width;
	margin: 5px;
}

.drag-content {
	border: 1px solid;
	width: $center_width;
	border-radius: 10px;
	padding: 10px 10px;
}

.f11 {
	width: calc(100% - #{$f22_width});
}

.f22 {
	width: $f22_width;
}

.okcomponent {
	padding: 5px;
	border-radius: 5px;
	margin-bottom: 10px;
}

.deleteIcon {
	margin-left: calc(#{$center_width} - 50px);
	z-index: 20;
}

.deleteIcon:hover {
	cursor: pointer;
	color: palevioletred;
}
</style>
