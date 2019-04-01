<template>
    <div class="abc-project-not-found-modal">
        <b-modal v-model="modalVisible" hide-footer title="Projet non trouvé !">
            Le project précedemment ouvert n'a pas été trouvé.<br/>Un nouveau project sera créé.
            <b-button class="mt-3" variant="outline-danger" block @click="closeProjectNotFoundModal">
                Compris !
            </b-button>
        </b-modal>
    </div>
</template>

<script lang="ts">
import {Component} from 'vue-property-decorator';
import {AbcExtendedVue} from '@/lib/utils/AbcExtendedVue';

@Component({})
export default class AbcProjectNotFoundModal extends AbcExtendedVue {

    get modalVisible(): boolean {
        return this.abcStorew.gui.getProjectNotFoundModalState();
    }

    set modalVisible(value: boolean) {
        this.abcStorew.gui.setProjectNotFoundModalVisible(value);
    }

    public closeProjectNotFoundModal() {
        return this.abcServices.project.createNewProject()
            .then((res) => this.modalVisible = false);
    }
}
</script>
