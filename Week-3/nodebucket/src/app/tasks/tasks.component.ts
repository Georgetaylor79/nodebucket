import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';

export interface Item {
  _id: string;
  text: string;
}

export interface Employee {
  empId: number;
  todo: Item[];
  done: Item[];
}

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent {
  //Local variables
  empId: number;
  employee: Employee;
  todo: Item[];
  done: Item[];

  constructor(private http: HttpClient, private cookieService: CookieService) {
    this.empId = parseInt(this.cookieService.get('session_user'), 10);
    this.employee= {} as Employee;
    this.todo =[];
    this.done = [];
  }

}
