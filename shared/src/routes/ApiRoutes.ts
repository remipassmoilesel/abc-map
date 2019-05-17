import {ApiRoute} from './ApiRoute';


export class ApiRoutes {

    public static readonly HEALTH_CHECK = new ApiRoute('/health');

    public static readonly PROJECT = new ApiRoute('/api/project');
    public static readonly PROJECT_CREATE_NEW = new ApiRoute('/api/projects/new');
    public static readonly PROJECT_WEBSOCKET = new ApiRoute('/api/projects/:id/websocket');
    public static readonly PROJECT_GET_BY_ID = new ApiRoute('/api/projects/:id');

    public static readonly LOGIN = new ApiRoute('/api/authentication/login');

    public static readonly MY_PROFILE = new ApiRoute('/api/users/my-profile');
    public static readonly REGISTER = new ApiRoute('/api/users/register');

    public static readonly DOCUMENTS = new ApiRoute('/api/documents');
    public static readonly DOCUMENTS_UPLOAD = new ApiRoute('/api/documents/upload');
    public static readonly DOCUMENTS_SEARCH = new ApiRoute('/api/documents/search');
    public static readonly DOCUMENTS_PATH = new ApiRoute('/api/documents/:path');
    public static readonly DOCUMENTS_DOWNLOAD_PATH = new ApiRoute('/api/documents/download/:path');
    public static readonly DOCUMENTS_USERNAME = new ApiRoute('/api/documents/:username');
    public static readonly DOCUMENTS_USERNAME_PATH = new ApiRoute('/api/documents/:username/:path');

}
