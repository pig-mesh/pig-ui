/*
 * @Date: 2022-08-25 14:13:11
 * @LastEditors: StavinLi 495727881@qq.com
 * @LastEditTime: 2023-05-24 15:00:32
 * @FilePath: /Workflow-Vue3/src/store/index.js
 */
import { defineStore } from 'pinia';
import { FormConfigUserVO, FormVO } from '/@/views/flow/form/const/types';
import { BpmModelFormType, type FormDesignData } from '/@/views/flow/form/const/constants';

var adminList: FormConfigUserVO[] = reactive([]);

export const useFlowStore = defineStore('flow', {
	state: () => {
		return {
			step1: {
				logo: '',
				name: '',
				flowId: '',
				groupId: undefined,
				adminList: adminList,
				remark: '',
			},
			step2: {
				formType: BpmModelFormType.NORMAL,
				formId: undefined,
				formCustomCreatePath: '',
				formCustomViewPath: '',
				formRule: [],
				formOption: {}
			} as FormDesignData,
			step2Legacy: [] as FormVO[], // 保留原有的表单数据作为兼容
			step3:{}
		};
	},
	actions: {
		setStep2(p: FormDesignData) {
			this.step2 = p;
		},
		setStep2Legacy(p: FormVO[]) {
			this.step2Legacy = p;
			// 如果是动态表单，同时更新新的数据结构
			if (this.step2.formType === BpmModelFormType.NORMAL) {
				this.step2.formRule = p;
			}
		},
		clearStep1() {
			this.step1 = {
				logo: '',
				name: '',
				flowId: '',
				groupId: undefined,
				adminList: adminList,
				remark: '',
			};
		},
		clearStep2() {
			this.step2 = {
				formType: BpmModelFormType.NORMAL,
				formId: undefined,
				formCustomCreatePath: '',
				formCustomViewPath: '',
				formRule: []
			};
			this.step2Legacy = [];
		},
		setStep3(p: any) {
			this.step3 = p;
		}
	},
});
