export class Download {
  public static fileAsBlob(): Cypress.Chainable<Blob> {
    return cy.get('[data-cy=file-output]').then(
      (anchor) =>
        new Cypress.Promise<Blob>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open('GET', anchor.prop('href'), true);
          xhr.responseType = 'blob';
          xhr.onload = () => resolve(xhr.response);
          xhr.onerror = (err) => reject(err);
          xhr.send();
        })
    );
  }
}
