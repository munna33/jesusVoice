import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TabsModule} from 'ngx-bootstrap/tabs';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PaginationConfig } from 'ngx-bootstrap/pagination';
import { HomeComponent } from './home/home.component';
import { BibleStudyComponent } from './bible-study/bible-study.component';
import { CommonModule } from '@angular/common';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { PrayerRequestComponent } from './prayer-request/prayer-request.component';
import { UserRegisterComponent } from './user-register/user-register.component';
import { RegistrationidModalComponent } from './registrationid-modal/registrationid-modal.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { AdsenseComponent } from './adsense/adsense.component';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    BibleStudyComponent,
    HeaderComponent,
    PrayerRequestComponent,
    UserRegisterComponent,
    RegistrationidModalComponent,
    PrivacyPolicyComponent,
    AdsenseComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CollapseModule.forRoot(),
    HttpClientModule,
    ModalModule.forRoot(),
    TabsModule.forRoot(),
    AccordionModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [PaginationConfig],
  bootstrap: [AppComponent],
  exports: [HeaderComponent]
})
export class AppModule { }
