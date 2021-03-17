import { Zipper } from '../zip';
import { AbcFile } from '../utils/AbcFile';
import { ManifestName } from '@abc-map/shared-entities';
import { ProjectHelper } from './ProjectHelper';

describe('ProjectHelper', () => {
  it('should find manifest', async () => {
    const files: AbcFile[] = [{ path: ManifestName, content: new Blob(['{"variable":"value"}']) }];
    const project = await Zipper.zipFiles(files);

    const manifest = await ProjectHelper.extractManifest(project);
    expect(manifest).toEqual({ variable: 'value' });
  });

  it('should fail', async () => {
    const files: AbcFile[] = [];
    const project = await Zipper.zipFiles(files);

    const err: Error = await ProjectHelper.extractManifest(project).catch((err) => err);
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toEqual('No manifest found');
  });
});
