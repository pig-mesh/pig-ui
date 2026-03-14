<template>
	<div class="prefixCls relative" style="width: 100%">
		<el-input v-model="innerValueRef" v-bind="$attrs" type="password" show-password @change="handleChange" style="width: 100%">
			<template #[item]="data" v-for="item in Object.keys($slots)">
				<slot :name="item" v-bind="data || {}"></slot>
			</template>
		</el-input>
		<div class="prefixCls-bar">
			<div class="prefixCls-bar--fill" :data-score="getPasswordStrength"></div>
		</div>
	</div>
</template>

<script setup lang="ts" name="StrengthMeter">
import { verifyPasswordStrength } from '/@/utils/toolsValidate';
const props = defineProps({
	value: {
		type: String,
	},
	showInput: {
		type: Boolean,
		default: () => {
			return true;
		},
	},
	disabled: {
		type: Boolean,
	},
});

const emit = defineEmits(['score', 'change', 'update:value']);

// 计算密码强度
const getPasswordStrength = computed(() => {
	const { disabled } = props;
	if (disabled) return -1;
	const innerValue = unref(innerValueRef);
	const score = innerValue ? verifyPasswordStrength(innerValue) : -1;
	emit('score', score);
	return score;
});

const innerValueRef = ref();

const handleChange = (e: any) => {
	innerValueRef.value = e;
};

watchEffect(() => {
	innerValueRef.value = props.value || '';
});

watch(
	() => unref(innerValueRef),
	(val) => {
		emit('update:value', val);
		emit('change', val);
	}
);
</script>

<style scoped lang="scss">
.prefixCls {
	&-bar {
		position: relative;
		height: 6px;
		margin: 10px auto 6px;
		background-color: grey;
		border-radius: 6px;

		&::before,
		&::after {
			position: absolute;
			z-index: 10;
			display: block;
			width: 33%;
			height: inherit;
			background-color: transparent;
			border-color: white;
			border-style: solid;
			border-width: 0 5px;
			content: '';
		}

		&::before {
			left: 33%;
		}
		//
		//&::after {
		//	right: 33%;
		//}

		&--fill {
			position: absolute;
			width: 0;
			height: inherit;
			background-color: transparent;
			border-radius: inherit;
			transition: width 0.5s ease-in-out, background 0.25s;

			&[data-score='1'] {
				width: 33%;
				background-color: var(--el-color-danger);
			}

			&[data-score='2'] {
				width: 67%;
				background-color: var(--el-color-warning);
			}

			&[data-score='3'] {
				width: 100%;
				background-color: var(--el-color-success);
			}
		}
	}
}
</style>
