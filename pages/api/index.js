

// 接口共用地址
const BASE_URL = 'https://www.kuaikanmanhua.com/'
function getRequest(url,data,type){
	var promise = new Promise((resolve,reject) => {
			var postData = data;
			uni.request({
				url:BASE_URL + url,
				data:postData,
				method:"GET",
				dataType:'json',
				success:function(res){
					resolve(res.data);
					
				},
				error:function(e)
				{
					reject('网络出错');
				}
			});
	});
	return promise;
}

