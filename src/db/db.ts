import Dexie, {Table} from "dexie";

export default interface Task {
    id?: number,
    name: string,
    status: string,
    due: Date
};

export class AppDB extends Dexie{
    tasks!: Table<Task, number>;

    constructor(){
        super('ngdexieliveQuery');
        this.version(3).stores({
            tasks: '++id',
        });
    }
}

export const db = new AppDB();