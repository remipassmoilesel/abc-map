import { ProjectHelper } from './ProjectHelper';

describe('ProjectHelper', () => {
  it('newProject()', () => {
    const a = ProjectHelper.newProject();
    const b = ProjectHelper.newProject();
    expect(a.id).not.toBe(b.id);
    expect(a.layers).toHaveLength(0);
    expect(a.name).toContain('Projet du');
  });
});
