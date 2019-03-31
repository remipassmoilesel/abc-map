import {Route} from "./Route";


export class Routes {

    public static readonly PROJECT = new Route("/project");
    public static readonly PROJECT_GET_BY_ID = new Route("/project/:id");
    public static readonly PROJECT_CREATE_NEW = new Route("/project/new");

}
