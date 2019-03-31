<template>
  <div>
    <b-navbar type="dark" variant="dark">
      <b-navbar-nav>
        <b-nav-item href="#">Accueil</b-nav-item>

        <!-- Navbar dropdowns -->
        <b-nav-item-dropdown text="Projet" left>
          <b-dropdown-item href="#">Nouveau</b-dropdown-item>
          <b-dropdown-item href="#">Enregistrer</b-dropdown-item>
          <b-dropdown-item href="#">Enregistrer sous ...</b-dropdown-item>
          <b-dropdown-item href="#">Quitter</b-dropdown-item>
        </b-nav-item-dropdown>

      </b-navbar-nav>
    </b-navbar>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Navbar extends Vue {

}
</script>

<style scoped lang="scss">

</style>
