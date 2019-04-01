<template>
    <div id="app">

        <abc-navbar></abc-navbar>
        <router-view/>

        <abc-project-not-found-modal></abc-project-not-found-modal>

    </div>
</template>

<style lang="scss" scoped>
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
    import AbcNavbar from "@/components/navbar/AbcNavbar.vue";
    import AbcProjectNotFoundModal from "@/components/modals/AbcProjectNotFoundModal.vue";

    @Component({
        components: {AbcProjectNotFoundModal, AbcNavbar}
    })
    export default class App extends Vue {
    }
</script>
