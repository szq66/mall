<template>
  <div id="detail">
    <detail-nav-bar @titleClick="titleClick" ref="navbar" />
    <scroll class="content"
            ref="scroll"
            :probeType="3" @scroll="contentScroll">
      <detail-swiper :top-images="topImages" />
      <detail-base-info :goods="goods" />
      <detail-shop-info :shop="shop" />
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad" />
      <detail-param-info ref="params" :param-info="paramInfo" />
      <detail-comment-info ref="comment" :comment-info="commentInfo" />
      <detail-recommend-info ref="recommend" :recommends="recommends" />
    </scroll>
    <back-top @click.native="backTop" v-show="isShowBackTop" />
    <detail-bottom-bar @addToCart="addToCart" />
  </div>
</template>

<script>
  import DetailNavBar from "./childComps/DetailNavBar";
  import DetailSwiper from "./childComps/DetailSwiper";
  import DetailBaseInfo from "./childComps/DetailBaseInfo";
  import DetailShopInfo from "./childComps/DetailShopInfo";
  import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
  import DetailParamInfo from "./childComps/DetailParamInfo";
  import DetailCommentInfo from "./childComps/DetailCommentInfo";
  import DetailRecommendInfo from "./childComps/DetailRecommendInfo";
  import DetailBottomBar from "./childComps/DetailBottomBar";

  import Scroll from "components/common/scroll/Scroll";

  import {getDetail, Goods, Shop, GoodsParam, getRecommend} from "network/detail";
  import {debounce} from "common/utils";
  import {itemListenerMixin, backTopMixin} from 'common/mixin';

  import {mapActions} from 'vuex';

  export default {
    name: "Detail",
    components: {
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      Scroll,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,
      DetailRecommendInfo,
      DetailBottomBar
    },
    mixins: [itemListenerMixin, backTopMixin],
    data() {
      return {
        iid: null,
        topImages: [],
        goods: {},
        shop: {},
        detailInfo: {},
        paramInfo: {},
        commentInfo: {},
        recommends: [],
        themeTopYs: [],
        getThemeTopY: null,
        currentIndex: 0
      }
    },
    created() {
      // 保持传入的iid
      this.iid = this.$route.params.iid

      // 根据iid请求详情数据
      getDetail(this.iid).then(res => {
        // 获取顶部图片的轮播数据
        const data = res.result
        this.topImages = data.itemInfo.topImages

        // 获取商品信息
        this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)

        // 获取店铺信息
        this.shop = new Shop(data.shopInfo)

        // 获取商品详情信息
        this.detailInfo = data.detailInfo

        // 获取参数信息
        this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)

        // 获取评论信息
        if (data.rate.CRate !== 0  && data.rate.list) {
          this.commentInfo = data.rate.list[0]
        }
      })

      // 获取推荐数据
      getRecommend().then(res => {
        this.recommends = res.data.list
      })

      this.getThemeTopY = debounce(() => {
        this.themeTopYs.push(0)
        this.themeTopYs.push(this.$refs.params.$el.offsetTop -44)
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop -44)
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop -44)
        this.themeTopYs.push(Number.MAX_VALUE)
      }, 100)
    },
    methods: {
      ...mapActions(['addCart']),
      imageLoad() {
        this.$refs.scroll.refresh()

        this.getThemeTopY()
      },
      titleClick(index) {
        this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 200)
      },
      contentScroll(position) {
        let positionY = -position.y
        let length = this.themeTopYs.length
        for (let i = 0; i < length - 1; i ++) {
          if (this.currentIndex !== i && (positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i + 1])) {
            this.currentIndex = i
            this.$refs.navbar.currentIndex = this.currentIndex
          }
        }

        // 判断是否显示BackTop
        this.listenShowBackTop(position)
      },
      addToCart() {
        // 获取购物车需要展示的信息
        let product = {}
        product.image = this.topImages[0]
        product.title = this.goods.title
        product.desc = this.goods.desc
        product.price = this.goods.realPrice
        product.iid = this.iid
        product.count = 0

        // 将商品添加到购物车
        this.addCart(product).then(res => {
          this.$toast.show(res)
        })
      }
    },
    destroyed() {
      this.$bus.$off('itemImageLoad', this.itemImgListener)
    }
  }
</script>

<style scoped>
  #detail {
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }

  .content {
    height: calc(100% - 93px);
  }
</style>
