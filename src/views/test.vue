<template>
  <div>
    <mu-appbar title="订单查询" style="background:rgba(0, 0, 0, 0.48);">
      <mu-icon-button icon="arrow_back" @click="back" slot="left"/>
      <!--<p slot="default">订单查询</p>-->
    </mu-appbar>
  </div>
</template>

<script>
  export default {
    name: "test",
    methods: {
      back() {
        this.$router.back(-1)
      }
    },
    mounted(){
      console.log("gogogogo")
    }

  }
</script>

<style scoped>

</style>
