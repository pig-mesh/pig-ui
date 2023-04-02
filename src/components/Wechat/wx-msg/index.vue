<template>
	<el-dialog title="用户消息" v-model="visible" :close-on-click-modal="false" draggable>
		<div v-loading="mainLoading" class="msg-main">
			<div id="msg-div" class="msg-div">
				<div v-if="!tableLoading">
					<div v-if="loadMore" class="el-table__empty-block" @click="loadingMore"><span class="el-table__empty-text">点击加载更多</span></div>
					<div v-if="!loadMore" class="el-table__empty-block"><span class="el-table__empty-text">没有更多了</span></div>
				</div>
				<div v-for="item in tableData" :key="item.id" class="execution" id="msgTable">
					<div class="avue-comment" :class="item.type === '2' ? 'avue-comment--reverse' : ''">
						<div class="avatar-div">
							<name-avatar v-if="item.type === '1'" scale="2" :name="item.nickName" />
							<name-avatar v-if="item.type !== '1'" scale="2" :face-url="item.appLogo" />
						</div>
						<div class="avue-comment__main">
							<div class="avue-comment__header">
								<div class="avue-comment__create_time">{{ item.createTime }}</div>
							</div>
							<div class="avue-comment__body" :style="item.type === '2' ? 'background: #6BED72;' : ''">
								<div v-if="item.repType === 'event' && item.repEvent === 'subscribe'">
									<el-tag type="success" size="mini">关注</el-tag>
								</div>
								<div v-if="item.repType === 'event' && item.repEvent === 'unsubscribe'">
									<el-tag type="danger" size="mini">取消关注</el-tag>
								</div>
								<div v-if="item.repType === 'event' && item.repEvent === 'CLICK'">
									<el-tag size="mini">点击菜单</el-tag>
									：【{{ item.repName }}】
								</div>
								<div v-if="item.repType === 'event' && item.repEvent === 'VIEW'">
									<el-tag size="mini">点击菜单链接</el-tag>
									：【{{ item.repUrl }}】
								</div>
								<div v-if="item.repType === 'event' && item.repEvent === 'scancode_waitmsg'">
									<el-tag size="mini">扫码结果：</el-tag>
									：【{{ item.repContent }}】
								</div>
								<div v-if="item.repType === 'text'">{{ item.repContent }}</div>
								<div v-if="item.repType === 'image'">
									<a target="_blank" :href="item.repUrl"><img :src="item.repUrl" style="width: 100px" /></a>
								</div>
								<div v-if="item.repType === 'voice'">
									<SvgIcon name="local-wx-voice" :size="80" @click="loadVideo(item)"></SvgIcon>
								</div>
								<div v-if="item.repType === 'video'" style="text-align: center">
									<SvgIcon name="local-wx-video" :size="80" @click="loadVideo(item)"></SvgIcon>
								</div>
								<div v-if="item.repType === 'shortvideo'" style="text-align: center">
									<svg-icon name="local-wx-video" :size="80" @click="loadVideo(item)"></svg-icon>
								</div>
								<div v-if="item.repType === 'location'">
									<el-link
										type="primary"
										target="_blank"
										:href="
											'https://map.qq.com/?type=marker&isopeninfowin=1&markertype=1&pointx=' +
											item.repLocationY +
											'&pointy=' +
											item.repLocationX +
											'&name=' +
											item.repContent +
											'&ref=joolun'
										"
									>
										<img
											:src="
												'https://apis.map.qq.com/ws/staticmap/v2/?zoom=10&markers=color:blue|label:A|' +
												item.repLocationX +
												',' +
												item.repLocationY +
												'&key=PFFBZ-RBM3V-IEEPP-UH6KE-6QUQE-C4BVJ&size=250*180'
											"
										/>
										<p />
										<i class="el-icon-map-location"></i>{{ item.repContent }}
									</el-link>
								</div>
								<div v-if="item.repType === 'link'" class="avue-card__detail">
									<el-link type="success" :underline="false" target="_blank" :href="item.repUrl">
										<div class="avue-card__title"><i class="el-icon-link"></i>{{ item.repName }}</div>
									</el-link>
									<div class="avue-card__info" style="height: unset">{{ item.repDesc }}</div>
								</div>
								<div v-if="item.repType === 'news'" style="width: 300px">
									<wx-news :obj-data="JSON.parse(item.content)"></wx-news>
								</div>
								<div v-if="item.repType === 'music'">
									<el-link type="success" :underline="false" target="_blank" :href="item.repUrl">
										<div class="avue-card__body" style="padding: 10px; background-color: #fff; border-radius: 5px">
											<div class="avue-card__avatar"><img :src="item.repThumbUrl" alt="" /></div>
											<div class="avue-card__detail">
												<div class="avue-card__title" style="margin-bottom: unset">{{ item.repName }}</div>
												<div class="avue-card__info" style="height: unset">{{ item.repDesc }}</div>
											</div>
										</div>
									</el-link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div v-loading="sendLoading" class="msg-send" @keyup.enter="sendMsg">
				<wx-reply :objData="objData"></wx-reply>
				<el-button type="success" class="send-but" @click="sendMsg">发送(S)</el-button>
			</div>
		</div>
	</el-dialog>
</template>

<script setup lang="ts" name="wx-msg">
import { fetchList, addObj } from '/@/api/mp/wx-fans-msg';
import { useMessage } from '/@/hooks/message';
import { getMaterialVideo } from '/@/api/mp/wx-material';

const WxReply = defineAsyncComponent(() => import('../wx-reply/index.vue'));
const WxNews = defineAsyncComponent(() => import('../wx-news/index.vue'));

const NameAvatar = defineAsyncComponent(() => import('/@/components/NameAvatar/index.vue'));

const visible = ref(false);

// 各种loading
const mainLoading = ref(false);
const sendLoading = ref(false);

const loadMore = ref(false);

const objData = ref({
	repType: 'text',
	appId: '',
}) as any;

const page = reactive({
	total: 0, // 总页数
	currentPage: 1, // 当前页数
	pageSize: 10, // 每页显示多少条
	ascs: [], //升序字段
	descs: 'create_time', //降序字段
});

const wxData = reactive({
	appId: '',
	wxUserId: '',
});

const sendMsg = () => {
	if (objData.value) {
		if (objData.value.repType === 'news') {
			if (JSON.parse(objData.value.content).length > 1) {
				useMessage().error('图文消息条数限制在1条以内，已默认发送第一条');
				objData.value.content = JSON.parse(objData.value.content)[0];
			}
		}
		sendLoading.value = true;
		addObj(
			Object.assign(
				{
					wxUserId: wxData.wxUserId,
					appId: wxData.appId,
				},
				objData.value
			)
		)
			.then(() => {
				tableData.value = [];
				getData().then(() => {
					//box-container是添加overflow的父div，也就是出现滚动条的div
					var scrollTarget = document.getElementById('msg-div');
					//scrollTarget.scrollHeight是获取dom元素的高度，然后设置scrollTop
					scrollTarget.scrollTop = scrollTarget.scrollHeight;
				});
			})
			.finally(() => {
				sendLoading.value = false;
			});
	}
};

const tableData = ref([] as any);
const tableLoading = ref(false);

const openDialog = (data: any) => {
	wxData.wxUserId = data.wxUserId;
	wxData.appId = data.appId;
	objData.value.appId = data.appId;
	getData();
	visible.value = true;
};

const getData = () => {
	tableLoading.value = true;
	return fetchList({
		...page,
		...wxData,
	}).then((res) => {
		const data = res.data.records.reverse();
		tableData.value = [...data, ...tableData.value];
		page.total = res.data.total;
		tableLoading.value = false;
		if (data.length < page.pageSize || data.length === 0) {
			loadMore.value = false;
		}
	});
};

const loadVideo = (item) => {
	getMaterialVideo({
		mediaId: item.repMediaId,
		appId: item.appId,
	}).then((response) => {
		const data = response.data;
		window.open(data.downUrl, 'target', '');
	});
};

const loadingMore = () => {
	page.currentPage = page.currentPage + 1;
	getData();
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>

<style lang="scss" scoped>
@import './comment.scss';
@import './card.scss';

.msg-main {
	margin-top: -30px;
	padding: 10px;
}

.msg-div {
	height: 50vh;
	overflow: auto;
	background-color: #eaeaea;
	margin-left: 10px;
	margin-right: 10px;
}

.msg-send {
	padding: 10px;
}

.avatar-div {
	text-align: center;
	width: 80px;
}

.send-but {
	float: right;
	margin-top: 8px !important;
}
</style>
