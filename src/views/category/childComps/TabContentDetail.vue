<template>
  <div>
    <goods-list v-for="(item, index) in categoryDetail" :key="index" :goods="item" />
  </div>
</template>

<script>
  import GoodsList from 'components/content/goods/GoodsList';

  export default {
    name: "TabContentDetail",
    components: {
      GoodsList
    },
    props: {
      categoryDetail: {
        type: Array,
        default() {
          return []
        }
      }
    }
  }
</script>

<style scoped>

</style>
