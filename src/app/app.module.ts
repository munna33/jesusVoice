import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeaderComponent } from './header/header.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { QuizComponent } from './quiz/quiz.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { TabsModule} from 'ngx-bootstrap/tabs';
import { UserManagmentComponent } from './admin-dashboard/user-managment/user-managment.component'; 
import { QuizManagmentComponent } from './admin-dashboard/quiz-managment/quiz-managment.component';
import { AddQuizComponent } from './admin-dashboard/add-quiz/add-quiz.component';
import { ResultComponent } from './admin-dashboard/result/result.component';
import { AddUserComponent } from './admin-dashboard/add-user/add-user.component';
import { HttpClientModule } from '@angular/common/http';
import { ModalPopupComponent } from './modal-popup/modal-popup.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { RankDetailsComponent } from './rank-details/rank-details.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    HeaderComponent,
    QuizComponent,
    AdminDashboardComponent,
    UserManagmentComponent,
    QuizManagmentComponent,
    AddQuizComponent,
    ResultComponent,
    AddUserComponent,
    ModalPopupComponent,
    RankDetailsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    CarouselModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ModalModule.forRoot(),  
    TabsModule.forRoot(),
    AccordionModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
