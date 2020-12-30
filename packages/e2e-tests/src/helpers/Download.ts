export class Download {
  public static textFile(selector: string): Cypress.Chainable<string> {
    return cy.get(selector).then(
      (anchor) =>
        new Cypress.Promise<string>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open('GET', anchor.prop('href'), true);
          xhr.responseType = 'blob';

          xhr.onload = () => {
            if (xhr.status === 200) {
              const blob = xhr.response;
              const reader = new FileReader();
              reader.onload = () => {
                resolve(reader.result as string);
              };

              reader.onerror = (err) => reject(err);
              reader.readAsText(blob);
            }
          };
          xhr.onerror = (err) => reject(err);

          xhr.send();
        })
    );
  }
}
