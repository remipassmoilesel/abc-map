import { Task } from '../../Task';
import BaseLayer from 'ol/layer/Base';

export class ToggleLayerVisibilityTask extends Task {
  constructor(private layer: BaseLayer, private state: boolean) {
    super();
  }

  public async undo(): Promise<void> {
    this.layer.setVisible(!this.state);
  }

  public async redo(): Promise<void> {
    this.layer.setVisible(this.state);
  }
}
