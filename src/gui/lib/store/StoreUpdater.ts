import {ProjectClient} from "../clients/ProjectClient";

export class StoreUpdater {

    private projectClient = new ProjectClient();

    public init(){
        this.projectClient.getCurrentProject().then((project)=>{

        });
    }

}