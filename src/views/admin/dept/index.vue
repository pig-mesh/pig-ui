<template>
  <basic-container>
    <div class="avue-crud">
      <el-form :inline="true">
        <el-form-item>
          <el-button
            v-if="permissions.sys_menu_add"
            icon="el-icon-plus"
            type="primary"
            @click="addOrUpdateHandle(false)"
          >
            添加
          </el-button>
        </el-form-item>
      </el-form>

      <el-table
        border
        v-loading="loading"
        :data="deptList"
        row-key="id"
        default-expand-all
        :tree-props="{ children: 'children' }"
      >
        <el-table-column
          prop="name"
          label="部门名称"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          prop="weight"
          label="排序"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          align="center"
        ></el-table-column>
        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              size="small"
              type="text"
              icon="el-icon-plus"
              @click="addOrUpdateHandle(false, scope.row.id)"
              v-if="permissions.sys_dept_add"
              >新增
            </el-button>
            <el-button
              size="small"
              type="text"
              icon="el-icon-edit"
              @click="addOrUpdateHandle(true, scope.row.id)"
              v-if="permissions.sys_dept_edit"
              >修改
            </el-button>
            <el-button
              size="small"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-if="permissions.sys_dept_del"
              >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <table-form
        v-if="addOrUpdateVisible"
        ref="addOrUpdate"
        @refreshDataList="getList"
      ></table-form>
    </div>
  </basic-container>
</template>

<script>
import { delObj, fetchTree } from "@/api/admin/dept";
import TableForm from "./dept-form";
import { mapGetters } from "vuex";

export default {
  name: "Dept",
  components: { TableForm },
  data() {
    return {
      addOrUpdateVisible: false,
      // 遮罩层
      loading: true,
      //表格树数据
      deptList: []
    };
  },
  created() {
    this.getList();
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    addOrUpdateHandle(isEdit, id) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(isEdit, id);
      });
    },
    getList() {
      this.loading = true;
      fetchTree().then(response => {
        this.deptList = response.data.data;
        this.loading = false;
      });
    },
    handleDelete(row) {
      this.$confirm('是否确认删除名称为"' + row.name + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return delObj(row.id);
        })
        .then(() => {
          this.getList();
          this.$message.success("删除成功");
        });
    }
  }
};
</script>
