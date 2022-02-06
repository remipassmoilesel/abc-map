export class UrlHelper {
  /**
   * Update specified URL, replace host and port part if they do not match E2E config
   *
   * @param url
   */
  public static adaptToConfig(url: string) {
    const urlMatch = url.match(/^(http:\/\/localhost:[0-9]+)(.+)/);
    const host = urlMatch?.length ? urlMatch[1] : undefined;
    const path = urlMatch?.length && urlMatch?.length > 1 ? urlMatch[2] : undefined;

    if (host !== Cypress.config('baseUrl')) {
      const newUrl = `${Cypress.config('baseUrl')}${path}`;
      cy.log(`URL has been updated from ${url.substring(0, 60)}... to ${newUrl.substring(0, 60)}...`);
      return newUrl;
    }

    return url;
  }
}
