import {ApiRoute} from './ApiRoute';


export class ApiRoutes {

    public static readonly PROJECT = new ApiRoute('/api/project');
    public static readonly PROJECT_CREATE_NEW = new ApiRoute('/api/project/new');
    public static readonly PROJECT_WEBSOCKET = new ApiRoute('/api/project/:id/websocket');
    public static readonly PROJECT_GET_BY_ID = new ApiRoute('/api/project/:id');

    public static readonly LOGIN = new ApiRoute('/api/authentication/login');

    public static readonly MY_PROFILE = new ApiRoute('/api/user/my-profile');
    public static readonly REGISTER = new ApiRoute('/api/user/register');

    public static readonly DATASTORE = new ApiRoute('/api/datastore/:username/:path');

}
