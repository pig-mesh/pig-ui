<!--
  -    Copyright (c) 2018-2025, lengleng All rights reserved.
  -
  - Redistribution and use in source and binary forms, with or without
  - modification, are permitted provided that the following conditions are met:
  -
  - Redistributions of source code must retain the above copyright notice,
  - this list of conditions and the following disclaimer.
  - Redistributions in binary form must reproduce the above copyright
  - notice, this list of conditions and the following disclaimer in the
  - documentation and/or other materials provided with the distribution.
  - Neither the name of the pig4cloud.com developer nor the names of its
  - contributors may be used to endorse or promote products derived from
  - this software without specific prior written permission.
  - Author: lengleng (wangiegie@gmail.com)
  -->

<template>
  <div class="app-container calendar-list-container">
    <basic-container>
      <avue-crud :option="tableOption"
                 :data="list"
                 ref="crud"
                 :page="page"
                 v-model="form"
                 :table-loading="listLoading"
                 :before-open="handleOpenBefore"
                 @on-load="getList"
                 @search-change="handleFilter"
                 @refresh-change="handleRefreshChange"
                 @row-update="update"
                 @row-save="create">

        <template slot="menuLeft">
          <el-button v-if="roleManager_btn_add"
                     class="filter-item"
                     @click="handleCreate"
                     size="small"
                     type="primary"
                     icon="el-icon-edit">添加
          </el-button>
        </template>

        <template slot="menu"
                  slot-scope="scope">
          <el-button size="mini"
                     type="text"
                     icon="el-icon-edit"
                     v-if="roleManager_btn_edit"
                     @click="handleUpdate(scope.row,scope.index)">编辑
          </el-button>
          <el-button size="mini"
                     type="text"
                     icon="el-icon-delete"
                     v-if="roleManager_btn_del"
                     @click="handleDelete(scope.row,scope.index)">删除
          </el-button>
          <el-button size="mini"
                     type="text"
                     icon="el-icon-plus"
                     plain
                     @click="handlePermission(scope.row,scope.index)"
                     v-if="roleManager_btn_perm">权限
          </el-button>
        </template>
      </avue-crud>
    </basic-container>
    <el-dialog title="分配权限"
               :visible.sync="dialogPermissionVisible">
      <el-tree class="filter-tree"
               :data="treeData"
               :default-checked-keys="checkedKeys"
               :check-strictly="false"
               node-key="id"
               highlight-current
               :props="defaultProps"
               show-checkbox
               ref="menuTree"
               :filter-node-method="filterNode"
               default-expand-all>
      </el-tree>
      <div slot="footer"
           class="dialog-footer">
        <el-button type="primary"
                   @click="updatePermession(roleId, roleCode)">更 新
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {addObj, delObj, fetchList, fetchRoleTree, getObj, permissionUpd, putObj} from '@/api/admin/role'
  import {tableOption} from '@/const/crud/admin/role'
  import {fetchMenuTree} from '@/api/admin/menu'
  import {mapGetters} from 'vuex'

  export default {
    name: 'table_role',
    data() {
      return {
        tableOption: tableOption,
        treeData: [],
        checkedKeys: [],
        defaultProps: {
          label: "name",
          value: 'id'
        },
        page: {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 20 // 每页显示多少条
        },
        menuIds: '',
        list: [],
        listLoading: true,
        form: {},
        roleId: undefined,
        roleCode: undefined,
        rolesOptions: undefined,
        dialogPermissionVisible: false,
        roleManager_btn_add: false,
        roleManager_btn_edit: false,
        roleManager_btn_del: false,
        roleManager_btn_perm: false
      }
    },
    created() {
      this.roleManager_btn_add = this.permissions['sys_role_add']
      this.roleManager_btn_edit = this.permissions['sys_role_edit']
      this.roleManager_btn_del = this.permissions['sys_role_del']
      this.roleManager_btn_perm = this.permissions['sys_role_perm']
    },
    computed: {
      ...mapGetters(['elements', 'permissions'])
    },
    methods: {
      getList(page, params) {
        this.listLoading = true
        fetchList(Object.assign({
          current: page.currentPage,
          size: page.pageSize
        }, params)).then(response => {
          this.list = response.data.data.records
          this.page.total = response.data.data.total
          this.listLoading = false
        })
      },
      handleRefreshChange() {
        this.getList(this.page)
      },
      handleFilter(param) {
        this.page.page = 1;
        this.getList(this.page, param);
      },
      handleCreate() {
        this.$refs.crud.rowAdd();
      },
      handleOpenBefore(show, type) {
        show();
      },
      handleUpdate(row, index) {
        this.$refs.crud.rowEdit(row, index);
      },
      handlePermission(row) {
        fetchRoleTree(row.roleId)
          .then(response => {
            this.checkedKeys = response.data
            return fetchMenuTree()
          })
          .then(response => {
            this.treeData = response.data.data
            // 解析出所有的太监节点
            this.checkedKeys = this.resolveAllEunuchNodeId(this.treeData, this.checkedKeys, [])
            this.dialogStatus = 'permission'
            this.dialogPermissionVisible = true
            this.roleId = row.roleId
            this.roleCode = row.roleCode
          })
      },
      resolveAllEunuchNodeId(json, idArr, temp) {
        for (let i = 0; i < json.length; i++) {
          const item = json[i]
          // 存在子节点，递归遍历;不存在子节点，将json的id添加到临时数组中
          if (item.children && item.children.length !== 0) {
            this.resolveAllEunuchNodeId(item.children, idArr, temp)
          } else {
            temp.push(idArr.filter(id => id === item.id))
          }
        }
        return temp
      },
      filterNode(value, data) {
        if (!value) return true
        return data.label.indexOf(value) !== -1
      },
      getNodeData(data, done) {
        done();
      },
      handleDelete(row, index) {
        var _this = this
        this.$confirm('是否确认删除名称为"' + row.roleName + '"'+ '"的数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          return delObj(row.roleId)
        }).then(() => {
          this.getList(this.page)
          this.list.splice(index, 1);
          this.$notify.success('删除成功')
        }).catch(function () {
        })
      },
      create(row, done, loading) {
        addObj(this.form).then(() => {
          this.getList(this.page)
          done();
            this.$notify.success('创建成功')
        }).catch(() => {
          loading();
        });
      },
      update(row, index, done, loading) {
        putObj(this.form).then(() => {
          this.getList(this.page)
          done();
          this.$notify.success('修改成功')
        }).catch(() => {
          loading();
        });
      },
      updatePermession (roleId) {
          this.menuIds = ''
          this.menuIds = this.$refs.menuTree.getCheckedKeys().join(',').concat(',').concat(this.$refs.menuTree.getHalfCheckedKeys().join(','))
          permissionUpd(roleId, this.menuIds).then(() => {
              this.dialogPermissionVisible = false
              this.$store.dispatch('GetMenu', false)
              this.$notify.success('修改成功')
          })
      }
    }
  }
</script>
