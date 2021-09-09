import { IconCategory } from '../../assets/point-icons/IconCategory';
import { IconProcessor } from '../../core/geo/styles/IconProcessor';
import { getAllIcons, PointIcon } from '../../assets/point-icons/PointIcon';

export interface IconPreview {
  icon: PointIcon;
  /**
   * Base 64 string of icon
   */
  preview: string;
}

let previews: Map<IconCategory, IconPreview[]> | undefined;

export function getPreviews() {
  if (!previews) {
    // We prepare previews
    const iconList = getAllIcons().map((i) => ({ icon: i, preview: IconProcessor.get().prepareCached(i, 50, '#0077b6') }));

    // We sort them by category
    previews = new Map<IconCategory, IconPreview[]>();
    for (const preview of iconList) {
      const category = previews.get(preview.icon.category);
      if (!category) {
        previews.set(preview.icon.category, [preview]);
      } else {
        category.push(preview);
      }
    }
  }

  return previews;
}
