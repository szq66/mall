<template>
  <div id="category">
    <nav-bar class="nav-bar">
      <div slot="center">商品分类</div>
    </nav-bar>
    <div class="content">
      <tab-menu :categories="categories" @selectItem="selectItem" />
      <scroll class="tab-content">
        <tab-control :titles="['综合', '新品', '销量']"
                     @itemClick="tabClick" />
      </scroll>
    </div>
  </div>
</template>

<script>
  import NavBar from "components/common/navbar/NavBar";

  import TabMenu from "./childComps/TabMenu";
  import TabControl from "components/content/tabControl/TabControl";
  import Scroll from "components/common/scroll/Scroll";

  import {getCategory} from "network/category";
  import {tabControlMixin} from "common/mixin";

  export default {
    name: 'Category',
    components: {
      NavBar,
      TabMenu,
      TabControl,
      Scroll
    },
    data() {
      return {
        categories: []
      }
    },
    mixins: [tabControlMixin],
    created() {
      this.getCategory()
    },
    methods: {
      getCategory() {
        getCategory().then(res => {
          this.categories = res.data.category.list;
        })
      },
      // getSubcategory() {
      //   getCategory().then(res => {
      //     console.log(res);
      //   })
      // },
      selectItem(index) {
        console.log(index);
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
  }
</style>
