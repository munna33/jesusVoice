import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { ResultService } from '../services/result.service';
import { config } from '../config/config';
import { Location } from '@angular/common';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ModalPopupComponent } from '../modal-popup/modal-popup.component';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './daily-quiz.html',
  styleUrls: ['./daily-quiz.scss'],
})
export class DailyQuiz {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;
  modalRef: BsModalRef | undefined;  
  appType: string = '';
  bibleScheduleData: any;
  today = new Date();
  yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
  todaysQuestionData: any;
  selectedAnswer: any;
  showMessage: string = '';
  showQuestion: boolean = false;
  loader: boolean = false;
  userDetails: any = {};
  enableQuizForDay: boolean = false;
  quizResultData: any = {};
  yourResult: any = {};
  selecteDayQuizData: any = {};
  ranksData: any = [];
  onlineExamRanksData: any = {};
  selectedDate: string | null = null; // yyyy-mm-dd
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',

    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: '',
    },
    events: this.formatEventsData(),
    // 🔒 LIMIT MONTHS (today & yesterday only)
    // validRange: {
    //   start: this.getMonthStart(this.yesterday),
    //   end: this.getMonthEnd(this.today)
    // },
    // 🔒 Disable selection except yesterday & today
    dateClick: (info) => {
      if (!this.isTodayOrYesterday(info.date) && !this.isFutureDate(info.date)) {
        return;
      }
      this.selectedDate = this.formatLocalDate(info.date);
      if (!this.isFutureDate(info.date)) {
        const quizData = this.bibleScheduleData.find((item: any) => {
          return item.date == info.dateStr;
        });

        this.loader = true;
        this.loadTodayQuestionData(quizData);
      } else {
        this.todaysQuestionData = {};
      }
      this.calendarComponent.getApi().render();
    },

    dayCellClassNames: (arg) => {
      const dateStr = this.formatLocalDate(arg.date);
      if (this.selectedDate === dateStr) {
        return ['selected-day'];
      }
      if (this.isTodayOrYesterday(arg.date)) {
        return ['active-day'];
      }
      if (this.isFutureDate(arg.date)) {
        return ['future-day'];
      }
      return ['disabled-day'];
    },
  };
  formatLocalDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  isFutureDate(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const d = new Date(date);
    d.setHours(0, 0, 0, 0);

    return d > today;
  }

  getMonthStart(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  getMonthEnd(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  }
  isTodayOrYesterday(date: Date): boolean {
    const d = new Date(date).toDateString();
    return (
      d === this.today.toDateString() || d === this.yesterday.toDateString()
    );
  }
  constructor(
    private resultService: ResultService,
    private location: Location,
    private modalService: BsModalService
  ) {}
  ngOnInit() {
    this.appType = localStorage.getItem('appType') as string;
    this.userDetails = JSON.parse(localStorage.getItem('user') as string);
    this.quizResultData = sessionStorage.getItem('dailyQuizResults')
      ? JSON.parse(sessionStorage.getItem('dailyQuizResults') as string)
      : null;
    this.bibleScheduleData = sessionStorage.getItem('bibleSchedule')
      ? JSON.parse(sessionStorage.getItem('bibleSchedule') as string)
      : null;
    // if(!this.bibleScheduleData) {
    //     this.loadBibleScheudle();
    // } else {
    this.loadDailyQuizScore();
    this.getTodayQuestion();
    // }
  }
  loadDailyQuizScore() {
    this.resultService.getDailyQuizQuestionResults().subscribe((data: any) => {
      this.quizResultData = data;
      this.ranksData = this.calculateRanks(this.quizResultData?.quizData);
      this.yourResult = this.loadYourScore(this.quizResultData?.quizData);
      sessionStorage.setItem('dailyQuizResults', JSON.stringify(data));
    });
  }
  loadYourScore(data: any) {
    const yourData: any = [];
    if(data) {
      data.forEach((entry: any) => {
        Object.keys(entry).forEach((dayKey) => {
           entry[dayKey].forEach((user: any) => {
            const regId = user['Registration ID'] || user['registration_id'];
            if(regId && regId === this.userDetails?.RegID) {
              yourData.push({
                Day: dayKey,
                ...user
              })
            }
           })
        })
      })
    }
    return this.sortDays(yourData);
  }
  sortDays(days: any[]) {
    return days.sort((a, b) => {
      const dayA = parseInt(a.Day, 10);
      const dayB = parseInt(b.Day, 10);
      return dayB - dayA; // Descending order
    });
  }
  getTodayQuestion() {
    if (!this.showQuestion) {
      this.loader = true;
      let quizData: any = {};
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      const formattedDate = `${yyyy}-${mm}-${dd}`;
      if (this.bibleScheduleData) {
        quizData = this.bibleScheduleData.find((item: any) => {
          return item.date == formattedDate;
        });
        this.loadTodayQuestionData(quizData);
      } else {
        this.loadBibleScheudle(formattedDate);
      }
      this.showQuestion = true;
    } else {
      this.showQuestion = false;
    }

    // return quizData;
  }
  loadTodayQuestionData(quizData: any) {
    this.showMessage = '';
    if (quizData) {
      this.resultService
        .getDailyQuizQuestion(quizData.day, config.GOOGLE_SHEETS_B6.DAILY_QUIZ)
        .subscribe((data: any) => {
          this.loader = false;
          this.todaysQuestionData = data;
          this.enableQuizForDay = this.isUserSubmittedAnswer(quizData.day);
        });
    } else {
      this.loader = false;
      this.showMessage = 'No schedule found';
      this.todaysQuestionData = {};
      setTimeout(() => {
        this.showMessage = '';
      }, 5000);
    }
  }
  isUserSubmittedAnswer(day: any): boolean {
    this.getUserDataForDay(day);
    return (
      this.quizResultData?.quizData?.[0]?.['Day_' + day]?.some(
        (item: any) =>
          item['Registration ID'] === this.userDetails?.RegID ||
          item['registration_id'] === this.userDetails?.RegID
      ) || false
    );
  }
  getUserDataForDay(day: any) {
    this.selecteDayQuizData = this.quizResultData?.quizData?.[0]?.[
      'Day_' + day
    ]?.find((item: any) => {
      if (
        item['Registration ID'] === this.userDetails?.RegID ||
        item['registration_id'] === this.userDetails?.RegID
      ) {
        return item;
      }
    });
  }
  formatEventsData() {
    let result: any = [];
    this.bibleScheduleData = !this.bibleScheduleData
      ? sessionStorage.getItem('bibleSchedule')
        ? JSON.parse(sessionStorage.getItem('bibleSchedule') as string)
        : null
      : null;
    if (this.bibleScheduleData) {
      this.bibleScheduleData.forEach((item: any) => {
        let eventsData: any = {};
        eventsData['title'] = 'Day ' + item.day;
        eventsData['date'] = item.date;
      });
    }

    return result;
  }
  submitAnswer() {
    this.loader = true;
    const payload = {
      regID: this.userDetails.RegID,
      answer: this.selectedAnswer,
      day: this.todaysQuestionData.Day,
      date: this.todaysQuestionData.Date,
      marks:
        this.todaysQuestionData.QType === 'mcq'
          ? this.todaysQuestionData.Answer == this.selectedAnswer
            ? 2
            : 0
          : 0,
    };
    this.resultService.saveDailyQuizQuestion(payload).subscribe((data: any) => {
      this.loader = false;
      if (data) {
        this.showMessage = 'Your answer submitted successfully!';
        this.quizResultData?.quizData?.[0]?.[
          'Day_' + this.todaysQuestionData.Day
        ].push({
          'Registration ID': payload.regID,
          Answer: payload.answer,
          Day: payload.day,
          Date: payload.date,
          Marks: payload.marks,
        });
        sessionStorage.setItem(
          'dailyQuizResults',
          JSON.stringify(this.quizResultData)
        );
        setTimeout(() => {
          // this.showMessage = '';
          this.todaysQuestionData = {};
          this.selectedAnswer = '';
        }, 100);
      }
    });
    // TODO: API call / emit event
  }

  isSubmitDisabled(): boolean {
    if (this.todaysQuestionData?.QType === 'mcq') {
      return !this.selectedAnswer;
    }
    return !this.selectedAnswer?.trim();
  }
  async loadBibleScheudle(formattedDate: any) {
    await this.resultService
      .getBibleSchedule(config.GOOGLE_SHEETS_B6.SCHEDULE)
      .subscribe((data: any) => {
        this.loader = false;
        this.bibleScheduleData = data;
        sessionStorage.setItem('bibleSchedule', JSON.stringify(data));
        const quizData = this.bibleScheduleData.find((item: any) => {
          return item.date == formattedDate;
        });
        this.loadTodayQuestionData(quizData);
      });
  }
  goToHome() {
    this.location.back();
  }
  calculateRanks(data:any) {
    if (data) {
      const marksMap = new Map();

      // 1. Collect total marks per Registration ID
      data.forEach((entry: any) => {
        Object.keys(entry).forEach((dayKey) => {
          entry[dayKey].forEach((user: any) => {
            const regId = user['Registration ID'] || user['registration_id'];
            const marks = Number(user.Marks) || 0;
            if(regId){
              marksMap.set(regId, (marksMap.get(regId) || 0) + marks);
            }
            
          });
        });
      });
      // 2. Convert map to array
      const result = Array.from(marksMap.entries()).map(
        ([regId, totalMarks]) => ({
          registrationID: regId,
          totalMarks,
        })
      );

      // 3. Sort by marks DESC
      result.sort((a, b) => b.totalMarks - a.totalMarks);
      return this.getRanks(result);
    } else {
      this.resultService.getDailyQuizQuestionResults()
    }
    
    return [];
  }
  getRanks(data: any) {
    let sortArr: any = Object.entries(data).sort((a: any, b: any) => {
      return b[1].totalMarks - a[1].totalMarks;
    });
    let currentRank = 1;
    let currentScore = sortArr[0][1].totalMarks;
    const usersWithRanks = sortArr.map((entry: any, index: any) => {
      const rank =
        currentScore === entry[1].totalMarks ? currentRank : currentRank + 1;

      if (currentScore !== entry[1].totalMarks) {
        currentRank++;
        currentScore = entry[1].totalMarks;
      }
      return (data[entry[0]] = { ...data[entry[0]], rank: rank });
    });
    return Object.values(data).sort((a: any, b: any) =>
      a.rank < b.rank ? -1 : 1
    );
  }
  getOnlineExamRanks(data: any) {
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
  openModalWithClass(data: any) {
      const config: ModalOptions = {
        initialState: {
            args: {
                title: "Your Submission Details",
                message: "",
                yesFunction: () => {  },
                noFunction: () => {  }
            },
            data,
            formData:  {
              
            }
        }
    }
      this.modalRef = this.modalService.show(
        ModalPopupComponent,
        config
      );
      this.modalRef.content.onClose.subscribe((result: any) => {
    })
  }
  onTabChange(tabName: any) {
    console.log('Selected tab:', tabName);

  // if (tabName === 'Ranks') {
  //   this.loadRanks();
  // }
   if (!sessionStorage.getItem('onlineQuizRanksDetails')) {
        this.resultService
          .getOnlineQuizDetails(config.GOOGLE_SHEETS_B6.ONLINE_QUIZ)
          .subscribe((data: any) => {
            sessionStorage.setItem(
              'onlineQuizRanksDetails',
              JSON.stringify(data)
            );

            this.onlineExamRanksData = this.getOnlineExamRanks(data);
             sessionStorage.setItem(
        'onlineQuizRanks',
        JSON.stringify(this.onlineExamRanksData)
      );
          });
      } 
      else {
        this.onlineExamRanksData = this.getOnlineExamRanks(
          JSON.parse(sessionStorage.getItem('onlineQuizRanksDetails') as string)
        );
          sessionStorage.setItem(
        'onlineQuizRanks',
        JSON.stringify(this.onlineExamRanksData))
      }
  }
}
