<template>
  <div id="category">
    <nav-bar class="nav-bar">
      <div slot="center">商品分类</div>
    </nav-bar>
    <div class="content">
      <tab-menu :categories="categories" @selectItem="selectItem" />
      <scroll class="tab-content" ref="scroll" @scroll="contentScroll">
        <tab-content-category :subcategories="showSubcategory" />
        <tab-control :titles="['综合', '新品', '销量']"
                     @itemClick="tabClick" />
        <tab-content-detail :category-detail="showCategoryDetail" />
      </scroll>
      <back-top @click.native="backTop" v-show="isShowBackTop" />
    </div>
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
        currentIndex: -1
      }
    },
    mixins: [tabControlMixin, backTopMixin],
    created() {
      this.getCategory()
    },
    computed: {
      showSubcategory() {
        if (this.currentIndex === -1) return {}
        return this.categoryData[this.currentIndex].subcategories
      },
      showCategoryDetail() {
        if (this.currentIndex === -1) return []
        return this.categoryData[this.currentIndex].categoryDetail[this.currentType]
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
        this.currentIndex = index;
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
        const miniWallkey = this.categories[this.currentIndex].miniWallkey;
        // 2.发送请求,传入miniWallkey和type
        getCategoryDetail(miniWallkey, type).then(res => {
          // 3.将获取的数据保存下来
          this.categoryData[this.currentIndex].categoryDetail[type] = res
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
