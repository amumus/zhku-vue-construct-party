<template>
  <div>
    <base-header></base-header>
    <hr/>
    <div>
      这是首页。
    </div>
    <hr/>
    <base-footer></base-footer>
  </div>
</template>

<script>
  import baseHeader from '@/components/common/BaseHeader.vue'
  import baseFooter from '../components/common/BaseFooter'

  export default {
    name: "BaseIndex",
    components: {
      baseFooter, baseHeader
    },
  }
</script>

<style scoped>

</style>
