<template>
	<view class="content">
		<image class="logo" :src="headerUrl"  @click="login"></image>
		<view class="text-area">
			<text class="title">{{nickName}}</text>
		</view>
		<!-- <button class="login-btn" type="primary" @click="login">
			微信用户一键登录
		</button> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				nickName: 'Hello',//昵称
				headerUrl:'../../static/Foj.png',//头像,
				statusBarHeight: 0,
				navHeight: 0
			}
		},
		onLoad() {
			this.getHieght()
			this.login()
		},
		methods: {
			navigateBack() {
				uni.redirectTo({
					url: './userPage'
				});
			},
			getHieght() {
				uni.getSystemInfo({
					success: (data) => {
						let custom = uni.getMenuButtonBoundingClientRect()
						this.statusBarHeight = data.statusBarHeight
						//导航栏高度 = 状态栏到胶囊的间距（胶囊距上距离-状态栏高度） * 2 + 胶囊高度 + 状态栏高度。
						this.navHeight = custom.bottom + custom.top - data.statusBarHeight
					}
				})
			},
			login(){
				var that = this
				uni.showModal({
					mask: true,
					title: '温馨提示',
					content: '授权微信登录后才能正常使用小程序功能',
					success(res) {
						if (res.confirm) {
							uni.getUserProfile({
								desc: '获取你的昵称、头像',
								success: userRes => {
									if (userRes.errMsg == 'getUserProfile:ok' && userRes.userInfo != undefined) {
										var userInfo = {
											avatarUrl: userRes.userInfo.avatarUrl,
											nickName: userRes.userInfo.nickName
										}
										console.log(userRes.userInfo.nickName,userRes.userInfo.avatarUrl,userRes);
										that.nickName = userRes.userInfo.nickName
										that.headerUrl = userRes.userInfo.avatarUrl
										uni.setStorage({
											key: 'cookie',
											data:userInfo
										})
										uni.redirectTo({
											url: '../home/home'
										});
									} else {
										uni.showToast({
											icon:"none",
											title:"获取失败，请重试"
										})
									}
								},
								fail: error => {}
							});
						} else if (res.cancel) {}
					}
				});
			},
			
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
	
	.button-style{
		width: 150rpx;
		height: 60rpx;
		background-color: #007AFF;
		border-radius: 10rpx;
		margin-top: 60rpx;
	}
	
	.head {
		width: 100vw;
		display: flex;
		align-items: center;
		border-bottom: 1rpx solid #aaaaaa;
		position: sticky;
		background-color: white;
	
		image {
			width: 30px;
			height: 30px;
			margin-left: 20rpx;
		}
	}
	
</style>
