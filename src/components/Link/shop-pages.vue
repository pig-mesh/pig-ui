<template>
	<div class="shop-pages">
		<div class="flex flex-wrap link-list">
			<div
				class="link-item border border-br px-5 py-[5px] rounded-[3px] cursor-pointer mr-[10px] mb-[10px]"
				v-for="(item, index) in linkList"
				:class="{
					'border-primary text-primary': modelValue.path == item.path && modelValue.name == item.name,
				}"
				:key="index"
				@click="handleSelect(item)"
			>
				{{ item.name }}
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import { LinkTypeEnum, type Link } from '.';

defineProps({
	modelValue: {
		type: Object as PropType<Link>,
		default: () => ({}),
	},
});
const emit = defineEmits<{
	(event: 'update:modelValue', value: Link): void;
}>();

const linkList = ref([
	{
		path: '/pages/index/index',
		name: '首页',
		type: LinkTypeEnum.SHOP_PAGES,
	},
	{
		path: '/pages/workbench/index',
		name: '工作台',
		type: LinkTypeEnum.SHOP_PAGES,
	},
	{
		path: '/pages/workbench/contacts/index',
		name: '通讯录',
		type: LinkTypeEnum.SHOP_PAGES,
	},
	{
		path: '/pages/workbench/calendar/index',
		name: '日程',
		type: LinkTypeEnum.SHOP_PAGES,
	},
	{
		path: '/pages/user/index',
		name: '我的',
		type: LinkTypeEnum.SHOP_PAGES,
	},
	{
		path: '/pages/index/search/index',
		name: '搜索',
		type: LinkTypeEnum.SHOP_PAGES,
	},
	{
		path: '/pages/user/collection/index',
		name: '我的收藏',
		type: LinkTypeEnum.SHOP_PAGES,
	},
	{
		path: '/pages/user/messages/index',
		name: '消息中心',
		type: LinkTypeEnum.SHOP_PAGES,
	},
	{
		path: '/pages/user/messages/detail',
		name: '消息详情',
		type: LinkTypeEnum.SHOP_PAGES,
	},
	{
		path: '/pages/user/settings/index',
		name: '个人设置',
		type: LinkTypeEnum.SHOP_PAGES,
	},
	{
		path: '/pages/user/profile/index',
		name: '个人资料',
		type: LinkTypeEnum.SHOP_PAGES,
	},
	{
		path: '/pages/user/bind-mobile/index',
		name: '绑定手机号',
		type: LinkTypeEnum.SHOP_PAGES,
	},
	{
		path: '/pages/user/change-password/index',
		name: '修改密码',
		type: LinkTypeEnum.SHOP_PAGES,
	},
	{
		path: '/pages/user/about/index',
		name: '关于我们',
		type: LinkTypeEnum.SHOP_PAGES,
	},
	{
		path: '/pages/user/customer-service/index',
		name: '联系客服',
		type: LinkTypeEnum.SHOP_PAGES,
	},
	{
		path: '/pages/login/agreement/index',
		name: '用户协议',
		type: LinkTypeEnum.SHOP_PAGES,
		query: {
			type: 'user',
		},
	},
	{
		path: '/pages/login/agreement/index',
		name: '隐私政策',
		type: LinkTypeEnum.SHOP_PAGES,
		query: {
			type: 'privacy',
		},
	},
]);

const handleSelect = (value: Link) => {
	emit('update:modelValue', value);
};
</script>
