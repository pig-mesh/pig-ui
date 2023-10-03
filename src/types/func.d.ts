// 定义全局属性的类型
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
