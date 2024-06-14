import { Component, inject, Input } from '@angular/core';
import { TodoHandlerService } from '../services/todo-handler.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {DateTime} from "luxon";
import Task from '../../db/db';
import { TaskCardComponent } from '../task-card/task-card.component';
import { CommonModule } from '@angular/common';
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
  renderEditPopup:boolean = false;
  taskToEditId!:number;

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

  generatePageHref(p:number){
    return `/?p=${p}&f=${this.filter}`;
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

  editTaskForm = new FormGroup({
    name: new FormControl(),
    due: new FormControl()
  });

  promptEditTask(task: Task){
    let oldDue = DateTime.fromJSDate(task.due).toISO()?.slice(0, 16);
    this.editTaskForm.setValue({name: task.name, due: oldDue});
    this.taskToEditId = task.id ?? 0;
    this.renderEditPopup = true;
  }

  closeEditTaskPrompt(){
    this.renderEditPopup = false;
  }  

  editTask(){
    this.todoHandler.editTask(this.taskToEditId, this.editTaskForm.value.name, DateTime.fromISO(this.editTaskForm.value.due).toJSDate());
    this.renderEditPopup = false;
    document.location.reload();
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
