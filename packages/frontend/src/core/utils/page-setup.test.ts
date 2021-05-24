import { addNoIndexMeta, pageSetup, removeNoIndexMeta } from './page-setup';

describe('page-setup', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
  });

  it('pageSetup() should set title and description, even if meta description does not exists', () => {
    pageSetup('Test title', 'Test description');

    expect(document.head.innerHTML).toEqual(`<title>Abc-Map - Test title</title><meta name="description" content="Test description">`);
  });

  it('pageSetup() change title and description', () => {
    // Prepare
    pageSetup('Test title', 'Test description');

    // Act
    pageSetup('Test title 2', 'Test description 2');

    // Assert
    expect(document.head.innerHTML).toEqual(`<title>Abc-Map - Test title 2</title><meta name="description" content="Test description 2">`);
  });

  it('addNoIndexMeta()', () => {
    addNoIndexMeta();

    expect(document.head.innerHTML).toEqual(`<meta name="robots" content="noindex">`);
  });

  it('addNoIndexMeta() twice', () => {
    // Prepare
    addNoIndexMeta();

    // Act
    addNoIndexMeta();

    // Assert
    expect(document.head.innerHTML).toEqual(`<meta name="robots" content="noindex">`);
  });

  it('removeNoIndexMeta() should not fail', () => {
    removeNoIndexMeta();

    expect(document.head.innerHTML).toEqual(``);
  });

  it('removeNoIndexMeta() should not remove', () => {
    // Prepare
    addNoIndexMeta();

    // Act
    removeNoIndexMeta();

    // Assert
    expect(document.head.innerHTML).toEqual(``);
  });
});
