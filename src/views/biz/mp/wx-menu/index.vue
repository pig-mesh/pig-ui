<template>
  <div class="layout-padding">
    <splitpanes>
      <pane size="20">
        <div class="layout-padding-auto layout-padding-view">
          <el-scrollbar>
            <query-tree class="mt10" :query="deptData.queryList" @node-click="handleNodeClick" placeholder="请输入微信公众号名称" />
          </el-scrollbar>
        </div>
      </pane>
      <pane>
        <div class="layout-padding-auto layout-padding-view">
          <el-scrollbar>
            <div v-loading="loading" class="clearfix public-account-management">
              <div class="left">
                <div class="weixin-hd">
                  <div class="weixin-title">{{ name }}</div>
                </div>
                <div class="clearfix weixin-menu menu_main">
                  <div v-for="(item, i) of menuList" :key="i" class="menu_bottom">
                    <div :class="{ active: isActive === i }" class="menu_item el-icon-s-fold" @click="menuClick(i, item)">
                      {{ item.name }}
                    </div>
                    <!-- 以下为二级菜单-->
                    <div v-if="isSubMenuFlag === i" class="submenu">
                      <template v-for="(subItem, k) in item.sub_button">
                        <div v-if="item.sub_button" :key="k" class="subtitle menu_bottom">
                          <div :class="{ active: isSubMenuActive === i + '' + k }" class="menu_subItem" @click="subMenuClick(subItem, i, k)">
                            {{ subItem.name }}
                          </div>
                        </div>
                      </template>
                      <!-- 二级菜单加号， 当长度 小于 5 才显示二级菜单的加号  -->
                      <div v-if="!item.sub_button || item.sub_button.length < 5" class="menu_bottom menu_addicon" @click="addSubMenu(i, item)">
                        <el-icon>
                          <el-icon><Plus /></el-icon>
                        </el-icon>
                      </div>
                    </div>
                  </div>
                  <!-- 一级菜单加号 -->
                  <div v-if="menuList.length < 3" class="menu_bottom menu_addicon" @click="addMenu">
                    <el-icon>
                      <el-icon><Plus /></el-icon>
                    </el-icon>
                  </div>
                </div>
                <div class="flex items-center justify-center gap-4 mt-4 mb-6 save_div">
                  <el-button
                      class="save_btn !px-6 !h-9 hover:scale-105 transition-transform"
                      type="primary"
                      size="small"
                      @click="handleSave"
                  >
                    <el-icon class="mr-1"><Check /></el-icon>
                    保存发布
                  </el-button>
                  <el-button
                      class="save_btn !px-6 !h-9 hover:scale-105 transition-transform"
                      type="primary"
                      plain
                      size="small"
                      @click="handleDelete"
                  >
                    <el-icon class="mr-1"><Delete /></el-icon>
                    清空菜单
                  </el-button>
                </div>
              </div>

              <!-- 配置面板 -->
              <div v-if="showRightFlag" class="right !bg-transparent">
                <el-card shadow="never" class="!border-2 !border-gray-200 dark:!border-gray-700 !rounded-xl overflow-hidden !bg-white dark:!bg-gray-800">
                  <!-- 卡片头部 -->
                  <template #header>
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-3">
                        <div class="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 shadow-md">
                          <el-icon class="text-white text-xl"><Setting /></el-icon>
                        </div>
                        <div>
                          <div class="text-lg font-semibold text-gray-900 dark:text-gray-100">菜单配置</div>
                          <div class="text-sm text-gray-500 dark:text-gray-400">设置菜单名称和响应行为</div>
                        </div>
                      </div>
                      <el-button
                        type="primary"
                        plain
                        @click="deleteMenu(tempObj)"
                        class="!rounded-lg"
                        :icon="Delete"
                      >
                        删除菜单
                      </el-button>
                    </div>
                  </template>

                  <!-- 配置表单 -->
                  <el-form label-width="120px" class="px-2">
                    <!-- 菜单名称 -->
                    <el-form-item label="菜单名称" class="!mb-6">
                      <el-input
                        v-model="tempObj.name"
                        placeholder="请输入菜单名称"
                        clearable
                        maxlength="8"
                        show-word-limit
                        class="!w-full"
                      >
                        <template #prefix>
                          <el-icon class="text-gray-400"><Edit /></el-icon>
                        </template>
                      </el-input>
                    </el-form-item>

                    <template v-if="showConfigureContent">
                      <!-- 菜单标识 -->
                      <el-form-item label="菜单标识" class="!mb-6">
                        <el-input
                          v-model="tempObj.key"
                          placeholder="请输入菜单 KEY"
                          clearable
                          class="!w-full"
                        >
                          <template #prefix>
                            <el-icon class="text-gray-400"><Key /></el-icon>
                          </template>
                        </el-input>
                      </el-form-item>

                      <!-- 菜单类型 -->
                      <el-form-item label="菜单类型" class="!mb-6">
                        <el-select
                          v-model="tempObj.type"
                          placeholder="请选择菜单类型"
                          clearable
                          class="!w-full"
                        >
                          <el-option
                            v-for="item in menuOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          />
                        </el-select>
                      </el-form-item>

                      <!-- 跳转链接 -->
                      <div v-if="tempObj.type === 'view'" class="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800 mb-6">
                        <div class="flex items-center gap-2 mb-3">
                          <el-icon class="text-blue-500"><Link /></el-icon>
                          <span class="font-medium text-gray-900 dark:text-gray-100">跳转网页设置</span>
                        </div>
                        <el-form-item label="跳转链接" class="!mb-0">
                          <el-input
                            v-model="tempObj.url"
                            placeholder="请输入链接地址，如：https://www.example.com"
                            clearable
                            class="!w-full"
                          >
                            <template #prefix>
                              <el-icon class="text-gray-400"><Link /></el-icon>
                            </template>
                          </el-input>
                        </el-form-item>
                      </div>

                      <!-- 小程序配置 -->
                      <div v-if="tempObj.type === 'miniprogram'" class="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800 mb-6">
                        <div class="flex items-center gap-2 mb-4">
                          <el-icon class="text-purple-500"><Postcard /></el-icon>
                          <span class="font-medium text-gray-900 dark:text-gray-100">小程序配置</span>
                        </div>
                        <el-form-item label="小程序 AppID" class="!mb-4">
                          <el-input
                            v-model="tempObj.miniProgramAppId"
                            placeholder="请输入小程序的 AppID"
                            clearable
                            class="!w-full"
                          />
                        </el-form-item>
                        <el-form-item label="页面路径" class="!mb-4">
                          <el-input
                            v-model="tempObj.miniProgramPagePath"
                            placeholder="请输入小程序的页面路径，如：pages/index"
                            clearable
                            class="!w-full"
                          />
                        </el-form-item>
                        <el-form-item label="备用网页" class="!mb-0">
                          <el-input
                            v-model="tempObj.url"
                            placeholder="不支持小程序的老版本客户端将打开本网页"
                            clearable
                            class="!w-full"
                          />
                        </el-form-item>
                        <div class="mt-3 flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                          <el-icon class="text-blue-500 mt-0.5"><InfoFilled /></el-icon>
                          <span class="text-sm text-blue-700 dark:text-blue-300">需要和公众号进行关联才可以把小程序绑定到微信菜单</span>
                        </div>
                      </div>

                      <!-- 图文消息 -->
                      <div v-if="tempObj.type === 'article_view_limited'" class="p-4 bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-xl border border-green-200 dark:border-green-800 mb-6">
                        <div class="flex items-center gap-2 mb-4">
                          <el-icon class="text-green-500"><Document /></el-icon>
                          <span class="font-medium text-gray-900 dark:text-gray-100">图文消息设置</span>
                        </div>
                        <div v-if="tempObj && tempObj.replyArticles && tempObj.replyArticles.length > 0" class="select-item">
                          <wx-news :objData="tempObj.replyArticles" />
                          <div class="mt-3 text-center">
                            <el-button type="danger" :icon="Delete" circle @click="deleteMaterial" />
                          </div>
                        </div>
                        <div v-else class="text-center py-6">
                          <el-button type="success" @click="openMaterial" :icon="FolderOpened">
                            从素材库选择
                          </el-button>
                        </div>
                        <wx-material-select ref="dialogNewsRef" @selectMaterial="selectMaterial" />
                      </div>

                      <!-- 点击回复 / 扫码回复 -->
                      <div v-if="tempObj.type === 'click' || tempObj.type === 'scancode_waitmsg'" class="p-4 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl border border-orange-200 dark:border-orange-800 mb-6">
                        <div class="flex items-center gap-2 mb-4">
                          <el-icon class="text-orange-500"><ChatDotRound /></el-icon>
                          <span class="font-medium text-gray-900 dark:text-gray-100">回复内容设置</span>
                        </div>
                        <wx-reply :objData="tempObj" v-if="hackResetWxReplySelect" />
                      </div>
                    </template>
                  </el-form>
                </el-card>
              </div>
             </div>
          </el-scrollbar>
        </div>
      </pane>
    </splitpanes>
  </div>
</template>

<script lang="ts" name="wx-menu" setup>
import {getObj, publishObj, saveObj} from '/@/api/mp/wx-menu';

// 部门树使用的数据
import {fetchAccountList} from '/@/api/mp/wx-account';
import {useMessage, useMessageBox} from '/@/hooks/message';
import {
  Plus,
  Check,
  Delete,
  InfoFilled,
  Setting,
  Edit,
  Key,
  Link,
  Postcard,
  Document,
  FolderOpened,
  ChatDotRound,
} from '@element-plus/icons-vue';

const WxMaterialSelect = defineAsyncComponent(() => import('/@/components/Wechat/wx-material-select/main.vue'));

const WxReply = defineAsyncComponent(() => import('/@/components/Wechat/wx-reply/index.vue'));

const QueryTree = defineAsyncComponent(() => import('/@/components/QueryTree/index.vue'));

const WxNews = defineAsyncComponent(() => import('/@/components/Wechat/wx-news/index.vue'));

// 点击树
const handleNodeClick = (node: any) => {
  accountId.value = node.appid;
  name.value = node.name;
  getMenuFun();
};

const deptData = reactive({
  queryList: (name?: string) => {
    return fetchAccountList({
      name: name,
    });
  },
});

const loading = ref(false);

const name = ref('测试公众号');

const accountId = ref(''); // 公众号id
// 一级菜单点中样式
const isActive = ref(-1);
// 一级菜单点中样式
const isSubMenuActive = ref('-1');
// 二级菜单显示标志
const isSubMenuFlag = ref(-1);

const menuList = reactive([
  {
    name: '菜单名称',
    sub_button: [],
  },
] as any);

const hackResetWxReplySelect = ref(false);

const menuOptions = ref([
  {
    value: 'view',
    label: '跳转网页',
  },
  {
    value: 'miniprogram',
    label: '跳转小程序',
  },
  {
    value: 'click',
    label: '点击回复',
  },
  {
    value: 'article_view_limited',
    label: '跳转图文消息',
  },
  {
    value: 'scancode_push',
    label: '扫码直接返回结果',
  },
  {
    value: 'scancode_waitmsg',
    label: '扫码回复',
  },
  {
    value: 'pic_sysphoto',
    label: '系统拍照发图',
  },
  {
    value: 'pic_photo_or_album',
    label: '拍照或者相册',
  },
  {
    value: 'pic_weixin',
    label: '微信相册',
  },
  {
    value: 'location_select',
    label: '选择地理位置',
  },
]);

const showRightFlag = ref(false);

let tempObj = ref({
  replyArticles: [] as any,
  articleId: '',
  appId: '',
});

const tempSelfObj = reactive({
  grand: '', // 表示二级菜单
  index: '', // 表示一级菜单索引
  secondIndex: '', // 表示二级菜单索引
});

const getMenuFun = () => {
  getObj(accountId.value).then((res) => {
    if (res.data) {
      const data = JSON.parse(res.data);
      if (data && data.button) {
        Object.assign(menuList, data.button);
      }
    } else {
      menuList.length = 0;
      Object.assign(menuList, {
        name: '菜单名称',
        sub_button: [],
      });
    }
  });
};

const showConfigureContent = ref(true);

// 一级菜单点击事件
const menuClick = (i, item) => {
  hackResetWxReplySelect.value = false;
  nextTick(() => {
    hackResetWxReplySelect.value = true;
  });
  showRightFlag.value = true; // 右边菜单
  tempObj.value = item;
  tempObj.value.appId = accountId.value;
  showConfigureContent.value = !(item.sub_button && item.sub_button.length > 0); // 有子菜单，就不显示配置内容
  isActive.value = i;
  isSubMenuFlag.value = i;
  isSubMenuActive.value = '-1';
  tempSelfObj.grand = '1'; //表示一级菜单
  tempSelfObj.index = i; //表示一级菜单索引
};

// 点击二级菜单
const subMenuClick = (subItem, index, k) => {
  hackResetWxReplySelect.value = false;
  nextTick(() => {
    hackResetWxReplySelect.value = true;
  });
  showRightFlag.value = true; // 右边菜单
  // Object.assign(tempObj, subItem) // 这个如果放在顶部，flag 会没有。因为重新赋值了。
  tempObj.value = subItem;
  tempObj.value.appId = accountId.value;
  showConfigureContent.value = true;
  isActive.value = -1; // 一级菜单去除样式
  isSubMenuActive.value = index + '' + k; // 二级菜单选中样式
  tempSelfObj.grand = '2'; //表示二级菜单
  tempSelfObj.index = index; //表示一级菜单索引
  tempSelfObj.secondIndex = k; //表示二级菜单索引
};

// 添加横向二级菜单；item 表示要操作的父菜单
const addSubMenu = (i, item) => {
  if (!item.sub_button || item.sub_button.length <= 0) {
    item['sub_button'] = [];
    showConfigureContent.value = false;
  }
  let addButton = {
    name: '子菜单名称',
    reply: {
      // 用于存储回复内容
      type: 'text',
      accountId: accountId.value, // 保证组件里，可以使用到对应的公众号
    },
  };
  item.sub_button.push(addButton);
};

// 添加横向一级菜单
const addMenu = () => {
  const addButton = {
    name: '菜单名称',
    sub_button: [],
    reply: {
      // 用于存储回复内容
      type: 'text',
      accountId: accountId.value, // 保证组件里，可以使用到对应的公众号
    },
  };
  menuList.push(addButton);
};

const deleteMenu = () => {
  useMessageBox()
      .confirm('确定要删除吗?')
      .then(() => {
        if (tempSelfObj.grand === '1') {
          menuList.splice(tempSelfObj.index, 1);
        } else if (tempSelfObj.grand === '2') {
          menuList[tempSelfObj.index].sub_button.splice(tempSelfObj.secondIndex, 1);
        }
        useMessage().success('删除成功');
        Object.assign(tempObj, {});
        showRightFlag.value = false;
        isActive.value = -1;
        isSubMenuActive.value = '-1';
      })
      .catch((err) => {
        useMessage().error(err.msg);
      });
};

const handleSave = async () => {
  try {
    await useMessageBox().confirm('确定要保存该菜单吗?');
    await saveObj(accountId.value, { button: menuList });
    await publishObj(accountId.value);
    useMessage().success('发布成功');
  } catch (err: any) {
    useMessage().error(err.msg);
  }
};

const deleteMaterial = () => {
  tempObj.value.replyArticles = [];
  tempObj.value.articleId = '';
};

const dialogNewsRef = ref();
const openMaterial = () => {
  dialogNewsRef.value.openDialog({ type: 'news', accountId: accountId.value });
};

const selectMaterial = (item) => {
  const articleId = item.articleId;
  const articles = item.content.newsItem;
  // 提示，针对多图文
  if (articles.length > 1) {
    // this.$alert('您选择的是多图文，将默认跳转第一篇', '提示', {
    //   confirmButtonText: '确定'
    // })
  }

  // 设置菜单的回复
  tempObj.value.articleId = articleId;
  tempObj.value.replyArticles = [];
  articles.forEach((article) => {
    tempObj.value.replyArticles.push({
      title: article.title,
      description: article.digest,
      picUrl: article.picUrl,
      url: article.url,
    });
  });
};

const handleDelete = () => {};

// 默认选择第一个公众号
onMounted(async () => {
  const { data } = await deptData.queryList();
  if (data?.length > 0) {
    handleNodeClick(data[0]);
  }
});
</script>

<style lang="scss" scoped>
@use './assets/wx-menu.scss' as *;
</style>
