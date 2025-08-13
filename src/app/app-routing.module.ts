import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { QuizComponent } from './quiz/quiz.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AddQuizComponent } from './admin-dashboard/add-quiz/add-quiz.component';
import { RankDetailsComponent } from './rank-details/rank-details.component';
import { OnlineQuizComponent } from './online-quiz/online-quiz/online-quiz.component';
import { OnlineQuizChaptersComponent } from './online-quiz-chapters/online-quiz-chapters/online-quiz-chapters.component';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { LeaderBoardComponent } from './leader-board/leader-board.component';
import { AboutComponent } from './about/about.component';

const routes: Routes = [
  {path:"login", component: LoginComponent},
  {path:"about", component: AboutComponent},
  {path:"welcome", component: WelcomePageComponent},
  {path: "dashboard", component: DashboardComponent},
  {path: "quiz", component: QuizComponent},
  {path: "admin", component: AdminDashboardComponent},
  {path: "addQuiz", component: AddQuizComponent},
  {path: 'leaderBoard', component: LeaderBoardComponent},
  {path: "ranks", component: RankDetailsComponent},
  {path: "online-quiz", component: OnlineQuizComponent},
  {path: "online-quiz-chapters", component: OnlineQuizChaptersComponent},
  {path:"", redirectTo:"/welcome", pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
