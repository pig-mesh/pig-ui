<template>
	<div :class="mode == 'square' ? 'chatface' : 'brround avatar cover-image'" :style="transform" style="overflow: hidden; width: 40px; height: 40px">
		<img v-if="faceUrl && !num" :src="faceUrl" class="w-100 h-100" />
		<div v-else :style="styles" class="w-100 h-100 d-flex ai-center jc-center">{{ text }}</div>
	</div>
</template>

<script>
export default {
	name: 'nameAvatar',
	props: {
		scale: {
			type: String,
			default: '1',
		},
		num: [Number, String],
		name: String,
		mode: {
			type: String,
			default: '',
		},
		fontColor: {
			type: String,
			default: '#fff',
		},
		backgroundColor: {
			type: String,
			default: '#3696F2',
		},
		faceUrl: {
			type: String,
			default: '',
		},
	},
	data() {
		return {};
	},
	watch: {},
	computed: {
		// eslint-disable-next-line vue/return-in-computed-property
		text() {
			if (this.num !== undefined) {
				return `+${this.num}`;
			} else {
				if (this.name) {
					return this.name.slice(-2);
				}
			}
		},
		transform() {
			let style = {};
			if (this.scale) {
				style['transform'] = `scale(${this.scale}, ${this.scale})`;
			}
			return style;
		},
		styles() {
			let style = {};
			if (this.size) {
				style['font-size'] = '12px';
			}
			if (this.fontColor) {
				style.color = this.fontColor;
			}
			if (this.backgroundColor) {
				style['background'] = this.backgroundColor;
			}
			return style;
		},
	},
	methods: {},
};
</script>
<style lang="scss" scoped>
@import './base.scss';

.avatar {
	display: inline-block;
	position: relative;
	text-align: center;
	vertical-align: bottom;
	font-size: 8px;
	user-select: none;
	z-index: 10;

	&:hover {
		z-index: 100;
	}
}

.brround {
	border-radius: 50%;
}

.chatface {
	display: block;
	border-radius: 8px;
	overflow: hidden;

	img {
		width: 100%;
		height: 100%;
	}
}
</style>
