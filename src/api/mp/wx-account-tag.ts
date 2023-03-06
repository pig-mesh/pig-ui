/*
 *    Copyright (c) 2018-2025, lengleng All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in the
 * documentation and/or other materials provided with the distribution.
 * Neither the name of the pig4cloud.com developer nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 * Author: lengleng (wangiegie@gmail.com)
 */

import request from '/@/utils/request';

export function getPage(query) {
	return request({
		url: '/admin/wx-account-tag/page',
		method: 'get',
		params: query,
	});
}

export function addObj(obj) {
	return request({
		url: '/admin/wx-account-tag',
		method: 'post',
		data: obj,
	});
}

export function delObjs(obj) {
	return request({
		url: '/admin/wx-account-tag',
		method: 'delete',
		data: obj,
	});
}

export function putObj(obj) {
	return request({
		url: '/admin/wx-account-tag',
		method: 'put',
		data: obj,
	});
}

export function sync(appId) {
	return request({
		url: '/admin/wx-account-tag/sync/' + appId,
		method: 'post',
	});
}

export function list(appId) {
	return request({
		url: '/admin/wx-account-tag/list/',
		method: 'get',
		params: { wxAccountAppid: appId },
	});
}
