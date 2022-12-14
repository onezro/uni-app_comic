<template>
	<view class="daily">
		<view class="head">
			<van-tabs v-model="active" sticky color="#f0ac24" line-width="72px" title-active-color="#343434"
				@click="chooseTag">
				<van-tab v-for="(p,i) in posTheme" :title="p" :name="i" :key="i">
					<scroll-view class="theme-list" scroll-y="true">
						<view class="topics">
							<view class="card" v-for="r in posList" :key='r.id' @click="goTodetail(r.id)">
								<image :lazy-load="true" :src="r.vertical_image_url"></image>
								<view class="comci-text">{{r.title}}</view>
								<view class="update-text">{{r.corner_text}}</view>
							</view>
						</view>
						<uni-load-more :status="status"></uni-load-more>
					</scroll-view>
			 </van-tab>
			</van-tabs>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				active: 0,
				pos: 0,
				posTheme: [],
				posList: [],
				status:'noMore'
			}
		},
		onLoad() {
			this.getDaily()
		},
		methods: {
			getDaily() {
				uni.request({
					url: `${this.$baseUrl}v2/pweb/daily/topics?pos=${this.pos}`,
					method: 'GET',
					success: ({
						data
					}) => {
						if (this.posTheme.length == 0) {
							this.posTheme = data.data.week_days
						}
						this.posList = data.data.topics
						// console.log(this.posTheme);
						setTimeout(function () {
							uni.hideLoading();
						}, 300);
					}
				})
			},
			chooseTag({
				name
			}) {
				this.posList=[]
				uni.showLoading({
					title: '加载中'
				});
				this.pos = name
				this.getDaily()
			},
			goTodetail(a){
				uni.navigateTo({
					url: '../detail/detail?detail_id='+a
				});
			}

		}

	}
</script>

<style lang="scss" scoped>
	.daily {
		.head {
			position: fixed;
			width: 100%;
			height: 45px;
			z-index: 10;
			background-color: #fff;
			.theme-list {
				box-sizing: border-box;
				padding: 0 30rpx;
				// width: 100vw;
				height: 100vh;

				// overflow: auto;
				::-webkit-scrollbar {
					display: none;
					width: 0 !important;
					height: 0 !important;
					-webkit-appearance: none;
					background: transparent;
					color: transparent;
				}

				.topics {
					display: flex;
					flex-wrap: wrap;
					justify-content: space-between;

					.card {
						margin-bottom: 15rpx;
						width: 220rpx;
						image {
							border-radius: 10rpx;
							width: 100%;
							height: 280rpx;
						}

						.comci-text {
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
							font-size: 27rpx;
						}

						.update-text {
							font-size: 20rpx;
							color: #949494;
						}
					}

					// .card:nth-child(n+4) {
					// 	margin-top: 15rpx;
					// }

				}
			}
		}
	}
</style>
