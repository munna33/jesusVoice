import { Component } from '@angular/core';
import { ResultService } from '../services/result.service';
import { config } from '../config/config';

@Component({
  selector: 'app-weekly-puzzle-leaderboard',
  templateUrl: './weekly-puzzle-leaderboard.component.html',
  styleUrls: ['./weekly-puzzle-leaderboard.component.scss'],
})
export class WeeklyPuzzleLeaderboardComponent {
  rankDetails: any = {};
  userDetails: any = {};
  constructor(private resultService: ResultService) {}
  ngOnInit() {
    this.userDetails = JSON.parse(localStorage.getItem('user') as string);
    const shhetID =
      localStorage.getItem('appType') === 'OLD_NEW'
        ? config.GOOGLE_SHEETS_B5.PUZZLE.OLD_NEW
        : config.GOOGLE_SHEETS_B5.PUZZLE.NEW;
    if (!sessionStorage.getItem('puzzleRanks')) {
      this.resultService
        .getPuzzleRankDetails({appType: localStorage.getItem('appType')})
        .subscribe((data: any) => {
          // this.rankDetails = data['GENISIS/ఆదికాండము'];
          this.rankDetails = this.getRanks(data);
          sessionStorage.setItem(
            'puzzleRanks',
            JSON.stringify(this.rankDetails)
          );
        });
    } else {
      this.rankDetails = JSON.parse(sessionStorage.getItem('puzzleRanks') as string)
    }
  }
  getRanks(data: any) {
    // Step 1: Group by title
    const titleMap: Record<string, any> = {};

    Object.entries(data).forEach(([weekKey, items]: any) => {
      items.forEach((item: any) => {
        // const { title, score } = item;

        if (!titleMap[item.RegistrationID]) {
          titleMap[item.RegistrationID] = { totalScore: 0, noOfAttemps: 0 };
        }

        titleMap[item.RegistrationID][weekKey] = item;
        titleMap[item.RegistrationID].totalScore += parseFloat(item.YourScore);
        titleMap[item.RegistrationID].noOfAttemps += 1;
        titleMap[item.RegistrationID] = {
          ...titleMap[item.RegistrationID],
          RegistrationID: item.RegistrationID,
        };
      });
    });
    // Step 2: Convert to array
    const mergedArray = Object.entries(titleMap).map(([title, entry]) => ({
      ...entry,
    }));

    // Step 3: Apply rank with tie handling
    let result = mergedArray.sort((a, b) => b.totalScore - a.totalScore);
    let currentRank = 1;
    let currentScore = result[0]?.totalScore ?? 0;
    result = result.map((entry, index) => {
      const rank =
        entry.totalScore === currentScore ? currentRank : currentRank + 1;

      if (entry.totalScore !== currentScore) {
        currentRank = currentRank + 1;
      }
      currentScore = entry.totalScore;

      return { ...entry, rank };
    });
    // Step 4: Return final ranked list sorted by ascending rank
    return result.sort((a: any, b: any) => a.rank - b.rank);
  }
}
