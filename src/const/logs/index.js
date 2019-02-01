export default {
  menu: false,
  addBtn: false,
  page: false,
  border: true,
  expand: true,
  refreshBtn: false,
  headerAlign: 'center',
  column: [{
    label: '类型',
    prop: 'type',
    width: 80,
    align: 'center',
    solt: true,
    dicData: [{
      label: 'bug',
      value: 'error'
    }]
  }, {
    label: '地址',
    width: 200,
    prop: 'url',
    overHidden: true
  }, {
    label: '内容',
    prop: 'message',
    overHidden: true
  }, {
    label: '错误堆栈',
    prop: 'stack',
    hide: true
  }, {
    label: '时间',
    align: 'center',
    prop: 'time',
    width: 200
  }]
}
