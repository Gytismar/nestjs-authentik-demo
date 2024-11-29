import { FakeAuthServiceConfig } from "../auth/classes/fake-auth.service";
import { OAuth2ServiceConfig } from "../auth/classes/oauth2.service";
import { Role } from "../auth/user.entity";

export const environment = {
  production: false,
  useFakeAuth: false,
  fakeAuthConfig: {
    loggedIn: true,
    userOverrides: {
      /* Usage example: */
      // username: 'somename'
      // roles: [Role.Viewer]
    }
  } satisfies FakeAuthServiceConfig,
  oAuth2Config: {
    clientId: 'NIC1m9rgpXsmX4jXaC13qFAsIaMFv2TmQxSrgLsF',
    issuerUri: 'http://localhost/application/o/netix/',
    redirectUri: window.location.origin + '/auth/callback',
    responseType: 'code',
    scope: 'openid profile email offline_access',
    useDebugLogging: true,
  } satisfies Partial<OAuth2ServiceConfig>,
};
