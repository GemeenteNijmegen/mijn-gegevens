const { Session } = require('./shared/Session');
const { render } = require('./shared/render');
const { BrpApi } = require('./BrpApi');


function redirectResponse(location, code = 302) {
    return {
        'statusCode': code,
        'body': '',
        'headers': { 
            'Location': location
        }
    }
}

exports.requestHandler = async (cookies, apiClient, dynamoDBClient) => {
    if(!cookies || !apiClient || !dynamoDBClient) { throw new Error('all handler params are required'); }
    console.time('request');
    console.timeLog('request', 'start request');
    console.timeLog('request', 'finished init');
    let session = new Session(cookies, dynamoDBClient);
    await session.init();
    console.timeLog('request', 'init session');
    if (session.isLoggedIn() !== true) {
        return redirectResponse('/login');
    }
    // Get API data
    console.timeLog('request', 'Api Client init');
    const bsn = session.getValue('bsn');
    const brpApi = new BrpApi(apiClient);
    console.timeLog('request', 'Brp Api');

    const brpData = await brpApi.getBrpData(bsn);
    const data = brpData;
    data.volledigenaam = brpData?.Persoon?.Persoonsgegevens?.Naam ? brpData.Persoon.Persoonsgegevens.Naam : 'Onbekende gebruiker';

    data.title = 'Persoonsgegevens';
    data.shownav = true;
    // render page
    const html = await render(data, __dirname + '/templates/persoonsgegevens.mustache', {
        'header': __dirname + '/shared/header.mustache',
        'footer': __dirname + '/shared/footer.mustache',
    });
    response = {
        'statusCode': 200,
        'body': html,
        'headers': {
            'Content-type': 'text/html'
        }
    };
    console.timeEnd('request');
    return response;
}
