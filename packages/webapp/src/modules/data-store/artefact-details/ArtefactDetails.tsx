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

import Cls from './ArtefactDetails.module.scss';
import { withTranslation } from 'react-i18next';
import { AbcArtefact, getListByLang, getTextByLang, Logger, Zipper, ArtefactType } from '@abc-map/shared';
import { FaIcon } from '../../../components/icon/FaIcon';
import { IconDefs } from '../../../components/icon/IconDefs';
import React, { useCallback, useState } from 'react';
import { getLang, prefixedTranslation } from '../../../i18n/i18n';
import LicenceModal from '../licence-modal/LicenceModal';
import { DataReader } from '../../../core/data/DataReader';
import { resolveInAtLeast } from '../../../core/utils/resolveInAtLeast';
import { FileFormat, FileFormats } from '../../../core/data/FileFormats';
import { FileIO } from '../../../core/utils/FileIO';
import { useServices } from '../../../core/useServices';
import Previews from './previews/Previews';
import { getArtefactIcon } from '../../../core/data/getArtefactIcon';
import clsx from 'clsx';
import { ReadStatus } from '../../../core/data/ReadResult';
import { Modal } from 'react-bootstrap';
import { attributionsVariableExpansion } from '../../../core/utils/variableExpansion';
import { linkify, stripHtml } from '../../../core/utils/strings';

const logger = Logger.get('ArtefactDetails.tsx');

const t = prefixedTranslation('DataStoreModule:');

interface Props {
  activeArtefact: AbcArtefact | undefined;
  mobileVisible: boolean;
  mobileOnHide: () => void;
  className?: string;
}

function ArtefactDetails(props: Props) {
  const { activeArtefact: artefact, mobileVisible, mobileOnHide, className } = props;
  const { dataStore, toasts } = useServices();
  const [descriptionModal, showDescriptionModal] = useState(false);
  const name = artefact && getTextByLang(artefact.name, getLang());
  const description = artefact && getTextByLang(artefact.description, getLang());
  const keywords = artefact && getListByLang(artefact.keywords, getLang());
  const icon = artefact && getArtefactIcon(artefact);
  const attributions = artefact?.attributions && attributionsVariableExpansion(artefact.attributions).join('<br/>');

  const handleShowDescription = useCallback(() => showDescriptionModal(true), []);
  const handleDescriptionModalClose = useCallback(() => showDescriptionModal(false), []);

  const handleImportArtefact = useCallback(() => {
    if (!artefact) {
      logger.error('No artefact to download');
      return;
    }

    const dataReader = DataReader.create();

    toasts.info(t('Import_in_progress'));
    resolveInAtLeast(dataReader.importArtefact(artefact), 800)
      .then((res) => {
        if (res.status === ReadStatus.Succeed) {
          toasts.info(t('Import_done'));
        } else if (res.status === ReadStatus.Failed) {
          toasts.error(t('Formats_not_supported'));
        }
      })
      .catch((err) => {
        logger.error('Cannot import artefact: ', err);
        toasts.genericError();
      });
  }, [artefact, toasts]);

  const handleDownloadArtefact = useCallback(() => {
    if (!artefact) {
      logger.error('No artefact to download');
      return;
    }

    toasts.info(t('Download_in_progress'));
    resolveInAtLeast(dataStore.downloadFilesFrom(artefact), 800)
      .then(async (res) => {
        let content: Blob;
        if (res.length === 1 && FileFormat.ZIP === FileFormats.fromPath(res[0].path)) {
          content = res[0].content;
        } else {
          content = await Zipper.forBrowser().zipFiles(res);
        }

        FileIO.downloadBlob(content, 'artefact.zip');
      })
      .catch((err) => {
        logger.error('Cannot donwload artefact', err);
        toasts.genericError();
      });
  }, [artefact, dataStore, toasts]);

  return (
    <div className={clsx(Cls.details, mobileVisible && Cls.mobileVisible, className)}>
      {/* No artefact selected, we display a message */}
      {!artefact && (
        <div className={Cls.noArtefactMessage}>
          <FaIcon icon={IconDefs.faGift} size={'5rem'} className={'mb-3'} />
          {t('Select_an_artifact_to_see_what_it_contains')}
        </div>
      )}

      {/* Artefact selected, we display details */}
      {artefact && (
        <>
          {/* Artefact name and close button on mobile */}
          <div className={Cls.header}>
            <h2 data-cy={'artefact-name'}>{name}</h2>
            <button onClick={mobileOnHide} className={Cls.mobileCloseButton}>
              <FaIcon icon={IconDefs.faTimes} size={'2rem'} />
            </button>
          </div>

          {/* About block */}
          <div className={'mb-3'}>
            <h4>{t('About')}</h4>
            <div className={Cls.aboutLine}>
              <div className={Cls.label}>{t('Kind')}:</div>
              <>
                {ArtefactType.BaseMap === artefact.type && t('Basemap')}
                {ArtefactType.Vector === artefact.type && t('Geometries')}
                {icon && <FaIcon icon={icon} size={'1.3rem'} className={'ml-2'} />}
              </>
            </div>

            <div className={Cls.aboutLine}>
              <div className={Cls.label}>{t('Provider')}:</div> {artefact.provider}
            </div>

            <div className={Cls.aboutLine}>
              <div className={Cls.label}>{t('Source')}:</div>
              <a href={artefact.link} rel="noreferrer" target={'_blank'}>
                {artefact.link}
              </a>
            </div>

            {!!attributions?.length && (
              <div className={Cls.aboutLine}>
                <div className={Cls.label}>{t('Attributions')}:</div>
                <div dangerouslySetInnerHTML={{ __html: attributions }} />
              </div>
            )}

            <div className={Cls.aboutLine}>
              <LicenceModal artefact={artefact} />
            </div>
          </div>

          {/* Description block */}
          {description && (
            <div className={'mb-3'}>
              <h4>{t('Description')}</h4>
              <div onClick={handleShowDescription} className={Cls.description} dangerouslySetInnerHTML={{ __html: stripHtml(description) }} />

              {/* Description can be expanded in a modal */}
              <Modal show={descriptionModal} onHide={handleShowDescription} centered>
                <Modal.Header>
                  <Modal.Title>
                    {name} : {t('Description')} <FaIcon icon={IconDefs.faGift} className={'ml-2'} />
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className={Cls.descriptionModalContent} dangerouslySetInnerHTML={{ __html: linkify(description) }} />
                </Modal.Body>
                <Modal.Footer>
                  <button className={'btn btn-outline-secondary'} onClick={handleDescriptionModalClose}>
                    {t('Close')}
                  </button>
                </Modal.Footer>
              </Modal>
            </div>
          )}

          {/* Keywords block */}
          {keywords && (
            <div className={'mb-3'}>
              {t('Keywords')}: {keywords.join(', ')}
            </div>
          )}

          {/* Artefact preview */}
          <h4>{t('Preview')}</h4>
          <Previews artefact={artefact} className={'mb-4'} key={artefact.id} />

          <div className={'flex-grow-1'} />

          {/* Actions */}
          <div className={Cls.actions}>
            <button className={'btn btn-primary'} onClick={handleImportArtefact} data-cy={'import-artefact'}>
              <FaIcon icon={IconDefs.faPlus} className={'mr-2'} />
              {t('Add_to_project')}
            </button>

            <button className={'btn btn-outline-secondary'} onClick={handleDownloadArtefact} data-cy={'download-artefact'}>
              <FaIcon icon={IconDefs.faDownload} className={'mr-2'} />
              {t('Download')}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default withTranslation()(ArtefactDetails);
