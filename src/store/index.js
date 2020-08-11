import Vue from "vue"
import Vuex, {Store} from "vuex"

import mutations from './mutations'
import actions from "./actions";
import getters from "./getters";
// 安装插件
Vue.use(Vuex)

// 创建Store对象
const state = {
  cartList: []
}
const store = new Store({
  state,
  mutations,
  actions,
  getters
})

export default store
