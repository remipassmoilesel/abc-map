import Vue from 'vue';
import Component from 'vue-class-component';
import './style.scss';

@Component({
    template: require('./template.html'),
})
export default class MainView extends Vue {

    /**
     * Triggered when component is displayed
     */
    public mounted() {

    }
}
