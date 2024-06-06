import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

export interface SessionUser{
  empId: number;
  firstName: string;
  lastName: string;
}

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {
  errorMessage: string;
  sessionUser: SessionUser;
  isLoading: boolean = false;

  signinForm = this.fb.group({
    empId: [null, Validators.compose([Validators.required, Validators.pattern('^[0-9]*$')])],
  })

  constructor( private fb: FormBuilder, private router: Router, private cookieService: CookieService, private securityService: SecurityService, private route: ActivatedRoute) {
    this.errorMessage = '';
    this.sessionUser = {} as SessionUser;
  }

  signin() {
    this.isLoading = true;

    const empId = this.signinForm.controls['empId'].value;

    if (!empId || isNaN(ParseInt(empId, 10))) {
      this.errorMessage = 'The employee ID is invalid.';
      this.isLoading = false;
      return;
    }

    this.securityService.findEmployeeById(empId).subscribe({
      next: (employee: any) => {
        this.sessionUser = employee;
        this.cookieService.set('session_iser')
      }
    })

}
