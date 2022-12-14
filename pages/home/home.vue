<template>
	<view class="home">
		<view class="navbar-fixed">
			<!-- 状态栏小程序撑起高度 -->
			<view :style="{height:statusBarHeight+'px'}"></view>
			<view class="navbar-content" :style="{height:navBarHeight+'px',width:windowWidth+'px'}">
				<view class="navbar-search">
					<view class="navbar-search_icon">
						<uni-icons type="search" size="16" color="#999"></uni-icons>
					</view>
					<view class="navbar-serach">
						<input class="navbar-search_text" @focus="clickInput" type="text" v-model="val"
							placeholder="请输入您要搜索的内容" />
					</view>
				</view>
			</view>
		</view>
		<view :style="{height: statusBarHeight+navBarHeight+'px'}"></view>
		<view class="home-head" :style="{top: statusBarHeight+navBarHeight+'px'}">
			<van-tabs animated v-model="choose" color="#343434" line-width="0px" title-active-color="#343434"
				@click="chooseTag">
				<van-tab title="推荐" :key="-1">
					<recommend :banners="banners" :recommendData="recommendData" :dailyList="dailyList"
						@changeList='changeList'></recommend>
				</van-tab>
				<van-tab v-for="f in favoriteType" :name="f.tagId" :title="f.title" :key="f.tagId">
					<scroll-view class="theme-list" scroll-y="true"  @scrolltolower="scrollLower">
							<view class="topics">
								<view class="card" v-for="r in themeList" :key='r.id' @click="goTodetail(r.id)">
									<image :lazy-load="true" :src="r.vertical_image_url"></image>
									<view class="comci-text">{{r.title}}</view>
									<view class="update-text">{{r.corner_text}}</view>
								</view>
							</view> 
						 <uni-load-more :status="status"></uni-load-more>
					</scroll-view>
				</van-tab>
				<view slot="nav-right">
					<image src="../../static/img/bt.png" :style="{'width': '20px','height': '20px','margin':'12px 7px'}"
						@click="open"></image>
				</view>
			</van-tabs>
		</view>
		<uni-popup ref="popup" type="right" background-color="#fff">
			<view class="pup" :style="{height: statusBarHeight+navBarHeight+'px'}"></view>
			<view class="theme">
				<view class="my-theme">
					<view class="my-text">
						<text>我的主题</text>
						<text @click="close" class="finsh">完成</text>
					</view>
					<view class="item">
						<view class="list" v-for="f in favoriteType" :key="f.tagId"
							@click="removeTheme(f)">{{f.title}}
							<view class="jia">x</view>
							</view>
					</view>
				</view>
				<view class="optional-theme">
					<view class="my-text">
						<text>更多主题</text>
					</view>
					<view class="item">
						<view class="list2" v-for="f in theme" :key="f.tagId" @click="addTheme(f)">{{f.title}} <view class="jia">+</view> </view>
					</view>
				</view>
			</view>
		</uni-popup>
	</view>

</template>

<script>
	import recommend from '../components/recommend.vue'
	export default {
		data() {
			return {
				banners: [],
				active: 2,
				choose: 1,
				statusBarHeight: 0,
				navBarHeight: 0,
				windowWidth: 0,
				val: '',
				favoriteType: [{
					"tagId": 68,
					"title": "异能",
					"icon": null
				}, {
					"tagId": 93,
					"title": "冒险",
					"icon": null
				}, {
					"tagId": 85,
					"title": "武侠",
					"icon": null
				}, {
					"tagId": 72,
					"title": "竞技",
					"icon": null
				}],
				count: 1,
				categories: [],
				theme: [],
				recommendData: {},
				dailyList: [],
				tag: '',
				themeList: [],
				since:0,
				allNum:110,
				status: "more",
				timer: null
			}
		},
		onLoad() {
			this.statusBar()
			this.getType()
		},
		methods: {
			getType() {
				uni.request({
					url: `${this.$baseUrl}v2/pweb/home`,
					method: 'GET',
					success: ({
						data
					}) => {
						// console.log(data);
						this.banners = data.data.banners
						this.categories = data.data.categories
						this.recommendData = data.data
						this.randomNumber()
					}
				})
			},
			getTheme() {
				uni.request({
					url: `${this.$baseUrl}v1/search/by_tag?since=${this.since}&count=30&f=3&tag=${this.tag}&sort=1&query_category={"update_status":1}`,
					method: 'GET',
					success: ({
						data
					}) => {
						// console.log(data.data);
						this.allNum=data.total
						this.themeList.push(...data.data.topics)
						setTimeout(function () {
							uni.hideLoading();
						}, 300);
					}
				})
			},
			 scrollLower() {
			      if (this.since >=this.allNum-30 ) {
			        this.status = "noMore"
			        return
			      } else {
			        this.status = "loading"
			      }
			      this.since+=30
				  // console.log(this.since);
			      this.timer = setTimeout(() => {
			        this.getTheme()
			      }, 1000)
			    },
			statusBar() {
				const info = uni.getSystemInfoSync()
				this.statusBarHeight = info.statusBarHeight
				this.windowWidth = info.windowWidth
				const menuButtonInfo = uni.getMenuButtonBoundingClientRect()
				this.navBarHeight = (menuButtonInfo.bottom - info.statusBarHeight) + (menuButtonInfo.top - info
					.statusBarHeight)
				this.windowWidth = menuButtonInfo.left
			},
			randomNumber() {
				let {
					topics
				} = this.recommendData.daily_topics
				let count = []
				while (count.length != 6) {
					let a = Math.ceil(Math.random() * 29)
					let b = count.findIndex(t => t == a)
					if (b == -1) {
						// console.log(a);
						count.push(a)
						let c = topics.filter((f, i) => i == a)
						this.dailyList.push(...c)
					}
				}
			},
			changeList() {
				this.dailyList = []
				this.randomNumber()
			},
			clickInput() {
				uni.navigateTo({
					url: '../search/search'
				});
			},
			chooseTag({
				name
			}) {
				// console.log(name);
				this.tag = name
				if (name != 0) {
					this.themeList = []
					this.since=0
					this.getTheme()
					uni.showLoading({
						title: '加载中'
					});
				}
			},
			open() {
				this.$refs.popup.open()
				this.moreTheme()
			},
			close() {
				this.$refs.popup.close()
			},
			moreTheme() {
				this.theme = this.categories.filter(c => !this.favoriteType.some(f => f.tagId == c.tagId))
			},
			removeTheme(a) {
				// console.log(a);
				this.favoriteType = this.favoriteType.filter(({
					tagId
				}) => tagId != a.tagId)
				this.theme.push(a)
				if (this.favoriteType.length == 0) {
					this.choose = -1
				}
			},
			addTheme(a) {
				this.favoriteType.push(a)
				this.theme = this.theme.filter(t => a.tagId != t.tagId)
			},
			goTodetail(a){
				// console.log(a);
				uni.navigateTo({
					url: '../detail/detail?detail_id='+a
				});
			}
		},
		components: {
			recommend,
		},
	}
</script>

<style lang="scss" scoped>
	.home {

		.pup {
			width: 500rpx;
		}

		.theme {
			display: flex;
			flex-direction: column;
			gap: 50rpx;
			box-sizing: border-box;
			padding: 0 30rpx;
			width: 500rpx;

			.my-theme,
			.optional-theme{
				display: flex;
				flex-direction: column;
				gap: 30rpx;

				.my-text {
					display: flex;
					justify-content: space-between;
					align-items: flex-end;
					.finsh{
						color: #fe7d06;
						font-size: 27rpx;
					}
				}

				.item {
					display: flex;
					flex-wrap: wrap;
					gap: 30rpx 40rpx;

					.list {
						position: relative;
						border-radius: 999px;
						width: 120rpx;
						font-size: 25rpx;
						padding: 8px 0;
						text-align: center;
						background-color: #f0f0f0;
						animation: move .5s linear infinite;
						.jia{
							position: absolute;
							border-radius: 999px;
							top: -10rpx;
							right: -5rpx;
							width: 15px;
							height: 15px;
							text-align: center;
							line-height: 15px;
							color: #fff;
							background-color: #dcdcdc;
						}
					}
					.list2 {
						position: relative;
						box-sizing: border-box;
						border: 1rpx solid #fe7d06;
						border-radius: 999px;
						width: 120rpx;
						font-size: 25rpx;
						padding: 8px 0;
						text-align: center;
						background-color: #fff0e3;
						.jia{
							position: absolute;
							border-radius: 999px;
							top: -10rpx;
							right: -5rpx;
							width: 15px;
							height: 15px;
							text-align: center;
							line-height: 15px;
							color: #fff;
							background-color: #fe7d06;
						}
					}
				}
			}


		}

		.theme-list {
			box-sizing: border-box;
			padding: 0 30rpx 200rpx 30rpx;
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
						font-size: 20rpx;
						color: #949494;
					}
				}

				.card:nth-child(n+4) {
					margin-top: 15rpx;
				}

			}

			.change {
				width: 100%;
				box-sizing: border-box;
				border-radius: 999px;
				padding: 15rpx 0;
				text-align: center;
				font-size: 28rpx;
				color: #999;
				background-color: #f0f0f0;
			}
		}

		.home-head {
			position: fixed;
			width: 100%;
			height: 45px;
			z-index: 10;
			background-image: linear-gradient(180deg, #f0ac24, #f0ac24c9, #e1ac1570);
		}

		.navbar-fixed {
			position: fixed;
			top: 0;
			left: 0;
			z-index: 99;
			width: 100%;
			background-color: #f0ac24;

			.navbar-content {
				display: flex;
				justify-content: center;
				align-items: center;
				padding: 0 15px;
				height: 45px;
				box-sizing: border-box;

				.navbar-search {
					display: flex;
					align-items: center;
					padding: 0 10px;
					width: 100%;
					height: 30px;
					border-radius: 30px;
					background-color: #fff;

					.navbar-search_icon {
						// width: 10px;
						// height: 10px;
						margin-right: 10px;
					}

					.navbar-search_text {
						width: 100%;
						font-size: 14px;
						color: #999;
					}
				}

				&.search {
					padding-left: 0;

					.navbar-content__search-icons {
						margin-left: 10px;
						margin-right: 10px;
					}

					.navbar-search {
						border-radius: 5px;
					}
				}
			}

		}

		@keyframes move {
			0% {
				transform: rotateZ(0deg);
			}

			25% {
				transform: rotateZ(3deg);
			}

			75% {
				transform: rotateZ(-3deg)
			}

			100% {
				transform: rotateZ(0deg)
			}

		}
	}
</style>
