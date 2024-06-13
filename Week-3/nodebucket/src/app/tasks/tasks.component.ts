import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { Subscriber } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';

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

  // mytask link,
  constructor(private http: HttpClient, private cookieService: CookieService) {
    this.empId = parseInt(this.cookieService.get('session_user'), 10);
    this.employee= {} as Employee;
    this.todo =[];
    this.done = [];

//my task link,
    this.http.get('/api/employee/${this.empId'). subscribe({
      next: (emp: any) => {
        this.employee = emp;
      },
      error:() => {
        console.error('Unable to get employee data for  employee ID: ', this.empId);
      },
      complete:() => {

        this.todo = this.employee.todo ?? []; // or set to an empty array
        this.done = this.employee.done ?? [];

      }
    });

    createTask(form: NgForm) {
      if (form.valid) {
        const todoTask = form.value.task;

        this.http.post(`/api/employees/${this.empId}/tasks`, {
          text: todoTask
        }).subscribe({
          next: (result: any) => {
            const newTodoItem = {
              _id: result.id,
              text: todoTask
            }
            this.todo.push(newTodoItem);
          },
          error: (err) => {
            console.error('Unable to create task for employee: ' + this.empId, err);
          }
        })
      }
    }
  }
}
