import { isFunction } from 'lodash';
import { reactive, toRaw } from 'vue';

/**
 * 分页钩子选项接口
 */
interface Options {
	/** 初始页码，默认为1 */
	page?: number;
	/** 每页数量，默认为15 */
	size?: number;
	/** 数据获取函数 */
	fetchFun: (_arg: any) => Promise<any>;
	/** 额外的查询参数 */
	params?: Record<any, any>;
	/** 是否首次加载时显示loading */
	firstLoading?: boolean;
	/** 请求前参数处理函数 */
	beforeRequest?(params: Record<any, any>): Record<any, any>;
	/** 请求后数据处理函数 */
	afterRequest?(res: Record<any, any>): void;
}

/**
 * 分页数据接口
 */
interface Pager {
	/** 当前页码 */
	current: number;
	/** 每页数量 */
	size: number;
	/** 加载状态 */
	loading: boolean;
	/** 总记录数 */
	count: number;
	/** 总记录数（与count相同，兼容性字段） */
	total: number;
	/** 数据列表 */
	lists: any[];
	/** 扩展数据 */
	extend: Record<any, any>;
}

/**
 * 分页钩子函数
 *
 * @param {Options} options - 配置选项
 * @param {number} [options.page=1] - 初始页码
 * @param {number} [options.size=15] - 每页数量
 * @param {Function} options.fetchFun - 数据获取函数
 * @param {Object} [options.params={}] - 查询参数
 * @param {boolean} [options.firstLoading=false] - 是否首次显示loading
 * @param {Function} [options.beforeRequest] - 请求前钩子
 * @param {Function} [options.afterRequest] - 请求后钩子
 *
 * @returns {Object} 返回分页相关状态和方法
 * @returns {Pager} pager - 分页数据对象
 * @returns {Function} getLists - 获取列表数据
 * @returns {Function} resetParams - 重置查询参数
 * @returns {Function} resetPage - 重置到第一页
 *
 * @example
 * ```typescript
 * // 基础用法
 * const { pager, getLists, resetPage } = usePaging({
 *   fetchFun: fetchUserList,
 *   size: 20
 * });
 *
 * // 带参数和钩子
 * const { pager, getLists } = usePaging({
 *   fetchFun: fetchProductList,
 *   params: { category: 'electronics' },
 *   beforeRequest: (params) => {
 *     // 处理参数
 *     return { ...params, timestamp: Date.now() };
 *   },
 *   afterRequest: (data) => {
 *     // 处理响应数据
 *     console.log('获取到', data.total, '条记录');
 *   }
 * });
 * ```
 */
export function usePaging(options: Options) {
	const {
		page = 1,
		size = 15,
		fetchFun,
		params = {},
		firstLoading = false,
		beforeRequest,
		afterRequest,
	} = options;

	/** 记录分页初始参数，用于重置 */
	const paramsInit: Record<any, any> = Object.assign({}, toRaw(params));

	/** 分页数据对象 */
	const pager = reactive<Pager>({
		/** 当前页码 */
		current: page,
		/** 每页数量 */
		size,
		/** 加载状态 */
		loading: firstLoading,
		/** 总记录数 */
		count: 0,
		/** 总记录数（兼容字段） */
		total: 0,
		/** 数据列表 */
		lists: [] as any[],
		/** 扩展数据 */
		extend: {} as Record<any, any>,
	});

	/**
	 * 获取列表数据
	 *
	 * @async
	 * @returns {Promise<any>} 返回API响应数据
	 *
	 * @description
	 * - 自动添加分页参数（current, size）
	 * - 支持请求前参数处理（beforeRequest）
	 * - 支持请求后数据处理（afterRequest）
	 * - 自动更新分页状态和列表数据
	 * - 自动管理loading状态
	 *
	 * @example
	 * ```typescript
	 * // 手动触发获取数据
	 * await getLists();
	 *
	 * // 修改参数后获取
	 * params.keyword = 'search';
	 * await getLists();
	 * ```
	 */
	const getLists = (): Promise<any> => {
		pager.loading = true;

		// 请求前参数处理
		let requestParams = params;
		if (isFunction(beforeRequest)) {
			requestParams = beforeRequest(params);
		}

		return fetchFun({
			current: pager.current,
			size: pager.size,
			...requestParams,
		})
			.then(({ data }) => {
				// 更新分页数据
				pager.count = data?.total;
				pager.total = data?.total;
				pager.lists = data?.records;
				pager.extend = data?.extend;

				// 请求后数据处理
				if (isFunction(afterRequest)) {
					afterRequest(data);
				}

				return Promise.resolve(data);
			})
			.catch((err: any) => {
				return Promise.reject(err);
			})
			.finally(() => {
				pager.loading = false;
			});
	};

	/**
	 * 重置为第一页并刷新数据
	 *
	 * @async
	 * @returns {Promise<any>} 返回获取列表的Promise
	 *
	 * @description
	 * 适用于筛选条件变化、搜索等场景
	 *
	 * @example
	 * ```typescript
	 * // 搜索时重置到第一页
	 * params.keyword = 'vue';
	 * await resetPage();
	 * ```
	 */
	const resetPage = (): Promise<any> => {
		pager.current = 1;
		return getLists();
	};

	/**
	 * 重置所有参数到初始值并刷新数据
	 *
	 * @async
	 * @returns {Promise<any>} 返回获取列表的Promise
	 *
	 * @description
	 * 恢复到初始化时的参数状态，适用于"重置"按钮
	 *
	 * @example
	 * ```typescript
	 * // 重置所有筛选条件
	 * await resetParams();
	 * ```
	 */
	const resetParams = (): Promise<any> => {
		Object.keys(paramsInit).forEach((item) => {
			params[item] = paramsInit[item];
		});
		return getLists();
	};

	return {
		/** 分页数据对象（响应式） */
		pager,
		/** 获取列表数据 */
		getLists,
		/** 重置参数并刷新 */
		resetParams,
		/** 重置到第一页并刷新 */
		resetPage,
	};
}
