import { Component } from '@angular/core';

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
}
