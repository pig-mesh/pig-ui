<script setup lang="ts">
import { useFlowStore } from '../../../stores/flow';
import { getCurrentInstance } from 'vue';

let flowStore = useFlowStore();


const step2FormList = computed(() => {
  let step2 = flowStore.step2;

  return step2;
})


const {proxy} = getCurrentInstance();

//表单
const formList = computed(() => {
  let value = step2FormList.value;

  let $deepCopy = other.deepClone(value.filter(res =>
      res.type != 'MultiSelect' &&
      res.type != 'Description' &&
      res.type != 'SelectMultiUser' &&
      res.type != 'SelectMultiDept' &&
      res.type != 'Layout' &&
      res.type != 'UploadImage' &&
      res.type != 'UploadFile'
  ));


  $deepCopy.push({
    id: 'root',
    name: '发起人',
    type: "SelectUser",
    typeName: "用户"
  })

  return $deepCopy;
})
let props = defineProps({
  condition: {
    type: Object,
    default: () => {
    },
  },
});


const formIdObj = computed(() => {
  var obj = {}
  for (var item of formList.value) {
    obj[item.id] = item;
  }
  return obj
})

const conditionSelectVal = computed(
    {
      get(){

        let value = props.condition.value;
        return (value&&value.length>0)?(value.map(res=>res.key)):undefined;

      },
      set(t){

        let options = (formIdObj.value)[props.condition.key].props.options;


        let filterElement = options.filter(res=>t.indexOf(res.key)>=0);
        props.condition.value = filterElement
      }
    }
)


//表达式
let expression = ref(
    {
      "SelectDept": [
        {
          key: "in",
          name: "属于"
        }, {
          key: "notin",
          name: "不属于"
        }
      ],

      "SelectUser": [
        {
          key: "in",
          name: "属于"
        }, {
          key: "notin",
          name: "不属于"
        }
      ],

      "Input": [
        {
          key: "==",
          name: "等于"
        }, {
          key: "!=",
          name: "不等于"
        }, {
          key: "contain",
          name: "包含"
        }, {
          key: "notcontain",
          name: "不包含"
        }
      ],

      "Textarea": [
        {
          key: "==",
          name: "等于"
        }, {
          key: "!=",
          name: "不等于"
        },{
          key: "contain",
          name: "包含"
        }, {
          key: "notcontain",
          name: "不包含"
        }
      ],
      "Number": [
        {
          key: "==",
          name: "等于"
        }, {
          key: "!=",
          name: "不等于"
        }, {
          key: ">",
          name: "大于"
        }, {
          key: ">=",
          name: "大于等于"
        }, {
          key: "<",
          name: "小于"
        }, {
          key: "<=",
          name: "小于等于"
        }
      ],
      "Date": [
        {
          key: "==",
          name: "等于"
        }, {
          key: "!=",
          name: "不等于"
        }, {
          key: ">",
          name: "大于"
        }, {
          key: ">=",
          name: "大于等于"
        }, {
          key: "<",
          name: "小于"
        }, {
          key: "<=",
          name: "小于等于"
        }
      ],
      "DateTime": [
        {
          key: "==",
          name: "等于"
        }, {
          key: "!=",
          name: "不等于"
        }, {
          key: ">",
          name: "大于"
        }, {
          key: ">=",
          name: "大于等于"
        }, {
          key: "<",
          name: "小于"
        }, {
          key: "<=",
          name: "小于等于"
        }
      ],
      "Time": [
        {
          key: "==",
          name: "等于"
        }, {
          key: "!=",
          name: "不等于"
        }, {
          key: ">",
          name: "大于"
        }, {
          key: ">=",
          name: "大于等于"
        }, {
          key: "<",
          name: "小于"
        }, {
          key: "<=",
          name: "小于等于"
        }
      ],
      "Money": [
        {
          key: "==",
          name: "等于"
        }, {
          key: "!=",
          name: "不等于"
        }, {
          key: ">",
          name: "大于"
        }, {
          key: ">=",
          name: "大于等于"
        }, {
          key: "<",
          name: "小于"
        }, {
          key: "<=",
          name: "小于等于"
        }
      ],
      "SingleSelect": [
        {
          key: "in",
          name: "属于"
        }, {
          key: "notin",
          name: "不属于"
        }
      ]
    }
)

import selectShow from '/@/views/flow/workflow/components/dialog/selectAndShow.vue';
import other from '/@/utils/other';
</script>

<template>
  <div>
    <el-select v-model="condition.key" placeholder="选择表单" style="width: 100%;">
      <el-option
          v-for="f in formList"
          :key="f.id"
          :label="f.name"
          :value="f.id"
      />
    </el-select>

    <el-select v-model="condition.expression" placeholder="选择关系" style="width: 100%;margin-top: 20px">

      <el-option
          v-for="f in expression[formIdObj[condition.key]?.type]"
          :key="f.key"
          :label="f.name"
          :value="f.key"
      />
    </el-select>

    <el-input v-model="condition.value" v-if="formIdObj[condition.key]?.type==='Input'||
formIdObj[condition.key]?.type==='Textarea'
" style="margin-top: 20px;" placeholder="条件值"></el-input>


    <el-input-number v-model="condition.value"
                     v-if="formIdObj[condition.key]?.type==='Money'||
formIdObj[condition.key]?.type==='Number'
"
                     placeholder="条件值"
                     style="width: 100%;margin-top: 20px"
                     controls-position="right"
    />


    <el-date-picker
        value-format="YYYY-MM-DD"
        type="date"
        class="formDate"

        v-model="condition.value"
        v-if="formIdObj[condition.key]?.type==='Date'
"
        placeholder="条件值"
        style="width: 100%;margin-top: 20px"

    />
    <el-time-picker
        arrow-control
        value-format="HH:mm:ss"


        class="formDate"

        v-model="condition.value"
        v-if="formIdObj[condition.key]?.type==='Time'
"
        placeholder="条件值"
        style="width: 100%;margin-top: 20px"

    />

    <el-date-picker
        value-format="YYYY-MM-DD HH:mm:ss"
        type="datetime"
        class="formDate"

        v-model="condition.value"
        v-if="formIdObj[condition.key]?.type==='DateTime'
"
        placeholder="条件值"
        style="width: 100%;margin-top: 20px"

    />

    <el-select v-model="conditionSelectVal"
               v-if="formIdObj[condition.key]?.type==='SingleSelect'
"
               style="width: 100%;margin-top: 20px"
               multiple
               collapse-tags
               collapse-tags-tooltip

               placeholder="请选择值">
      <el-option
          v-for="item in formIdObj[condition.key].props.options"
          :key="item.key"
          :label="item.value"
          :value="item.key"
      />
    </el-select>
    <div style="margin-top: 20px">
      <select-show v-if="formIdObj[condition.key]?.type==='SelectUser'
" v-model:orgList="condition.value" type="org" :multiple="true"></select-show>
    </div>
    <div style="margin-top: 20px">

      <select-show v-if="formIdObj[condition.key]?.type==='SelectDept'
" v-model:orgList="condition.value" type="dept" :multiple="true"></select-show>
    </div>

  </div>
</template>

<style scoped>
:deep(.formDate div.el-input__wrapper) {
	width: 100% !important;
}
:deep(.formDate) {
	width: 100% !important;
}
</style>
