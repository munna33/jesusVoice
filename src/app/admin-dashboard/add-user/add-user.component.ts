import { Component } from '@angular/core';
import { UsermanagementService } from 'src/app/services/usermanagement.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent {
  fullName: string ='';
  villageName: string = '';
  churchName: string = '';
  contactNumber: string = '';
  occupation: string = '';
  userDetails: any[] =[];
  enableFileUpload: boolean = false;
  file: any = '';
  parentCollection: string = '';
  parentCollections: string[] = ['OLD_NEW', 'OLD', 'NEW','QUIZ', 'PUZZLE', 'USERS','new_testament_users'];
  loader: boolean = false;
  constructor(private usermanagementService: UsermanagementService) {}
  ngOnInit() {
    this.loader = true;
    this.usermanagementService.getAllCollections().subscribe(
      (response: any) => {
        this.loader = false;
        this.parentCollections = response;
        // console.log('User Details:', this.parentCollections);
      },
      (error: any) => {
        this.loader = false;
        console.error('Error fetching user details:', error);
      }
    );
  }
  addUser() {
    const user ={
      fullName: this.fullName,
      villageName: this.villageName,
      churchName: this.churchName,
      contactNumber: this.contactNumber, 
      occupation: this.occupation
    }
    this.userDetails.push(user);

  }
  addBulkUser() {
    if (this.file && this.parentCollection) {
      this.loader = true;
      // Call the service to upload the file
      // Assuming usermanagementService is injected in the constructor
      this.usermanagementService.uploadFile(this.file, this.parentCollection).subscribe(
        response => {
          this.loader = false;
          this.enableFileUpload = false;
          this.file = null; // Reset the file input
          this.parentCollection = ''; // Reset the parent collection
          // Handle success response
        },
        error => {
          this.loader = false;
          this.enableFileUpload = false;
          this.file = null; // Reset the file input
          this.parentCollection = ''; // Reset the parent collection
          console.error('Error uploading file', error);
          // Handle error response
        }
      );
    } else {
      alert('Please select a file and parent collection');
    }
  }
  onFileSelected(event: any) {
    this.file = event.target.files[0];
    if (this.file) {
      this.enableFileUpload = true;
      // You can add further processing of the file here if needed
    } else {
      this.enableFileUpload = false;
    }
  }
}
