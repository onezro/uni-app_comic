<template>
	<scroll-view class="theme-list" scroll-x="true">
		<view class="catalog-sets">
			<view class="analecta-box" v-for="r in topics" :key="r.id" @click="goTodetail(r.id)">
				<image :lazy-load="true" :src="r.vertical_image_url" :mode="r.title"></image>
				<text>{{r.title}}</text>
				<view class="tags">
					<text v-for="(b,i) in r.tags" :key="b">{{i>1?'':b}}</text>
				</view>
			</view>
		</view>
	</scroll-view>
</template>

<script>
	export default{
		props:['topics'],
		methods:{
			goTodetail(a) {
				// console.log(a);
				uni.navigateTo({
					url: '../detail/detail?detail_id=' + a
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
	.catalog-sets {
		display: flex;
		gap: 10px;
		margin: 0 30rpx;
	
		.analecta-box {
			display: flex;
			flex-direction: column;
			gap: 10rpx;
			width: 200rpx;
	
			image {
				border-radius: 10rpx;
				width: 200rpx;
				height: 266rpx;
	
			}
	
			text {
				font-size: 27rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
	
			.tags {
				display: flex;
				gap: 10rpx;
	
				color: goldenrod;
	
				text {
					font-size: 22rpx;
				}
			}
		}
	}
</style>