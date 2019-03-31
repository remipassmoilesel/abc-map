<template>
  <div>
    <b-navbar type="dark" variant="dark">
      <b-navbar-nav>
        <b-nav-item @click="goToMap()">Carte</b-nav-item>

        <b-nav-item-dropdown text="Projet" left>
          <b-dropdown-item>Nouveau</b-dropdown-item>
          <b-dropdown-item>Enregistrer</b-dropdown-item>
          <b-dropdown-item>Enregistrer sous ...</b-dropdown-item>
          <b-dropdown-item>Quitter</b-dropdown-item>
        </b-nav-item-dropdown>

        <b-nav-item-dropdown text="Aide" left>
          <b-dropdown-item @click="goToAbout()">A propos</b-dropdown-item>
        </b-nav-item-dropdown>

      </b-navbar-nav>
    </b-navbar>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Navbar extends Vue {

  goToMap(){
    this.$router.push('/map');
  }

  goToAbout(){
    this.$router.push('/about');
  }

}
</script>

<style scoped lang="scss">

</style>
