export const tableOption = {
  dialogDrag: true,
  border: true,
  stripe: true,
  menuAlign: 'center',
  align: 'center',
  menuType: 'text',
  editBtn: false,
  delBtn: false,
  addBtn: false,
  viewBtn: false,
  searchBtn: true,
  searchMenuSpan: 6,
  defaultSort: {
    prop: 'createTime',
    order: 'descending'
  },
  column: [
    {
      label: '公众号',
      prop: 'appId',
      dicUrl: '/mp/wxaccount/list',
      props: {
        label: 'name',
        value: 'appid'
      },
      hide: true,
      type:'select',
      search: true,
      width: 100
    },
    {
      label: '消息类型',
      prop: 'repType',
      type: 'select',
      dicData: [{
        value: 'text',
        label: '文本'
      }, {
        value: 'image',
        label: '图片'
      }, {
        value: 'voice',
        label: '语音'
      }, {
        value: 'video',
        label: '视频'
      }, {
        value: 'shortvideo',
        label: '小视频'
      }, {
        value: 'location',
        label: '地理位置'
      }, {
        value: 'link',
        label: '链接消息'
      }, {
        value: 'event',
        label: '事件推送'
      }],
      search: true,
      sortable: true,
      width: 120
    },
    {
      label: '用户',
      prop: 'nickName',
      overHidden: false,
      search: true,
      width: 100
    },
    {
      label: '公众号名称',
      prop: 'appName',
      hide: true,
    },
    {
      label: '公众号名称',
      prop: 'appLogo',
      hide: true,
    },
    {
      label: '头像地址',
      prop: 'headimgUrl',
      type: 'upload',
      imgWidth: 40,
      imgFullscreen: true,
      editDisplay: false,
      addDisplay: false,
      listType: 'picture-img'
    }, {
      label: '内容',
      prop: 'repContent',
      overHidden: true,
      align: 'left',
      slot: true
    }, {
      label: '时间',
      type: 'date',
      prop: 'createTime',
      width: 200
    },
    {
      label: '是否已读',
      prop: 'readFlag',
      type: 'select',
      dicData: [
        {
          value: '1',
          label: '是'
        }, {
          value: '0',
          label: '否'
        }
      ],
      slot: true
    }
  ]
}
