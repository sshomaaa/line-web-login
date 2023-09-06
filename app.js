const port = 9000;

function currentTime() {
    return new Intl.DateTimeFormat('ja-JP', {
        timeZone: 'Asia/Tokyo',
        hour12: false,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).format(new Date());
}

const { v4: uuidv4 } = require('uuid');
const express = require('express');
const app = express();
app.use((req, res, next) => {
    req.id = uuidv4();
    next();
});
app.use((req, res, next) => {
    console.log(`${currentTime()} [${req.id}] ${req.method}: ${req.path}`);
    next();
});
app.use(express.urlencoded({
    extended: false,
}));
app.use(express.json());

app.get('/login', function (req, res) {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8" />
            <title>Login - LINE Web Login</title>
        </head>
        <body>
            <h2>LINE Web Login</h2>
            <a href="/redirect_auth">Login</a>
        </body>
        </html>
    `);
});

app.get('/redirect_auth', function (req, res) {
    const channelId = process.env.LINE_LOGIN_CHANNEL_ID;
    const redirectUri = process.env.LINE_LOGIN_REDIRECT_URI;
    const encodedRedirectUri = encodeURI(redirectUri);
    const state = process.env.LINE_LOGIN_STATE ?? req.id;
    const scope = `openid%20profile`;
    const nonce = req.id;
    const authUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=code`
        + `&client_id=${channelId}`
        + `&redirect_uri=${encodedRedirectUri}`
        + `&state=${state}`
        + `&scope=${scope}`
        + `&nonce=${nonce}`;

    console.log(`${currentTime()} [${req.id}] state = ${state}`);
    console.log(`${currentTime()} [${req.id}] redirectUri = ${redirectUri}`);
    console.log(`${currentTime()} [${req.id}] authUrl = ${authUrl}`);
    res.redirect(authUrl);
});

app.get('/auth', function (req, res) {
    let code = req.query.code;
    let state = req.query.state;
    let scope = req.query.scope;
    let error = req.query.error;
    let errorCode = req.query.errorCode;
    let errorMessage = req.query.errorMessage;

    console.log(`${currentTime()} [${req.id}] code = ${code}`);
    console.log(`${currentTime()} [${req.id}] state = ${state}`);
    console.log(`${currentTime()} [${req.id}] scope = ${scope}`);
    console.log(`${currentTime()} [${req.id}] error = ${error}`);
    console.log(`${currentTime()} [${req.id}] errorCode = ${errorCode}`);
    console.log(`${currentTime()} [${req.id}] errorMessage = ${errorMessage}`);

    if (error != undefined || errorCode != undefined || errorMessage != undefined) {
        res.redirect('/cancel');
        return;
    }
    res.redirect(`/success?code=${code}`);
});

app.get('/cancel', function (req, res) {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8" />
            <title>Login Cancel - LINE Web Login</title>
        </head>
        <body>
            <h2>LINE Web Login - Login Cancel.</h2>
        </body>
        </html>
    `);
});

app.get('/success', function (req, res) {
    let code = req.query.code;
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8" />
            <title>Login Success - LINE Web Login</title>
        </head>
        <body>
            <h2>LINE Web Login - Login Success.</h2>
            <p>Authorization code = ${code}
        </body>
        </html>
    `);
});

app.listen(port, () => console.log(`Listening on port ${port}`));
