/**
 * Copyright © 2023 Rémi Pace.
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

import React, { MouseEvent, useCallback, useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { AllPointIcons, getSafeIconName, IconCategory, IconName } from '@abc-map/point-icons';
import { IconProcessor } from '../../core/point-icons/IconProcessor';
import { LabeledIconCategories } from './LabeledIconCategory';
import { IconPreview } from './IconPreview';
import { useTranslation } from 'react-i18next';
import Cls from './PointIconPicker.module.scss';
import { Logger } from '@abc-map/shared';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefs } from '../icon/IconDefs';
import { PointIconButton } from './PointIconButton';

const logger = Logger.get('PointIconPicker.ts');

interface Props {
  value: IconName | undefined;
  onChange: (p: IconName) => void;
}

type PreviewMap = Map<
  IconCategory,
  {
    // True when all previews of category are ready
    ready: boolean;
    previews: IconPreview[];
  }
>;

const MaxOpenCategories = 3;
const previewColor = '#0094e3';

export function PointIconPicker(props: Props) {
  const { value: valueProp, onChange } = props;
  const { t } = useTranslation('PointIconPicker');

  const [modal, showModal] = useState(false);
  const [value, setValue] = useState<IconPreview | undefined>(undefined);
  const [iconPreviews, setIconPreviews] = useState<PreviewMap>(new Map());
  const [categoriesOpen, setCategoriesOpen] = useState<IconCategory[]>([LabeledIconCategories.Pins.value]);

  const handleToggleModal = useCallback(() => showModal((st) => !st), []);

  // Icons may not be ready yet, so we listen for download events and refresh UI
  const [iconEvents, updateUi] = useState(0);
  useEffect(() => {
    const handleIconProcessorEvent = () => {
      updateUi((st) => st + 1);
    };

    IconProcessor.get().addEventListener(handleIconProcessorEvent);
    return () => {
      IconProcessor.get().removeEventListener(handleIconProcessorEvent);
    };
  }, []);

  // Each time value prop change, we update internal value
  useEffect(() => {
    if (!valueProp) {
      return;
    }

    const icon = getSafeIconName(valueProp);
    const preview = IconProcessor.get().prepare(icon, 20, previewColor) ?? '';

    setCategoriesOpen((st) => st.concat(icon.category).slice(-MaxOpenCategories));
    setValue({ icon, preview });
    // We must update UI when 'iconEvents' updates
  }, [valueProp, iconEvents]);

  const handleToggleCategory = useCallback(
    (ev: MouseEvent<HTMLElement>): void => {
      const target = ev.target as HTMLElement;
      const category = target.dataset['category'] as IconCategory | undefined;
      if (!category) {
        logger.error('Invalid category: ', category);
        return;
      }

      const isOpen = categoriesOpen.find((cat) => cat === category);
      if (!isOpen) {
        setCategoriesOpen((st) => st.concat(category).slice(-MaxOpenCategories));
      } else {
        setCategoriesOpen((st) => st.filter((categoryB) => categoryB !== category));
      }
    },
    [categoriesOpen]
  );

  // Generate previews for specified category.
  // 'ready' is true when all icons have been rendered. Otherwise, some of them are not available yet.
  const generatePreviews = useCallback((category: IconCategory): { ready: boolean; previews: IconPreview[] } => {
    let ready = true;
    const previews = AllPointIcons.filter((icon) => icon.category === category)
      .map((icon) => {
        const preview = IconProcessor.get().prepare(icon, 50, '#0077b6');

        // Previews may not be ready now, if not it will be available later
        if (!preview) {
          ready = false;
          return null;
        }

        return { icon, preview };
      })
      .filter((preview): preview is IconPreview => !!preview);

    return { ready, previews };
  }, []);

  // Each time open categories change, we update previews
  useEffect(() => {
    const start = Date.now();

    const previews: PreviewMap = new Map();
    categoriesOpen.forEach((category) => previews.set(category, generatePreviews(category)));
    setIconPreviews(previews);

    logger.info('Preview generation took: ' + (Date.now() - start) + 'ms');
  }, [categoriesOpen, generatePreviews, iconEvents]);

  // When user select an icon, we close the modal
  const handleIconSelected = useCallback(
    (preview: IconPreview): void => {
      showModal(false);
      onChange(preview.icon.name);
    },
    [onChange]
  );

  return (
    <>
      {/* Button, always visible */}
      <button onClick={handleToggleModal} className={'btn  btn-sm btn-outline-secondary'} data-cy={'point-icon-selector'}>
        {!value && t('Select')}
        {value && <img src={value.preview} alt={value.icon.name} />}
      </button>

      {/* Modal, visible on demand */}
      <Modal show={modal} onHide={handleToggleModal} size={'xl'} centered>
        <Modal.Header closeButton>
          <Modal.Title>{t('Icons')}</Modal.Title>
        </Modal.Header>
        <Modal.Body className={'d-flex flex-column'}>
          <div className={Cls.viewPort}>
            {LabeledIconCategories.All.map((category) => {
              const isOpen = categoriesOpen.find((cat) => cat === category.value);
              const previews = iconPreviews.get(category.value);

              return (
                <div key={category.value} className={Cls.category}>
                  <div className={'d-flex align-items-center border-bottom mb-3'}>
                    <FontAwesomeIcon icon={isOpen ? IconDefs.faChevronUp : IconDefs.faChevronDown} className={'me-2 mb-1'} />

                    <h3
                      onClick={handleToggleCategory}
                      data-category={category.value}
                      data-e2e={category.value}
                      className={clsx(Cls.categoryTitle, 'flex-grow-1 user-select-none')}
                    >
                      {t(category.i18nLabel)}
                    </h3>
                  </div>

                  {isOpen && (
                    <div className={Cls.categoryContent}>
                      {!!previews && (
                        <>
                          {previews.previews.map((icon, idx) => {
                            const isSelected = !!valueProp && icon.icon.name === valueProp;
                            return (
                              <PointIconButton
                                key={icon.icon.name}
                                value={icon}
                                selected={isSelected}
                                onSelected={handleIconSelected}
                                data-cy={`${category.value}-${idx}`}
                              />
                            );
                          })}

                          {!previews.ready && <div>{t('Loading')}</div>}
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
