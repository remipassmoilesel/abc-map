import { ProjectFactory } from './ProjectFactory';
import { CURRENT_VERSION, DEFAULT_PROJECTION } from '@abc-map/shared-entities';

describe('ProjectFactory', () => {
  it('newProjectMetadata()', () => {
    const a = ProjectFactory.newProjectMetadata();
    expect(a.id).toBeDefined();
    expect(a.name).toContain('Projet du');
    expect(a.projection).toEqual(DEFAULT_PROJECTION);
    expect(a.version).toBe(CURRENT_VERSION);
  });

  it('newProject()', () => {
    const a = ProjectFactory.newProject();
    expect(a.layers).toHaveLength(0);
    expect(a.layouts).toHaveLength(0);
  });
});
