import request from '/@/utils/request';

/**
 * Fetches a paginated list of jobs
 * @param query - Query parameters for filtering and pagination
 * @returns Promise with job list data
 */
export async function fetchList(query?: Object) {
	const { data } = await request({
		url: '/job/sys-job/page',
		method: 'get',
		params: query,
	});
	return data;
}

/**
 * Creates a new job
 * @param obj - Job data to create
 * @returns Promise with creation result
 */
export async function addObj(obj?: Object) {
	const { data } = await request({
		url: '/job/sys-job',
		method: 'post',
		data: obj,
	});
	return data;
}

/**
 * Fetches a single job by ID
 * @param id - Job ID
 * @returns Promise with job data
 */
export async function getObj(id?: string) {
	const { data } = await request({
		url: '/job/sys-job/' + id,
		method: 'get',
	});
	return data;
}

/**
 * Deletes a job by ID
 * @param id - Job ID to delete
 * @returns Promise with deletion result
 */
export async function delObj(id?: string) {
	const { data } = await request({
		url: '/job/sys-job/' + id,
		method: 'delete',
	});
	return data;
}

/**
 * Updates an existing job
 * @param obj - Job data to update
 * @returns Promise with update result
 */
export async function putObj(obj?: Object) {
	const { data } = await request({
		url: '/job/sys-job',
		method: 'put',
		data: obj,
	});
	return data;
}

/**
 * Starts a job
 * @param jobId - Job ID to start
 * @returns Promise with start operation result
 */
export async function startJobRa(jobId: string) {
	const { data } = await request({
		url: '/job/sys-job/start-job/' + jobId,
		method: 'post',
	});
	return data;
}

/**
 * Runs a job immediately
 * @param jobId - Job ID to run
 * @returns Promise with run operation result
 */
export async function runJobRa(jobId: string) {
	const { data } = await request({
		url: '/job/sys-job/run-job/' + jobId,
		method: 'post',
	});
	return data;
}

/**
 * Shuts down a running job
 * @param jobId - Job ID to shut down
 * @returns Promise with shutdown operation result
 */
export async function shutDownJobRa(jobId: string) {
	const { data } = await request({
		url: '/job/sys-job/shutdown-job/' + jobId,
		method: 'post',
	});
	return data;
}

/**
 * Validates job configuration
 * @param rule - Validation rule
 * @param value - Value to validate
 * @param callback - Validation callback
 * @param form - Form data
 */
export async function validateJob(rule: any, value: any, callback: any, form: any) {
	try {
		const { data } = await request({
			url: '/job/sys-job/validate',
			method: 'get',
			params: Object.assign(form, { field: rule.field }),
		});
		if (data) {
			callback(new Error(data));
		} else {
			callback();
		}
	} catch (error) {
		callback(new Error('Validation failed'));
	}
}
