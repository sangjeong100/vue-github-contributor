<template>
  <section>


  </section>
</template>

<script>

import { mapState } from "vuex";

export default {
  name: "Container",
  data () {
    return {
      msg: "welcome to My Vue3 App"
    };
  },
  computed: {
    ...mapState({
      area: "area"
    }),
    width() {
      return this
    }
  }
}
</script>



<style lang="scss" scoped>

</style>