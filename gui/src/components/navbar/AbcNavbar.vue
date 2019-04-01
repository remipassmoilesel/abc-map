<template>
    <b-navbar type="dark" variant="dark">
        <b-navbar-nav>
            <b-nav-item @click="goToMap()">Carte</b-nav-item>

            <b-nav-item-dropdown text="Projet" left>
                <abc-new-project></abc-new-project>
                <b-dropdown-item>Enregistrer</b-dropdown-item>
                <b-dropdown-item>Enregistrer sous ...</b-dropdown-item>
                <b-dropdown-item>Quitter</b-dropdown-item>
            </b-nav-item-dropdown>

            <b-nav-item-dropdown text="Aide" left>
                <b-dropdown-item @click="goToAbout()">A propos</b-dropdown-item>
            </b-nav-item-dropdown>

            <b-nav-item>Projet: {{ projectName() }}</b-nav-item>

        </b-navbar-nav>
    </b-navbar>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {AbcExtendedVue} from "@/lib/utils/AbcExtendedVue";
    import AbcNewProject from "@/components/navbar/items/AbcNewProject.vue";
    @Component({
        components: {AbcNewProject}
    })
    export default class AbcNavbar extends AbcExtendedVue {

        projectName(): string {
            return this.abcStorew.project.getProjectName();
        }

        goToMap(): void {
            this.$router.push('/map');
        }

        goToAbout(): void {
            this.$router.push('/about');
        }

    }
</script>

<style scoped lang="scss">
    .navbar {
        height: 50px;
    }
</style>
