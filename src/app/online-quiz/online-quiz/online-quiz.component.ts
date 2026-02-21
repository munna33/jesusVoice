import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Location } from '@angular/common';
import { NavigationStart, Router } from '@angular/router';
import { ResultService } from 'src/app/services/result.service';
import { config } from 'src/app/config/config';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-online-quiz',
  templateUrl: './online-quiz.component.html',
  styleUrls: ['./online-quiz.component.scss'],
})
export class OnlineQuizComponent implements OnInit {
  @ViewChild('video', { static: true }) video!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
 @ViewChild('certificateCanvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;
  private stream!: MediaStream;
  private captureInterval: any;

  showQuizDetails: boolean = false;
  confirmYourDetails: boolean = false;
  currentQuestionIndex = 0;
  timeLeft = 40;
  interval: any;
  score = 0;
  selectedAnswer: string = '';
  quizCompleted = false;
  // QUIZSHEET_ID = '1f9IKPjRL2MzrGmrPqpsvB7YM2rCjirIdZUaFtYeByAY';
  QUIZRESULT_ID = '';
  // QUIZTRACK_ID = '1_mMJYRdtu2YAaRrl699eeCBBA_CSDrJjX4S6gcXoEMY';
  userDetails: any = {};
  questionData: any = [];
  chapterName: string = '';
  yourAnswers: any = [];
  message: string = '';
  isQuizStarted: boolean = false;
  loader: boolean = false;
  finalResult: any = {};
  questionNumber = 1;
  userTrackingData: any;
  trackID: string = '';
  isFinalQuiz: boolean = false;
  showCertificate: boolean = false;

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (
      (event.ctrlKey &&
        ['c', 'v', 'x', 'a', 's', 'p'].includes(event.key.toLowerCase())) ||
      event.key === 'PrintScreen'
    ) {
      event.preventDefault();
      this.logViolation('Keyboard shortcut blocked');
    }
  }

  @HostListener('document:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    if (event.key === 'PrintScreen') {
      alert('Screenshots are not allowed');
      this.logViolation('PrintScreen detected');
    }
  }

  /* ================= TAB SWITCH ================= */

  @HostListener('document:visibilitychange')
  onVisibilityChange() {
    if (document.hidden) {
      alert('Tab switching is not allowed');
      this.logViolation('Tab switch detected');
    }
  }
  constructor(
    private _location: Location,
    private router: Router,
    private resultService: ResultService,
    private http: HttpClient
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.questionData = navigation.extras.state['quizData'];
      this.userDetails = navigation.extras.state['user'];
      this.chapterName = navigation.extras.state['chapterName'];
      this.isFinalQuiz = navigation.extras.state['isFinalQuiz'];
    } else {
      this.router.navigateByUrl('/bible-study/dashboard');
    }
  }

  ngOnInit() {
    this.trackID =config.GOOGLE_SHEETS_B5.ONLINE_QUIZ_TRACKING.OLD_NEW;
    this.QUIZRESULT_ID = this.isFinalQuiz
      ? config.GOOGLE_SHEETS_B6.FINAL_QUIZ_RESULTS
      : config.GOOGLE_SHEETS_B6.ONLINE_QUIZ_RESULTS;

    window.history.pushState(null, '', window.location.href);
    window.onpopstate = () => {
      window.history.pushState(null, '', window.location.href);
      // alert('Back navigation is disabled');
      // this.submitQuiz();
    };
    const requestPayload = {
      regID: this.userDetails?.RegID,
      appType: localStorage.getItem('appType'),
      quizID: this.chapterName,
      finalQuiz: this.isFinalQuiz,
    };

    this.resultService.getTrackingDetails(requestPayload).subscribe((data) => {
      if (data) {
        this.userTrackingData = data;
      }
    });
    // this.resultService.getTrackingDetails(this.trackID).subscribe(data => {
    //   if(data){
    //     this.userTrackingData = data;
    //   }
    // })
  }
  startTimer(chapterName: any) {
    const req = {
      regID: this.userDetails?.RegID,
      name: this.userDetails?.Name,
      quizID: chapterName,
      appType: localStorage.getItem('appType'),
      finalQuiz: this.isFinalQuiz,
    };
    this.startProctoring();
    // const req = {
    //  "Registration ID": this.userDetails?.RegID,
    //   "Name": this.userDetails?.Name,
    //   "Quiz ID": chapterName,
    //   "Attempted": true,
    //   "Date": new Date(),
    // }
    this.resultService.trackSubmit(req).subscribe((data) => {});
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.nextQuestion();
      }
    }, 1000);
  }
  isUserSubmitted(chapterName: string) {
    // if(this.userTrackingData && this.userTrackingData[chapterName] && this.userTrackingData[chapterName].filter((item: any) => item['Registration ID'] == this.userDetails?.RegID).length > 0) {
    //   return true;
    // }
    if (this.userTrackingData && this.userTrackingData.isAttempted) {
      return true;
    }
    return false;
  }
  selectAnswer(option: any, question: any) {
    let selectedAnswer = {
      QNO: question?.QNO,
      yourAnswer: option,
      correctAnswer: question?.Answer,
    };
    if (this.yourAnswers.length > 0) {
      this.updateYourAnswers(question, selectedAnswer);
    } else {
      this.yourAnswers.push(selectedAnswer);
    }

    this.selectedAnswer = option;
  }
  updateYourAnswers(question: any, selectedAnswer: any) {
    let matchCount = this.yourAnswers.filter(
      (item: any) => item?.QNO == question?.QNO
    );
    if (matchCount.length > 0) {
      this.yourAnswers = this.yourAnswers.map((item: any) => {
        if (item?.QNO == question?.QNO) {
          return {
            ...item,
            yourAnswer: selectedAnswer.yourAnswer,
          };
        } else {
          return item;
        }
      });
    } else {
      this.yourAnswers = [...this.yourAnswers, selectedAnswer];
    }
  }
  nextQuestion() {
    this.questionNumber++;
    if (
      this.selectedAnswer?.trim() ===
      this.questionData[this.currentQuestionIndex].Answer?.trim()
    ) {
      this.score++;
    }
    this.selectedAnswer = '';
    this.timeLeft = 40;
    this.currentQuestionIndex++;
    if (this.currentQuestionIndex >= this.questionData.length) {
      clearInterval(this.interval);
      this.loader = true;
      this.submitQuiz();
    }
  }
  submitQuiz() {
    // this.captureAndSend();
    const requestObj = this.prepareTheResult();
    this.resultService
      .submitQuiz(this.QUIZRESULT_ID, requestObj)
      .subscribe((data: any) => {
        if (data) {
          this.message = data?.message;
        }
        this.loader = false;
        let sessionQuestionData = sessionStorage.getItem('quizChapters')
          ? JSON.parse(sessionStorage.getItem('quizChapters') as any)
          : '';
        if (
          sessionQuestionData &&
          sessionQuestionData.hasOwnProperty(this.chapterName)
        ) {
          sessionQuestionData[this.chapterName]['Your Score'] = this.score;
          sessionQuestionData[this.chapterName]['Total Score'] =
            this.questionData.length;
        }
        sessionStorage.setItem(
          'quizChapters',
          JSON.stringify(sessionQuestionData)
        );

        sessionStorage.removeItem('quizChapters');
        sessionStorage.removeItem('onlineQuizRanks');
        this.isFinalQuiz
          ? sessionStorage.removeItem('onlineFinalQuizRanksDetails')
          : sessionStorage.removeItem('onlineQuizRanksDetails');
        
      });
      const messageBody = this.examResultTemplate(
        this.userDetails?.Name,
        this.score,
        0
      );
    // this.resultService.sendResults({
    //   to: '91'+this.userDetails?.Contact || '',
    //   message: messageBody,
    // }).subscribe();
    this.quizCompleted = true;
    this.isQuizStarted = false;
    this.questionNumber = 0;
    setTimeout(() => {
      this.drawCertificate();
    }, 2000);
   

    // this.stopCameraAndProctoring();
  }
  examResultTemplate(name: string, marks: number, rank: number) {
  return (
    `Hi ${this.userDetails?.Name},\n\n` +
    `🎉 *Congratulations on your outstanding achievement!*\n\n` +
    `You have scored a perfect *${marks}/${this.questionData.length}* ` +
    `in the *Bible Study Final Online Exam*.\n\n` +
    `We will be sharing your rank and certificate shortly.\n\n` +
    `Thank you for your active participation.\n` +
    `May this achievement encourage you to grow further in knowledge and faith.\n\n` +
    `@VoiceOfJesus | యేసయ్య స్వరం`
  );
}

  getOptions(question: any) {
    // console.log(question.Options.split(','))
    return question.Options.split(',');
  }
  goToDashboard() {
    // this._location.back();
    // this.stopCameraAndProctoring();
    this.router.navigateByUrl('/bible-study/dashboard');
  }

  stopCameraAndProctoring() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null as any;
    }
    clearInterval(this.captureInterval);
    this.enableUserActions();
    this.video.nativeElement.style.display = 'none';
    this.canvas.nativeElement.style.display = 'none';
  }
  getYourAnswer(qno: any) {
    return this.yourAnswers.find((item: any) => item.QNO == qno)?.yourAnswer;
  }
  prepareTheResult() {
    let requestObj: any = {
      'Registration ID': this.userDetails?.RegID,
      Name: this.userDetails?.Name,
      'Quiz ID': this.chapterName,
      'Your Score': this.score,
      'Total Score': this.questionData.length,
    };
    this.questionData.forEach((item: any) => {
      requestObj[item.QNO] = item.QNO + ':' + this.getYourAnswer(item.QNO);
    });
    this.finalResult = requestObj;
    return requestObj;
  }

  sendMessage() {
    const phoneNumber = '91' + this.userDetails?.Contact; // Use international format without '+'
    // console.log('phoneNumber', phoneNumber)
    // const message = encodeURIComponent(this.finalResult);
    // const url = `https://wa.me/${phoneNumber}?text=${message}`;

    // Generate certificate image with message
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Background
      ctx.fillStyle = '#f9f6ee';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Border
      ctx.strokeStyle = '#c9a74b';
      ctx.lineWidth = 8;
      ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

      // Title
      ctx.font = 'bold 32px Arial';
      ctx.fillStyle = '#333';
      ctx.textAlign = 'center';
      ctx.fillText('Certificate of Completion', canvas.width / 2, 70);

      // Message
      ctx.font = '20px Arial';
      ctx.fillStyle = '#444';
      ctx.textAlign = 'center';
      ctx.fillText(
        `Congratulations ${this.userDetails?.Name}!`,
        canvas.width / 2,
        140
      );
      ctx.font = '18px Arial';
      ctx.fillText(
        `You have successfully completed the Online Quiz on "${this.chapterName}".`,
        canvas.width / 2,
        180
      );
      ctx.font = 'bold 22px Arial';
      ctx.fillStyle = '#2e7d32';
      ctx.fillText(
        `Your Score: ${this.score} out of ${this.questionData.length}`,
        canvas.width / 2,
        230
      );

      // Date
      ctx.font = '16px Arial';
      ctx.fillStyle = '#555';
      ctx.fillText(
        `Date: ${new Date().toLocaleDateString()}`,
        canvas.width / 2,
        320
      );

      // Footer
      ctx.font = 'italic 16px Arial';
      ctx.fillStyle = '#888';
      ctx.fillText('Bible Study 180 Days', canvas.width / 2, 370);

      // Show image
      const imgUrl = canvas.toDataURL('image/png');
      const win = window.open('');
      if (win) {
        win.document.write(`<img src="${imgUrl}" alt="Certificate"/>`);
      }
    }
    // Convert canvas image to base64 and send via WhatsApp
    const imgUrl = canvas.toDataURL('image/png');
    const message = encodeURIComponent(`Certificate: ${imgUrl}`);
    const url = `https://wa.me/${phoneNumber}?text=${message}`;

    window.open(url, '_blank');
  }
  logViolation(reason: string) {
    this.resultService
      .trackVoilation({
        reason,
        time: new Date(),
        regID: this.userDetails?.RegID,
        appType: localStorage.getItem('appType'),
      })
      .subscribe();
  }
  ngOnDestroy(): void {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
    }
    clearInterval(this.captureInterval);
    this.enableUserActions();
  }
  async startCamera() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false,
      });

      this.video.nativeElement.srcObject = this.stream;
    } catch (err) {
      if (!this.quizCompleted) {
        alert('Camera access is mandatory to attend the exam');
        // location.reload();
      }
    }
    this.disableUserActions();
  }

  /* ================= PROCTORING ================= */

  startProctoring() {
    const timeInterval = ((this.questionData.length * 40) / 2) * 1000;
    this.captureInterval = setInterval(() => {
      this.captureAndSend();
    }, timeInterval); // every 5 seconds
    // setTimeout(() => {
    //   this.captureAndSend();
    // }, 3000); // initial delay
  }

  captureAndSend() {
    const video = this.video.nativeElement;
    const canvas = this.canvas.nativeElement;

    if (!video.videoWidth) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(video, 0, 0);

    const image = canvas.toDataURL('image/jpeg', 0.7);
    this.resultService
      .getProctoring({
        frame: image,
        timestamp: new Date(),
        regID: this.userDetails?.RegID,
        appType: localStorage.getItem('appType'),
      })
      .subscribe();
    // this.http
    //   .post('/api/proctor/frame', {
    //     frame: image,
    //     timestamp: new Date(),
    //     regID: this.userDetails?.RegID
    //   })
    //   .subscribe();
  }

  /* ================= SECURITY ================= */

  disableUserActions() {
    document.addEventListener('copy', this.blockEvent);
    document.addEventListener('paste', this.blockEvent);
    document.addEventListener('cut', this.blockEvent);
    document.addEventListener('contextmenu', this.blockEvent);
  }

  enableUserActions() {
    document.removeEventListener('copy', this.blockEvent);
    document.removeEventListener('paste', this.blockEvent);
    document.removeEventListener('cut', this.blockEvent);
    document.removeEventListener('contextmenu', this.blockEvent);
  }

  blockEvent = (e: Event) => {
    e.preventDefault();
    return false;
  };
  downloadCertificate() {
    const canvas = this.canvasRef.nativeElement;
    const link = document.createElement('a');
    link.download = `${this.userDetails?.Name}_Certificate.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }
  drawCertificate() {
  const canvas = this.canvasRef.nativeElement;
  const ctx = canvas.getContext('2d')!;

  const img = new Image();
  img.src = 'assets/images/certificate.png';

  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0);

    // COMMON SETTINGS
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const lineGap = 50; // 👈 control spacing here

    let currentY = centerY - 140;

    // -------- NAME --------
    ctx.font = 'bold 56px Poppins';
    ctx.fillStyle = '#0f3d2e';
    ctx.fillText(this.userDetails?.Name, centerX, currentY);

    currentY += lineGap + 20;

    // -------- TEXT LINE 1 --------
    ctx.font = '32px Poppins';
    ctx.fillStyle = '#1f2937';
    ctx.fillText(
      'In recognition of attempting the Online Quiz',
      centerX,
      currentY
    );

    currentY += lineGap;

    // -------- CHAPTER NAME (BOLD) --------
    ctx.font = 'bold 32px Poppins';
    ctx.fillText(
      `(${this.chapterName})`,
      centerX,
      currentY
    );

    currentY += lineGap;

    // -------- TEXT LINE 2 --------
    ctx.font = '32px Poppins';
    ctx.fillText(
      'as part of the Bible Study Program and scoring',
      centerX,
      currentY
    );

    currentY += lineGap;

    // -------- SCORE (BOLD) --------
    ctx.font = 'bold 34px Poppins';
    ctx.fillStyle = '#0f3d2e';
    ctx.fillText(
      `${this.score} / 10 marks`,
      centerX,
      currentY
    );

    currentY += lineGap + 7;

    // -------- CONGRATULATIONS --------
    ctx.font = 'italic 30px Poppins';
    ctx.fillStyle = '#065f46';
    ctx.fillText(
      'Congratulations on your dedication to learning God’s Word.',
      centerX,
      currentY
    );
  };

  this.showCertificate = true;
}


}
