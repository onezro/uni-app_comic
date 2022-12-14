<template>
	<view class="detail">

		<view class="detail-meg">
			<view class="comic">
				<image :lazy-load="true" :src="detail_info.cover_image_url"></image>
				<view class="comic-info">
					<view class="title">
						<text>{{detail_info.title}}</text>
						<view class="concern" :class="{followed:isConcern()}" @click="concernComic">
							{{book.length!=0?'已关注':'+关注'}}
						</view>
					</view>
					<view class="popularity">
						<text class="text">{{detail_info.popularity_info}}人气值</text>
						<text class="l">|</text>
						<text class="text">{{detail_info.comments_count}}总评论</text>
						<text class="l">|</text>
						<text class="text">{{detail_info.fav_count}}人关注</text>
					</view>
				</view>
			</view>
			<view class="comic-box">
				<view class="introduction">
					<view class="label">
						<text v-for="t in tags" :key="t">{{t}}</text>
					</view>
					<view class="text">{{detail_info.description}}</view>
					<view class="author">
						<image :lazy-load="true" :src="detail_info.user.avatar"></image>
						<text>{{detail_info.user.nickname}}</text>
					</view>
				</view>
				<view class="directory">
					<view class="dirtext">
						<view class="analecta">漫画选集</view>
					</view>
					<scroll-view class="theme-list" scroll-x="true">
						<view class="catalog-sets">
							<view class="analecta-box" v-for="c in detail_info.comics" :key="c.id"
								@click="goToRead(c.id,c.is_free)" :class="{read:alread(c.id)}">
								<image :lazy-load="true" :src="c.cover_image_url" :mode="c.title"></image>
								<text>{{c.title}}</text>
								<view class="gou" v-if="exist[0].comic_id==c.id"></view>
								<view class="pay" v-if="c.is_pay_comic">付费</view>
							</view>
						</view>
					</scroll-view>
					<view class="unfold" @click="open">展开目录</view>
				</view>
			</view>
			<view class="recommend">
				<view class="recomtext">
					相关推荐
				</view>
				<recently :topics="recommend_topics"></recently>
			</view>
			<view class="recently">
				<view class="recomtext">
					最近更新
				</view>
				<recently :topics="bottom_recommend.topic_list"></recently>
			</view>
		</view>

		<uni-popup ref="popup" type="bottom" background-color="#fff">
			<view class="list">
				<view class="head">
					<view class="title">
						<view class="xz">漫画选集</view>
						<view class="sort" @click="changeSort"><text>{{sortList?"倒序":"正序"}}</text><i></i></view>
					</view>
					<view class="time"><text>{{detail_info.update_status}}</text><text
							class="l">|</text><text>已更{{detail_info.comics_count}}个内容</text><text
							class="l">|</text><text>{{detail_info.comic_body_count}}篇正文</text></view>
				</view>
				<scroll-view class="catalog" enable-back-to-top=true :scroll-top="scrollTop" scroll-y="true"
					@scroll="disabledScroll">
					<view class="box">
						<view class="assemble" v-for="c in comics" :key="c.id" @click="goToRead(c.id,c.is_free)"
							:class="{active:alread(c.id)}">
							<image :lazy-load="true" :src="c.cover_image_url" :mode="c.title"></image>
							<view class="assemble-text">
								<view class="">{{c.title}}</view>
								<view class="update"> <text>{{c.created_at}}</text> <text>{{c.likes_count}}</text>
								</view>
								<view class="gou" v-if="exist[0].comic_id==c.id"></view>
								<view class="pay" v-if="c.is_pay_comic">付费</view>
							</view>
						</view>

					</view>
					<view class="top" v-if="showTop" @click="goTop">Top</view>
				</scroll-view>
			</view>
		</uni-popup>
		<view class="read-box">
			<view class="add">{{exist.length!=0?exist[0].lookTitle:detail_info.comics[0].title}}</view>
			<view class="start" @click="goToredw">开始阅读</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from "vuex"
	import recently from "../components/recently.vue"
	export default {
		data() {
			return {
				detail_info: {},
				bottom_recommend: {},
				recommend_topics: [],
				tags: [],
				comics: [],
				detail_id: '',
				sortList: false,
				showTop: false,
				scrollTop: 0,
				oldScrollTop: 0,
			}
		},
		onLoad(options) {
			uni.setNavigationBarTitle({
				title: '详情'
			})
			this.detail_id = options.detail_id
			this.getDetail()
			uni.showLoading({
				title: '加载中'
			});
		},
		computed: {
			...mapState(['historyComic', 'bookself', 'already']),
			exist() {
				return this.historyComic.filter(h => h.id == this.detail_id)
			},
			book() {
				return this.bookself.filter(h => h.id == this.detail_id)
			}
		},
		methods: {
			getDetail() {
				uni.request({
					url: `${this.$baseUrl}v2/pweb/topic/${this.detail_id}`,
					method: 'GET',
					success: ({
						data
					}) => {
						this.detail_info = data.data.topic_info
						this.bottom_recommend = data.data.bottom_recommend
						this.recommend_topics = data.data.recommend_topics
						this.tags = this.detail_info.tags.filter((t, i) => i < 6)
						this.comics = this.detail_info.comics
						console.log(this.comics[0].is_free);
						setTimeout(function() {
							uni.hideLoading();
						}, 800);
					}
				})
			},
			goTodetail(a) {
				// console.log(a);
				uni.navigateTo({
					url: '../detail/detail?detail_id=' + a
				});
			},
			open() {
				this.$refs.popup.open()
			},
			close() {
				this.$refs.popup.close()
			},
			disabledScroll({
				detail
			}) {
				this.oldScrollTop = parseInt(detail.scrollTop)
				if (this.oldScrollTop > 30) {
					this.showTop = true
				} else {
					this.showTop = false
				}
			},
			goTop() {
				this.scrollTop = this.oldScrollTop
				//当视图渲染结束 重新设置为0
				this.$nextTick(() => {
					this.scrollTop = 0
				});
			},
			changeSort() {
				this.sortList = !this.sortList
				this.comics = this.comics.reverse()
			},
			goToRead(a, b) {
				// console.log(a,b);
				if (b) {
					this.$refs.popup.close()
					uni.navigateTo({
						url: '../reader/reader?comics_id=' + a
					});
				} else {
					uni.showModal({
					    title: '提示',
					    content: '疯狂漫画V我50',
					    success: (res)=> {
					        if (res.confirm) {
					            uni.showToast({
					            	title: '还是有点少，再V我50',
					            	duration: 1000
					            })
					        } else if (res.cancel) {
					          uni.showToast({
					          	title: '支付取消',
					          	duration: 1000
					          })
					        }
					    }
					});
				}

			},
			concernComic() {
				let a = this.exist.length != 0 ? this.exist[0].lookTitle : this.detail_info.comics[0].title
				let b = this.exist.length != 0 ? this.exist[0].comic_id : this.detail_info.comics[0].id
				let concern = {
					id: this.detail_id,
					image: this.detail_info.vertical_image_url,
					title: this.detail_info.title,
					latest: this.detail_info.comics.pop().title,
					lookTitle: a,
					comic_id: b
				}
				// console.log(concern);
				this.setBookself(concern)
			},
			isConcern() {
				let a = this.bookself.findIndex(b => b.id == this.detail_id)
				// console.log(a);
				if (a == -1) {
					return false
				} else {
					return true
				}
			},
			alread(a) {
				// console.log(a);
				let b = this.already.findIndex(t => t == a)
				if (b != -1) {
					return true
				} else {
					return false
				}
			},
			goToredw() {
				let b = this.exist.length != 0 ? this.exist[0].comic_id : this.detail_info.comics[0].id
				// this.$refs.popup.close()
				uni.navigateTo({
					url: '../reader/reader?comics_id=' + b
				});
			},
			...mapMutations(['setBookself'])

		},
		components: {
			recently
		}
	}
</script>


<style lang="scss" scoped>
	.detail {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		overflow: auto;
		background-color: #fff;

		&::-webkit-scrollbar {
			display: none;
			width: 0 !important;
			height: 0 !important;
			-webkit-appearance: none;
			background: transparent;
			color: transparent;
		}

		.detail-meg {
			padding-bottom: 110rpx;

			.comic {
				position: relative;
				width: 100%;
				height: 435rpx;

				image {
					width: 100%;
					height: 100%;
				}

				.comic-info {
					position: absolute;
					width: 100%;
					height: 100%;
					background-color: rgba(0, 0, 0, .2);
					box-sizing: border-box;
					display: flex;
					flex-direction: column;
					justify-content: flex-end;
					padding: 30rpx;
					gap: 20rpx;
					left: 0;
					bottom: 0;
					color: #fff;

					.title {
						display: flex;
						justify-content: space-between;
						align-items: center;
						letter-spacing: 5rpx;
						font-size: 34rpx;
						font-weight: bold;

						.concern {
							border-radius: 999px;
							padding: 10rpx 15rpx;
							font-size: 25rpx;
							letter-spacing: 3rpx;
							color: #000;
							background-color: #f0ac24;
						}

						.followed {
							color: #000;
							background-color: #dcdcdc;
						}
					}

					.popularity {
						display: flex;
						align-items: center;
						gap: 8rpx;
						letter-spacing: 3rpx;

						.text {
							font-size: 22rpx;
							font-weight: 600;
						}

						.l {
							font-size: 15rpx;
						}
					}
				}
			}

			.comic-box {

				.introduction {
					display: flex;
					flex-direction: column;
					gap: 20rpx;
					padding: 0 30rpx;

					.label {
						margin-top: 10rpx;
						display: flex;
						gap: 10px;

						text {
							// width: 120rpx;
							border-radius: 999px;
							font-size: 20rpx;
							padding: 5px 18rpx;
							background-color: #f0f0f0;
						}
					}

					.text {
						font-size: 25rpx;
					}

					.author {
						display: flex;
						align-items: center;
						gap: 20rpx;

						image {
							border-radius: 999px;
							width: 40rpx;
							height: 40rpx;
						}

						text {
							font-size: 25rpx;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
						}
					}

				}

				.directory {
					display: flex;
					flex-direction: column;
					gap: 20rpx;
					margin-top: 30rpx;

					.dirtext {
						padding: 0 30rpx;
					}

					.catalog-sets {
						display: flex;
						gap: 10px;
						margin-left: 30rpx;

						.analecta-box {
							position: relative;
							display: flex;
							flex-direction: column;
							gap: 10rpx;
							width: 300rpx;

							image {
								border-radius: 10rpx;
								width: 300rpx;
								height: 169rpx;
							}

							text {
								font-size: 25rpx;
								overflow: hidden;
								text-overflow: ellipsis;
								white-space: nowrap;
							}

							.gou {
								position: absolute;
								right: 10rpx;
								top: 10rpx;
								width: 40rpx;
								height: 40rpx;
								background-image: url(../../static/img/8-b.png);
								background-size: cover;
								background-repeat: no-repeat;
							}

							.pay {
								position: absolute;
								border-radius: 10rpx;
								left: 10rpx;
								top: 10rpx;
								padding: 5rpx 10px;
								font-size: 20rpx;
								color: #fff;
								background-color: #f0ac24;
							}
						}

						.read {
							image {
								opacity: 0.5;
							}
						}
					}

					.unfold {
						border-radius: 999px;
						border: 1rpx solid #dcdcdc;
						margin: auto;
						font-size: 25rpx;
						padding: 10rpx 25rpx;
					}
				}

			}

			.recommend,
			.recently {
				display: flex;
				flex-direction: column;
				gap: 20rpx;
				margin-top: 30rpx;

				.recomtext {
					padding: 0 30rpx;
				}

			}
		}

		.read-box {
			position: fixed;
			left: 0;
			bottom: 0;
			display: flex;
			width: 100%;
			height: 90rpx;
			background-color: #f7f7f7;

			.add {
				flex: 1;
				text-align: center;
				line-height: 90rpx;
			}

			.start {
				// border-top-left-radius: 30rpx;
				width: 250rpx;
				text-align: center;
				line-height: 90rpx;
				color: #9a4e06;
				font-weight: bold;
				background-color: #f0ac24;
			}

		}

		.list {
			box-sizing: border-box;
			width: 100%;
			height: 80vh;
			padding: 20rpx 20rpx 0 20rpx;

			.head {
				display: flex;
				flex-direction: column;
				gap: 10rpx;
				position: sticky;
				left: 0;
				top: 0;
				width: 100%;
				height: 90rpx;
				background-color: #fff;

				.title {
					display: flex;
					justify-content: space-between;

					.xz {
						font-size: 30rpx;
						font-weight: bold;
					}

					.sort {
						font-size: 26rpx;
					}

				}

				.time {
					display: flex;
					align-items: center;
					gap: 10rpx;
					font-size: 23rpx;
					color: #999;

					.l {
						font-size: 18rpx;
					}
				}
			}

			.catalog {
				width: 100%;
				height: calc(80vh - 110rpx);

				.top {
					position: fixed;
					border-radius: 999px;
					bottom: 20rpx;
					right: 20rpx;
					width: 60rpx;
					height: 60rpx;
					font-size: 30rpx;
					text-align: center;
					line-height: 60rpx;
					color: #fff;
					background-color: #f0ac24;
				}

				.box {

					.assemble {
						position: relative;
						display: flex;
						gap: 20rpx;
						height: 141rpx;
						padding: 12rpx 20rpx;

						image {
							border-radius: 10rpx;
							width: 250rpx;
							height: 141rpx;
						}

						.assemble-text {
							flex: 1;
							display: flex;
							flex-direction: column;
							justify-content: space-between;

							.update {
								display: flex;
								justify-content: space-between;
								font-size: 25rpx;
							}
						}

						.gou {
							position: absolute;
							right: 20rpx;
							top: 20rpx;
							width: 40rpx;
							height: 40rpx;
							background-image: url(../../static/img/8-b.png);
							background-size: cover;
							background-repeat: no-repeat;
						}

						.pay {
							position: absolute;
							border-radius: 10rpx;
							left: 30rpx;
							top: 20rpx;
							padding: 5rpx 10px;
							font-size: 20rpx;
							color: #fff;
							background-color: #f0ac24;
						}
					}

					.active {
						background-color: #f7f7f7;

						image {
							opacity: 0.5;
						}
					}

				}
			}
		}
	}
</style>
