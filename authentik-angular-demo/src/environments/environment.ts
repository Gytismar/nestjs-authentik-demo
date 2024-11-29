import { FakeAuthServiceConfig } from "../auth/classes/fake-auth.service";
import { OAuth2ServiceConfig } from "../auth/classes/oauth2.service";

export const environment = {
  production: true,
  useFakeAuth: false,
  fakeAuthConfig: {} satisfies FakeAuthServiceConfig,
  oAuth2Config: {
    clientId: 'NIC1m9rgpXsmX4jXaC13qFAsIaMFv2TmQxSrgLsF',
    issuerUri: 'http://localhost/application/o/netix/',
    redirectUri: window.location.origin + '/auth/callback',
    responseType: 'code',
    scope: 'openid profile email offline_access',
    useDebugLogging: false,
  } satisfies Partial<OAuth2ServiceConfig>,
};
