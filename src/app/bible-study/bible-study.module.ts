import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BibleStudyComponent } from './bible-study.component';
import { RouterModule } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { AboutComponent } from '../about/about.component';
import { DailyQuiz } from '../daily-quiz/daily-quiz';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { QuizComponent } from '../quiz/quiz.component';
import { AdminDashboardComponent } from '../admin-dashboard/admin-dashboard.component';
import { AddQuizComponent } from '../admin-dashboard/add-quiz/add-quiz.component';
import { LeaderBoardComponent } from '../leader-board/leader-board.component';
import { RankDetailsComponent } from '../rank-details/rank-details.component';
import { OnlineQuizComponent } from '../online-quiz/online-quiz/online-quiz.component';
import { OnlineQuizChaptersComponent } from '../online-quiz-chapters/online-quiz-chapters/online-quiz-chapters.component';
import { HeaderComponent } from '../header/header.component';
import { UserManagmentComponent } from '../admin-dashboard/user-managment/user-managment.component';
import { QuizManagmentComponent } from '../admin-dashboard/quiz-managment/quiz-managment.component';
import { ResultComponent } from '../admin-dashboard/result/result.component';
import { AddUserComponent } from '../admin-dashboard/add-user/add-user.component';
import { ModalPopupComponent } from '../modal-popup/modal-popup.component';
import { ExamResultsModalPopupComponent } from '../exam-results-modal-popup/exam-results-modal-popup.component';
import { OnlineQuizLeaderboardComponent } from '../online-quiz-leaderboard/online-quiz-leaderboard.component';
import { WeeklyPuzzleLeaderboardComponent } from '../weekly-puzzle-leaderboard/weekly-puzzle-leaderboard.component';
import { HomeComponent } from '../home/home.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from '../app-routing.module';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { OnlineFinalExamLeaderBoardComponent } from '../online-final-exam-leader-board/online-final-exam-leader-board.component';
import { BibleScheduleComponent } from '../bible-schedule/bible-schedule.component';
import { CalendarComponent } from '../calendar/calendar.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
    declarations: [
    LoginComponent,
    DashboardComponent,
    QuizComponent,
    AdminDashboardComponent,
    UserManagmentComponent,
    QuizManagmentComponent,
    AddQuizComponent,
    ResultComponent,
    AddUserComponent,
    ModalPopupComponent,
    RankDetailsComponent,
    ExamResultsModalPopupComponent,
    OnlineQuizComponent,
    OnlineQuizChaptersComponent,
    DailyQuiz,
    LeaderBoardComponent,
    OnlineQuizLeaderboardComponent,
    WeeklyPuzzleLeaderboardComponent,
    OnlineFinalExamLeaderBoardComponent,
    AboutComponent,
    BibleScheduleComponent,
    CalendarComponent
    ],
    imports: [
    CommonModule,
    FormsModule,
    CarouselModule,
    HttpClientModule,
    PaginationModule,
    FullCalendarModule,
    ModalModule.forChild(),
    TabsModule.forRoot(),
    AccordionModule.forRoot(),
    RouterModule.forChild([
        {
            path: '',
            component: BibleStudyComponent,
            children: [
                // Add child routes here, e.g.:
                // { path: 'details', component: BibleStudyDetailsComponent }
                { path: "login", component: LoginComponent },
                // { path: "about", component: AboutComponent },
                { path: "daily-quiz", component: DailyQuiz },
                { path: "dashboard", component: DashboardComponent },
                { path: "quiz", component: QuizComponent },
                { path: "admin", component: AdminDashboardComponent },
                { path: "addQuiz", component: AddQuizComponent },
                { path: 'leaderBoard', component: LeaderBoardComponent },
                { path: "ranks", component: RankDetailsComponent },
                { path: "online-quiz", component: OnlineQuizComponent },
                { path: "online-quiz-chapters", component: OnlineQuizChaptersComponent },
                { path: 'bible-schedule', component: BibleScheduleComponent},
                { path: "", redirectTo: "/", pathMatch: 'full' }
            ]
        }
    ]),
    TranslateModule
],
    exports: [
        
    ]
})
export class BibleStudyModule { }