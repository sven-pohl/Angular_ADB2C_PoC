import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  isAuthorized: boolean;
  isAuthorizedSubscription: Subscription;
  apiResult: string;
  userDataSubscription: Subscription;
  userData: any;

  constructor(private oidcSecurityService: OidcSecurityService, private http: HttpClient) {
    this.isAuthorized = false;
    if (this.oidcSecurityService.moduleSetup) {
      this.doCallbackLogicIfRequired();
  } else {
      this.oidcSecurityService.onModuleSetup.subscribe(() => {
          this.doCallbackLogicIfRequired();
      });
  }
  }

  ngOnInit() {
    this.isAuthorizedSubscription = this.oidcSecurityService.getIsAuthorized()
      .subscribe(isAuthorized => this.isAuthorized = isAuthorized);

   this.userDataSubscription = this.oidcSecurityService.getUserData()
    .subscribe(userData => this.userData = userData);
  }

  ngOnDestroy() {
    this.isAuthorizedSubscription.unsubscribe();
  }

  signUp() {
    this.oidcSecurityService.authorize();
  }

  signOut() {
    this.oidcSecurityService.logoff();
  }

  callApi() {
    const token = this.oidcSecurityService.getToken();
    const apiURL = 'https://localhost:5001/api/values';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get(apiURL, { headers: headers }).subscribe(
        response => this.apiResult = JSON.stringify(response),
        error => console.log(error));
  }

  private doCallbackLogicIfRequired() {
      // Will do a callback, if the url has a code and state parameter.
      this.oidcSecurityService.authorizedCallback(window.location.toString());
  }
}
