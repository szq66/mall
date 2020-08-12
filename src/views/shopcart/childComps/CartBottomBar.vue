<template>
    <div class="bottom-bar">
      <div class="check-content">
        <check-button class="check-button" v-model="isSelectAll" @click.native="checkClick" />
        <span>全选</span>
      </div>
      <div class="price">
        合计：{{totalPrice}}
      </div>
      <div class="calculate" @click="calcClick">
        去计算({{checkLength}})
      </div>
    </div>
</template>

<script>
  import CheckButton from "components/content/checkButton/CheckButton";

  import {mapGetters} from 'vuex';

  export default {
    name: "CartBottomBar",
    components: {
      CheckButton
    },
    computed: {
      ...mapGetters(['cartList']),
      totalPrice() {
        return '￥' + this.cartList.filter(item => {
          return item.checked
        }).reduce((preValue, item) => {
          return preValue + item.price * item.count
        }, 0).toFixed(2)
      },
      checkLength() {
        return this.cartList.filter(item => item.checked).length
      },
      isSelectAll() {
        if (this.cartList.length === 0)
          return false
        return !this.cartList.find(item => !item.checked)
      }
    },
    methods: {
      checkClick() {
        if (this.isSelectAll) {
          this.cartList.forEach(item => item.checked = false)
        } else {
          this.cartList.forEach(item => item.checked = true)
        }
      },
      calcClick() {
        if (this.cartList.length === 0) {
          this.$toast.show('购物车为空，请添加商品')
        }
        else if (this.checkLength === 0) {
          this.$toast.show('请选择购买的商品')
        }
      }
    }
  }
</script>

<style scoped>
  .bottom-bar {
    height: 40px;
    line-height: 40px;
    background-color: #eee;
    position: relative;
    display: flex;
    font-size: 14px;
  }

  .check-content {
    display: flex;
    margin-left: 10px;
    align-items: center;
    width: 60px;
  }

  .check-button {
    width: 20px;
    height: 20px;
    line-height: 20px;
    margin-right: 4px;
  }

  .price {
    margin-left: 8px;
    flex: 1;
  }

  .calculate {
    width: 90px;
    background-color: red;
    color: #fff;
    text-align: center;
  }
</style>
