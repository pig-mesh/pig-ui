export const tableOption = {
  "border": true,
  "index": true,
  "indexLabel": "序号",
  "stripe": true,
  addBtn: false,
  "menuAlign": "center",
  "align": "center",
  "searchMenuSpan": 6,
  dialogWidth: '50%',
  "column": [
    {
      "type": "input",
      "label": "岗位名称",
      "prop": "postName",
      span: 24,
      rules: [{
        required: true,
        message: '请输入岗位名称',
        trigger: 'blur'
      }]
    },
    {
      "type": "input",
      "label": "岗位标识",
      "prop": "postCode",
      span: 24,
      rules: [{
        required: true,
        message: '请输入岗位标识',
        trigger: 'blur'
      }]
    },
    {
      "type": "textarea",
      "label": "岗位描述",
      "prop": "remark",
      "hide":true,
      span: 24
    },
    {
      "type": "input-number",
      "label": "岗位排序",
      "prop": "postSort",
      "hide":true,
      "value": 0,
      span:8
    },
    {
      "type": "input",
      "label": "创建时间",
      "prop": "createTime",
      "addDisplay": false,
      "editDisabled": true,
      span: 24
    }
  ]
}
