import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { QuizComponent } from './quiz/quiz.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AddQuizComponent } from './admin-dashboard/add-quiz/add-quiz.component';
import { RankDetailsComponent } from './rank-details/rank-details.component';

const routes: Routes = [
  {path:"login", component: LoginComponent},
  {path: "dashboard", component: DashboardComponent},
  {path: "quiz", component: QuizComponent},
  {path: "admin", component: AdminDashboardComponent},
  {path: "addQuiz", component: AddQuizComponent},
  {path: "ranks", component: RankDetailsComponent},
  {path:"", redirectTo:"/login", pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
