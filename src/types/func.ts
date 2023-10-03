// 定义全局属性的类型
// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
import { ComponentCustomProperties } from 'vue';

declare module '@vue/runtime-core' {
	interface ComponentCustomProperties {
		parseTime: Function;
		parseDate: Function;
		dateTimeStr: string;
		dateStr: string;
		timeStr: string;
		baseURL: string;
	}
}
