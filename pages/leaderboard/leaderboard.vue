<template>
	<view class="leader">
		<view class="head">
			<van-tabs v-model="active" sticky color="#f0ac24" line-width="20px" title-active-color="#343434"
				@click="chooseTag">
				<van-tab v-for="l in list" :title="l.title" :name="l.rank_id" :key="l.rank_id">
					<scroll-view class="theme-list" scroll-y="true">
						<view class="topics">
							<view class="card" v-for="r in BoardList" :key='r.id' @click="goTodetail(r.id)">
								<image :lazy-load="true" :src="r.vertical_image_url"></image>
								<view class="comci-text">{{r.title}}</view>
								<view class="update-text">更新至：{{r.latest_comic.title}}</view>
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
				list: [{
						"rank_id": 9,
						"title": "人气榜"
					},
					{
						"rank_id": 2,
						"title": "新作榜"
					},
					{
						"rank_id": 7,
						"title": "飙升榜"
					},
					{
						"rank_id": 11,
						"title": "韩漫榜"
					},
					{
						"rank_id": 28,
						"title": "免费榜"
					},
					{
						"rank_id": 10,
						"title": "日漫榜"
					},
					{
						"rank_id": 12,
						"title": "完结榜"
					}
				],
				active: 0,
				status: 'noMore',
				BoardList: [],
				rank_id: 9,
			}
		},
		onLoad(options) {
			this.getBoard()
			uni.showLoading({
				title: '加载中'
			});
		},
		methods: {
			getBoard() {
				uni.request({
					url: `${this.$baseUrl}v2/pweb/rank/topics?rank_id=${this.rank_id}`,
					method: 'GET',
					success: ({
						data
					}) => {
						this.BoardList = data.data.rank_info.topics
						// console.log(this.BoardList);
						setTimeout(function() {
							uni.hideLoading();
						}, 500);
					}
				})
			},
			chooseTag({
				name
			}) {
				this.rank_id = name
				this.BoardList = []
				this.getBoard()
				uni.showLoading({
					title: '加载中'
				});

			},
			goTodetail(a) {
				uni.navigateTo({
					url: '../detail/detail?detail_id=' + a
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.leader {
		.head {
			position: fixed;
			width: 100%;
			height: 45px;
			z-index: 10;
			background-color: #fff;

			.theme-list {
				box-sizing: border-box;
				padding: 0 20rpx;
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
				
					// gap: 15rpx;
					.card {
						width: 220rpx;
				
						// margin-bottom: 20rpx;
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
						.update-text{
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
							font-size: 20rpx;
							color: #949494;
							margin-bottom: 10rpx;
						}
					}
				}
			}
		}
	}
</style>
