<template>
  <div class="layout-padding">
    <div class="layout-padding-auto layout-padding-view">

      <el-row v-show="showSearch">
        <el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
          <el-form-item label="知识库名" prop="title">
            <el-select class="!w-[150px]" placeholder="请选择知识库" v-model="state.queryForm.datasetId">
              <el-option :key="index" :label="item.name" :value="item.id" v-for="(item, index) in datasetList">
                {{ item.name }}
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="问题" prop="questionText">
            <el-input placeholder="请输入问题" v-model="state.queryForm.questionText"/>
          </el-form-item>
          <el-form-item label="标注" prop="standardFlag">
            <el-select class="!w-[150px]" v-model="state.queryForm.standardFlag" placeholder="是否标注">
              <el-option v-for="item in yes_no_type" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="调用结果" prop="llmFlag">
            <el-select class="!w-[150px]" v-model="state.queryForm.llmFlag" placeholder="请选择交互结果">
              <el-option v-for="item in llm_use_status" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button icon="search" type="primary" @click="getDataList">
              查询
            </el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row>
        <div class="mb8" style="width: 100%">
          <el-button icon="folder-add" type="primary" class="ml10" @click="formDialogRef.openDialog()"
                     v-auth="'knowledge_aiChatRecord_add'">
            新 增
          </el-button>
          <el-button plain :disabled="multiple" icon="Delete" type="primary"
                     v-auth="'knowledge_aiChatRecord_del'" @click="handleDelete(selectObjs)">
            删除
          </el-button>
          <right-toolbar v-model:showSearch="showSearch" :export="'knowledge_aiChatRecord_export'"
                         @exportExcel="exportExcel" class="ml10 mr20" style="float: right;"
                         @queryTable="getDataList"></right-toolbar>
        </div>
      </el-row>


      <splitpanes>
        <pane size="65">
          <el-table :data="state.dataList" v-loading="state.loading" border
                    :cell-style="tableStyle.cellStyle" :header-cell-style="tableStyle.headerCellStyle"
                    @selection-change="selectionChangHandle"
                    @row-click="rowClickHandle"
                    @sort-change="sortChangeHandle">
            <el-table-column type="selection" width="40" align="center"/>
            <el-table-column type="index" label="#" width="50"/>
            <el-table-column width="150" prop="datasetName" label="所属知识库" show-overflow-tooltip/>
            <el-table-column width="100" prop="username" label="用户标识" show-overflow-tooltip/>
            <el-table-column prop="questionText" label="问题" show-overflow-tooltip/>
            <el-table-column width="100" prop="standardFlag" label="已标注" show-overflow-tooltip>
              <template #default="scope">
                <dict-tag :options="yes_no_type" :value="scope.row.standardFlag"></dict-tag>
              </template>
            </el-table-column>
            <el-table-column width="100" prop="llmFlag" label="交互成功" show-overflow-tooltip>
              <template #default="scope">
                <dict-tag :options="llm_use_status" :value="scope.row.llmFlag"></dict-tag>
              </template>
            </el-table-column>
          </el-table>
          <pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle"
                      v-bind="state.pagination"/>
        </pane>
        <pane size="35">
          <div class="flex items-center justify-center pl-4">
            <div class="mx-auto w-full max-w-[550px] bg-white">
              <div class="mb-2">
                <label class="mb-1 block text-xl font-semibold">
                  用户提问：
                </label>
                <div class="mb-12" v-if="selectRow.llmFlag === '2'">
                  <div v-html="matchResult" @click="handleChildClick"/>
                </div>
                <div class="mb-2" v-else>
                  <el-input type="textarea" placeholder="请点击问题列表" class="w-full"
                            rows="5" v-model="selectRow.questionText"></el-input>
                </div>
              </div>

              <div class="mb-2">
                <label class="mb-1 block text-xl font-semibold">
                  大模型答案
                  <tip content="可编辑，注意使用markdown语法"/>
                  ：
                </label>

                <div class="mb-2">
                  <el-input type="textarea" placeholder="请点击问题列表" class="w-full"
                            rows="10" v-model="selectRow.answerText"></el-input>
                </div>
              </div>

              <div class="mb-5 flex justify-end" v-if="selectRow.llmFlag === '1'">
                <label
                    for="email"
                    class="mb-4 mr-4 block text-base font-medium text-primary"
                >
                  标注为正确答案:
                </label>
                <el-switch v-model="selectRow.standardFlag" @change="editHandle" :active-value="'1'"
                           :inactive-value="'0'"></el-switch>
              </div>
            </div>
          </div>
        </pane>
      </splitpanes>
    </div>
  </div>
</template>

<script setup lang="ts" name="systemAiChatRecord">
import {BasicTableProps, useTable} from "/@/hooks/table";
import {fetchList, delObjs, putObj} from "/@/api/knowledge/aiChatRecord";
import {useMessage, useMessageBox} from "/@/hooks/message";
import {useDict} from '/@/hooks/dict';
import {fetchDataList} from "/@/api/knowledge/aiDataset";
import {addObj, getObj, testObj} from "/@/api/admin/sensitive";

// 定义查询字典
const {yes_no_type, llm_use_status} = useDict('yes_no_type', 'llm_use_status')

// 定义变量内容
const formDialogRef = ref()
const matchResult = ref()

const selectRow = reactive({
  recordId: '',
  answerText: '',
  questionText: '',
  standardFlag: 0,
  qdrantId: ''
})

// 搜索变量
const queryRef = ref()
const showSearch = ref(true)
// 多选变量
const selectObjs = ref([]) as any
const multiple = ref(true)

const state: BasicTableProps = reactive<BasicTableProps>({
  queryForm: {},
  pageList: fetchList,
  descs: ['create_time']
})

//  table hook
const {
  getDataList,
  currentChangeHandle,
  sizeChangeHandle,
  sortChangeHandle,
  downBlobFile,
  tableStyle
} = useTable(state)

// 清空搜索条件
const resetQuery = () => {
  // 清空搜索条件
  queryRef.value?.resetFields()
  // 清空多选
  selectObjs.value = []
  getDataList()
}

// 导出excel
const exportExcel = () => {
  downBlobFile('/knowledge/aiChatRecord/export', Object.assign(state.queryForm, {ids: selectObjs}), 'aiChatRecord.xlsx')
}

// 多选事件
const selectionChangHandle = (objs: { recordId: string }[]) => {
  selectObjs.value = objs.map(({recordId}) => recordId);
  multiple.value = !objs.length;
};

const datasetList = ref([])
const getDatasetList = async () => {
  const {data} = await fetchDataList()
  datasetList.value = data
}


// 删除操作
const handleDelete = async (ids: string[]) => {
  try {
    await useMessageBox().confirm('此操作将永久删除');
  } catch {
    return;
  }

  try {
    await delObjs(ids);
    getDataList();
    useMessage().success('删除成功');
  } catch (err: any) {
    getDataList();
    useMessage().error(err.msg);
  }
};

// 表格行点击
const rowClickHandle = async (row: any) => {
  Object.assign(selectRow, row)

  if (row.llmFlag === '2') {
    const {data} = await testObj({sensitiveWord: row.questionText});
    // 要处理的字符串
    matchResult.value = row.questionText;
    // 遍历关键词数组，并进行替换
    data.forEach((word: string) => {
      let regex = new RegExp(word, 'g');
      matchResult.value = matchResult.value.replace(regex, `
<div class="tooltip tooltip-open tooltip-bottom" data-tip="加入白名单">
  <a class="link link-error" @click="$emit('click-child')">${word}</a>
</div>
`);
    })
  }
}


const editHandle = async () => {
  putObj(selectRow).then(() => {
    getDataList()
    useMessage().success('操作成功');
    getDataList()
  }).catch((err: any) => {
    useMessage().error(err.msg);
  })
};

const handleChildClick = async (event: any) => {
  try {
    if (event.target.tagName.toLowerCase() === 'a' && event.target.classList.contains('link-error')) {
      const {data} = await getObj({sensitiveWord: event.target.innerText, sensitiveType: '1'})
      if (data) {
        useMessage().error('数据已存在，请勿重新添加');
        return
      }
      await addObj({sensitiveWord: event.target.innerText, sensitiveType: '1'})
      useMessage().success('白名单添加成功');
    }
  } catch (err: any) {
    useMessage().error(err.msg);
  }
}

onMounted(() => {
  getDatasetList()
})
</script>
