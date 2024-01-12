import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { ApiClient } from '@gemeentenijmegen/apiclient';

import { Response } from '@gemeentenijmegen/apigateway-http/lib/V2/Response';
import { Session } from '@gemeentenijmegen/session';
import { BrpApi } from './BrpApi';
import * as template from './templates/persoonsgegevens.mustache';
import { MdiFileMultiple } from '../../shared/Icons';
import { nav } from '../../shared/nav';
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
    const zakenNav = {
      url: '/zaken',
      title: 'Zaken',
      description: 'Bekijk de status van uw zaken en aanvragen.',
      label: 'Bekijk zaken',
      icon: MdiFileMultiple.default,
    };
    if (config?.showZaken) {
      nav.push(zakenNav);
    }
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

    const userType = session.getValue('user_type');
    // Companies can log in, but can't use this page.
    if (userType != 'person') {
      return Response.redirect('/');
    }
    const bsn = session.getValue('identifier');

    const brpApi = new BrpApi(this.config.apiClient);
    console.timeLog('request', 'Brp Api');

    const brpData = await brpApi.getBrpData(bsn);
    const data = brpData;
    data.volledigenaam = session.getValue('username');

    data.title = 'Persoonsgegevens';
    data.shownav = true;
    data.nav = nav;
    // render page
    const html = await render(data, template.default);
    return Response.html(html, 200, session.getCookie());
  }

}

