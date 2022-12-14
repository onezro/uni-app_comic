<template>
	<view class="search">
		<view class="">
			<uni-search-bar :focus="true" @cancel="cancel" @confirm="confirm" v-model="searchValue" @input="input"></uni-search-bar>
		</view>
		<view class="history" v-if="show">
			<view class="box">
				<text>历史</text>
				<text class="de" @click="removeSearchText">X</text>
			</view>
			<view class="history-text">
				<text v-for="s in searchText" :key="s.id" @longpress="longpress(s.id)" @click="goToSearch(s.text)"
					@touchend="touchend">{{s.text}}</text>
			</view>
		</view>
		<view class="keyword-box" v-if='!show'>
			<view class="keyword" v-for="(l,i) in lightArr" :key="i" @click="choose(i)">
				<rich-text :nodes="l"></rich-text>
			</view>
		</view>
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
				searchValue: '',
				show: true,
				keyWord: [],
				lightArr: [],
				islongPress: false
			}
		},
		onLoad() {

		},
		computed: {
			...mapState(['searchText'])
		},
		methods: {
			getHotWord(a) {
				uni.request({
					url: `${this.$baseUrl}v1/search/suggestion_topic_author?q=${a}&type=2&f=2 `,
					method: 'GET',
					success: ({
						data
					}) => {
						// console.log(data.data);
						this.keyWord = data.data.info
						this.highLight(data.data.info)
						// console.log(this.keyWord);
					}
				})
			},
			confirm({
				value
			}) {
				this.searchValue = ''
				let a = {
					text: value,
					id: new Date().getTime()
				}
				this.setSearchText(a)
				uni.navigateTo({
					url: '../searchcomic/searchcomic?search_title='+value
				});
			},
			input(a) {
				if (a) {
					this.show = false
					this.getHotWord(a)
					// console.log(a);
				} else {
					this.show = true
				}
			},
			cancel(){
				this.searchValue = ''
				uni.navigateBack({
					delta: 1 //返回层数，2则上上页
				});
			},
			highLight(a) {
				let reg = new RegExp(this.searchValue, 'ig')
				let rep = []
				// console.log();
				a.forEach(({
					title
				}) => {
					// console.log(t);
					let b = title.replace(reg, (val) =>
						`<span class="replace-title" style="color: #e2b221">${val}</span>`)
					rep.push(b)
				})
				this.lightArr = rep
				// console.log(this.lightArr);
			},
			choose(a) {
				this.searchValue = ''
				let b = {
					text: this.keyWord[a].title,
					id: new Date().getTime()
				}
				this.setSearchText(b)
				uni.navigateTo({
					url: '../searchcomic/searchcomic?search_title='+this.keyWord[a].title
				});
			},
			longpress(a) {
				// console.log("长按事件");
				this.islongPress = true;
				if(this.islongPress == true){
					// console.log(a);
					uni.showModal({
					    title: '提示',
					    content: '是否删除',
					    success: (res)=> {
					        if (res.confirm) {
					            // console.log('用户点击确定');
								this.delSearchText(a)
					        } else if (res.cancel) {
					            // console.log('用户点击取消');
					        }
					    }
					});

				}
			},
			goToSearch(a) {
				if (this.islongPress == false) {
					// console.log("不是长按事件");
					// console.log(a);
					uni.navigateTo({
						url: '../searchcomic/searchcomic?search_title='+a
					});
				}
			},
			touchend() {
				//延时执行为了防止 click() 还未判断 islongPress 的值就被置为 fasle
				setTimeout(() => {
					this.islongPress = false
				}, 200)
			},

			...mapMutations(['setSearchText', 'delSearchText','removeSearchText'])
		}
	}
</script>

<style lang="scss" scoped>
	.search {
		.history {
			box-sizing: border-box;
			width: 100%;
			padding: 0 30rpx;
			display: flex;
			flex-direction: column;
			gap: 25rpx;

			.box {
				display: flex;
				justify-content: space-between;
				align-items: flex-end;
				font-size: 30rpx;

				.de {
					font-size: 28rpx;
					color: #999;
				}
			}

			.history-text {
				display: flex;
				flex-wrap: wrap;
				gap: 20rpx;

				text {
					border-radius: 999px;
					font-size: 25rpx;
					padding: 15rpx 20rpx;
					// text-align: center;
					// line-height: 30rpx;
					background-color: #f0f0f0;
				}
			}
		}

		.keyword-box {
			box-sizing: border-box;
			width: 100%;
			padding: 0 30rpx;

			.keyword {
				padding: 20rpx 0;
				font-weight: bold;
			}
		}
	}
</style>
