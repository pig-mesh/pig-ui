import request from '/@/utils/request';

/**
 * 流程实例行数据
 */
export interface ProcessInstanceRow {
	/** 流程定义 ID */
	flowId: string;
	/** 流程实例 ID */
	processInstanceId: string;
	/** 流程名称 */
	name?: string;
	/** 创建时间 */
	createTime?: string;
	/** 结束时间 */
	endTime?: string;
	/** 流程状态: 1=进行中, 2=已结束 */
	status: number;
	/** 结束原因: 0=拒绝, 1=通过, 9=终止 */
	finishReason?: string;
	/** 发起人姓名 */
	starterName?: string;
}

/**
 * 流程审批节点
 */
export interface ApprovalNode {
	/** 节点类型: 0=发起人, 1=审批人, 2=抄送 */
	type: number;
	/** 节点名称 */
	name: string;
	/** 用户列表 */
	userVoList?: Array<{
		/** 用户姓名 */
		name?: string;
		/** 处理时间 */
		showTime?: string;
		/** 审批意见 */
		approveDesc?: string;
	}>;
	/** 子节点 */
	children?: any;
	/** 分支节点 */
	branch?: any[];
}

//  流程详情
export function detail(param: any) {
	return request({
		url: '/task/process-instance/detail',
		method: 'get',
		params: param,
	});
}
