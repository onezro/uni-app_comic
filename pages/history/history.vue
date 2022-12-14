<template>
	<view class="history">
		<view class="card" v-for="h in historyComic" :key="h.id" @click="goToRead(h.comic_id)">
			<view class="img" :style="{'backgroundImage':'url('+h.cover_image_url+')'}"></view>
			<view class="info">
				<text class="title">{{h.title}}</text>
				<text class="last">阅读至：{{h.lookTitle}}</text>
				<text class="time">{{getData(h.timeId)}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from "vuex"
	export default {
		computed: {
			...mapState(['historyComic'])

		},
		methods: {
			getData(a) {
				let date = new Date(a)
				let y = date.getFullYear() //获取年份
				let m = date.getMonth() + 1 //获取月份
				m = m < 10 ? "0" + m : m //月份不满10天显示前加0
				let d = date.getDate() //获取日期
				d = d < 10 ? "0" + d : d //日期不满10天显示前加0
				let h = date.getHours()
				h=h < 10 ? "0" + h : h
				let min = date.getMinutes()
					min=min < 10 ? "0" + min : min			
				return y + "-" + m + "-" + d+' '+h+':'+min
			},
			goToRead(a){
				uni.navigateTo({
					url: '../reader/reader?comics_id=' + a
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.history {
		box-sizing: border-box;
		width: 100%;
		height: 100vh;
		overflow: auto;
		padding: 0 20rpx;

		.card {
			display: flex;
			gap: 20rpx;
			padding: 10rpx 0;

			.img {
				border-radius: 10rpx;
				width: 157rpx;
				height: 200rpx;
				background-repeat: no-repeat;
				background-size: 350rpx 200rpx;
				background-position: center;
			}

			.info {
				display: flex;
				flex-direction: column;
				justify-content: space-around;

				.title {
					font-size: 30rpx;
					font-weight: bold;
				}

				.last {
					font-size: 27rpx;
				}

				.time {
					font-size: 20rpx;
					color: #999;
				}
			}
		}
	}
</style>
