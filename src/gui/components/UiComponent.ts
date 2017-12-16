import Vue from 'vue';

export abstract class UiComponent extends Vue{
    public abstract name: string;
    public abstract description: string;
}