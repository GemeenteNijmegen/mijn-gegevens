import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { ApiClient } from '@gemeentenijmegen/apiclient';

import { Response } from '@gemeentenijmegen/apigateway-http/lib/V2/Response';
import { Session } from '@gemeentenijmegen/session';
import { BrpApi } from './BrpApi';
import * as template from './templates/persoonsgegevens.mustache';
import { render } from '../../shared/render';

interface Config {
  apiClient: ApiClient;
  dynamoDBClient: DynamoDBClient;
  showZaken?: boolean; // show the 'Mijn Zaken' menu
}

export class PersoonsgegevensRequestHandler {
  private config: Config;
  constructor(config: Config) {
    this.config = config;
  }

  async handleRequest(cookies: string) {
    console.time('request');
    console.timeLog('request', 'start request');
    console.timeLog('request', 'finished init');
    let session = new Session(cookies, this.config.dynamoDBClient);
    await session.init();
    console.timeLog('request', 'init session');
    if (session.isLoggedIn() == true) {
      // Get API data
      const response = await this.handleLoggedinRequest(session);
      console.timeEnd('request');
      return response;
    }
    console.timeEnd('request');
    return Response.redirect('/login');
  }

  private async handleLoggedinRequest(session: Session) {
    console.timeLog('request', 'Api Client init');
    const bsn = session.getValue('bsn');
    const brpApi = new BrpApi(this.config.apiClient);
    console.timeLog('request', 'Brp Api');

    const brpData = await brpApi.getBrpData(bsn);
    const data = brpData;
    data.volledigenaam = session.getValue('username');

    data.title = 'Persoonsgegevens';
    data.shownav = true;
    // render page
    const html = await render(data, template.default);
    return Response.html(html, 200, session.getCookie());
  }

}

