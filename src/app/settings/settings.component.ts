import { Component, inject } from '@angular/core';
import { TodoHandlerService } from '../services/todo-handler.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  todoHandler: TodoHandlerService = inject(TodoHandlerService);

  resetDb(){
    this.todoHandler.clearAll().then(() => {
      window.location.href = "/";
    });
  }
}
