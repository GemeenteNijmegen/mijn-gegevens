const { render } = require('./shared/render');
const { BrpApi } = require('./BrpApi');
const { Session } = require('@gemeentenijmegen/session');
const { Response } = require('@gemeentenijmegen/apigateway-http/lib/V2/Response');

exports.persoonsgegevensRequestHandler = async (cookies, apiClient, dynamoDBClient) => {
    if(!apiClient || !dynamoDBClient) { throw new Error('all handler params are required'); }
    console.time('request');
    console.timeLog('request', 'start request');
    console.timeLog('request', 'finished init');
    let session = new Session(cookies, dynamoDBClient);
    await session.init();
    console.timeLog('request', 'init session');
    if (session.isLoggedIn() == true) {
        // Get API data
        const response = await handleLoggedinRequest(session, apiClient);
        console.timeEnd('request');
        return response;
    }
    console.timeEnd('request');
    return Response.redirect('/login');
}

async function handleLoggedinRequest(session, apiClient) {
    console.timeLog('request', 'Api Client init');
    const bsn = session.getValue('bsn');
    const brpApi = new BrpApi(apiClient);
    console.timeLog('request', 'Brp Api');

    const brpData = await brpApi.getBrpData(bsn);
    const data = brpData;
    data.volledigenaam = session.getValue('username');

    data.title = 'Persoonsgegevens';
    data.shownav = true;
    // render page
    const html = await render(data, __dirname + '/templates/persoonsgegevens.mustache', {
        'header': __dirname + '/shared/header.mustache',
        'footer': __dirname + '/shared/footer.mustache',
    });
    return Response.html(html, 200, session.getCookie());
}

