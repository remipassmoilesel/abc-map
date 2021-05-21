import { ProjectConstants } from './ProjectConstants';

describe('ProjectConstants', () => {
  it('modifications require data migration', () => {
    expect(ProjectConstants.CurrentVersion).toEqual('0.1');
    expect(ProjectConstants.ManifestName).toEqual('project.json');
  });
});
