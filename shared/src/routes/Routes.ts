import {Route} from "./Route";


export class Routes {

    public static readonly API_PREFIX = "/api";

    public static readonly PROJECT = new Route("/api/project");
    public static readonly PROJECT_CREATE_NEW = new Route("/api/project/new");
    public static readonly PROJECT_WEBSOCKET = new Route("/api/project/:id/websocket");
    public static readonly PROJECT_GET_BY_ID = new Route("/api/project/:id");

}
