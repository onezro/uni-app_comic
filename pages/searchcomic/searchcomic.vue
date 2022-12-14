<template>
	<view class="comic">
		<view class="card" v-for="h in hit" :key="h.id" @click="goTodetail(h.id)">
			<image :lazy-load="true" :src="h.vertical_image_url" mode=""></image>
			<view class="card-meg">
				<view class="card-head">
					<view class="title">{{h.title}}</view>
					<view class="tags">
						<text v-for="c  in h.category" :key="c">{{c}}</text>
					</view>
					<view class="des">{{h.description}}</view>
				</view>
				<view class="card-bottom">
					<view class="news">最新：{{h.latest_comic_title}}</view>
					<view class="author">作者：{{h.user.nickname}}</view>
				</view>

			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				hit: []
			}
		},
		onLoad(options) {
			// console.log(options.search_title);
			uni.setNavigationBarTitle({
				title: options.search_title
			})
			this.getkeyWordComic(options.search_title)
		},
		methods: {
			getkeyWordComic(a) {
				uni.request({
					url: `${this.$baseUrl}v1/search/topic?q=${a}&f=3&size=30`,
					method: 'GET',
					success: ({
						data
					}) => {
						this.hit = data.data.hit
						// console.log(this.hit);
					}
				})
			},
			goTodetail(a) {
				uni.navigateTo({
					url: '../detail/detail?detail_id=' + a 
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
	.comic {
		width: 100%;
		height: 100vh;
		overflow: auto;
		padding: 20rpx 20rpx 0 20rpx;

		&::-webkit-scrollbar {
			display: none;
			width: 0 !important;
			height: 0 !important;
			-webkit-appearance: none;
			background: transparent;
			color: transparent;
		}

		.card {
			display: flex;
			gap: 20rpx;
			width: 100%;
			height: 280rpx;
			padding-bottom: 20rpx;

			image {
				border-radius: 10rpx;
				width: 210rpx;
				height: 280rpx;
			}

			.card-meg {
				padding: 10rpx 0;
				width: 480rpx;
				display: flex;
				flex-direction: column;
				gap: 30rpx;

				.card-head {
					display: flex;
					flex-direction: column;
					gap: 8rpx;

					.title {
						font-size: 32rpx;
						font-weight: bold;
					}

					.tags {
						display: flex;
						gap: 7rpx;
		
						text{
							box-sizing: border-box;
							padding: 0 10rpx;
							border: 1rpx  solid #888;
							border-radius: 8rpx;
							font-size: 20rpx;
							font-weight: bold;
							color: #888;
						}
					}

					.des {
						font-size: 25rpx;
						color: #888;
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
					}
				}
				.card-bottom{
					display: flex;
					flex-direction: column;
					gap: 10rpx;
					.news{
						font-size: 27rpx;
						color: #5a5a5a;
					}
					.author{
						font-size: 25rpx;
						color: #5a5a5a;
					}
				}
			}
		}
	}
</style>
