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

import React, { ChangeEvent, MouseEvent, useCallback, useEffect, useRef, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { prefixedTranslation } from '../../../../i18n/i18n';
import { FormState } from '../../../form-validation-label/FormState';
import FormValidationLabel from '../../../form-validation-label/FormValidationLabel';
import { ValidationHelper } from '../../../../core/utils/ValidationHelper';

const t = prefixedTranslation('TextEditor:');

interface Props {
  onEmbedVideo: (url: string) => void;
  onEmbedImage: (url: string) => void;
  onClose: () => void;
}

enum MediaType {
  Image = 'Image',
  Video = 'Video',
}

export function EmbedMediaModal(props: Props) {
  const { onEmbedImage, onEmbedVideo, onClose } = props;
  const [type, setType] = useState(MediaType.Image);
  const [formState, setFormState] = useState(FormState.InvalidFile);

  // We must stop propagation in order to not lost focus, due to editor event handler
  const handleClick = useCallback((ev: MouseEvent) => ev.stopPropagation(), []);

  // Image form has only one file field
  const [imageUrl, setImageUrl] = useState('');
  const handleImageChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      if (!ev.target.files?.length) {
        setFormState(FormState.InvalidFile);
        return;
      }

      const file = ev.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        setFormState(FormState.FileTooHeavy);
        return;
      }

      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }

      setImageUrl(URL.createObjectURL(file));
      setFormState(FormState.Ok);
    },
    [imageUrl]
  );

  // Video form has only one text field
  const [videoUrl, setVideoUrl] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const handleUrlChange = useCallback((ev: ChangeEvent<HTMLInputElement>) => {
    const value = ev.target.value;
    setVideoUrl(value);
    setFormState(ValidationHelper.secureUrl(value) ? FormState.Ok : FormState.InvalidHttpsUrl);
  }, []);

  // We focus text field every time it appear
  useEffect(() => inputRef.current?.focus(), [type]);

  // User cancels
  const handleCancel = useCallback(() => onClose(), [onClose]);

  // User confirms
  const handleConfirm = useCallback(() => {
    type === MediaType.Image ? onEmbedImage(imageUrl) : onEmbedVideo(videoUrl);
    onClose();
  }, [type, onEmbedImage, imageUrl, onEmbedVideo, videoUrl, onClose]);

  return (
    <Modal show={true} onHide={handleCancel} centered>
      <Modal.Header closeButton>{t('Embed_media')} 🎬</Modal.Header>
      <Modal.Body className={'d-flex flex-column'} onClick={handleClick}>
        {/* Media type selection */}
        <label className={'mb-2'}>
          <input type={'radio'} checked={MediaType.Image === type} onChange={() => setType(MediaType.Image)} className={'form-check-input mr-2'} />
          {t('Embed_image')}
        </label>
        <label className={'mb-4'}>
          <input type={'radio'} checked={MediaType.Video === type} onChange={() => setType(MediaType.Video)} className={'form-check-input mr-2'} />
          {t('Embed_video')}
        </label>

        {/* Image form */}
        {MediaType.Image === type && (
          <>
            <div className={'mb-2'}>{t('Select_an_image')}</div>
            <input type={'file'} onChange={handleImageChange} className={'form-control mb-3'} />
          </>
        )}

        {/* Video form */}
        {MediaType.Video === type && (
          <>
            <div className={'mb-2'}>{t('Address_of_video')}</div>
            <input ref={inputRef} type={'text'} value={videoUrl} onChange={handleUrlChange} className={'form-control mb-3'} />
          </>
        )}

        {/* Validation message */}
        <FormValidationLabel state={formState} className={'my-3'} />
      </Modal.Body>

      {/* Confirm and cancel controls */}
      <Modal.Footer>
        <button onClick={handleCancel} className={'btn btn-outline-secondary'}>
          {t('Cancel')}
        </button>
        <button onClick={handleConfirm} disabled={formState !== FormState.Ok} className={'btn btn-primary'}>
          {t('Confirm')}
        </button>
      </Modal.Footer>
    </Modal>
  );
}
