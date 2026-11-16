// Builds a ready-to-upload folder for single-site hosting on Windows IIS
// (SmarterASP.NET / site4now "Node.js App", httpPlatform handler).
//
//   cd Server
//   npm run deploy:build                                   -> ../deploy
//   npm run deploy:build -- https://other.site --folder=shop (other URL / folder)
//
// The hosting panel only runs Node apps from a SUB-FOLDER, which becomes the
// URL prefix (https://site/app/). Upload the CONTENTS of deploy/ to the site root:
//   index.html, web.config   site root: sends visitors to /app/
//   app/web.config           IIS security settings; the panel adds the Node.js handler
//   app/server.js            startup file for the panel's Node.js App
//   app/diag.js              optional self-check (use as startup file if the app won't start)
//   app/src/, app/db/        API server + database setup scripts
//   app/public/              built React website (under /app, API at /app/api)
//   app/uploads/             item images
//   app/node_modules/        production dependencies (Windows binaries)
//   app/.env                 production settings (Server/.env.production + BASE_PATH)
const { execSync } = require('child_process');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Arguments: [site URL] [--folder=app]
const args = process.argv.slice(2);
const SITE_URL = (args.find((a) => !a.startsWith('--')) || 'https://yesgp1-001-site13.itempurl.com').replace(/\/$/, '');
const APP_FOLDER = ((args.find((a) => a.startsWith('--folder=')) || '--folder=app').split('=')[1] || 'app')
  .replace(/^\/+|\/+$/g, '');
if (!/^[A-Za-z0-9_-]+$/.test(APP_FOLDER)) throw new Error('--folder must be a simple folder name, e.g. app');
const BASE_PATH = `/${APP_FOLDER}`;

const SERVER_DIR = path.resolve(__dirname, '..');
const ROOT_DIR = path.resolve(SERVER_DIR, '..');
const CLIENT_DIR = path.join(ROOT_DIR, 'Client');
const DEPLOY_DIR = path.join(ROOT_DIR, 'deploy');
const APP_DIR = path.join(DEPLOY_DIR, APP_FOLDER);
const PROD_ENV = path.join(SERVER_DIR, '.env.production');

const run = (cmd, cwd, env = {}) => {
  console.log(`\n> ${cmd}   (in ${path.relative(ROOT_DIR, cwd) || '.'})`);
  execSync(cmd, { cwd, stdio: 'inherit', env: { ...process.env, ...env } });
};
const copy = (from, to) => fs.cpSync(from, to, { recursive: true });

function parseEnv(file) {
  const out = {};
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
    if (m) out[m[1]] = m[2];
  }
  return out;
}

// Server/.env.production is created once and then reused, so the JWT secret
// (and therefore customers' logins) survives future deployments.
function ensureProductionEnv() {
  if (fs.existsSync(PROD_ENV)) {
    console.log(`Using existing ${path.relative(ROOT_DIR, PROD_ENV)}`);
    return;
  }
  const dev = parseEnv(path.join(SERVER_DIR, '.env'));
  const lines = [
    '# Production settings for the deployed site. Copied to deploy/.env by deploy:build.',
    '# Keep this file private (it is git-ignored).',
    'NODE_ENV=production',
    '',
    `DB_HOST=${dev.DB_HOST}`,
    `DB_PORT=${dev.DB_PORT || 3306}`,
    `DB_USER=${dev.DB_USER}`,
    `DB_PASSWORD=${dev.DB_PASSWORD}`,
    `DB_NAME=${dev.DB_NAME}`,
    '',
    '# PORT is provided by IIS (iisnode); do not set it here.',
    `CORS_ORIGINS=${SITE_URL}`,
    '',
    '# Separate from development, so dev logins are not valid in production.',
    `JWT_SECRET=${crypto.randomBytes(48).toString('hex')}`,
    'JWT_EXPIRES_IN=7d',
    '',
  ];
  fs.writeFileSync(PROD_ENV, lines.join('\n'));
  console.log(`Created ${path.relative(ROOT_DIR, PROD_ENV)} (new JWT secret)`);
}

const WEB_CONFIG = `<?xml version="1.0" encoding="utf-8"?>
<!-- IIS settings for the Node.js site (website, API and images all served by server.js). -->
<configuration>
  <system.webServer>
    <webSocket enabled="false" />

    <!-- The Node.js handler (httpPlatform) is NOT defined here: the hosting
         control panel (Node.js App -> Create, startup file server.js) adds it to
         this file when the app is enabled, with the host's node.exe path. -->

    <!-- Never serve these folders/files directly -->
    <security>
      <requestFiltering>
        <hiddenSegments>
          <add segment="node_modules" />
          <add segment="iisnode" />
          <add segment=".env" />
          <add segment="src" />
          <add segment="db" />
        </hiddenSegments>
        <!-- allow image uploads up to the server limit (8 MB) -->
        <requestLimits maxAllowedContentLength="10485760" />
      </requestFiltering>
    </security>

    <!-- Let Express send its own error pages / JSON errors -->
    <httpErrors existingResponse="PassThrough" />

  </system.webServer>
</configuration>
`;

// Root of the site: the app lives in a sub-folder, so send visitors there.
const ROOT_INDEX_HTML = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Spice Soirée</title>
  <meta http-equiv="refresh" content="0; url=${BASE_PATH}/">
  <script>location.replace('${BASE_PATH}/' + location.search + location.hash)</script>
</head>
<body>
  <p><a href="${BASE_PATH}/">Continue to Spice Soirée</a></p>
</body>
</html>
`;

// Root web.config: default page = the redirect above, and nothing else is
// served from the root. inheritInChildApplications="false" keeps these settings
// out of the Node app in the sub-folder.
const ROOT_WEB_CONFIG = `<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <location path="." inheritInChildApplications="false">
    <system.webServer>
      <defaultDocument enabled="true">
        <files>
          <clear />
          <add value="index.html" />
        </files>
      </defaultDocument>
      <security>
        <requestFiltering>
          <hiddenSegments>
            <add segment=".env" />
            <add segment="node_modules" />
            <add segment="iisnode" />
          </hiddenSegments>
        </requestFiltering>
      </security>
    </system.webServer>
  </location>
</configuration>
`;

function main() {
  console.log(`Building deployment for ${SITE_URL}`);
  ensureProductionEnv();

  // Fresh output folder (keeps nothing from earlier builds). Empty it rather than
  // deleting it: Windows refuses to delete a folder that a terminal or Explorer
  // window currently has open.
  fs.mkdirSync(DEPLOY_DIR, { recursive: true });
  for (const entry of fs.readdirSync(DEPLOY_DIR)) {
    fs.rmSync(path.join(DEPLOY_DIR, entry), { recursive: true, force: true });
  }

  // The hosting panel runs Node apps only from a sub-folder, which becomes the
  // URL prefix: deploy/app -> https://site/app/
  fs.mkdirSync(APP_DIR, { recursive: true });

  // 1. React website -> deploy/app/public. PUBLIC_URL makes routes, scripts and
  //    images live under /app; the API is called on the same domain (/app/api).
  //    BUILD_PATH keeps Client/build (local testing) untouched.
  run('npm run build', CLIENT_DIR, {
    PUBLIC_URL: BASE_PATH,
    REACT_APP_API_URL: `${BASE_PATH}/api`,
    BUILD_PATH: path.join(APP_DIR, 'public'),
    GENERATE_SOURCEMAP: 'false',
  });

  // 2. API server
  copy(path.join(SERVER_DIR, 'src'), path.join(APP_DIR, 'src'));
  fs.mkdirSync(path.join(APP_DIR, 'db'));
  for (const f of ['schema.sql', 'setup.js', 'seed-data.js']) {
    copy(path.join(SERVER_DIR, 'db', f), path.join(APP_DIR, 'db', f));
  }
  copy(path.join(SERVER_DIR, 'db', 'seed-images'), path.join(APP_DIR, 'db', 'seed-images'));
  copy(path.join(SERVER_DIR, 'package.json'), path.join(APP_DIR, 'package.json'));
  copy(path.join(SERVER_DIR, 'package-lock.json'), path.join(APP_DIR, 'package-lock.json'));
  fs.writeFileSync(
    path.join(APP_DIR, 'server.js'),
    "// Startup file for the hosting panel's Node.js App (set startup file = server.js)\nrequire('./src/server.js');\n"
  );
  copy(path.join(__dirname, 'diag.js'), path.join(APP_DIR, 'diag.js'));
  fs.writeFileSync(path.join(APP_DIR, 'web.config'), WEB_CONFIG);
  // Production settings + the URL prefix the server should accept
  fs.writeFileSync(
    path.join(APP_DIR, '.env'),
    `${fs.readFileSync(PROD_ENV, 'utf8').trimEnd()}\n\n# Sub-folder the app is hosted in (set by deploy:build)\nBASE_PATH=${BASE_PATH}\n`
  );

  // 3. Images: everything currently in the uploads folder (seed + admin uploads)
  const { UPLOAD_DIR } = require('../src/uploads');
  copy(UPLOAD_DIR, path.join(APP_DIR, 'uploads'));

  // 4. Production dependencies (Windows binaries, built on this machine)
  //    The image library (sharp) ships a 64-bit Windows binary. If the host runs
  //    a different Node, uploads report an error but the site keeps working
  //    (check /api/health -> imageProcessing).
  run('npm ci --omit=dev --no-audit --no-fund', APP_DIR);

  // 5. Site root: send visitors of https://site/ to the app, and keep the root
  //    from serving files directly.
  fs.writeFileSync(path.join(DEPLOY_DIR, 'index.html'), ROOT_INDEX_HTML);
  fs.writeFileSync(path.join(DEPLOY_DIR, 'web.config'), ROOT_WEB_CONFIG);

  const folderSize = (dir) =>
    fs.readdirSync(dir, { withFileTypes: true }).reduce((sum, entry) => {
      const full = path.join(dir, entry.name);
      return sum + (entry.isDirectory() ? folderSize(full) : fs.statSync(full).size);
    }, 0);
  const mb = (folderSize(DEPLOY_DIR) / 1048576).toFixed(1);
  console.log(`\nDone. Upload the CONTENTS of ${DEPLOY_DIR} (${mb} MB) to the site root.`);
  console.log(`Then in the hosting panel: Node.js App -> folder /${APP_FOLDER}, startup file server.js, turn ON.`);
  console.log(`Website: ${SITE_URL}${BASE_PATH}/  (the site root redirects there)`);
}

main();
