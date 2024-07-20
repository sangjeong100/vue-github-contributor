<template>
    <article>
        <h3>Area Graph (Github Contributor of Insight Cone coding)</h3>
        <h4>{{ period }}</h4>
        <svg :width="width" :height="height">
            <Axis v-for="([key, value], index) of scale" :key="key" :axis="key"></Axis>

        </svg>
    </article>
</template>


<script setup>
import { useStore } from "../store/useStore";
import AreaGraph from "./AreaGraph.vue";

</script>


<style lang="scss" scoped>

</style>