<template>
  <basic-container>
    <el-row :span="24">
      <el-col :md="4">
        <div class="tree-position">
          <avue-tree :option="treeOption"
                     :data="treeData"
                     @node-click="nodeClick" />
        </div>
      </el-col>
      <el-col :md="20">
        <div class="public-account-management clearfix"
             v-loading="saveLoading">
          <!--左边配置菜单-->
          <div class="left">
            <div class="weixin-hd">
              <div class="weixin-title">
                {{menuName}}
              </div>
            </div>
            <div class="weixin-menu menu_main clearfix">
              <div class="menu_bottom"
                   v-for="(item, i) of menu.button"
                   :key="i">
                <!-- 一级菜单 -->
                <div @click="menuFun(i,item)"
                     class="menu_item el-icon-s-fold"
                     :class="{'active': isActive == i}">
                  {{item.name}}
                </div>
                <!--以下为二级菜单-->
                <div class="submenu"
                     v-if="isSubMenuFlag == i">
                  <div class="subtitle menu_bottom"
                       v-if="item.sub_button"
                       v-for="(subItem, k) in item.sub_button"
                       :key="k">
                    <div class="menu_subItem"
                         :class="{'active': isSubMenuActive == i + '' +k}"
                         @click="subMenuFun(subItem, i, k)">{{subItem.name}}
                    </div>
                  </div>
                  <!--  二级菜单加号， 当长度 小于  5 才显示二级菜单的加号  -->
                  <div class="menu_bottom menu_addicon"
                       v-if="!item.sub_button || item.sub_button.length < 5"
                       @click="addSubMenu(i,item)"><i class="el-icon-plus"></i></div>
                </div>
              </div>
              <!-- 一级菜单加号 -->
              <div class="menu_bottom menu_addicon"
                   v-if="menuKeyLength < 3"
                   @click="addMenu"><i class="el-icon-plus"></i></div>
            </div>
            <div class="save_div">
              <el-button v-if="permissions.mp_wxmenu_add"
                         class="save_btn"
                         type="success"
                         @click="saveMenu">保存</el-button>
              <el-button v-if="permissions.mp_wxmenu_push"
                         class="save_btn"
                         type="info"
                         @click="publishMenu">发布</el-button>
            </div>
          </div>
          <!--右边配置-->
          <div v-if="showRightFlag"
               class="right">
            <div class="configure_page">
              <div>
                <span>菜单标识：</span>
                <el-input class="input_width"
                          v-model="tempObj.key"
                          placeholder="请输入菜单KEY"
                          :maxlength=nameMaxlength
                          clearable></el-input>
              </div>
              <div class="menu_content">
                <span>菜单名称：</span>
                <el-input class="input_width"
                          v-model="tempObj.name"
                          placeholder="请输入菜单名称"
                          :maxlength=nameMaxlength
                          clearable></el-input>
              </div>
              <div v-if="showConfigurContent">
                <div class="menu_content">
                  <span>菜单内容：</span>
                  <el-select v-model="tempObj.type"
                             clearable
                             placeholder="请选择"
                             class="menu_option">
                    <el-option v-for="item in menuOptions"
                               :label="item.label"
                               :value="item.value"
                               :key="item.value"></el-option>
                  </el-select>
                </div>
                <div class="configur_content"
                     v-if="tempObj.type == 'view'">
                  <span>跳转链接：</span>
                  <el-input class="input_width"
                            v-model="tempObj.url"
                            placeholder="请输入链接"
                            clearable></el-input>
                </div>
                <div class="configur_content"
                     v-if="tempObj.type == 'miniprogram'">
                  <div class="applet">
                    <span>小程序的appid：</span>
                    <el-input class="input_width"
                              v-model="tempObj.appid"
                              placeholder="请输入小程序的appid"
                              clearable></el-input>
                  </div>
                  <div class="applet">
                    <span>小程序的页面路径：</span>
                    <el-input class="input_width"
                              v-model="tempObj.pagepath"
                              placeholder="请输入小程序的页面路径，如：pages/index"
                              clearable></el-input>
                  </div>
                  <div class="applet">
                    <span>备用网页：</span>
                    <el-input class="input_width"
                              v-model="tempObj.url"
                              placeholder="不支持小程序的老版本客户端将打开本网页"
                              clearable></el-input>
                  </div>
                  <p class="blue">tips:需要和公众号进行关联才可以把小程序绑定带微信菜单上哟！</p>
                </div>
                <div class="configur_content"
                     v-if="tempObj.type == 'view_limited'">
                  <el-row>
                    <div class="select-item"
                         v-if="tempObj && tempObj.content && tempObj.content.articles">
                      <WxNews :objData="tempObj.content.articles"></WxNews>
                      <el-row class="ope-row">
                        <el-button type="danger"
                                   icon="el-icon-delete"
                                   circle
                                   @click="deleteTempObj"></el-button>
                      </el-row>
                    </div>
                    <div v-if="!tempObj.content || !tempObj.content.articles">
                      <el-row>
                        <el-col :span="24"
                                style="text-align: center">
                          <el-button type="success"
                                     @click="openMaterial">素材库选择<i class="el-icon-circle-check el-icon--right"></i></el-button>
                        </el-col>
                      </el-row>
                    </div>
                    <el-dialog title="选择图文"
                               v-model="dialogNewsVisible"
                               width="90%">
                      <WxMaterialSelect :objData="{repType:'news',appId: checkAppId}"
                                        @selectMaterial="selectMaterial"></WxMaterialSelect>
                    </el-dialog>
                  </el-row>
                </div>
                <div class="configur_content"
                     v-if="tempObj.type == 'click' || tempObj.type == 'scancode_waitmsg'">
                  <WxReplySelect :objData="tempObj"
                                 v-if="hackResetWxReplySelect"></WxReplySelect>
                </div>
              </div>
              <div class="delete_btn">
                <el-button v-if="permissions.mp_wxmenu_del"
                           size="mini"
                           type="danger"
                           icon="el-icon-delete"
                           @click="deleteMenu(tempObj)">删除当前菜单
                </el-button>
              </div>
            </div>
          </div>
          <!--一进页面就显示的默认页面，当点击左边按钮的时候，就不显示了-->
          <div v-if="!showRightFlag"
               class="right">
            <p>请选择菜单配置</p>
          </div>
        </div>
      </el-col>
    </el-row>
  </basic-container>
</template>

<script>
import { getObj, publishObj, saveObj } from '@/api/mp/wxmenu'
import { fetchAccountList } from '@/api/mp/wxaccount'
import WxReplySelect from '@/components/wechat/WxReply.vue'
import WxNews from '@/components/wechat/WxNews.vue'
import WxMaterialSelect from '@/components/wechat/WxMaterialSelect.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'wxmenu',
  components: {
    WxReplySelect,
    WxNews,
    WxMaterialSelect
  },
  data () {
    return {
      treeOption: {
        nodeKey: 'id',
        addBtn: false,
        menu: false,
        props: {
          labelText: '标题',
          label: 'name',
          value: 'appid',
          children: 'children'
        }
      },
      treeData: [],
      checkAppId: undefined,
      showRightFlag: false,//右边配置显示默认详情还是配置详情
      menu: {
        button: []
      },//横向菜单
      isActive: -1,// 一级菜单点中样式
      isSubMenuActive: -1,// 一级菜单点中样式
      isSubMenuFlag: -1,// 二级菜单显示标志
      tempObj: {},//右边临时变量，作为中间值牵引关系
      tempSelfObj: {
        //一些临时值放在这里进行判断，如果放在tempObj，由于引用关系，menu也会多了多余的参数
      },
      visible2: false,//素材内容  "选择素材"按钮弹框显示隐藏
      tableData: [], //素材内容弹框数据,
      menuName: '',
      showConfigurContent: true,
      nameMaxlength: 0,//名称最大长度
      menuOptions: [{
        value: 'view',
        label: '跳转网页'
      }, {
        value: 'miniprogram',
        label: '跳转小程序'
      }, {
        value: 'click',
        label: '点击回复'
      }, {
        value: 'view_limited',
        label: '跳转图文消息'
      }, {
        value: 'scancode_push',
        label: '扫码直接返回结果'
      }, {
        value: 'scancode_waitmsg',
        label: '扫码回复'
      }, {
        value: 'pic_sysphoto',
        label: '系统拍照发图'
      }, {
        value: 'pic_photo_or_album',
        label: '拍照或者相册'
      }, {
        value: 'pic_weixin',
        label: '微信相册'
      }, {
        value: 'location_select',
        label: '选择地理位置'
      }],
      dialogNewsVisible: false,
      saveLoading: false,
      hackResetWxReplySelect: false
    }
  },
  created () {
    this.getAccountList()
  },
  methods: {
    nodeClick (data) {
      this.checkAppId = data.appid
      this.tempObj.appId = data.appid
      this.getMenuFun()
    },
    getAccountList () {
      fetchAccountList().then(response => {
        this.treeData = response.data.data
        // 默认选中第一个
        if (this.treeData.length > 0) {
          this.nodeClick(this.treeData[0])
        }
      })
    },
    deleteTempObj () {
      this.$delete(this.tempObj, 'repName')
      this.$delete(this.tempObj, 'repUrl')
      this.$delete(this.tempObj, 'content')
    },
    openMaterial () {
      this.dialogNewsVisible = true
    },
    selectMaterial (item) {
      if (item.content.articles.length > 1) {
        this.$alert('您选择的是多图文，将默认跳转第一篇', '提示', {
          confirmButtonText: '确定'
        })
      }
      this.dialogNewsVisible = false
      this.tempObj.media_id = item.mediaId
      this.tempObj.mediaName = item.name
      this.tempObj.url = item.url
      item.mediaType = this.tempObj.mediaType
      item.content.articles = item.content.articles.slice(0, 1)
      this.tempObj.content = item.content
    },
    getMenuFun () {
      getObj(this.checkAppId).then((res) => {
        if (res.data.data) {

          let data = JSON.parse(res.data.data)
          if (data && data.button) {
            this.menu.button = data.button
          }
        }
      });
    },
    handleClick (tab, event) {
      this.tempObj.mediaType = tab.name
    },
    saveMenu () {
      this.$confirm('确定要保存该菜单吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.saveLoading = true
        saveObj(this.checkAppId, this.menu).then(response => {
          this.saveLoading = false
          this.$message.success('保存成功，请点击发布')
        }).catch(() => {
          this.saveLoading = false
        })
      }).catch(() => {
      })
    },
    publishMenu () {
      this.$confirm('确定要发布该菜单吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.saveLoading = true
        publishObj(this.checkAppId).then(response => {
          this.saveLoading = false
          this.$message.success('发布成功')
        }).catch(() => {
          this.saveLoading = false
        })
      })
    },
    // 一级菜单点击事件
    menuFun (i, item) {
      this.hackResetWxReplySelect = false//销毁组件
      this.$nextTick(() => {
        this.hackResetWxReplySelect = true//重建组件
      })
      this.showRightFlag = true;//右边菜单
      this.tempObj = item;//这个如果放在顶部，flag会没有。因为重新赋值了。
      this.tempSelfObj.grand = "1";//表示一级菜单
      this.tempSelfObj.index = i;//表示一级菜单索引
      this.isActive = i; //一级菜单选中样式
      this.isSubMenuFlag = i; //二级菜单显示标志
      this.isSubMenuActive = -1; //二级菜单去除选中样式
      this.nameMaxlength = 4
      if (item.sub_button && item.sub_button.length > 0) {
        this.showConfigurContent = false
      } else {
        this.showConfigurContent = true
      }
      this.tempObj.appId = this.checkAppId
    },
    // 二级菜单点击事件
    subMenuFun (subItem, index, k) {
      this.hackResetWxReplySelect = false//销毁组件
      this.$nextTick(() => {
        this.hackResetWxReplySelect = true//重建组件
      })
      this.showRightFlag = true;//右边菜单
      this.tempObj = subItem;//将点击的数据放到临时变量，对象有引用作用
      this.tempSelfObj.grand = "2";//表示二级菜单
      this.tempSelfObj.index = index;//表示一级菜单索引
      this.tempSelfObj.secondIndex = k;//表示二级菜单索引
      this.isSubMenuActive = index + "" + k; //二级菜单选中样式
      this.isActive = -1;//一级菜单去除样式
      this.showConfigurContent = true;
      this.nameMaxlength = 7
      this.tempObj.appId = this.checkAppId
    },
    // 添加横向一级菜单
    addMenu () {
      let menuKeyLength = this.menuKeyLength
      let addButton = {
        name: "菜单名称",
        sub_button: []
      }
      this.$set(this.menu.button, menuKeyLength, addButton)
      this.menuFun(this.menuKeyLength - 1, addButton)
    },
    // 添加横向二级菜单
    addSubMenu (i, item) {
      if (!item.sub_button || item.sub_button.length <= 0) {
        this.$set(item, 'sub_button', [])
        this.$delete(item, 'type')
        this.$delete(item, 'pagepath')
        this.$delete(item, 'url')
        this.$delete(item, 'key')
        this.$delete(item, 'media_id')
        this.$delete(item, 'textContent')
        this.showConfigurContent = false
      }
      let subMenuKeyLength = item.sub_button.length;//获取二级菜单key长度
      let addButton = {
        name: "子菜单名称"
      }
      this.$set(item.sub_button, subMenuKeyLength, addButton);
      this.subMenuFun(item.sub_button[subMenuKeyLength], i, subMenuKeyLength)
    },
    //删除当前菜单
    deleteMenu (obj) {
      let _this = this;
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this.deleteData();// 删除菜单数据
        _this.tempObj = {};
        _this.showRightFlag = false;
        this.isActive = -1;
        this.isSubMenuActive = -1;
      }).catch(() => {
      });
    },
    // 删除菜单数据
    deleteData () {
      // 一级菜单的删除方法
      if (this.tempSelfObj.grand == "1") {
        this.menu.button.splice(this.tempSelfObj.index, 1);
      }
      // 二级菜单的删除方法
      if (this.tempSelfObj.grand == "2") {
        this.menu.button[this.tempSelfObj.index].sub_button.splice(this.tempSelfObj.secondIndex, 1);
      }
      this.$message({
        type: 'success',
        message: '删除成功!'
      });
    }
  },
  computed: {
    ...mapGetters(['permissions']),
    // menuObj的长度，当长度 小于  3 才显示一级菜单的加号
    menuKeyLength: function () {
      return this.menu.button.length;
    }
  }
}
</script>

