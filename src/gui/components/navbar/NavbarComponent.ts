import Vue from 'vue';
import Component from "vue-class-component";
import './style.scss'

@Component({
    template: require('./template.html')
})
export default class NavbarComponent extends Vue {

    /**
     * Triggered when component is displayed
     */
    mounted() {

    }
}
