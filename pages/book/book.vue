<template>
	<view class="book">
		<view class="box">
			<view class="card" v-for="b in bookself" :key="b.id" @longpress="longpress(b)" @click="goToRead(b.comic_id)"
					@touchend="touchend">
			<image :lazy-load="true" :src="b.image"></image>
			<view class="text">
				<text class="title">{{b.title}}</text>
				<text class="last-look">{{b.lookTitle}}</text>
			</view>
		</view>
		</view>
		
	</view>
</template>

<script>
	import {
		mapState,mapMutations
	} from "vuex"
	export default {
		data(){
			return {
				islongPress:false
			}
		},
		computed: {
			...mapState(['bookself'])
		},
		methods:{
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
								this.setBookself(a)
					        } else if (res.cancel) {
					            // console.log('用户点击取消');
					        }
					    }
					});
			
				}
			},
			goToRead(a) {
				if (this.islongPress == false) {
					uni.navigateTo({
						url: '../reader/reader?comics_id='+a
					});
				}
			},
			touchend() {
				//延时执行为了防止 click() 还未判断 islongPress 的值就被置为 fasle
				setTimeout(() => {
					this.islongPress = false
				}, 200)
			},
			...mapMutations(['setBookself'])
		}
	}
</script>

<style lang="scss" scoped>
	.book {
		box-sizing: border-box;
		width: 100%;
		height: 100vh;
		overflow: auto;
		padding: 5rpx 30rpx 0 30rpx;
		&::-webkit-scrollbar {
			display: none;
			width: 0 !important;
			height: 0 !important;
			-webkit-appearance: none;
			background: transparent;
			color: transparent;
		}
		.box{
			display: flex;
			flex-wrap: wrap;
			gap: 22rpx;
			.card {
			display: flex;
			flex-direction: column;
			width: 216rpx;
			gap: 8rpx;

			image {
				border-radius: 10rpx;
				width: 100%;
				height: 288rpx;
			}

			.text {
				display: flex;
				flex-direction: column;
				width: 100%;
				.title {
					font-size: 28rpx;
					font-weight: bold;
				}

				.last-look {
					font-size: 25rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					/*禁止换行显示*/
					white-space: nowrap;
				}
			}
		}
		}
		
	}
</style>
