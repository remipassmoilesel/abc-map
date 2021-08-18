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

import React, { Component, ReactNode } from 'react';
import { Modal } from 'react-bootstrap';
import { ProcessingResult, Status } from '../../../ProcessingResult';
import { Parameters } from '../../../Parameters';
import Cls from './ProcessingReportModal.module.scss';

interface Props {
  result: ProcessingResult;
  params: Parameters;
  onClose: () => void;
}

class ProcessingReportModal extends Component<Props, {}> {
  public render(): ReactNode {
    const result = this.props.result;
    const params = this.props.params;
    const handleClose = this.props.onClose;
    const status = this.getStatusFromResult(result);

    return (
      <Modal show={true} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Fin du traitement</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className={`p-3 ${Cls.modal}`}>
            {/* Status */}
            <div className={'mb-4'}>{status}</div>

            {/* Number of processed features */}
            {result.featuresProcessed > 0 && <div className={'mb-3'}>{result.featuresProcessed} géométries ont été traitées.</div>}

            {/* Warning if no features processed */}
            {result.featuresProcessed < 1 && (
              <div className={'mb-3'}>⚠️ Aucune géométrie n&apos;a été traitée. Le traitement a été mal configuré ou les données sont invalides.</div>
            )}

            {/* Number of invalid features */}
            {result.invalidFeatures > 0 && (
              <div className={'mb-3'}>
                ⚠️ Certaines géométries ({result.invalidFeatures}) n&apos;ont pas la propriété de jointure&nbsp;
                <code>{params.geometries.joinBy || 'Propriété non définie'}</code>. Elles n&apos;ont pas été utilisées.
              </div>
            )}

            {/* Number of invalid values */}
            {result.invalidValues.length > 0 && (
              <div className={'mb-3'}>
                ⚠️ Certaines valeurs de champs de taille ({result.invalidValues.length}) ne peuvent pas être exploitées comme des nombres.
                <pre>{result.invalidValues.join('\n')}</pre>
              </div>
            )}

            {/* Data rows not found by join key */}
            {result.missingDataRows.length > 0 && (
              <div className={'mb-3'}>
                ⚠️ Certaines géométries ({result.missingDataRows.length}) n&apos;ont pas de données correspondante à leur propriété&nbsp;
                <code>{params.geometries.joinBy || 'Propriété non définie'}</code>.<pre>{result.missingDataRows.join('\n')}</pre>
              </div>
            )}
          </div>
          <div className={'mt-4 d-flex justify-content-end'}>
            <button onClick={handleClose} className={'btn btn-primary'} data-cy={'close-processing-report'}>
              Fermer
            </button>
          </div>
        </Modal.Body>
      </Modal>
    );
  }

  private getStatusFromResult(result: ProcessingResult) {
    switch (result.status) {
      case Status.Succeed:
        return <div className={'alert alert-primary'}>Le traitement est terminé 🥳 </div>;
      case Status.BadProcessing:
        return <div className={'alert alert-warning'}>Le traitement est terminé, mais il ne s&apos;est pas passé comme prévu 🤷. </div>;
      case Status.InvalidValues:
        return <div className={'alert alert-warning'}>Le traitement a été interrompu car certaines données sont incorrectes 🖩 </div>;
      case Status.InvalidMinMax:
        return (
          <div className={'alert alert-warning'}>
            Les valeurs doivent être supérieures à zéro et la valeur minimum doit être inférieure à la valeur maximum 🖩{' '}
          </div>
        );
    }
  }
}

export default ProcessingReportModal;
