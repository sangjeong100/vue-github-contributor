<template>
    <path :d="line"/>
</template>

<script setup>
    import { useStore } from "../store/useStore";
    import * as d3 from "d3";
    import { storeToRefs } from "pinia";
    import { watch, ref } from "vue";

    const store = useStore();
    
    const line = ref("");

    const { scale, weeks } = storeToRefs(store);

    watch(weeks, (newWeeks) => {
        render(newWeeks);
    })

    const render = (weeks) => {
        const path = d3.line()
                        .curve(d3.curveBasis)
                        .x( d => scale.value.get("x")(new Date(d.w * 1000)))
                        .y( d => scale.value.get("y")(d.c));
        line.value = path(weeks);
    }

</script>

<style scoped>
path {
  fill: none;
  stroke: rgb(65, 184, 131);
  stroke-width: 3px;
}
</style>

<style lang="scss" scoped>

</style>