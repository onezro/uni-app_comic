import Vue from 'vue'

import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		already: uni.getStorageSync("ALREADY") || [],
		historyComic: uni.getStorageSync("HISTORYCOMIC") || [],
		bookself:uni.getStorageSync("BOOKSELF") || [],
		searchText:uni.getStorageSync("SEARCHTEXT") || []
	},
	mutations: {
		setAlready(state, a) {
			let b = state.already.findIndex(t => t == a)
			if (b == -1) {
				state.already.unshift(a)
				uni.setStorageSync("ALREADY", state.already)
			}
		},
		setHistory(state, a) {
			let b = state.historyComic.findIndex(t => t.id == a.id)
			if (b != -1) {
				state.historyComic = state.historyComic.filter(t => t.id != a.id)
			}
			state.historyComic.unshift(a)
			uni.setStorageSync("HISTORYCOMIC", state.historyComic)
		},
		setBookself(state, a){
			let b=state.bookself.findIndex(t => t.id == a.id)
			if(b==-1){
				// console.log(1);
				state.bookself.unshift(a)
				uni.setStorageSync("BOOKSELF", state.bookself)
			}else{
				// console.log(2);
				state.bookself=state.bookself.filter(t => t.id != a.id)
				// console.log(state.bookself);
				uni.setStorageSync("BOOKSELF", state.bookself)
			}
		},
		updateBook(state,a){
			let b=state.bookself.findIndex(t => t.id == a.id)
			if(b!=-1){
				let c=state.bookself.filter(t => t.id == a.id)
				state.bookself=state.bookself.filter(t => t.id != a.id)
				c=c.map(t=>{
					return {
						...t,
						comic_id:a.comic_id,
						lookTitle:a.lookTitle,
						timeId:a.timeId
					}
				})
				state.bookself.unshift(...c)
				uni.setStorageSync("BOOKSELF", state.bookself)
			}
			
		},
		setSearchText(state,a){
			state.searchText=state.searchText.filter(s=>s.text!=a.text)
			state.searchText.unshift(a)
			uni.setStorageSync("SEARCHTEXT", state.searchText)
		},
		delSearchText(state,a){
			state.searchText=state.searchText.filter(s=>s.id!=a)
			uni.setStorageSync("SEARCHTEXT", state.searchText)
		},
		removeSearchText(state){
			state.searchText=[]
			const value = uni.removeStorageSync("SEARCHTEXT");
			console.log("移除成功");
			// uni.setStorageSync("SEARCHTEXT", state.searchText)
		}
	},
	actions: {

	}
})
export default store
