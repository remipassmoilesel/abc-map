import {Actions, Mutations} from './mutationsAndActions';
import {ClientGroup} from '../../clients/ClientGroup';
import {Logger} from '../../../../api/dev/Logger';
import {IActionDialogPayload, IMapViewPayload} from './payloads';

const logger = Logger.getLogger('GuiStateStoreModule');
const clients = new ClientGroup();

// /!\ All variables must be initialized
export class GuiState {
    public actionDialogVisible: boolean = false;
}

export class GuiStoreModule {

    public state = new GuiState();

    // Warning: all mutations must be synchronous !
    public mutations = {
        [Mutations.ACTION_DIALOG]: (state: GuiState, payload: IActionDialogPayload) => {
            logger.info(`Comitting mutation ${Mutations.ACTION_DIALOG}`);
            state.actionDialogVisible = payload.dialogIsVisible;
        },
    };

    public actions = {
        [Actions.ACTION_DIALOG]: (context: any, payload: IActionDialogPayload) => {
            logger.info(`Dispatching action ${Actions.ACTION_DIALOG}`);
            context.commit(Mutations.ACTION_DIALOG, payload);
        },
    };

    public getters = {
        isActionDialogVisible: (state: GuiState) => {
            return state.actionDialogVisible;
        },
    };

}

