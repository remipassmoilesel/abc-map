module.exports = {
  environmentName: 'local',
  externalUrl: 'http://localhost:10082/',
  server: {
    host: '127.0.0.1',
    port: 10_082,
    log: {
      requests: true,
      errors: true,
      warnings: false,
    },
    globalRateLimit: {
      max: 1000,
      timeWindow: '1m',
    },
    authenticationRateLimit: {
      max: 1000,
      timeWindow: '1m',
    },
  },
  project: {
    maxPerUser: 10,
  },
  database: {
    url: 'mongodb://localhost:27019',
    username: 'admin',
    password: 'admin',
  },
  jwt: {
    algorithm: 'HS512',
  },
  authentication: {
    secret: 'azerty1234',
    tokenExpiresIn: '6h',
    passwordLostExpiresIn: '30min',
  },
  registration: {
    passwordSalt: 'azerty1234',
    secret: 'azerty1234',
    confirmationExpiresIn: '24h',
  },
  smtp: {
    from: 'no-reply@abc-map.fr',
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'lelia16@ethereal.email',
      pass: '63rntn3G4DU3uue2MJ',
    },
  },
  datastore: {
    path: 'resources/dev-datastore',
  },
  development: {
    generateData: {
      users: 100,
      projectsPerUser: 5,
    },
    persistEmails: true,
  },
  legalMentions: `
        <div class="container p-2">
            <div class="row">
                <div class="col-xl-6">
                    <div class="mt-4 d-flex flex-column">
                      <h3 class='mb-3'>🇬🇧 Terms of use</h3>
                      <div>This platform is offered in order to be useful, but without any guarantee.</div>
                      <div>This software is free software licensed under <a target='_blank' href='https://www.gnu.org/licenses/agpl-3.0.html'>GNU AGPLv3</a>.</div>
                      <div>This license is explained <a target='_blank' href='https://www.gnu.org/licenses/quick-guide-gplv3.en.html'>here</a>.</div>
                      <div>The source code of the application is available <a target='_blank' href='https://gitlab.com/abc-map/abc-map'>here</a>.</div>
                    </div>
                    <div class="mt-4 d-flex flex-column">
                        <h3 class='mb-3'>Personal data</h3>
                        <div>No cookie or tracking technique is used.</div>
                        <div>If you have not registered, no personal data is stored or processed.</div>
                        <div>If you have registered your email address serves as an identifier. </div>
                        <div>You can delete your account on your profile page. </div>
                        <div>No data is kept after deleting an account.</div>
                    </div>
                    <div class="mt-4 d-flex flex-column">
                        <h3 class='mb-3'>Contact</h3>
                        <a href='https://twitter.com/abcmapfr' target='_blank' rel="noreferrer">
                          🐦 Twitter
                        </a>
                        <a href='mailto:fr.abcmap@gmail.com' target='_blank' rel="noreferrer">
                          📧 Email
                        </a>
                        <a href='https://remi-pace.fr' target='_blank' rel="noreferrer">
                          🌐 Author's personal website
                        </a>
                        <div class="mt-3"><code>abc-map.fr</code> is maintained by Rémi Pace.</div>
                        <div>This platform is hosted by <a href="https://www.ovhcloud.com/en/contact/" target="_blank">OVH</a>.</div>
                    </div>
                </div>
                <div class="col-xl-6">
                    <div class="mt-4 d-flex flex-column">
                        <h3 class='mb-3'>🇫🇷 Conditions d'utilisation</h3>
                        <div>Cette plateforme est proposée dans le but d'être utile, mais sans aucune garantie.</div>
                        <div>Ce logiciel est un logiciel libre sous licence <a target='_blank' href='https://www.gnu.org/licenses/agpl-3.0.html'>GNU AGPLv3</a>.</div>
                        <div>Cette licence est expliquée <a target='_blank' href='https://www.gnu.org/licenses/quick-guide-gplv3.fr.html'>ici</a>.</div>
                        <div>Le code source de l'application est disponible <a target='_blank' href='https://gitlab.com/abc-map/abc-map'>ici</a>.</div>
                    </div>
                    <div class="mt-4 d-flex flex-column">
                        <h3 class='mb-3'>Données personnelles</h3>
                        <div>Aucun cookie ni dispositif de traçage n'est utilisé.</div>
                        <div>Si vous n'êtes pas inscrit aucune donnée personnelle n'est stockée ou traitée.</div>
                        <div>Si vous êtes inscrit votre adresse email sert d'identifiant. </div>
                        <div>Vous pouvez supprimer votre compte sur la page de votre profil. </div>
                        <div>Aucune donnée n'est conservée après suppression d'un compte.</div>
                    </div>
                    <div class="mt-4 d-flex flex-column">
                        <h3 class='mb-3'>Contact</h3>
                        <a href='https://twitter.com/abcmapfr' target='_blank' rel="noreferrer">
                          🐦 Twitter
                        </a>
                        <a href='mailto:fr.abcmap@gmail.com' target='_blank' rel="noreferrer">
                          📧 Email
                        </a>
                        <a href='https://remi-pace.fr' target='_blank' rel="noreferrer">
                          🌐 Site personnel de l'auteur
                        </a>
                        <div class="mt-3"><code>abc-map.fr</code> est maintenu par Rémi Pace.</div>
                        <div>Cette plateforme est hébergée par <a href="https://www.ovhcloud.com/fr/contact/" target="_blank">OVH</a>.</div>
                    </div>
                </div>
            </div>
        </div>
        `,
};
