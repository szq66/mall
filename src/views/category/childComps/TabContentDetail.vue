<template>
  <div>
    <goods-list :goods="categoryDetail" />
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
