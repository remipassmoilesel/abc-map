import { AbstractTool } from '../AbstractTool';
import { MapTool } from '@abc-map/shared-entities';
import VectorSource from 'ol/source/Vector';
import Geometry from 'ol/geom/Geometry';
import { Map } from 'ol';
import Icon from '../../../../assets/tool-icons/text.svg';
import { Logger } from '../../../utils/Logger';
import { TextChanged, TextEnd, TextEvent, TextInteraction, TextStart } from './TextInteraction';
import { FeatureWrapper } from '../../features/FeatureWrapper';
import { HistoryKey } from '../../../history/HistoryKey';
import { UpdateStyleTask } from '../../../history/tasks/UpdateStyleTask';
import { FeatureStyle } from '../../style/FeatureStyle';
import GeometryType from 'ol/geom/GeometryType';

const logger = Logger.get('Text.ts');

export class Text extends AbstractTool {
  public getId(): MapTool {
    return MapTool.Text;
  }

  public getIcon(): string {
    return Icon;
  }

  public getLabel(): string {
    return 'Texte';
  }

  public setup(map: Map, source: VectorSource<Geometry>): void {
    super.setup(map, source);

    // FIXME: seek features around cursor
    const features = source.getFeatures();
    const text = new TextInteraction({ features });

    let before: FeatureStyle | undefined;

    text.on(TextEvent.Start, (ev: TextStart) => {
      const feature = FeatureWrapper.from(ev.feature);

      const style = feature.getStyleProperties();
      style.text = {
        ...style.text,
        color: this.store.getState().map.currentStyle.text?.color,
        size: this.store.getState().map.currentStyle.text?.size,
      };

      if (feature.getGeometry()?.getType() === GeometryType.POINT) {
        style.text.offsetX = 20;
        style.text.offsetY = 20;
        style.text.alignment = 'left';
      } else {
        style.text.offsetX = 0;
        style.text.offsetY = 0;
        style.text.alignment = 'center';
      }

      feature.setStyleProperties(style);
      before = style;
    });

    text.on(TextEvent.Changed, (ev: TextChanged) => {
      const feature = FeatureWrapper.from(ev.feature);
      feature.setText(ev.text);
    });

    text.on(TextEvent.End, (ev: TextEnd) => {
      if (!before) {
        logger.error('Cannot register task, before style was not set');
        return;
      }

      const after = FeatureWrapper.from(ev.feature).getStyleProperties();
      if (before.text?.value === after.text?.value) {
        return;
      }

      const feature = FeatureWrapper.from(ev.feature);
      this.history.register(HistoryKey.Map, new UpdateStyleTask([{ before, after, feature }]));
    });

    map.addInteraction(text);
    this.interactions.push(text);
  }
}
