import { useToNumber } from '@vueuse/core';

export const PROCESS_INSTANCE_STATUS = {
	RUNNING: 1,
	FINISHED: 2,
} as const;

export const PROCESS_FINISH_REASON = {
	REFUSED: '0',
	PASSED: '1',
	WITHDRAWN: '3',
	TERMINATED: '9',
} as const;

export const LEAVE_FLOW_STATUS = {
	PENDING: 0,
	RUNNING: 1,
	PASSED: 2,
	WITHDRAWN: 3,
	REFUSED: 4,
	TERMINATED: 5,
} as const;

export const PROCESS_INSTANCE_STATUS_OPTIONS = [
	{ label: '进行中', value: PROCESS_INSTANCE_STATUS.RUNNING },
	{ label: '已结束', value: PROCESS_INSTANCE_STATUS.FINISHED },
] as const;

export const LEAVE_FLOW_STATUS_OPTIONS = [
	{ label: '待审批', value: LEAVE_FLOW_STATUS.PENDING },
	{ label: '进行中', value: LEAVE_FLOW_STATUS.RUNNING },
	{ label: '已通过', value: LEAVE_FLOW_STATUS.PASSED },
	{ label: '已撤回', value: LEAVE_FLOW_STATUS.WITHDRAWN },
	{ label: '已拒绝', value: LEAVE_FLOW_STATUS.REFUSED },
	{ label: '已终止', value: LEAVE_FLOW_STATUS.TERMINATED },
] as const;

export interface ProcessStatusInput {
	status?: number | string;
	finishReason?: string | null;
	rejectToStarter?: boolean | null;
}

function toOptionalNumber(value?: number | string): number | undefined {
	if (value === undefined || value === null || value === '') {
		return undefined;
	}
	const parsed = useToNumber(value, { method: 'parseFloat' }).value;
	return Number.isNaN(parsed) ? undefined : parsed;
}

function normalizeString(value?: string | null): string | undefined {
	if (value === undefined || value === null || value === '') {
		return undefined;
	}
	return String(value);
}

export function getProcessStatusLabel(input: ProcessStatusInput): string {
	if (input.rejectToStarter) {
		return '驳回待提交';
	}

	const status = toOptionalNumber(input.status);
	if (status === PROCESS_INSTANCE_STATUS.RUNNING) {
		return '进行中';
	}

	const finishReason = normalizeString(input.finishReason);
	if (finishReason === PROCESS_FINISH_REASON.WITHDRAWN) {
		return '已撤回';
	}
	if (finishReason === PROCESS_FINISH_REASON.TERMINATED) {
		return '终止';
	}
	if (finishReason === PROCESS_FINISH_REASON.PASSED) {
		return '通过';
	}
	if (finishReason === PROCESS_FINISH_REASON.REFUSED) {
		return '拒绝';
	}
	return '已结束';
}

export function getProcessStatusTagType(input: ProcessStatusInput): string | undefined {
	if (input.rejectToStarter) {
		return 'warning';
	}

	const status = toOptionalNumber(input.status);
	if (status === PROCESS_INSTANCE_STATUS.RUNNING) {
		return undefined;
	}

	const finishReason = normalizeString(input.finishReason);
	if (finishReason === PROCESS_FINISH_REASON.WITHDRAWN) {
		return 'warning';
	}
	if (finishReason === PROCESS_FINISH_REASON.TERMINATED) {
		return 'danger';
	}
	if (finishReason === PROCESS_FINISH_REASON.PASSED) {
		return 'success';
	}
	if (finishReason === PROCESS_FINISH_REASON.REFUSED) {
		return 'danger';
	}
	return undefined;
}

export function getLeaveFlowStatusLabel(status: number | string): string {
	const normalizedStatus = toOptionalNumber(status);

	if (normalizedStatus === LEAVE_FLOW_STATUS.PENDING) {
		return '待审批';
	}
	if (normalizedStatus === LEAVE_FLOW_STATUS.RUNNING) {
		return '进行中';
	}
	if (normalizedStatus === LEAVE_FLOW_STATUS.PASSED) {
		return '已通过';
	}
	if (normalizedStatus === LEAVE_FLOW_STATUS.WITHDRAWN) {
		return '已撤回';
	}
	if (normalizedStatus === LEAVE_FLOW_STATUS.REFUSED) {
		return '已拒绝';
	}
	if (normalizedStatus === LEAVE_FLOW_STATUS.TERMINATED) {
		return '已终止';
	}
	return String(status ?? '待审批');
}

export function getLeaveFlowStatusTagType(status: number | string): string {
	const normalizedStatus = toOptionalNumber(status);

	if (normalizedStatus === LEAVE_FLOW_STATUS.PENDING) {
		return 'info';
	}
	if (normalizedStatus === LEAVE_FLOW_STATUS.RUNNING) {
		return 'warning';
	}
	if (normalizedStatus === LEAVE_FLOW_STATUS.PASSED) {
		return 'success';
	}
	if (normalizedStatus === LEAVE_FLOW_STATUS.WITHDRAWN) {
		return 'warning';
	}
	if (normalizedStatus === LEAVE_FLOW_STATUS.REFUSED) {
		return 'danger';
	}
	if (normalizedStatus === LEAVE_FLOW_STATUS.TERMINATED) {
		return 'danger';
	}
	return 'info';
}
