<template>
    <div>
        <InputForm/>
        <h1>Contributor</h1>
        <ul>
            <li v-for="contributor in contributors" :key="contributor.author.id" @click="selectContributor(contributor)">
                <router-link :to="{ name: 'UserDetails', params: { username: contributor.author.login }}">
                    {{  contributor.author.login }}
                </router-link>
            </li>
        </ul>
    </div>
</template>

<script setup>

    import { useStore } from "../store/useStore";
    import { storeToRefs } from "pinia";
    import InputForm from "./InputForm.vue";
    
    const store = useStore();
    const { contributors } = storeToRefs(store);

    const selectContributor = (contributor) => {
        store.setData(contributor);
    };


</script>

<style scoped>
ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 10px 0;
}

a {
  text-decoration: none;
  color: #42b983;
}
</style>