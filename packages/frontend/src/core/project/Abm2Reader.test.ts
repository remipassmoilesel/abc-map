import { Abm2Reader } from './Abm2Reader';
import { TestHelper } from '../utils/TestHelper';

describe('Abm2Reader.test.ts', function () {
  it('Incorrect project', function () {
    expect.assertions(1);
    return Abm2Reader.fromFile({} as any).catch((err) => expect(err.message.startsWith("Failed to execute 'readAsText'")).toBeTruthy());
  });

  it('Correct project', async function () {
    const original = TestHelper.sampleProject();
    original.layouts.push(TestHelper.sampleLayout());

    const file = new Blob([JSON.stringify(original)]);
    const loaded = await Abm2Reader.fromFile(file as File);
    expect(loaded).toEqual(original);
  });
});
