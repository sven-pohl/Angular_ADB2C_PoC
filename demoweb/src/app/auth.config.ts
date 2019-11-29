import { AuthConfig } from 'angular-oauth2-oidc';

export const DiscoveryDocumentConfig = {
  url : "https://azuregeek.b2clogin.com/azuregeek.onmicrosoft.com/v2.0/.well-known/openid-configuration?p=b2c_1_susi"
}

export const authConfig: AuthConfig = {
  redirectUri: window.location.origin + '/index.html',
  responseType: 'token id_token',
  issuer: 'https://azuregeek.b2clogin.com/7b918f59-f55d-4d3e-8f45-58502a7684f7/v2.0/',
  strictDiscoveryDocumentValidation: false,
  tokenEndpoint: 'https://azuregeek.b2clogin.com/azuregeek.onmicrosoft.com/oauth2/v2.0/token?p=b2c_1_susi',
  loginUrl: 'https://azuregeek.b2clogin.com/azuregeek.onmicrosoft.com/oauth2/v2.0/token?p=b2c_1_susi',
  clientId: '447115e9-7562-4755-bd5b-5badb1b2230e',
  scope: 'openid profile https://azuregeek.onmicrosoft.com/demoapi/user_impersonation',
  skipIssuerCheck: true,
  clearHashAfterLogin: true,
  oidc: true,
}