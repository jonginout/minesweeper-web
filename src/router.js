import Vue from "vue";
import Router from "vue-router";

import Error404 from "./views/Error404.vue";
import Minesweeper from "./views/Minesweeper.vue";
import MinesweeperMain from "./components/minesweeper/Main.vue";

Vue.use(Router);

export default new Router({
    mode: "history",
    routes: [
        {
            path: "*",
            component: Error404
        },
        {
            path: "/",
            component: Minesweeper,
            children: [
                {
                    path: "",
                    component: MinesweeperMain
                },

            ]
        },
    ]
});