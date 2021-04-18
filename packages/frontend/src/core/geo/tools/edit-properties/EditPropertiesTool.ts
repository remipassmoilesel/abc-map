import { AbstractTool } from '../AbstractTool';
import { Logger, MapTool } from '@abc-map/frontend-shared';
import VectorSource from 'ol/source/Vector';
import Geometry from 'ol/geom/Geometry';
import { Map } from 'ol';
import Icon from '../../../../assets/tool-icons/properties.svg';
import { MainStore } from '../../../store/store';
import { HistoryService } from '../../../history/HistoryService';
import { ModalService } from '../../../ui/ModalService';
import { EditPropertiesInteraction } from './EditPropertiesInteraction';
import { EditPropertiesEvent, FeatureSelected } from './EditPropertiesEvent';
import { FeatureWrapper } from '../../features/FeatureWrapper';
import { ModalStatus } from '../../../ui/Modals.types';
import { HistoryKey } from '../../../history/HistoryKey';
import { SetFeatureProperties } from '../../../history/tasks/features/SetFeatureProperties';
import * as _ from 'lodash';

const logger = Logger.get('EditPropertiesTool.ts');

function interactionFactory(source: VectorSource): EditPropertiesInteraction {
  return new EditPropertiesInteraction({ source });
}

export class EditPropertiesTool extends AbstractTool {
  constructor(mainStore: MainStore, history: HistoryService, private modals: ModalService, private newInteraction = interactionFactory) {
    super(mainStore, history);
  }

  public getId(): MapTool {
    return MapTool.EditProperties;
  }

  public getIcon(): string {
    return Icon;
  }

  public getLabel(): string {
    return 'Editer les propriétés';
  }

  public setup(map: Map, source: VectorSource<Geometry>): void {
    super.setup(map, source);

    const edit = this.newInteraction(source);

    edit.on(EditPropertiesEvent.FeatureSelected, (ev: FeatureSelected) => {
      const feature = FeatureWrapper.from(ev.feature);
      const before = feature.getSimpleProperties();

      this.modals
        .featurePropertiesModal(before)
        .then((modalEvent) => {
          const after = modalEvent.properties;
          if (ModalStatus.Confirmed === modalEvent.status && !_.isEqual(before, after)) {
            feature.overwriteSimpleProperties(after);
            this.history.register(HistoryKey.Map, new SetFeatureProperties(feature, before, after));
          }
        })
        .catch((err) => logger.error('Error while editing feature properties: ', err));
    });

    map.addInteraction(edit);
    this.interactions.push(edit);
  }
}
