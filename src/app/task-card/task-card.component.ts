import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import Task from '../../db/db';
import { CommonModule } from '@angular/common';
import { DateTime } from 'luxon';
import { TodoHandlerService } from '../services/todo-handler.service';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-card.component.html'
})
export class TaskCardComponent {
  @Output() onStatusChange: EventEmitter<any> = new EventEmitter();
  @Input() task!: Task;
  todoHandler: TodoHandlerService = inject(TodoHandlerService);
  
  dueIn: string = "";
  bgColor:string = "bg-gray-400";

  isPassDue(){
    return DateTime.now() > DateTime.fromJSDate(this.task.due);
  }

  markAsDone(){
    this.todoHandler.markTaskDone(this.task.id);
    this.onStatusChange.emit();
  }

  markAsCancelled(){
    this.todoHandler.markTaskCancelled(this.task.id);
    this.onStatusChange.emit();
  }

  getRelativeDate(){
    return DateTime.fromJSDate(this.task.due).toRelative()?.toString() ?? "";
  }

  constructor(){
  }
}
