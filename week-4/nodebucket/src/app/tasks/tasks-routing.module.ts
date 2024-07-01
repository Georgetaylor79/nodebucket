/**
 * Title: task-routing.module.ts
 * Author: George Taylor
 * Date: 06.30.2024
 */


import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { TasksComponent } from "./tasks.component";

// Task Component Route

const routes: Routes = [
  {
    path: '',
    component: TasksComponent,
    children: [
      {
        path: 'my-tasks',
        component: TasksComponent,
        title: 'My Tasks'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

//Exports the TaskRoutingModule
export class TaskRoutingModule { }
