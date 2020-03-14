<template>
  <basic-container>
    <avue-crud :option="option"
               :data="data"
               ref="crud"
               v-model="form"
               :permission="permissionList"
               :before-open="beforeOpen"
               @row-del="rowDel"
               @row-update="rowUpdate"
               @row-save="rowSave"
               @tree-load="treeLoad">
      <template slot-scope="scope"
                slot="icon">
        <div style="text-align:center">
          <i :class="scope.row.icon"></i>
        </div>
      </template>
      <template slot-scope="scope"
                slot="type">
        <div style="text-align:center">
          <el-tag v-if="scope.row.type !== '1'" size="small" type="success">菜单</el-tag>
          <el-tag v-else-if="scope.row.type === '1'" size="small" type="info">按钮</el-tag>
        </div>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {addObj, delObj, fetchMenuTree, getObj, putObj} from '@/api/admin/menu'
  import { validatenull } from '@/util/validate'
  import {mapGetters} from "vuex";
  import {tableOption} from '@/const/crud/admin/menu'

  export default {
    data() {
      return {
        form: {},
        option: tableOption,
        lazy:true,
        data: []
      };
    },
    created() {
      this.onLoad()
    },
    watch: {
      'form.type'() {
        this.showHide()
      }
    },
    computed: {
      ...mapGetters(["permissions"]),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permissions.sys_menu_add, false),
          delBtn: this.vaildData(this.permissions.sys_menu_del, false),
          editBtn: this.vaildData(this.permissions.sys_menu_edit, false)
        };
      }
    },
    methods: {
      rowSave(row,done,loading) {
        if (validatenull(row.parentId)){
          row.parentId = -1
        }
        addObj(row).then(() => {
          done()
          this.onLoad();
          this.$message.success("添加成功");
        });
      },
      rowUpdate(row,index, done,loading) {
        if (validatenull(row.parentId)){
          row.parentId = -1
        }
        putObj(row).then(() => {
          done()
          this.onLoad();
          this.$message.success("修改成功");
        });
      },
      rowDel(row) {
        this.$confirm("确定将选择数据删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          return delObj(row.id);
        }).then(() => {
          this.onLoad();
          this.$message.success("删除成功");
        });
      },
      beforeOpen(done, type) {
        if (["edit", "view"].includes(type)) {
          getObj(this.form.id).then(res => {
            this.form = res.data.data;
          });
        }
        done();
      },
      onLoad() {
        fetchMenuTree(this.option.lazy).then(res => {
          this.data = res.data.data;
        });
      },
      treeLoad(node, child, resolve){
        fetchMenuTree(this.option.lazy, node.id).then(res => {
          resolve(res.data.data)
        })
      },
      showHide(){
        this.$refs.crud.option.column.filter(item => {
          // 不是按钮类型 要输入path
          if (item.prop === "path") {
            item.addDisplay = this.form.type !== "1"
            item.editDisplay = this.form.type !== "1"
          }
          // 不是按钮类型 要输入path
          if (item.prop === "icon") {
            item.addDisplay = this.form.type !== "1"
            item.editDisplay = this.form.type !== "1"
          }

          // 是按钮类型输入permission
          if (item.prop === "permission") {
            item.addDisplay = this.form.type === "1"
            item.editDisplay = this.form.type === "1"
          }

          // 是按钮类型输入 上级菜单
          if (item.prop === "parentId") {
            item.rules[0].required = this.form.type === "1"
          }

          // 菜单开启 keepAlive 选择
          if (item.prop === "keepAlive") {
            item.addDisplay = this.form.type === "0"
            item.editDisplay = this.form.type === "0"
            item.rules[0].required = this.form.type === "0"
          }
        });
      }
    }
  };
</script>

<style>
</style>
