import { Component, EventEmitter, Output, inject } from '@angular/core';
import { TodoHandlerService } from '../services/todo-handler.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {DateTime} from "luxon";
import Todo from '../models/Todo';
import Task from '../../db/db';
import { Observable } from 'rxjs';
import { TaskCardComponent } from '../task-card/task-card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TaskCardComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent {

  todoHandler: TodoHandlerService = inject(TodoHandlerService);
  
  tasks:Task[] = [];
  

  defaultDue: string = DateTime.now().plus({hours: 1}).toISO().slice(0,16);

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

    this.todoHandler.retrieveTasks().then((data: Task[]) => {
      this.tasks = [...data];
    });

    return;
  }

  reloadData(){
    // console.log("Callback from child component!")
    this.todoHandler.retrieveTasks().then((data: Task[]) => {
      this.tasks = [...data];
    });
  }

  constructor(){
    this.todoHandler.retrieveTasks().then((data: Task[]) => {
      this.tasks = [...data];
    });
  }
}
