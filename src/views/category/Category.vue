<template>
  <div id="category">
    <nav-bar class="nav-bar">
      <div slot="center">商品分类</div>
    </nav-bar>
    <div class="content">
      <tab-menu :categories="categories" @selectItem="selectItem" />
      <tab-control :titles="['综合', '新品', '销量']"
                   @tabClick="tabClick"
                   v-show="isTabFixed"
                   ref="tabControl1"
                   class="tab-control" />
      <scroll class="tab-content" ref="scroll" :probe-type="3" @scroll="contentScroll">
        <tab-content-category :subcategories="showSubcategory" @contentCategoryLoad="contentCategoryLoad" />
        <tab-control :titles="['综合', '新品', '销量']"
                     @tabClick="tabClick"
                     ref="tabControl2" />
        <tab-content-detail :category-detail="showCategoryDetail" />
      </scroll>
    </div>
    <back-top @click.native="backTop" v-show="isShowBackTop" />
  </div>
</template>

<script>
  import NavBar from "components/common/navbar/NavBar";

  import TabMenu from "./childComps/TabMenu";
  import TabControl from "components/content/tabControl/TabControl";
  import Scroll from "components/common/scroll/Scroll";
  import TabContentCategory from "./childComps/TabContentCategory";
  import TabContentDetail from "./childComps/TabContentDetail";

  import {getCategory, getSubcategory, getCategoryDetail} from "network/category";
  import {tabControlMixin, backTopMixin} from "common/mixin";

  export default {
    name: 'Category',
    components: {
      NavBar,
      TabMenu,
      TabControl,
      Scroll,
      TabContentCategory,
      TabContentDetail
    },
    data() {
      return {
        categories: [],
        categoryData: {},
        curIndex: -1,
        tabOffsetTop: 0,
        isTabFixed: false
      }
    },
    mixins: [tabControlMixin, backTopMixin],
    created() {
      this.getCategory()
    },
    computed: {
      showSubcategory() {
        if (this.curIndex === -1) return {}
        return this.categoryData[this.curIndex].subcategories
      },
      showCategoryDetail() {
        if (this.curIndex === -1) return []
        return this.categoryData[this.curIndex].categoryDetail[this.currentType]
      }
    },
    methods: {
      /**
       * 网络请求相关的方法
       */
      getCategory() {
        getCategory().then(res => {
          // 1.请求分类数据
          this.categories = res.data.category.list;
          // 2.初始化每个类别的子数据
          for (let i = 0; i < this.categories.length; i++) {
            this.categoryData[i] = {
              subcategories: {},
              categoryDetail: {
                'pop': [],
                'new': [],
                'sell': []
              }
            }
          }
          // 3.请求第一个分类的数据
          this.getSubcategory(0)
        })
      },
      getSubcategory(index) {
        this.curIndex = index;
        const mailKey = this.categories[index].maitKey;
        getSubcategory(mailKey).then(res => {
          this.categoryData[index].subcategories = res.data
          this.categoryData = {...this.categoryData}
          this.getCategoryDetail('pop')
          this.getCategoryDetail('sell')
          this.getCategoryDetail('new')
        })
      },
      getCategoryDetail(type) {
        // 1.获取请求的miniWallkey
        const miniWallkey = this.categories[this.curIndex].miniWallkey;
        // 2.发送请求,传入miniWallkey和type
        getCategoryDetail(miniWallkey, type).then(res => {
          // 3.将获取的数据保存下来
          this.categoryData[this.curIndex].categoryDetail[type] = res
          this.categoryData = {...this.categoryData}
        })
      },
      /**
       *事件监听相关的方法
       */
      selectItem(index) {
        this.getSubcategory(index)
      },
      contentScroll(position) {
        // 判断BackTop是否显示
        this.listenShowBackTop(position)

        // 决定TabControl是否吸顶(position: fixed)
        this.isTabFixed = (-position.y) > this.tabOffsetTop
      },
      contentCategoryLoad() {
        // 获取tabControl的offsetTop
        // 所有组件都有一个属性$el用于获取组件中的元素
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
      }
    }
  }
</script>

<style scoped>
  #category {
    height: 100vh;
  }

  .nav-bar {
    background-color: var(--color-tint);
    color: white;
  }

  .tab-control {
    position: relative;
    z-index: 9;
  }

  .content {
    position: absolute;
    left: 0;
    right: 0;
    top: 44px;
    bottom: 49px;

    display: flex;

    height: calc(100% - 93px);
  }

  .tab-content {
    flex: 1;
    height: 100%;

    overflow: hidden;
  }
</style>
