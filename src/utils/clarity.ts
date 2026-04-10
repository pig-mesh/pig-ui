import Clarity from '@microsoft/clarity';

let _initialized = false;

/**
 * 初始化 Microsoft Clarity
 * @param projectId 后端返回的项目 ID
 */
export function initClarity(projectId: string): void {
	if (!projectId || _initialized) return;

	Clarity.init(projectId);
	_initialized = true;
}
