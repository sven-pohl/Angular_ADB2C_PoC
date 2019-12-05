import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OAuthService, NullValidationHandler, JwksValidationHandler } from 'angular-oauth2-oidc';
import { authConfig, DiscoveryDocumentConfig, authConfigPkce } from './auth.config';

@Component({
  selector: 'app-root',
  template: `
  <h1 *ngIf="!claims">
  Hi!
  </h1>
  
  <h1 *ngIf="claims">
  Hi, {{claims.given_name}}!
  </h1>
  
  <h2 *ngIf="claims">Your Claims:</h2>
  
  <pre *ngIf="claims">
  {{claims | json}}
  </pre>
  <br />
  
  <div *ngIf="!claims">
  <button (click)="login()">Login</button>
  </div>
  
  <div *ngIf="claims">
    <button (click)="refreshToken()">Refresh</button>
    <button (click)="logout()">Logout</button>
    <button (click)="getMessage()">API Call</button>
    <div *ngIf="message">
      Response:
      {{message | json}}
    </div>
    <div *ngIf="accessTokenExpirationDate">
      Token expires at {{accessTokenExpirationDate.toLocaleString()}}
      <br />
      Refreshed:
      <ul>
        <li *ngFor="let refreshTime of refreshTimes">
          {{refreshTime}}
        </li>
      </ul>
    </div>
  </div>
  `,
  styles: []
})
export class AppComponent {
  constructor(private http: HttpClient, private oauthService: OAuthService) {
    //this.configure();
    this.configurePkce();
    
    if(oauthService.hasValidAccessToken()){
      this.refreshTimes.push(new Date(Date.now()).toLocaleString());
    }
  }

  message: string;
  refreshTimes: Array<string> = [];

  public getMessage() {
    this.http.get("https://localhost:5001/api/values", { responseType: 'text' })
      .subscribe(r => {
        this.message = r
        console.log("message: ", this.message);
      });
  }

  public login() {
    this.oauthService.initLoginFlow();
    this.refreshTimes.push(new Date(Date.now()).toLocaleString());
  }

  public logout() {
    this.oauthService.logOut();
  }

  public refreshToken() {
    if (!this.oauthService.hasValidAccessToken()) {
      this.oauthService.silentRefresh()
        .then(info => { 
          console.debug('refresh ok', info) 
          this.refreshTimes.push(new Date(Date.now()).toLocaleString())})
        .catch(err => console.error('refresh error', err));
      }
    else {
      console.log("Token is still valid")
    };
  }

  public get claims() {
    let claims = this.oauthService.getIdentityClaims();
    return claims;

  }

  public get accessTokenExpirationDate() {
    let accessTokenExpirationDate = new Date(this.oauthService.getAccessTokenExpiration());
    return accessTokenExpirationDate;
  }

  private configure() {
    this.oauthService.configure(authConfig);
    this.oauthService.tokenValidationHandler = new NullValidationHandler();
    this.oauthService.loadDiscoveryDocument(DiscoveryDocumentConfig.url)
    this.oauthService.setupAutomaticSilentRefresh();
    this.oauthService.tryLoginImplicitFlow();
  }

  private configurePkce() {
    this.oauthService.configure(authConfigPkce);
    this.oauthService.tokenValidationHandler = new JwksValidationHandler();
    this.oauthService.loadDiscoveryDocument(DiscoveryDocumentConfig.url);
    this.oauthService.setupAutomaticSilentRefresh();
    this.oauthService.tryLoginCodeFlow();
  }

}