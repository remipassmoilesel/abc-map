import Vue from 'vue';
import Component from "vue-class-component";
import './style.scss'

@Component({
    template: require('./template.html')
})
export default class LeftMenuComponent extends Vue {

    isCollapse = false;

    /**
     * Triggered when component is displayed
     */
    public mounted() {

    }

    public handleOpen(){

    }

    public handleClose(){

    }
}
