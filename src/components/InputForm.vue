<template>
    <div calss="form-group">
        <form @submit.prevent="fetchApiData" class="form">
            <div><input type="text" v-model="owner" placeholder="owner"/></div>
            <div><input type="text" v-model="repo" placeholder="repo"/></div>
            <button>search</button>
        </form>
    </div>
</template>

<script setup>
    import { useStore } from "../store/useStore";
    import { ref } from "vue";

    const store = useStore();

    const owner = ref("i-leaders-Sync");
    const repo = ref("Sync");

    const fetchApiData = () => {
        store.fetchData(owner.value.trim(), repo.value.trim());
    }
    

</script>

<style lang="scss" scoped>
.form-group {
  width: 740px;
  margin: 10px;
}
.form {
  display: flex;
  justify-content: center;
}
input {
  margin-right: 10px;
}
</style>