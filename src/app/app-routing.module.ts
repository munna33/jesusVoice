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
import { HomeComponent } from './home/home.component';
import { CommonModule } from '@angular/common';

const routes: Routes = [
  {path:"home", component: HomeComponent},
  {path:"bible-study", loadChildren: () => import('./bible-study/bible-study.module').then(m => m.BibleStudyModule)},
  {path:"", redirectTo:"/home", pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
