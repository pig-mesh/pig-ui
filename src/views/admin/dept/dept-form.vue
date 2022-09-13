<template>
  <!-- 添加或修改菜单对话框 -->
  <el-dialog :title="!form.deptId ? '新增': '修改'"
             v-model="visible">
    <el-form ref="dataForm" :model="form" :rules="rules" label-width="80px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="部门名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入菜单名称"/>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="上级部门">
            <el-tree-select
                v-model="form.parentId"
                :data="deptOptions"
                :props="{ value: 'id', label: 'name', children: 'children' }"
                value-key="menuId"
                placeholder="选择上级菜单"
                check-strictly
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="排序" prop="sortOrder">
            <el-input-number v-model="form.sortOrder" controls-position="right" :min="0"/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="dataFormSubmit">确 定</el-button>
        <el-button @click="visible = false">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import {addObj, fetchTree, getObj, putObj} from '@/api/admin/dept'

export default {
  name: "DeptForm",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 菜单树选项
      deptOptions: [],
      // 是否显示弹出层
      visible: false,
      form: {
        name: undefined,
        sortOrder: 999
      },
      // 表单校验
      rules: {
        name: [
          {required: true, message: "菜单名称不能为空", trigger: "blur"}
        ],
        sortOrder: [
          {required: true, message: "菜单顺序不能为空", trigger: "blur"}
        ]
      }
    };
  },
  methods: {
    init(isEdit, id) {
      if (id !== null) {
        this.form.parentId = id;
      }
      this.visible = true
      this.getTreeselect();
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (isEdit) {
          getObj(id).then(response => {
            this.form = response.data.data
          })
        } else {
          this.form.deptId = undefined
        }
      })
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.form.parentId === undefined) {
            this.form.parentId = 0
          }

          if (this.form.deptId) {
            putObj(this.form).then(data => {
              this.$message.success('修改成功')
              this.visible = false
              this.$emit('refreshDataList')
            });
          } else {
            addObj(this.form).then(data => {
              this.$message.success('添加成功')
              this.visible = false
              this.$emit('refreshDataList')
            })
          }
        }
      })
    },
    /** 查询菜单下拉树结构 */
    getTreeselect() {
      fetchTree().then(response => {
        this.deptOptions = []
        const dept = {id: 0, name: '根部门', children: response.data.data};
        this.deptOptions.push(dept)
      });
    },
    /** 转换菜单数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children
      }

      return {
        id: node.id,
        label: node.name,
        children: node.children
      }
    }
  }
};
</script>
