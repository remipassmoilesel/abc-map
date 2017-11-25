import Vue from "vue";

const vueInstance = new Vue();
export type ToastType = 'success' | 'warning' | 'info' | 'error'

export class Toaster {

    public static toast(message: string, type: ToastType) {
        vueInstance.$message({
            message,
            type
        });
    }

    public static info(message: string) {
        Toaster.toast(message, 'info');
    }

    public static success(message: string) {
        Toaster.toast(message, 'success');
    }

    public static warning(message: string) {
        Toaster.toast(message, 'warning');
    }

    public static error(message: string) {
        Toaster.toast(message, 'error');
    }

}