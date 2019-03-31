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
                this.clients.project.createNewProject("Nouveau projet")
                    .then(project => {
                        return this.storew.project.setCurrentProject(project).then(res => project);
                    });
            }
        }

    }
</script>
