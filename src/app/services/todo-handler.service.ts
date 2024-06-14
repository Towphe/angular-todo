import { Injectable } from '@angular/core';
import Todo from '../models/Todo';
import { liveQuery } from 'dexie';
import Task, { db } from '../../db/db';
import { Observable } from 'rxjs';
import { DateTime } from 'luxon';

@Injectable({
  providedIn: 'root'
})

export class TodoHandlerService {

  async retrieveTasks(p:number=1, f:string="all", c:number=10){
    let tasks;
    switch(f){
      case "pending":
        return {
          tasks: await db.tasks.filter(task => task.status === 'pending' && task.due > DateTime.now().toJSDate()).reverse().offset((p-1)*c).limit(c).toArray(),
          pages: await db.tasks.filter(task => task.status === 'pending' && task.due > DateTime.now().toJSDate()).count()
        }
        case "completed":
          return {
            tasks: await db.tasks.filter(task => task.status === 'completed').reverse().offset((p-1)*c).limit(c).toArray(),
            pages: await db.tasks.filter(task => task.status === 'completed').count()
          };
        case "expired":
          return {
            tasks: await db.tasks.filter(task => task.status === 'pending' && task.due < DateTime.now().toJSDate()).reverse().offset((p-1)*c).limit(c).toArray(),
            pages: await db.tasks.filter(task => task.status === 'pending' && task.due < DateTime.now().toJSDate()).count()
          }
        default:
          return {
            tasks: await db.tasks.reverse().offset((p-1)*c).limit(c).toArray(),
            pages: await db.tasks.count()
          };
    }
  }

  async addTask(taskName:string, dueDate:Date){
    let newTask: Task = {
      name: taskName,
      due: dueDate,
      status: "pending"
    }

    let num:number = await db.tasks.add(newTask);

    return;
  }

  async markTaskDone(taskId: number | undefined){
    if (!taskId){
      return;
    }
    await db.tasks.update(taskId, {
      status: 'completed'
    });
    return;
  }

  async editTask(taskId:number, newTaskName:string, newTaskDue:Date){
    alert(newTaskDue);
    await db.tasks.update(taskId, {
      "name": newTaskName,
      "due" : newTaskDue
    });
  }

  async markTaskCancelled(taskId: number | undefined){
    if (!taskId){
      return;
    }
    await db.tasks.update(taskId, {
      status: 'cancelled'
    });
    return;
  }

  async clearAll(){
    await db.tasks.clear();
  }

  constructor() {
  }
}
