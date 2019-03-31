<template>
    <div class="abc-project-updater"></div>
</template>

<script lang="ts">
    import {Component} from 'vue-property-decorator';
    import {ExtendedVue} from "@/lib/ExtendedVue";

    @Component({})
    export default class AbcProjectUpdater extends ExtendedVue {

        mounted() {
            if (this.storew.project.getCurrentProject() === null) {
                this.services.project.createNewProject("Nouveau projet")
                    .then(project => this.storew.project.setCurrentProject(project));
            }
        }

    }
</script>
