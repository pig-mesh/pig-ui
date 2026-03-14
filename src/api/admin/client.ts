import request from '/@/utils/request';

/**
 * Fetches paginated list of clients
 * @param query - Query parameters for pagination and filtering
 * @returns Promise with paginated client list
 */
export function fetchList(query?: Object) {
	return request({
		url: '/admin/client/page',
		method: 'get',
		params: query,
	});
}

/**
 * Adds a new client
 * @param obj - Client object to create
 * @returns Promise with created client data
 */
export function addObj(obj?: Object) {
	return request({
		url: '/admin/client',
		method: 'post',
		data: obj,
	});
}

/**
 * Gets client details by ID
 * @param id - Client ID
 * @returns Promise with client details
 */
export function getObj(id?: string) {
	return request({
		url: '/admin/client/' + id,
		method: 'get',
	});
}

/**
 * Deletes one or more clients
 * @param ids - Client IDs to delete
 * @returns Promise with deletion result
 */
export function delObj(ids?: object) {
	return request({
		url: '/admin/client',
		method: 'delete',
		data: ids,
	});
}

/**
 * Updates an existing client
 * @param obj - Client object with updated data
 * @returns Promise with updated client data
 */
export function putObj(obj?: Object) {
	return request({
		url: '/admin/client',
		method: 'put',
		data: obj,
	});
}

/**
 * Refreshes client cache
 * @returns Promise with cache sync result
 */
export function refreshCache() {
	return request({
		url: '/admin/client/sync',
		method: 'put',
	});
}

/**
 * Gets client details by client ID
 * @param obj - Client ID
 * @returns Promise with client details
 */
export function getDetails(obj: Object) {
	return request({
		url: '/admin/client/getClientDetailsById/' + obj,
		method: 'get',
	});
}

/**
 * Validates client ID uniqueness for form validation
 * @param rule - Validation rule
 * @param value - Client ID value to validate
 * @param callback - Validation callback function
 * @param isEdit - Whether in edit mode (skips validation if true)
 * @param t - i18n translation function
 * @returns Promise that resolves when validation completes
 */
export async function validateclientId(rule: any, value: any, callback: any, isEdit: boolean, t?: any) {
	if (isEdit) {
		return callback();
	}

	try {
		const { data } = await getDetails(value);
		if (data !== null) {
			const message = t ? t('client.clientIdExists') : 'Client ID already exists';
			callback(new Error(message));
		} else {
			callback();
		}
	} catch (error) {
		// Network error or API failure - allow validation to pass
		callback();
	}
}
