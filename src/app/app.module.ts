import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ImagesliderComponent } from './imageslider/imageslider.component';
import { AsideComponent } from './aside/aside.component';
import { EventComponent } from './event/event.component';
import { RouterModule, Routes }   from '@angular/router';
import { GalleryComponent } from './gallery/gallery.component';
import { ContactComponent } from './contact/contact.component';
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { MainComponent } from './main/main.component';
import { GetEventServiceService } from './get-event-service.service';
import { HttpModule } from '@angular/http';
var appRoute: Routes =[
       {path:'',component:HomeComponent,pathMatch: 'full'},
        
      {
        path: 'events',
        component: EventComponent
      },
       {
        path: 'gallery',
        component: GalleryComponent
      }, {
        path: 'contact',
        component: ContactComponent
      }, {
        path: 'about',
        component: AboutComponent
      },
      {
        path: 'login',
        component: LoginComponent
      },
    ];
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NavbarComponent,
    ImagesliderComponent,
    AsideComponent,
    EventComponent,
    GalleryComponent,
    ContactComponent,
    AboutComponent,
    LoginComponent,
    HomeComponent,
    MainComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoute)
  ],
  providers: [GetEventServiceService],
  bootstrap: [AppComponent],
  exports:[RouterModule]
})
export class AppModule { }
