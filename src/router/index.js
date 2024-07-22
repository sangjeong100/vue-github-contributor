import { createRouter, createWebHistory } from "vue-router";
import Home from "../components/Home.vue";
import UserDetails from "../components/UserDetails.vue";

const routes = [
    {
        path: "/",
        name: "Home",
        component: Home
    },
    {
        path: "/user/:username",
        name: "UserDetails",
        component: UserDetails
    }
];

const router = createRouter({
    history: createWebHistory(), // Hash 모드 설정 
    routes: routes
});

export default router;