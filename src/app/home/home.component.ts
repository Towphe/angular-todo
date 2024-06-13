import { Component, EventEmitter, Output, inject, Input } from '@angular/core';
import { TodoHandlerService } from '../services/todo-handler.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {DateTime} from "luxon";
import Todo from '../models/Todo';
import Task from '../../db/db';
import { Observable } from 'rxjs';
import { TaskCardComponent } from '../task-card/task-card.component';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TaskCardComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  todoHandler: TodoHandlerService = inject(TodoHandlerService);
  
  tasks:Task[] = [];
  totalTasks:number = 0;
  totalPages:number[] = [1];
  defaultDue: string = DateTime.now().plus({hours: 1}).toISO().slice(0,16);
  filter!:string;
  filterOptions:string[] = ["All", "Pending", "Completed", "Expired"];

  currentPage!: number;

  taskForm = new FormGroup({
    name: new FormControl(''),
    due: new FormControl(this.defaultDue)
  });
  
  addTask(){
    let name = this.taskForm.value.name;
    let due = this.taskForm.value.due;

    if (name == null || due == null){
      // null value | raise exception
      return;
    }

    this.todoHandler.addTask(name, DateTime.fromISO(due).toJSDate());

    this.todoHandler.retrieveTasks(this.currentPage).then((data) => {
      this.tasks = [...data.tasks];
      this.totalPages = Array.from(Array(Math.ceil(data.pages / 10)).keys());
    });

    return;
  }

  selectFilter(){
    window.location.href = `/?p=1&f=${this.filter}`;
  }

  reloadData(){
    this.todoHandler.retrieveTasks(this.currentPage).then((data) => {
      this.tasks = [...data.tasks];
      this.totalPages = Array.from(Array(Math.ceil(data.pages / 10)).keys());
    });
  }

  constructor(){
  }
  
  @Input()
  set f(filter:string){
    this.filter = filter ?? "all"; 
  }

  @Input()
  set p(page:number){
    this.currentPage = page;
    this.todoHandler.retrieveTasks(this.currentPage, this.filter).then((data) => {
      this.tasks = [...data.tasks]
      this.totalPages = Array.from(Array(Math.ceil(data.pages / 10)).keys());
    });
  }
}
