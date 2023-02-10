export interface menuData {
    id: String,
    menuId: string,
    name: string,
    permission?: any,
    parentId: string,
    icon: string,
    path: string,
    sortOrder: number,
    menuType: string,
    keepAlive: string,
    visible: string,
    createBy: string,
    updateBy: string,
    createTime: string,
    updateTime: string,
    delFlag: string,
    children: menuData[]
}
