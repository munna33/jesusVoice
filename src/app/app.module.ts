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
import { ExamResultsModalPopupComponent } from './exam-results-modal-popup/exam-results-modal-popup.component';
import { OnlineQuizComponent } from './online-quiz/online-quiz/online-quiz.component';
import { OnlineQuizChaptersComponent } from './online-quiz-chapters/online-quiz-chapters/online-quiz-chapters.component';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { LeaderBoardComponent } from './leader-board/leader-board.component';
import { OnlineQuizLeaderboardComponent } from './online-quiz-leaderboard/online-quiz-leaderboard.component';
import { WeeklyPuzzleLeaderboardComponent } from './weekly-puzzle-leaderboard/weekly-puzzle-leaderboard.component';
import { AboutComponent } from './about/about.component';
import { PaginationModule,PaginationConfig } from 'ngx-bootstrap/pagination';
import { HomeComponent } from './home/home.component';
import { BibleStudyComponent } from './bible-study/bible-study.component';
import { CommonModule } from '@angular/common';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { PrayerRequestComponent } from './prayer-request/prayer-request.component';
import { UserRegisterComponent } from './user-register/user-register.component';
import { RegistrationidModalComponent } from './registrationid-modal/registrationid-modal.component';
import { NgPipesModule } from 'ngx-pipes';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    BibleStudyComponent,
    HeaderComponent,
    PrayerRequestComponent,
    UserRegisterComponent,
    RegistrationidModalComponent,
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
  ],
  providers: [PaginationConfig],
  bootstrap: [AppComponent],
  exports: [HeaderComponent]
})
export class AppModule { }
