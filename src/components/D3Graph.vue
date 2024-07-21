<template>
    <article><slot></slot></article>
</template>
  
<script setup>

    import { useStore } from "../store/useStore";
    import { computed } from "vue";
    import { storeToRefs } from "pinia";
  
    const store = useStore();

    const { area, selectedWeeks } = storeToRefs(store);

    const created = computed(() => {
        store.fetchData();
    });

</script>
  
<style scoped></style>