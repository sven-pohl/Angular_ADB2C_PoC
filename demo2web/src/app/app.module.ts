import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AuthModule, ConfigResult, OidcConfigService, OidcSecurityService, OpenIdConfiguration } from 'angular-auth-oidc-client';
import { AppComponent } from './app.component';
import { RedirectComponent } from './redirect/redirect.component';
import { HomeComponent } from './home/home.component';
import { BrowserDetailsComponent } from './browser-details/browser-details.component';

export function loadConfig(oidcConfigService: OidcConfigService) {
    console.log('APP_INITIALIZER STARTING');
    return () => oidcConfigService.load_using_custom_stsServer('https://azuregeek.b2clogin.com/7b918f59-f55d-4d3e-8f45-58502a7684f7/b2c_1_susi/v2.0/.well-known/openid-configuration');
}

const appRoutes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'forbidden', component: HomeComponent },
  { path: 'unauthorized', component: HomeComponent },
  { path: 'redirect.html', component: RedirectComponent }
];

@NgModule({
    declarations: [
      AppComponent,
      RedirectComponent,
      HomeComponent,
      BrowserDetailsComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes),
        AuthModule.forRoot(),
    ],
    providers: [
        OidcConfigService,
        {
            provide: APP_INITIALIZER,
            useFactory: loadConfig,
            deps: [OidcConfigService],
            multi: true,
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {
    constructor(private oidcSecurityService: OidcSecurityService, private oidcConfigService: OidcConfigService) {
        this.oidcConfigService.onConfigurationLoaded.subscribe((configResult: ConfigResult) => {
            const config: OpenIdConfiguration = {
                stsServer: configResult.customConfig.stsServer,
                redirect_url: 'http://localhost:4200/',
                //redirect_url: 'http://localhost:4200/redirect.html',
                client_id: '447115e9-7562-4755-bd5b-5badb1b2230e',
                scope: 'openid profile https://azuregeek.onmicrosoft.com/demoapi/user_impersonation',
                //response_type: 'id_token token',
                response_type: 'code',
                log_console_warning_active: true,
                log_console_debug_active: true,
                auto_userinfo: false,
                post_logout_redirect_uri: window.location.origin + '/home',

                forbidden_route: '/forbidden',
                // HTTP 401
                unauthorized_route: '/unauthorized',
                max_id_token_iat_offset_allowed_in_seconds: 10,

                silent_renew: true,
                silent_renew_url: 'https://localhost:4200/silent-renew.html',
            };

            this.oidcSecurityService.setupModule(config, configResult.authWellknownEndpoints);
        });
    }
}