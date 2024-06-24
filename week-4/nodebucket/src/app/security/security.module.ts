/**
 * Title: security.module.ts
 * Author: George Taylor
 * Date: 06.23.2024
*/

// imports statements
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SecurityRoutingModule } from './security-routing.module';
import { SecurityComponent } from './security.component';
import { SigninComponent } from './signin/signin.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import{ HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule} from '@angular/router';

@NgModule({
  declarations: [
    SecurityComponent,
    SigninComponent
  ],
  imports: [
    CommonModule,
    SecurityRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule
  ]
})
export class SecurityModule { }
