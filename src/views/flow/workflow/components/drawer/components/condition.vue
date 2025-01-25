<script setup lang="ts">
import {useFlowStore} from '../../../stores/flow';
import {getCurrentInstance} from 'vue';
import selectShow from '/@/components/OrgSelector/index.vue';
import other from '/@/utils/other';

let flowStore = useFlowStore();


const step2FormList = computed(() => {
  return flowStore.step2;
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
    field: 'root',
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
    if (item.props) {
      if (item.props.type === 'user') {
        item.type = 'SelectUser'
      } else if (item.props.type === 'dept') {
        item.type = 'SelectDept'
      }
    }
    obj[item.field] = item;
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

      "input": [
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

      "textarea": [
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
      "inputNumber": [
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
      "datePicker": [
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
    }
)
</script>

<template>
  <div>
    <el-select v-model="condition.key" placeholder="选择表单" style="width: 100%;">
      <el-option
          v-for="f in formList"
          :key="f.field"
          :label="f.title || f.name"
          :value="f.field"
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

    <el-input v-model="condition.value" v-if="formIdObj[condition.key]?.type==='input'||
formIdObj[condition.key]?.type==='textarea'
" style="margin-top: 20px;" placeholder="条件值"></el-input>


    <el-input-number v-model="condition.value"
                     v-if="formIdObj[condition.key]?.type==='Money'||
formIdObj[condition.key]?.type==='inputNumber'
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
        v-if="formIdObj[condition.key]?.type==='datePicker'
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
" v-model:orgList="condition.value" type="user" :multiple="true"></select-show>
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
