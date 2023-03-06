import { defineStore } from 'pinia';

export const useMsg = defineStore('msg', {
	state: () => ({
		msgArray: [] as any[],
	}),
	actions: {
		getAllMsg() {
			return this.msgArray;
		},
		// 设置字典
		setMsg(value: Object) {
			this.msgArray.push(value);
		},
		// 删除字典
		removeAll() {
			this.msgArray = [];
		},
	},
});
