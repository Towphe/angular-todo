import { Injectable } from '@angular/core';
import Todo from '../models/Todo';
import { liveQuery } from 'dexie';
import Task, { db } from '../../db/db';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class TodoHandlerService {

  // use IndexedDB for this later
  
  async retrieveTasks(p:number=1, c:number=10){
    return await db.tasks.offset((p-1)*c).limit(c).toArray();
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

  constructor() {
  }
}
