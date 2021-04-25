import squareIcon from '../../../assets/point-icons/square.inline.svg';
import circleIcon from '../../../assets/point-icons/circle.inline.svg';
import starIcon from '../../../assets/point-icons/star.inline.svg';

/**
 * Warning: Modify this will require a data migration
 */
export enum PointIcons {
  Square = 'square',
  Circle = 'circle',
  Star = 'star',
}

export interface PointIcon {
  name: PointIcons;
  contentSvg: string;
}

const AllIcons: PointIcon[] = [
  {
    name: PointIcons.Square,
    contentSvg: squareIcon,
  },
  {
    name: PointIcons.Circle,
    contentSvg: circleIcon,
  },
  {
    name: PointIcons.Star,
    contentSvg: starIcon,
  },
];

export const DefaultIcon = AllIcons[0];

/**
 * This function return icon with specified name.
 *
 * This method never fail, if icon was not found, we return the default one.
 *
 * @param name
 */
export function safeGetIcon(name: PointIcons | string): PointIcon {
  return AllIcons.find((i) => i.name === name) || DefaultIcon;
}

export function getAllIcons(): PointIcon[] {
  return AllIcons;
}
