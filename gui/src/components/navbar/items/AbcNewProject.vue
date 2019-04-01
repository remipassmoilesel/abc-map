<template>
    <b-dropdown-item @click="newProject()">Nouveau</b-dropdown-item>
</template>

<script lang="ts">
import {Component} from 'vue-property-decorator';
import {AbcExtendedVue} from '@/lib/utils/AbcExtendedVue';

@Component
export default class AbcNewProject extends AbcExtendedVue {

    public newProject() {
        return this.abcServices.project.createNewProject();
    }

}
</script>

<style scoped lang="scss">
    .navbar {
        height: 50px;
    }
</style>
