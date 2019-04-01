<template>
    <div class="abc-project-updater">
        <b-modal v-model="projectNotFoundModal" hide-footer title="Projet non trouvé !">
            Le project précedemment ouvert n'a pas été trouvé.<br/>Un nouveau project sera créé.
            <b-button class="mt-3" variant="outline-danger" block @click="closeProjectNotFoundModal">
                Compris !
            </b-button>
        </b-modal>
    </div>
</template>

<script lang="ts">
    import {Component} from 'vue-property-decorator';
    import {AbcExtendedVue} from "@/lib/utils/AbcExtendedVue";
    import {LSKey} from "@/lib/utils/AbcLocalStorageHelper";

    // TODO: create a dedicated service ?
    @Component({})
    export default class AbcProjectUpdater extends AbcExtendedVue {

        projectNotFoundModal = false;

        mounted() {
            return this.initProject();
        }

        setProjectNotFoundModalVisible(state: boolean) {
            this.projectNotFoundModal = state;
        }

        initProject(): Promise<any> {
            const storedProjectId = this.abcLocalst.get(LSKey.CURRENT_PROJECT_ID);
            if (!storedProjectId) {
                return this.createNewProject();
            } else {
                return this.openProject(storedProjectId)
            }
        }

        createNewProject(): Promise<any> {
            return this.abcApiClients.project.createNewProject("Nouveau projet")
                .then(project => {
                    this.abcLocalst.save(LSKey.CURRENT_PROJECT_ID, project.id);
                    return this.abcStorew.project.setCurrentProject(project).then(res => project);
                });
        }

        openProject(projectId: string): Promise<any> {
            return this.abcApiClients.project.findProjectById(projectId)
                .then(project => {
                    this.abcLocalst.save(LSKey.CURRENT_PROJECT_ID, project.id);
                    return this.abcStorew.project.setCurrentProject(project).then(res => project);
                })
                .catch(err => {
                    this.setProjectNotFoundModalVisible(true);
                })
        }

        closeProjectNotFoundModal() {
            this.createNewProject().then(() => {
                this.setProjectNotFoundModalVisible(false);
            });
        }
    }
</script>
