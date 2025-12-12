import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { config } from 'src/app/config/config';
import { ResultService } from 'src/app/services/result.service';

@Component({
  selector: 'app-online-quiz-chapters',
  templateUrl: './online-quiz-chapters.component.html',
  styleUrls: ['./online-quiz-chapters.component.scss'],
})
export class OnlineQuizChaptersComponent {
  questionData: any;
  userDetails: any;
  loader: boolean = true;
  appType: string = '';
  constructor(private resultService: ResultService, private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.userDetails = navigation.extras.state['user'];
    }
  }
  ngOnInit() {
    this.appType = sessionStorage.getItem('appType') as string;
    let quizDetailsID =
      this.appType === 'OLD_NEW'
        ? config.GOOGLE_SHEETS_B5.ONLINE_QUIZ.OLD_NEW
        : config.GOOGLE_SHEETS_B5.ONLINE_QUIZ.NEW;
    let quizResultID =
      this.appType === 'OLD_NEW'
        ? config.GOOGLE_SHEETS_B5.ONLINE_QUIZ_RESULTS.OLD_NEW
        : config.GOOGLE_SHEETS_B5.ONLINE_QUIZ_RESULTS.NEW;

    if (sessionStorage.getItem('quizChapters')) {
      this.loader = false;
      this.questionData = JSON.parse(
        sessionStorage.getItem('quizChapters') as any
      );
      this.loadQuizRankData(quizResultID, this.questionData)
    } else {
      this.resultService.getOnlineQuiz(quizDetailsID).subscribe((data) => {
        if (data) {
          // this.questionData = data;
          this.loadQuizRankData(quizResultID, data)
        }
      });
    }
  }
  loadQuizRankData(quizResultID: any, data: any) {
    if (!sessionStorage.getItem('onlineQuizRanksDetails')) {
            this.resultService
              .getOnlineQuizDetails(quizResultID)
              .subscribe((resultData: any) => {
                this.questionData = this.formatQuizData(data, resultData);
                sessionStorage.setItem('onlineQuizRanksDetails', JSON.stringify(resultData))
                this.loader = false;
              });
          } else {
            this.questionData = this.formatQuizData(data,JSON.parse(sessionStorage.getItem('onlineQuizRanksDetails')as string))
            this.loader = false;
          }
  }
  formatQuizData(questionData: any, resultData: any) {
    let result: any = {};
    Object.keys(questionData).forEach((item: any, index: any) => {
      if (resultData.hasOwnProperty(item.trim())) {
        result[item] = {
          Questions: questionData[item.trim()].Questions || questionData[item.trim()],
          'Your Score': this.getYourQuizScore(
            resultData[item.trim()],
            'Your Score'
          ),
          'Total Score': this.getYourQuizScore(
            resultData[item.trim()],
            'Total Score'
          ),
        };
      } else {
        result[item] = { Questions: questionData[item.trim()] || questionData[item.trim()] };
      }
    });
    sessionStorage.setItem('quizChapters', JSON.stringify(result));
    return result;
  }

  getYourQuizScore(resultData: any, key: any): any {
    let result = resultData.find(
      (item: any) =>
        item['Registration ID'].trim() == this.userDetails?.RegID?.trim()
    );
    return result && result[key] ? result[key] : '';
  }
  getChapters() {
    if (this.questionData) {
      return Object.keys(this.questionData).reverse();
    }
    return [];
  }
  launchQuiz(option: string) {
    this.router.navigateByUrl('/bible-study/online-quiz', {
      state: {
        quizData: this.questionData[option].Questions,
        user: this.userDetails,
        chapterName: option,
      },
    });
    // this.router.navigateByUrl('/online-quiz', {state: {quizData: this.getRandomUniqueItems(this.questionData[option].Questions,option=='Online Exam 1'?50: 30), user: this.userDetails, chapterName: option}})
  }
  getRandomUniqueItems(array: any, count: number) {
    if (count > array.length) {
      throw new Error('Count cannot be greater than the array length');
    }
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
  goToDashboard() {
    this.router.navigateByUrl('/bible-study/dashboard');
  }
  getFontColor(option: any) {
    if (this.questionData[option]['Your Score']) {
      return (this.questionData[option]['Your Score'] /
        this.questionData[option]['Total Score']) *
        100 >=
        70
        ? 'green'
        : 'red';
    }
    return;
  }
  checkQuizOption(quizID: any) {
    if (this.questionData[quizID]['Your Score']) {
      return true;
    } else {
      return false;
    }
  }
  chapterScore(option: any) {
    if (this.questionData[option]['Your Score']) {
      return (
        this.questionData[option]['Your Score'] +
        ' / ' +
        this.questionData[option]['Total Score']
      );
    } else {
      return '';
    }
  }
}
