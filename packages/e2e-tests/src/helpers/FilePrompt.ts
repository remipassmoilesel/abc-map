export class FilePrompt {
  public static select(name: string, content: Blob) {
    return cy.get('[data-cy=file-input]').attachFile({ filePath: name, fileContent: content });
  }
}
