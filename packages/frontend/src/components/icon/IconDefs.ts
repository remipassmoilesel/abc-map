/**
 * Copyright © 2021 Rémi Pace.
 * This file is part of Abc-Map.
 *
 * Abc-Map is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.
 *
 * Abc-Map is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General
 * Public License along with Abc-Map. If not, see <https://www.gnu.org/licenses/>.
 */

import { faBan } from '@fortawesome/free-solid-svg-icons/faBan';
import { faEraser } from '@fortawesome/free-solid-svg-icons/faEraser';
import { faChevronCircleDown } from '@fortawesome/free-solid-svg-icons/faChevronCircleDown';
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons/faExclamationCircle';
import { faLaughWink } from '@fortawesome/free-solid-svg-icons/faLaughWink';
import { faRocket } from '@fortawesome/free-solid-svg-icons/faRocket';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons/faMapMarkerAlt';
import { faExclamation } from '@fortawesome/free-solid-svg-icons/faExclamation';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons/faQuestionCircle';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons/faExclamationTriangle';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons/faInfoCircle';
import { faFile } from '@fortawesome/free-solid-svg-icons/faFile';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons/faChevronDown';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons/faChevronRight';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons/faUserCircle';
import { faLockOpen } from '@fortawesome/free-solid-svg-icons/faLockOpen';
import { faFeather } from '@fortawesome/free-solid-svg-icons/faFeather';
import { faKey } from '@fortawesome/free-solid-svg-icons/faKey';
import { faLock } from '@fortawesome/free-solid-svg-icons/faLock';
import { faComments } from '@fortawesome/free-solid-svg-icons/faComments';
import { faFlask } from '@fortawesome/free-solid-svg-icons/faFlask';
import { faCogs } from '@fortawesome/free-solid-svg-icons/faCogs';
import { faFileCode } from '@fortawesome/free-solid-svg-icons/faFileCode';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { faDrawPolygon } from '@fortawesome/free-solid-svg-icons/faDrawPolygon';
import { faVectorSquare } from '@fortawesome/free-solid-svg-icons/faVectorSquare';
import { faImage } from '@fortawesome/free-solid-svg-icons/faImage';
import { faEdit } from '@fortawesome/free-solid-svg-icons/faEdit';
import { faSearchPlus } from '@fortawesome/free-solid-svg-icons/faSearchPlus';
import { faSearchMinus } from '@fortawesome/free-solid-svg-icons/faSearchMinus';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons/faArrowUp';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons/faArrowDown';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons/faArrowRight';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons/faArrowLeft';
import { faEye } from '@fortawesome/free-solid-svg-icons/faEye';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons/faEyeSlash';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons/faTimesCircle';
import { faClone } from '@fortawesome/free-solid-svg-icons/faClone';
import { faPaintRoller } from '@fortawesome/free-solid-svg-icons/faPaintRoller';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons/faPencilAlt';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons/faTrashAlt';
import { faRedo } from '@fortawesome/free-solid-svg-icons/faRedo';
import { faUndo } from '@fortawesome/free-solid-svg-icons/faUndo';
import { faUpload } from '@fortawesome/free-solid-svg-icons/faUpload';
import { faDownload } from '@fortawesome/free-solid-svg-icons/faDownload';
import { faPenAlt } from '@fortawesome/free-solid-svg-icons/faPenAlt';
import { faGlobeEurope } from '@fortawesome/free-solid-svg-icons/faGlobeEurope';
import { faTable } from '@fortawesome/free-solid-svg-icons/faTable';
import { faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons/faArrowCircleLeft';
import { faImages } from '@fortawesome/free-solid-svg-icons/faImages';
import { faArrowCircleRight } from '@fortawesome/free-solid-svg-icons/faArrowCircleRight';
import { faLink } from '@fortawesome/free-solid-svg-icons/faLink';
import { faBalanceScale } from '@fortawesome/free-solid-svg-icons/faBalanceScale';
import { faFeatherAlt } from '@fortawesome/free-solid-svg-icons/faFeatherAlt';
import { faPen } from '@fortawesome/free-solid-svg-icons/faPen';
import { faPrint } from '@fortawesome/free-solid-svg-icons/faPrint';
import { faFileAlt } from '@fortawesome/free-solid-svg-icons/faFileAlt';
import { faInfo } from '@fortawesome/free-solid-svg-icons/faInfo';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons/faPlusCircle';
import { faMinusCircle } from '@fortawesome/free-solid-svg-icons/faMinusCircle';
import { faMapSigns } from '@fortawesome/free-solid-svg-icons/faMapSigns';
import { faExpandAlt } from '@fortawesome/free-solid-svg-icons/faExpandAlt';
import { faCompressAlt } from '@fortawesome/free-solid-svg-icons/faCompressAlt';
import { faListOl } from '@fortawesome/free-solid-svg-icons/faListOl';
import { faMinus } from '@fortawesome/free-solid-svg-icons/faMinus';
import { faDraftingCompass } from '@fortawesome/free-solid-svg-icons/faDraftingCompass';
import { faRulerCombined } from '@fortawesome/free-solid-svg-icons/faRulerCombined';
import { faRuler } from '@fortawesome/free-solid-svg-icons/faRuler';
import { faCopy } from '@fortawesome/free-solid-svg-icons/faCopy';
import { faList } from '@fortawesome/free-solid-svg-icons/faList';
import { faBoxOpen } from '@fortawesome/free-solid-svg-icons/faBoxOpen';
import { faGift } from '@fortawesome/free-solid-svg-icons/faGift';
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars';
import { faLanguage } from '@fortawesome/free-solid-svg-icons/faLanguage';
import { faShareAltSquare } from '@fortawesome/free-solid-svg-icons/faShareAltSquare';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons/faExternalLinkAlt';
import { faClipboard } from '@fortawesome/free-solid-svg-icons/faClipboard';
import { faStickyNote } from '@fortawesome/free-solid-svg-icons/faStickyNote';

export const IconDefs = {
  faBan,
  faEraser,
  faLanguage,
  faBars,
  faList,
  faBoxOpen,
  faGift,
  faMapSigns,
  faChevronCircleDown,
  faSearch,
  faExclamationCircle,
  faLaughWink,
  faRocket,
  faMapMarkerAlt,
  faExclamation,
  faQuestionCircle,
  faExclamationTriangle,
  faInfoCircle,
  faFile,
  faChevronDown,
  faChevronRight,
  faUserCircle,
  faLockOpen,
  faFeather,
  faKey,
  faLock,
  faComments,
  faFlask,
  faCogs,
  faRulerCombined,
  faRuler,
  faCopy,
  faFileCode,
  faTrash,
  faPlus,
  faDrawPolygon,
  faVectorSquare,
  faImage,
  faMinus,
  faEdit,
  faSearchPlus,
  faSearchMinus,
  faArrowUp,
  faArrowDown,
  faArrowRight,
  faArrowLeft,
  faEye,
  faEyeSlash,
  faTimes,
  faTimesCircle,
  faClone,
  faPaintRoller,
  faPencilAlt,
  faDraftingCompass,
  faTrashAlt,
  faUndo,
  faRedo,
  faUpload,
  faDownload,
  faPenAlt,
  faGlobeEurope,
  faTable,
  faArrowCircleRight,
  faArrowCircleLeft,
  faImages,
  faLink,
  faBalanceScale,
  faFeatherAlt,
  faPen,
  faPrint,
  faFileAlt,
  faInfo,
  faPlusCircle,
  faMinusCircle,
  faExpandAlt,
  faCompressAlt,
  faListOl,
  faShareAltSquare,
  faExternalLinkAlt,
  faClipboard,
  faStickyNote,
};
