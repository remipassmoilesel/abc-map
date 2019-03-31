<template>
    <div id="app">
        <abc-navbar></abc-navbar>
        <router-view/>
        <abc-project-updater></abc-project-updater>
    </div>
</template>

<style lang="scss">
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;

        display: flex;
        flex-direction: column;

        height: 100%;
        min-height: 100%;
    }
</style>

<script lang="ts">
    import Vue from "vue";
    import Component from "vue-class-component";
    import AbcNavbar from "@/components/AbcNavbar.vue";
    import AbcProjectUpdater from "@/components/AbcProjectUpdater.vue";

    @Component({
        components: {AbcProjectUpdater, AbcNavbar}
    })
    export default class App extends Vue {
    }
</script>
