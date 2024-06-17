import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { SecurityService } from '../security.service';
import { Router} from '@angular/router';


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
  errorMessage: string
  sessionUser: SessionUser
  isLoading: boolean = false

  signinForm = this.fb.group({
    empId: [null, Validators.compose([Validators.required, Validators.pattern('^[0-9]*$')])]
  })

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private cookieService: SecurityService,
    private route: ActivatedRoute) {
      this.sessionUser = {} as SessionUser;
      this.errorMessage = '';
    }
  
  signin() {
    this.isLoading = true;

    console.log('signinForm', this.signinForm.value)

    const empId = this.signinForm.controls['empId'].value;


    if (!empId || isNaN(parseInt(empId, 10))) {
      this.errorMessage = 'The employee ID you entered is invalid, please try again.';
      this.isLoading = false;
      return;
    }

    this.secService.findEmployeeById(empId).subscribe({
      next: (employee: any) => {
        console.log('employee,' employee)

        this.sessionUser = employee
        this.cookieService.set('session_user', empId, 1);
        this.cookieService.set('session_name', `${employee.firstName} ${employee.lastName}`, 1)

        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';

        this.isLoading - false;

        this.router.navigate([returnUrl]);
      },

      error: (err) => {
        this.isLoading = false;

        if (err.error.message) {
          this.errorMessage = err.error.message;
          return
        }

        this.errorMessage = err.message
      }
    })

}
