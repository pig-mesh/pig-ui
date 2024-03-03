import request from "/@/utils/request"

export function fetchTree(query?: Object) {
  return request({
    url: '/admin/sysArea/tree',
    method: 'get',
    params: query
  })
}

export function fetchList(query?: Object) {
  return request({
    url: '/admin/sysArea/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj?: Object) {
  return request({
    url: '/admin/sysArea',
    method: 'post',
    data: obj
  })
}

export function getObj(query?: Object,) {
  return request({
    url: '/admin/sysArea/details',
    method: 'get',
    params: query
  })
}

export function delObjs(ids?: Object) {
  return request({
    url: '/admin/sysArea',
    method: 'delete',
    data: ids
  })
}

export function putObj(obj?: Object) {
  return request({
    url: '/admin/sysArea',
    method: 'put',
    data: obj
  })
}

export function validateAdCode(rule: any, value: any, callback: any, isEdit: boolean) {
  if (isEdit) {
    return callback();
  }

  getObj({ adcode: value }).then((response) => {
    const result = response.data;
    if (result !== null) {
      callback(new Error('编码已经存在'));
    } else {
      callback();
    }
  });
}
