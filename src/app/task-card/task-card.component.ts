import { Component, Input } from '@angular/core';
import Task from '../../db/db';
import { CommonModule } from '@angular/common';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-card.component.html'
})
export class TaskCardComponent {
  @Input() task!: Task;
  dueIn: string = "";
  bgColor:string = "bg-gray-400";

  isPassDue(){
    return DateTime.now() > DateTime.fromJSDate(this.task.due);
  }

  markAsDone(){
    console.log(`Task #${this.task.id}`);
    // service for this to follow
  }

  markAsCancelled(){
    console.log(`Task #${this.task.id} marked as cancelled`);
    // service for this to follow
  }

  getRelativeDate(){
    return DateTime.fromJSDate(this.task.due).toRelative()?.toString() ?? "";
  }

  constructor(){
  }
}
