import Vue from 'vue';
import Component from "vue-class-component";
import './style.scss'

@Component({
    template: require('./template.html')
})
export default class NavbarComponent extends Vue {

    activeIndex = '1';

    /**
     * Triggered when component is displayed
     */
    public mounted() {

    }

    public handleSelect(){

    }
}
