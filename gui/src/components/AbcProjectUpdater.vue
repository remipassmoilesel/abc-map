import {LSKey} from "../lib/LocalStorageHelper";
import {LSKey} from "../lib/LocalStorageHelper";
<template>
    <div class="abc-project-updater"></div>
</template>

<script lang="ts">
    import {Component} from 'vue-property-decorator';
    import {ExtendedVue} from "@/lib/ExtendedVue";
    import {LSKey} from "@/lib/LocalStorageHelper";

    // TODO: move to a dedicated service ?
    @Component({})
    export default class AbcProjectUpdater extends ExtendedVue {

        mounted() {
            this.initProject();
        }

        private initProject() {
            const storedProjectId = this.localst.get(LSKey.CURRENT_PROJECT_ID);
            if (!storedProjectId) {
                this.createNewProject();
            } else {
                this.openProject(storedProjectId)
            }
        }

        private createNewProject() {
            this.clients.project.createNewProject("Nouveau projet")
                .then(project => {
                    this.localst.save(LSKey.CURRENT_PROJECT_ID, project.id);
                    return this.storew.project.setCurrentProject(project).then(res => project);
                });
        }

        private openProject(projectId: string) {
            this.clients.project.findProjectById(projectId)
                .then(project => {
                    this.localst.save(LSKey.CURRENT_PROJECT_ID, project.id);
                    return this.storew.project.setCurrentProject(project).then(res => project);
                });
        }
    }
</script>
