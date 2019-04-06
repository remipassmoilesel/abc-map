import {ApiRoute} from './ApiRoute';


export class ApiRoutes {

    public static readonly API_PREFIX = '/api';

    public static readonly PROJECT = new ApiRoute('/api/project');
    public static readonly PROJECT_CREATE_NEW = new ApiRoute('/api/project/new');
    public static readonly PROJECT_WEBSOCKET = new ApiRoute('/api/project/:id/websocket');
    public static readonly PROJECT_GET_BY_ID = new ApiRoute('/api/project/:id');

}
