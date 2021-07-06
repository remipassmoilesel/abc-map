import { DefaultStyle } from '@abc-map/shared';
import { AllIcons } from '../../../assets/point-icons/icons';

describe('DefaultStyle', function () {
  it('Default icon should exists', () => {
    const defaultIcon = AllIcons.find((i) => i.name === DefaultStyle.point.icon);

    expect(defaultIcon).toBeDefined();
  });
});
