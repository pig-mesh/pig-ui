/*
 * @Date: 2022-08-29 14:00:42
 * @LastEditors: StavinLi 495727881@qq.com
 * @LastEditTime: 2023-03-29 15:53:05
 * @FilePath: /Workflow-Vue3/src/components/dialog/common.js
 */

import {deptRoleList} from '/@/api/admin/role';
import {orgTree, orgTreeSearcheUser} from '/@/api/admin/dept';

export const searchVal = ref('');
export const departments = ref({
    titleDepartments: [], childDepartments: [], roleList: [], employees: [],
});
export const roles = ref({});
export const getRoleList = async () => {
    let {
        data: {list},
    } = await deptRoleList();
    roles.value = list;
};
export const getDepartmentList = async (parentId = 0, type = 'org') => {
    // let { data } = await getDepartments({ parentId })

    let {data} = await orgTree(type, parentId);

    departments.value = data;
};
export const getDebounceData = async (event: any, type = 1) => {
    if (event) {
        let data = {
            username: event, pageNum: 1, pageSize: 30,
        };
        if (type === 1) {
            departments.value.childDepartments = [];
            let res = await orgTreeSearcheUser(data);
            departments.value.employees = res.data;
        }
    } else {
        type === 1 ? await getDepartmentList() : await getRoleList();
    }
};
