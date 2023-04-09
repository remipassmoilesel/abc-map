module.exports = {
  environmentName: 'test',
  externalUrl: 'http://localhost:10082/',
  server: {
    host: '127.0.0.1',
    port: 10_082,
    log: {
      requests: false,
      errors: false,
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
    url: 'mongodb://mongo:27017',
    username: 'admin',
    password: 'admin',
  },
  jwt: {
    algorithm: 'HS512',
  },
  authentication: {
    secret: 'azerty1234',
    tokenExpiresIn: '45min',
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
    path: 'resources/datastore',
  },
  development: {
    generateData: {
      users: 100,
      projectsPerUser: 0,
    },
    persistEmails: true,
  },
  legalMentions: `
        <h3 class='my-3'>Conditions d'utilisation</h3>
        <div>
            <div>Ce logiciel est un logiciel libre sous licence <a target='_blank' href='https://www.gnu.org/licenses/agpl-3.0.html'>GNU AGPLv3</a>.</div>
            <div>Cette licence est expliquée <a target='_blank' href='https://www.gnu.org/licenses/quick-guide-gplv3.fr.html'>ici</a>.</div>
            <div>Le code source de l'application est disponible <a target='_blank' href='https://gitlab.com/abc-map/abc-map'>ici</a>.</div>
        </div>

        <h3 class='mt-5 mb-3'>Données personnelles</h3>
        <div>
            <div>Aucun cookie ni dispositif de traçage n'est utilisé.</div>
            <div>Si vous n'êtes pas inscrit aucune donnée personnelle n'est stockée ou traitée.</div>
            <div>Si vous êtes inscrit votre adresse email sert d'identifiant. </div>
            <div>Vous pouvez supprimer votre compte sur la page de votre profil. </div>
            <div>Aucune donnée n'est conservée après suppression d'un compte.</div>
        </div>

        <h3 class='mt-5 mb-3'>Mentions légales</h3>
        <div>...</div>

        <h3 class='mt-5 mb-3'>Réseaux</h3>
        <div class='d-flex flex-column'>
          <a href={'https://twitter.com/abcmapfr'} target={'_blank'} rel="noreferrer">
            Twitter
          </a>
          <a href={'https://remi-pace.fr'} target={'_blank'} rel="noreferrer">
            Site personnel de l&apos;auteur
          </a>
        </div>
        `,
};
