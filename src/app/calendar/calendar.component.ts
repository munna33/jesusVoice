import { Component } from '@angular/core';
import { ResultService } from '../services/result.service';
import { config } from '../config/config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent {
year = 2026;
loader: boolean = false;
showModal: boolean = false;
selectedDateScripture: { date: string;bibleStudyDay: string, scripture: any; day: any;fullName?: string } | undefined ;
  months = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];

  activeMonthIndex = 0;
  calendarDays: any[][] = [];

  schedule: any = {};
  constructor(private resultService: ResultService, private router: Router) {}
  ngOnInit() {
    this.activeMonthIndex = new Date().getMonth();
    this.loader = true;
      const storedSchedule = JSON.parse(sessionStorage.getItem('bibleSchedule') as string);
      if (storedSchedule) {
        this.schedule = storedSchedule;
        this.generateMonth(this.activeMonthIndex);
        this.loader = false
        return;
      }
    this.resultService.getBibleSchedule(config.GOOGLE_SHEETS_B6.SCHEDULE).subscribe((data: any) => {
      this.loader = false
      this.schedule = data;
      sessionStorage.setItem('bibleSchedule', JSON.stringify(this.schedule));
      this.generateMonth(this.activeMonthIndex);
    });
  }

  generateMonth(monthIndex: number) {
  const firstDay = new Date(this.year, monthIndex, 1);
  const lastDay = new Date(this.year, monthIndex + 1, 0);

  const weeks: any[][] = [];
  let week: any[] = [];

  // 1️⃣ Pad before first day
  for (let i = 0; i < firstDay.getDay(); i++) {
    week.push(null);
  }

  // 2️⃣ Fill days
  for (let day = 1; day <= lastDay.getDate(); day++) {
    const dateObj = new Date(this.year, monthIndex, day);
    const entryScripture = this.getScriptureForDate(dateObj)
    week.push({
      day,
      bibleStudyDay: entryScripture.day,
      date: dateObj,
      scripture: entryScripture.scripture,
      fullName: entryScripture.fullName
    });

    // 3️⃣ Push week when it reaches 7
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }

  // 4️⃣ Pad AFTER last day (THIS WAS MISSING)
  if (week.length > 0) {
    while (week.length < 7) {
      week.push(null);
    }
    weeks.push(week);
  }

  this.calendarDays = weeks;
}


  getScriptureForDate(dateObj: Date) {
  if (!dateObj) return '';

  // Convert to local YYYY-MM-DD (NO UTC)
  const localDate =
    dateObj.getFullYear() + '-' +
    String(dateObj.getMonth() + 1).padStart(2, '0') + '-' +
    String(dateObj.getDate()).padStart(2, '0');

  const entry = this.schedule.find(
    (e: any) => e.date === localDate
  );

  return entry ? entry : '';
}

  prevMonth() {
    if (this.activeMonthIndex > 0) {
      this.activeMonthIndex--;
      this.generateMonth(this.activeMonthIndex);
    }
  }

  nextMonth() {
    if (this.activeMonthIndex < 11) {
      this.activeMonthIndex++;
      this.generateMonth(this.activeMonthIndex);
    }
  }
  isToday(dateObj: Date): boolean {
    const today = new Date();

    return (
      dateObj.getFullYear() === today.getFullYear() &&
      dateObj.getMonth() === today.getMonth() &&
      dateObj.getDate() === today.getDate()
    );
  }
  getTodaysSchedule() {
    let scripture: any;
    if (this.schedule) {
      const today = new Date(); 
      const formattedDate =
    today.getFullYear() + '-' +
    String(today.getMonth() + 1).padStart(2, '0') + '-' +
    String(today.getDate()).padStart(2, '0');
      scripture = this.schedule.find((entry: any) => entry.date === formattedDate);
      if (scripture) {
        // alert(`Today's Scripture (${formattedDate}): ${scripture}`);
        this.selectedDateScripture = { date: formattedDate, bibleStudyDay: scripture.bibleStudyDay, scripture: scripture.fullName, day: scripture.day };
        this.showModal = true;
      } else {
        this.selectedDateScripture = undefined;
        // alert("No scripture found for today.");
      }
    } else {
      this.selectedDateScripture = undefined;
      // alert("Bible schedule not found. Please refresh the page.");
    }
  }
  openModal(scripture?: any) {
  let scriptureObj = {
    day: scripture?.day,
    bibleStudyDay: scripture.bibleStudyDay,
    date: this.formatToDMY(scripture?.date as string),
    scripture: scripture?.fullName
  }


  this.selectedDateScripture = scriptureObj || 'No scripture available';
  this.showModal = true;
}

  closeModal() {
    this.showModal = false;
  }
  copy() {
    const content: string = (`🌺🙇🏻‍♀🙇🏻‍♂🕊✝🕊🙇🏻‍♀🙇🏻‍♂🌺\n\n`+
    `*రోజు*: ${this.selectedDateScripture?.bibleStudyDay} \n\n` +
    `*తేది*: ${this.formatToDMY(this.parseDMYtoDate(this.selectedDateScripture?.date as string))} \n\n` +
    `*${this.selectedDateScripture?.scripture}* \n\n`+
    `ప్రార్ధించు, పఠించు, ధ్యానించు మరియు ప్రకటించు\n\n`+
    `🙏🏻🙇🏻‍♀🙇🏻‍♂📖📖🧎🏻‍♀🧎🏻👨‍👨‍👦‍👦`)
    
    navigator.clipboard.writeText(content)
    .then(() => alert('Link copied!'));
  }
  formatToDMY(dateStr: any): string {
    const d = new Date(dateStr);
    return [
      String(d.getDate()).padStart(2, '0'),
      String(d.getMonth() + 1).padStart(2, '0'),
      d.getFullYear(),
    ].join('-');
  }

  parseDMYtoDate(dateStr: string): Date {
    const parts = dateStr.split('-');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day);
  }
  goToHome() {
    this.router.navigateByUrl('/home');
  }
}
