<template>
	<div id="home">
		<nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <tab-control :titles="['流行', '新款', '精选']"
                 @tabClick="tabClick"
                 v-show="isTabFixed"
                 ref="tabControl1"
                 class="tab-control" />
		<scroll class="content"
            ref="scroll"
            :probe-type="3"
            :pull-up-load="true"
            @scroll="cotentScroll"
            @pullingUp="loadMore">
			<home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad" />
			<recommend-view :recommends="recommends" />
			<feature-view />
			<tab-control :titles="['流行', '新款', '精选']"
                   @tabClick="tabClick"
                   ref="tabControl2" />
			<goods-list :goods="showGoods" />
		</scroll>
		<back-top @click.native="backClick" v-show="isShowBackTop" />
  </div>
</template>

<script>
import HomeSwiper from './childComps/HomeSwiper'
import RecommendView from './childComps/RecommendView'
import FeatureView from './childComps/FeatureView'

import NavBar from 'components/common/navbar/NavBar'
import TabControl from 'components/content/tabControl/TabControl'
import GoodsList from 'components/content/goods/GoodsList'
import Scroll from 'components/common/scroll/Scroll'
import BackTop from 'components/content/backtop/BackTop'

import {getHomeMultidata, getHomeGoods} from 'network/home'
import {debounce} from "common/utils";

export default {
  name: 'Home',
  components: {
		NavBar,
		HomeSwiper,
		RecommendView,
		FeatureView,
		TabControl,
		GoodsList,
		Scroll,
		BackTop
  },
  data() {
		return {
			banners: [],
			recommends: [],
			goods: {
				'pop': {page: 0, list: []},
				'new': {page: 0, list: []},
				'sell': {page: 0, list: []}
			},
			currentType: 'pop',
      isShowBackTop: false,
      tabOffsetTop: 0,
      isTabFixed: false
		}
  },
  computed: {
		showGoods() {
			return this.goods[this.currentType].list
		}
  },
  created() {
    this.getHomeMultidata(),
		this.getHomeGoods('pop'),
		this.getHomeGoods('new'),
		this.getHomeGoods('sell')
  },
  mounted() {
    // 监听item中的图片加载事件
    const refresh = debounce(this.$refs.scroll.refresh, 50)
    this.$bus.$on('itemImageLoad', () => {
      refresh()
    })
  },
  methods: {
		/**
  	 * 事件监听相关的方法
  	 */
		tabClick(index) {
			switch (index) {
				case 0:
				this.currentType = 'pop'
				break
				case 1:
				this.currentType = 'new'
				break
				case 2:
				this.currentType = 'sell'
				break
			}
			this.$refs.tabControl1.currentIndex = index
      this.$refs.tabControl2  .currentIndex = index
    },
    backClick() {
      this.$refs.scroll.scrollTo(0, 0)
    },
    cotentScroll(position) {
      // 判断BackTop是否显示
      this.isShowBackTop = (-position.y) > 1000

      // 决定TabControl是否吸顶(position: fixed)
      this.isTabFixed = (-position.y) > this.tabOffsetTop
    },
    loadMore() {
      this.getHomeGoods(this.currentType)
    },
    swiperImageLoad () {
      // 获取tabControl的offsetTop
      // 所有组件都有一个属性$el用于获取组件中的元素
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
    },
		/**
  	 * 网络请求相关的方法
  	 */
		getHomeMultidata() {
			getHomeMultidata().then(res => {
				this.banners = res.data.banner.list;
				this.recommends = res.data.recommend.list
			})
		},
		getHomeGoods(type) {
			let page = this.goods[type].page + 1
			getHomeGoods(type, page).then(res => {
				this.goods[type].list.push(...res.data.list)
				this.goods[type].page += 1

        this.$refs.scroll.finishPullUp()
			})
		}
  }
}
</script>

<style scoped>
	#home {
		/*padding-top: 44px;*/
		height: 100vh;
		position: relative;
	}
	.home-nav{
		background-color: var(--color-tint);
		color: #fff;

    /*在使用浏览器进行原生滚动时让导航不跟随一起滚动*/
		/*position: fixed;*/
		/*left: 0;*/
		/*right: 0;*/
		/*top: 0;*/
		/*z-index: 9;*/
	}

	.content {
		overflow: hidden;
		position: absolute;
		top: 44px;
		bottom: 49px;
		left: 0;
		right: 0;
	}

  .tab-control {
    position: relative;
    z-index: 9;
  }
</style>
