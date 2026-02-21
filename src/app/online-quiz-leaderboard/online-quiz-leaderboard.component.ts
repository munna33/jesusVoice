import { Component } from '@angular/core';
import { ResultService } from '../services/result.service';
import { config } from '../config/config';

@Component({
  selector: 'app-online-quiz-leaderboard',
  templateUrl: './online-quiz-leaderboard.component.html',
  styleUrls: ['./online-quiz-leaderboard.component.scss'],
})
export class OnlineQuizLeaderboardComponent {
  rankDetails: any = {};
  userDetails: any = {};
  constructor(private resultService: ResultService) {}
  ngOnInit() {
    this.userDetails = JSON.parse(localStorage.getItem('user') as string);
    const shhetID =config.GOOGLE_SHEETS_B6.ONLINE_QUIZ_RESULTS;
    if (!sessionStorage.getItem('onlineQuizRanks')) {
      if (!sessionStorage.getItem('onlineQuizRanksDetails')) {
        this.resultService
          .getOnlineQuizDetails(shhetID)
          .subscribe((data: any) => {
            sessionStorage.setItem(
              'onlineQuizRanksDetails',
              JSON.stringify(data)
            );
            
            this.rankDetails = this.getRanks(data);
             sessionStorage.setItem(
        'onlineQuizRanks',
        JSON.stringify(this.rankDetails)
      );
          });
      } 
      else {
        this.rankDetails = this.getRanks(
          JSON.parse(sessionStorage.getItem('onlineQuizRanksDetails') as string)
        );
          sessionStorage.setItem(
        'onlineQuizRanks',
        JSON.stringify(this.rankDetails))
      }
     
    } else {
      this.rankDetails = JSON.parse(
        sessionStorage.getItem('onlineQuizRanks') as string
      );
    }
  }
  getRanks(data: any) {
    // Step 1: Group by title
    const titleMap: Record<string, any> = {};

    Object.entries(data).forEach(([weekKey, items]: any) => {
      items.forEach((item: any) => {
        // const { title, score } = item;

        if (!titleMap[item['Registration ID']]) {
          titleMap[item['Registration ID']] = { 'Total Score': 0, noOfAttemps: 0 };
        }

        titleMap[item['Registration ID']][weekKey] = item;
        titleMap[item['Registration ID']]['Total Score'] += parseFloat(item['Your Score']);
        titleMap[item['Registration ID']].noOfAttemps += 1;
        titleMap[item['Registration ID']] = {
          ...titleMap[item['Registration ID']],
          "Registration ID": item['Registration ID'],
        };
      });
    });

    // Step 2: Convert to array
    const mergedArray = Object.entries(titleMap).map(([title, entry]) => ({
      ...entry,
    }));

    // Step 3: Apply rank with tie handling

    let result = mergedArray.sort((a, b) => b['Total Score'] - a['Total Score']);
    let currentRank = 1;
    let currentScore = result[0]?.['Total Score'] ?? 0;
    result = result.map((entry, index) => {
      const rank =
        entry['Total Score'] === currentScore ? currentRank : currentRank + 1;

      if (entry['Total Score'] !== currentScore) {
        currentRank = currentRank + 1;
      }
      currentScore = entry['Total Score'];

      return { ...entry, rank };
    });
    // Step 4: Return final ranked list sorted by ascending rank
    return result.sort((a: any, b: any) => a.rank - b.rank);
  }
}
