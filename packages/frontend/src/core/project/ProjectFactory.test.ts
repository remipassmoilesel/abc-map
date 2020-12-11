import { ProjectFactory } from './ProjectFactory';
import { CURRENT_VERSION } from '@abc-map/shared-entities';

describe('ProjectFactory', () => {
  it('newProject()', () => {
    const a = ProjectFactory.newProject();
    const b = ProjectFactory.newProject();
    expect(a.metadata.id).not.toBe(b.metadata.id);
    expect(a.metadata.name).toContain('Projet du');
    expect(a.metadata.version).toBe(CURRENT_VERSION);
    expect(a.layers).toHaveLength(0);
  });
});
