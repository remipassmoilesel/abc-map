import Vue from 'vue';
import Component from 'vue-class-component';
import './style.scss';

@Component({
    template: require('./template.html'),
})
export default class NavbarComponent extends Vue {

    public projectOptions = [
        {
            value: 'project-new',
            label: 'New project'
        },
        {
            value: 'project-save',
            label: 'Save project'
        },
        {
            value: 'project-save-as',
            label: 'Save as project'
        },
    ];

    public selectedOptions: string[] = [];

    /**
     * Triggered when component is displayed
     */
    public mounted() {

    }

    public handleChange(selectedElements) {
        const selectedId = selectedElements[0];
        
    }
}
