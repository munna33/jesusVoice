import { Component } from '@angular/core';
import { ResultService } from '../services/result.service';
import { config } from '../config/config';

@Component({
  selector: 'app-online-final-exam-leader-board',
  templateUrl: './online-final-exam-leader-board.component.html',
  styleUrls: ['./online-final-exam-leader-board.component.scss'],
})
export class OnlineFinalExamLeaderBoardComponent {
  rankDetails: any[] = [];
  userDetails: any = {};
  appType = localStorage.getItem('appType') || 'OLD_NEW';
  expandedIndex: number | null = null;


  constructor(private resultService: ResultService) {}
  ngOnInit() {
    this.userDetails = JSON.parse(localStorage.getItem('user') as string);
    const shhetID = config.GOOGLE_SHEETS_B5.FINAL_QUIZ_RESULTS.OLD_NEW;
    this.resultService.getFinalExamResults(shhetID, this.appType).subscribe((data: any) => {
      this.rankDetails = this.getRanks(data);
    });
  }
  getRanks(data: any) {
    let result: any[] = [];
    Object.entries(data).forEach(([_,item] : any) => {
        let obj: {registrationID: any, totalScore: any, name: any} = {} as any;
        obj['registrationID'] = item['registrationID'];
        obj['totalScore'] = item['totalScore'];
        obj['name'] = item['name'];
        result.push(obj);
    });
    result = result.sort((a, b) => Number(b['totalScore']) - Number(a['totalScore']));
    result = this.getFinalExamRank(result);
    return this.getRanksWithTies(result);
  }
  getRanksWithTies(data: any[]) {
    let result = data.sort((a, b) => b['totalScore'] - a['totalScore']);
    let currentRank = 1;
    let currentScore = result[0]?.['totalScore'] ?? 0;
    result = result.map((entry, index) => {
      const rank =
        entry['totalScore'] === currentScore ? currentRank : currentRank + 1;

      if (entry['totalScore'] !== currentScore) {
        currentRank = currentRank + 1;
      }
      currentScore = entry['totalScore'];

      return { ...entry, rank };
    });
    
    // Step 4: Return final ranked list sorted by ascending rank
    return result.sort((a: any, b: any) => a.rank - b.rank);
  }
  getFinalExamRank(result: any[]) {
    let onlineQuizResults = JSON.parse(sessionStorage.getItem('onlineQuizRanks') || '[]');
    let quizResults= JSON.parse(sessionStorage.getItem('rankDetails') || '[]');
    quizResults = this.calculateTotalMarks(quizResults, this.appType === 'OLD_NEW' ? 150 : 130, this.appType === 'OLD_NEW' ? 20 : 10, 'noOfDays','registrationID');
    onlineQuizResults = this.calculateTotalMarks(onlineQuizResults, this.appType === 'OLD_NEW' ? 150 : 40, this.appType === 'OLD_NEW' ? 20 : 10, 'Total Score','Registration ID');
    let finalResults: any[] = []; 
    result.forEach((item) => {
      let quizObj = quizResults.find((q: any) => q.registrationID.toUpperCase() === item.registrationID.toUpperCase());
      let onlineQuizObj = onlineQuizResults.find((o: any) => o.registrationID.toUpperCase() === item.registrationID.toUpperCase());
      let totalScore = parseFloat(this.appType === 'OLD_NEW' ? item.totalScore : 2 * item.totalScore);
      if(quizObj) {
        totalScore += parseFloat(quizObj.totalScore);
      }
      if(onlineQuizObj) {
        totalScore += parseFloat(onlineQuizObj.totalScore);
      }
      finalResults.push({
        registrationID: item.registrationID,
        name: item.name,
        dailyQuizCalculatedScore: quizObj ? quizObj.totalScore : 0,
        onlineQuizCalculatedScore: onlineQuizObj ? onlineQuizObj.totalScore : 0,
        finalExamScore: this.appType === 'OLD_NEW' ? item.totalScore : 2 *item.totalScore,
        totalScore: parseFloat(totalScore.toFixed(2)),
        noOfDaysAttempted: quizObj ? quizObj.yourScore : 0,
        onlineQuizScore: onlineQuizObj ? onlineQuizObj.yourScore : 0,
      });
    });
    sessionStorage.setItem('finalExamRanks', JSON.stringify(finalResults));
    return finalResults;
  }
  calculateTotalMarks(data: any, total: any, weightPercent: any, key: string, registrationKey: string) {
   let result: {registrationID: any, yourScore: any, totalScore: number}[] = [];
    data.forEach((item: any) => {
      let obj: {registrationID: any, yourScore: any,totalScore: number} = {registrationID: item[registrationKey],yourScore: item[key], totalScore: item[key] ? this.weightedOutOf20(Number(item[key]), total, weightPercent) : 0};
      result.push(obj);
    });
    return result;
  }
  weightedOutOf20(score: number, total = 150, weightPercent = 20): number {
    const percentage = this.appType === 'OLD_NEW' ? 20 : 10;
    if (total <= 0) return 0;
    const weightedScore = (score / total) * weightPercent;
    return weightedScore > percentage ? percentage : parseFloat(weightedScore.toFixed(2));
  }
  toggleDetails(index: number) {
    this.expandedIndex = this.expandedIndex === index ? null : index;
  }
}
