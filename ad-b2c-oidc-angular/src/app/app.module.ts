import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { RedirectComponent } from './redirect/redirect.component';
import { HomeComponent } from './home/home.component';
import { environment } from './../environments/environment';

import {
    AuthModule,
    ConfigResult,
    OidcSecurityService,
    OpenIdConfiguration,
    OidcConfigService
} from 'angular-auth-oidc-client';

export function loadConfig(oidcConfigService: OidcConfigService) {
    console.log('APP_INITIALIZER STARTING');
    return () => oidcConfigService.load_using_custom_stsServer('https://azuregeek.b2clogin.com/7b918f59-f55d-4d3e-8f45-58502a7684f7/b2c_1_susi/v2.0/.well-known/openid-configuration');
}

const appRoutes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'redirect.html', component: RedirectComponent }
];

@NgModule({
    declarations: [
        AppComponent,
        RedirectComponent,
        HomeComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        AuthModule.forRoot(),
        RouterModule.forRoot(appRoutes),
    ],
    providers: [
        OidcConfigService,
        {
            provide: APP_INITIALIZER,
            useFactory: loadConfig,
            deps: [OidcConfigService],
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {

    constructor(
        private oidcSecurityService: OidcSecurityService,
        private oidcConfigService: OidcConfigService,
    ) {
        this.oidcConfigService.onConfigurationLoaded.subscribe((configResult: ConfigResult) => {

            const openIDImplicitFlowConfiguration : OpenIdConfiguration = {
              stsServer: 'https://azuregeek.b2clogin.com/7b918f59-f55d-4d3e-8f45-58502a7684f7/b2c_1_susi/v2.0/',
              redirect_url: 'http://localhost:4200/redirect.html',
              client_id: '447115e9-7562-4755-bd5b-5badb1b2230e',
              response_type: 'id_token token',
              scope: 'openid profile https://azuregeek.onmicrosoft.com/demoapi/user_impersonation',
              post_logout_redirect_uri: 'http://localhost:4200',
              post_login_route: '/home',
              forbidden_route: '/home',
              unauthorized_route: '/home',
              auto_userinfo: false,
              log_console_warning_active: true,
              log_console_debug_active: !environment.production,
              max_id_token_iat_offset_allowed_in_seconds: 30,
            }

            this.oidcSecurityService.setupModule(openIDImplicitFlowConfiguration, configResult.authWellknownEndpoints);

        });

        console.log('APP STARTING');
    }
}
