module.exports = {
  environmentName: 'local',
  externalUrl: 'http://localhost:10082/',
  server: {
    host: '127.0.0.1',
    port: 10_082,
    log: {
      requests: false,
      errors: true,
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
    generateData: true,
    users: 100,
    persistEmails: true,
  },
  legalMentions: `
    <h3 class='mt-5 mb-3'>🇬🇧 Terms of use</h3>
    <div>
        <div>This platform is offered in order to be useful, but without any guarantee.</li>
        <div>This software is free software licensed under <a target='_blank' href='https://www.gnu.org/licenses/agpl-3.0.html'>GNU AGPLv3</a>.</div>
        <div>This license is explained <a target='_blank' href='https://www.gnu.org/licenses/quick-guide-gplv3.en.html'>here</a>.</div>
        <div>The source code of the application is available <a target='_blank' href='https://gitlab.com/abc-map/abc-map'>here</a>.</div>
    </div>

    <h3 class='mt-5 mb-3'>Personal data</h3>
    <div>
        <div>No cookie or tracking technique is used.</div>
        <div>If you have not registered, no personal data is stored or processed.</div>
        <div>If you have registered your email address serves as an identifier. </div>
        <div>You can delete your account on your profile page. </div>
        <div>No data is kept after deleting an account.</div>
    </div>

    <h3 class='mt-5 my-3'>🇫🇷 Conditions d'utilisation</h3>
    <div>
        <div>Cette plateforme est proposée dans le but d'être utile, mais sans aucune garantie.</li>
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

    <h3 class='mt-5 mb-3'>Contact / Réseaux</h3>
    <div class='d-flex flex-column'>
      <a href='https://twitter.com/abcmapfr' target='_blank' rel="noreferrer">
        🐦 Twitter
      </a>
      <a href='mailto:fr.abcmap@gmail.com' target='_blank' rel="noreferrer">
        📧 Contact
      </a>
      <a href='https://remi-pace.fr' target='_blank' rel="noreferrer">
        🌐 Author's personal website / Site personnel de l&apos;auteur
      </a>
    </div>

    <h3 class='mt-5 mb-3'>Legal Notice / Mentions légales</h3>
    <div><code>abc-map.fr</code> is maintained by Rémi Pace. For any complaint, please contact:</div>
    <div><code>abc-map.fr</code> est maintenu par Rémi Pace. Pour toute réclamation, merci de vous adresser à:</div>
    <div class='alert alert-info mt-3'>
      <div class='mb-3'>OVH</div>
      <div>📍 2 rue Kellermann - 59100 Roubaix - France</div>
      <div>📞 1007</div>
      <div>🌐 <a href="https://www.ovhcloud.com/fr/contact/" target="_blank">https://www.ovhcloud.com/fr/contact/</a></div>
    </div>
        `
};
