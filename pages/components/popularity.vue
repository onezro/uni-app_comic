<template>
	<view class="topics">
		<view class="card" v-for="r in topics" :key='r.id'
			@click="goTodetail(r.id)">
			<image :lazy-load="true" :src="r.cover_image_url"></image>
			<view class="comci-text">{{r.title}}</view>
		</view>
	</view>
</template>

<script>
	export default{
		props:['topics'],
		methods:{
			goTodetail(a) {
				uni.navigateTo({
					url: '../detail/detail?detail_id=' + a
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.topics {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	
		// gap: 15rpx;
		.card {
			width: 336rpx;
			margin-bottom: 20rpx;
	
			image {
				border-radius: 10rpx;
				width: 100%;
				height: 210rpx;
			}
	
			.comci-text {
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				font-size: 27rpx;
			}
		}
	
	}
</style>