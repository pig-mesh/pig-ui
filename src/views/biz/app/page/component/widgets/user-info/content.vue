<template>
	<div class="user-info flex items-center px-6">
		<img src="./images/default_avatar.png" class="w-15 h-15" alt="" />
		<div class="text-white text-lg ml-2.5">未登录</div>
	</div>
</template>
<script lang="ts" setup></script>

<style lang="scss" scoped>
.user-info {
	background: url(./images/my_topbg.png);
	height: 115px;
	background-position: bottom;
	background-size: 100% auto;
}
</style>
