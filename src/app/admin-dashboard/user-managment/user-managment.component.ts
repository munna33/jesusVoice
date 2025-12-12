import { Component } from '@angular/core';
import { UsermanagementService } from 'src/app/services/usermanagement.service';

@Component({
  selector: 'app-user-managment',
  templateUrl: './user-managment.component.html',
  styleUrls: ['./user-managment.component.scss'],
})
export class UserManagmentComponent {
  userDetails: any = {};
  newTestamentUsers: any[] = [];
  oldNewTestamentUsers: any[] = [];
  pagedNewTestamentUsers: any[] = [];
  pagedOldNewTestamentUsers: any[] = [];

  currentNewPage: number = 1;
  currentOldNewPage: number = 1;
  itemsPerPage: number = 10;
  totalItemsNewTestament: number = 0;
  totalItemsOldNewTestament: number = 0;
  loader: boolean = true;
  searchOldNewTerm: string = '';
  searchNewTerm: string = '';
  constructor(private usermanagementService: UsermanagementService) {}
  ngOnInit() {
    this.loader = true;
    this.usermanagementService.getAllUsers().subscribe(
      (response: any) => {
        this.loader = false;
        this.userDetails = response;
        this.newTestamentUsers = this.userDetails['new_testament'] || [];
        this.oldNewTestamentUsers = this.userDetails['old_new_testament'] || [];
        this.pagedNewTestamentUsers = this.newTestamentUsers.slice(
          0,
          this.itemsPerPage
        );
        this.pagedOldNewTestamentUsers = this.oldNewTestamentUsers.slice(
          0,
          this.itemsPerPage
        );
        this.totalItemsNewTestament = this.newTestamentUsers.length;
        this.totalItemsOldNewTestament = this.oldNewTestamentUsers.length;
      },
      (error: any) => {
        this.loader = false;
        console.error('Error fetching user details:', error);
      }
    );
  }
  pageChangeEvent(page: any, type: string) {
    // this.pagedUsers = this.allUsers.slice(startIndex, endIndex);
    if (type === 'New Testament') {
      this.currentNewPage = page;
      const startIndex = (page - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      this.pagedNewTestamentUsers = this.newTestamentUsers.slice(
        startIndex,
        endIndex
      );
    } else if (type === 'Old_New Testament') {
      this.currentOldNewPage = page;
      const startIndex = (page - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      this.pagedOldNewTestamentUsers = this.oldNewTestamentUsers.slice(
        startIndex,
        endIndex
      );
    }
  }
  filterOldNewUsers(searchTerm: string) {
    if (searchTerm) {
      this.pagedOldNewTestamentUsers = this.oldNewTestamentUsers.filter(
        (user: any) =>
           {
          return (
            (user['Full Name / పూర్తి పేరు'] &&
            user['Full Name / పూర్తి పేరు']
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) || (user['Reg No'] && user['Reg No']
              .toLowerCase().includes(searchTerm.toLowerCase()))
          );
        }
      );
    } else {
      this.pagedOldNewTestamentUsers = this.oldNewTestamentUsers.slice(
        0,
        this.itemsPerPage
      );
    }
  }
  filterNewUsers(searchTerm: string) {
    if (searchTerm) {
      this.pagedNewTestamentUsers = this.newTestamentUsers.filter(
        (user: any) => {
          return (
            (user['Full Name / పూర్తి పేరు'] &&
            user['Full Name / పూర్తి పేరు']
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) || (user['Reg No'] && user['Reg No']
              .toLowerCase().includes(searchTerm.toLowerCase()))
          );
        }
      );
    } else {
      this.pagedNewTestamentUsers = this.newTestamentUsers.slice(
        0,
        this.itemsPerPage
      );
    }
  }
  test(user: any) {
    const phoneNumber = '919849279780'; // Use international format without '+'

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
      `You have successfully completed the Online Quiz on "Genisis".`,
      canvas.width / 2,
      180
    );
    ctx.font = 'bold 22px Arial';
    ctx.fillStyle = '#2e7d32';
    ctx.fillText(
      `Your Score: 10 out of 10`,
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
    ctx.fillText(
      'Bible Study 180 Days',
      canvas.width / 2,
      370
    );

    // Show image
    const imgUrl = canvas.toDataURL('image/png');
    const win = window.open('');
    if (win) {
      win.document.write(`<img src="${imgUrl}" alt="Certificate"/>`);
    }
  }
  // Convert canvas image to base64 and send via WhatsApp
  const imgUrl = canvas.toDataURL('image/png');
  const message = encodeURIComponent(
    `Certificate: ${imgUrl}`
  );
  const url = `https://wa.me/${phoneNumber}?text=${message}`;
  
  window.open(url, '_blank');
  }

}
