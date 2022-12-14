<template>
	<view class="reader">
		<view class="header"
			:style="{height:navHeight+'px',paddingTop:statusBarHeight+'px',paddingRight:customLeft+'px'}"
			v-if="showHead">
			<view class="be">
				<image src="../../static/img/_wS.png" @click="goBack"></image>
				<text class="title">{{comic.title}}</text>
			</view>
			<view class="pe">
				<view class="sy" @click="goHome"></view>
				<text class="delit" @click="gotoDetail(comic.id)">详</text>
			</view>

		</view>
		<scroll-view class="comic-img" scroll-y="true" @scroll="topRecord" :scroll-top='setTop'>

			<view class="img" v-for="(c,i) in comic_images" :key="i">
				<image :lazy-load="true" :src="c.url" @click="showHead=!showHead" :style="{width:setWidth,height:setHeight}"></image>
			</view>

		</scroll-view>
		<view class="bottom">
			<view class="zhan" v-if="prev == null"></view>
			<image src="../../static/img/k7T1.png" @click="prevPage" v-if="prev != null"></image>
			<view class="moom" @click="open">目录</view>
			<image src="../../static/img/k7T.png" @click="nextPage"></image>
		</view>
		<view class="pages"> <text>{{comic_info.title}}</text><text>{{page}}/{{comic_info.comic_images.length}}</text>
		</view>
		<uni-popup ref="popup" type="bottom" background-color="#fff">
			<view class="list">
				<view class="head">
					<view class="title">
						<view class="xz">漫画选集</view>
						<view class="sort" @click="changeSort"><text>{{sortList?"倒序":"正序"}}</text><i></i></view>
					</view>
				</view>
				<scroll-view class="catalog" enable-back-to-top=true :scroll-top="scrollTop" scroll-y="true" @scroll="disabledScroll">
					<view class="box">
						<view class="assemble" v-for="c in comicArr" :key="c.id" @click="goToRead(c.id)"
							:class="{active:alread(c.id)}">
							<image :lazy-load="true" :src="c.cover_image_url" :mode="c.title"></image>
							<view class="assemble-text">
								<view class="">{{c.title}}</view>
								<view class="update"> <text>{{c.created_at}}</text> <text>{{c.likes_count}}</text>
								</view>
								<view class="gou" v-if="comics_id==c.id"></view>
								<view class="pay" v-if="c.is_pay_comic">付费</view>
							</view>
						</view>
					</view>
					<view class="top" v-if="showTop" @click="goTop">Top</view>
				</scroll-view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from "vuex"
	export default {
		data() {
			return {
				comics_id: '',
				comic_info: {},
				comic_title: '',
				comic_images: [],
				comicArr: [],
				comic: {},
				prev: 0,
				next: 0,
				navHeight: 0,
				statusBarHeight: 0,
				sortList: false,
				scrollTop: 0,
				oldScrollTop:0,
				showTop:false,
				showHead: true,
				page: 1,
				customLeft: 0,
				setWidth:'',
				setHeight:'',
			}
		},
		onLoad(options) {
			this.getHieght()
			this.getComics(options.comics_id)
			this.setAlready(options.comics_id)
			uni.showLoading({
				title: '加载中'
			});
		},
		computed: {
			...mapState(['already'])
		},
		methods: {
			getComics(a) {
				this.comics_id = a
				uni.request({
					url: `${this.$baseUrl}v2/pweb/comic/${a}`,
					method: 'GET',
					success: ({
						data
					}) => {
						this.comic_info = data.data.comic_info;
						this.comic_images = data.data.comic_info.comic_images
						this.prev = data.data.previous_comic_info
						this.next = data.data.next_comic_info
						if(this.comicArr.length==0){
							this.comicArr = data.data.topic_info.comics.reverse()
						}
						this.comic = data.data.topic_info
						let comicRead = {
							id: data.data.topic_info.id,
							comic_id: a,
							timeId:new Date().getTime(),
							title: data.data.topic_info.title,
							lookTitle: data.data.comic_info.title,
							cover_image_url: data.data.comic_info.cover_image_url,
							latest: this.comicArr.pop().title,
							author: data.data.topic_info.user.nickname,
						}
						this.setHistory(comicRead)
						this.updateBook(comicRead)
						this.imgCompute()
						setTimeout(function () {
							uni.hideLoading();
						}, 800);
						// console.log(comicRead);
						// console.log(this.comic,this.comicArr);
					}
				})
			},
			getHieght() {
				uni.getSystemInfo({
					success: (data) => {
						let custom = uni.getMenuButtonBoundingClientRect()
						this.statusBarHeight = data.statusBarHeight
						//导航栏高度 = 状态栏到胶囊的间距（胶囊距上距离-状态栏高度） * 2 + 胶囊高度 + 状态栏高度。
						this.customLeft = custom.width
						// console.log(this.customLeft);
						this.navHeight = custom.bottom + custom.top - data.statusBarHeight
					}
				})
			},
			goBack() {
				uni.navigateBack({
					delta: 1 //返回层数，2则上上页
				});
			},
			prevPage() {
				if (this.prev != null) {
					this.comic_images = []
					this.getComics(this.prev.id)
					this.setAlready(this.prev.id)
					uni.showLoading({
						title: '加载中'
					});
				}
			},
			nextPage() {
				this.comic_images = []
				// this.setTop=0
				if (this.next.id != null) {
					// this.comic_info={}
					this.getComics(this.next.id)
					this.setAlready(this.next.id)
				}
				uni.showLoading({
					title: '加载中'
				});
			},
			open() {
				this.$refs.popup.open()
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
				this.comicArr = this.comicArr.reverse()
			},
			goToRead(a) {
				this.comic_images = []
				this.setAlready(a)
				this.$refs.popup.close()
				this.getComics(a)
			},
			goHome() {
				// console.log(1);
				uni.switchTab({
					url: '../home/home'
				});
			},
			gotoDetail(a) {
				// console.log(a);
				uni.navigateTo({
					url: '../detail/detail?detail_id=' + a
				});
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
			topRecord({
				detail
			}) {
				if (parseInt(detail.scrollTop) > 0) {
					this.showHead = false
				}
				if (parseInt(detail.scrollTop) == 0) {
					this.showHead = true
				}
				this.page = Math.ceil(parseInt(detail.scrollTop) / parseInt(this.setHeight)) + 1

			},
			imgCompute(){
				  let  {width,height}=this.comic_images.shift()
				  // console.log(width,height);
				  const getSystemInfo = uni.getSystemInfoSync()
				  const {windowWidth, windowHeight} = getSystemInfo; //屏幕可视宽高
				  let imageAdapt = (height * windowWidth) / width; //计算根据宽度的自适应的高度
		
				  this.setWidth=`${windowWidth}px`
				  this.setHeight=`${Math.ceil(imageAdapt)}px`
			},
			...mapMutations(['setAlready', 'setHistory', 'updateBook'])

		}
	}
</script>

<style lang="scss" scoped>
	.reader {
		position: fixed;
		width: 100%;
		height: 100%;

		.header {
			position: fixed;
			top: 0;
			left: 0;
			box-sizing: border-box;
			padding: 0 20rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			width: 100%;
			z-index: 999;
			background-color: #fff;

			.be {
				display: flex;
				gap: 20rpx;

				image {
					width: 45rpx;
					height: 45rpx;
				}

				.title {

					font-size: 30rpx;
					font-weight: bold;
					color: #343434;
				}
			}

			.pe {
				display: flex;
				gap: 20rpx;
				margin-right: 20rpx;
				.delit {
					border-radius: 999px;
					padding: 3rpx 6rpx;
					border: 2rpx solid #999;
					font-size: 20rpx;
					color: #999;

				}

				.sy {
					width: 35rpx;
					height: 35rpx;
					background-image: url(../../static/img/mv1.png);
					background-repeat: no-repeat;
					background-size: 100% 100%;
				}
			}


		}

		.comic-img {
			width: 100%;
			height: 100vh;
			overflow: auto;

			&::-webkit-scrollbar {
				display: none;
				width: 0 !important;
				height: 0 !important;
				-webkit-appearance: none;
				background: transparent;
				color: transparent;
			}

			.img {
				font-size: 0;

				image {
					font-size: 0;
				}

			}

		}

		.bottom {
			position: fixed;
			bottom: 0rpx;
			right: 0rpx;
			padding: 10rpx 25rpx;
			border-radius: 999rpx;
			display: flex;
			align-items: center;
			gap: 20rpx;
			color: #fff;
			background-color: rgba(0, 0, 0, .4);

			image {
				width: 40rpx;
				height: 40rpx;
			}
			.zhan{
				width: 40rpx;
				height: 40rpx;
			}

		}


		.list {
			box-sizing: border-box;
			width: 100%;
			height: 80vh;
			padding-top: 20rpx;

			.head {
				box-sizing: border-box;
				display: flex;
				flex-direction: column;
				gap: 10rpx;
				position: sticky;
				left: 0;
				top: 0;
				width: 100%;
				height: 60rpx;
				padding: 0 20rpx;
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

			}

			.catalog {
				width: 100%;
				height: calc(80vh - 70rpx);
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

		.pages {
			box-sizing: border-box;
			position: fixed;
			left: 0;
			bottom: 0;
			display: flex;
			gap: 20rpx;
			border-top-right-radius: 20rpx;
			padding: 10rpx 20rpx;
			font-size: 20rpx;
			color: #fff;
			background-color: rgba(0, 0, 0, .4);
		}

	}
</style>
