<template>
    <section>
        <InputForm />
        <D3Graph>
            <AreaGraphWrapper :width="width" :height="height" :graphStyle="style" />
        </D3Graph>
        <D3Graph>
            <LineGraphWrapper :width="width" :height="height" :graphStylee="style" />
        </D3Graph> 
        <D3Graph>
            <RectGraphWrapper :width="width" :height="height" :graphStyle="style" />
        </D3Graph>
    </section>
</template>

<script setup>
    import InputForm from "./InputForm.vue";
    import D3Graph from "./D3Graph.vue";
    import AreaGraphWrapper from "./AreaGraphWrapper.vue";
    import RectGraphWrapper from "./RectGraphWrapper.vue";
    import LineGraphWrapper from "./LineGraphWrapper.vue";
    import { useStore } from "../store/useStore";
    import { ref, computed } from "vue";
    import { storeToRefs } from "pinia";

    const store = useStore();

    const { area } = storeToRefs(store);
    
    const msg = ref("Welcome to Your Vue.js App");

    const width = computed(() => {
        return area.value.width + area.value.margin;
    });

    const height = computed(() => {
        return area.value.height + area.value.margin;
    });

    const style = computed(() => {
        const areaMargin = area.value.margin / 2;
        return {
            transform: `translate(${areaMargin}px, ${areaMargin}px)`
        };
    });

</script>

<style lang="scss" scoped>

h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>