<template>
	<div class="del-wrap">
		<slot></slot>
		<div v-if="showClose" class="icon-close" @click.stop="handleClose">
			<el-icon><CloseBold /></el-icon>
		</div>
	</div>
</template>

<script lang="ts">
export default defineComponent({
	props: {
		showClose: {
			type: Boolean,
			default: true,
		},
	},
	emits: ['close'],
	setup(props, { emit }) {
		const handleClose = () => {
			emit('close');
		};
		return {
			handleClose,
		};
	},
});
</script>

<style scoped lang="scss">
.del-wrap {
	position: relative;

	&:hover > .icon-close {
		display: flex;
		transform: scale(1);
	}

	.icon-close {
		display: none;
		position: absolute;
		top: -10px;
		right: -10px;
		width: 24px;
		height: 24px;
		background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
		justify-content: center;
		align-items: center;
		border-radius: 50%;
		color: #fff;
		cursor: pointer;
		font-size: 14px;
		box-shadow: 0 2px 8px rgba(255, 107, 107, 0.4);
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		z-index: 10;
		border: 2px solid #fff;

		&:hover {
			transform: scale(1.15) rotate(90deg);
			box-shadow: 0 4px 12px rgba(255, 107, 107, 0.6);
			background: linear-gradient(135deg, #ff5252 0%, #e53935 100%);
		}

		&:active {
			transform: scale(0.95) rotate(90deg);
		}
	}

	// 在深色模式下的样式
	[data-theme='dark'] & {
		.icon-close {
			border-color: var(--next-bg-main);
			box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);

			&:hover {
				box-shadow: 0 4px 12px rgba(255, 107, 107, 0.5);
			}
		}
	}
}
</style>
