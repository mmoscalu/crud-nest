import {Injectable} from '@nestjs/common';
import {Task, TaskStatus} from "./task.model";
import {v4 as uuidv4} from 'uuid';
import {CreateTaskDto} from "./dto/create-task.dto";
import {GetTasksFilterDto} from "./dto/get-tasks-filter.dto";

@Injectable()
export class TasksService {
    private tasks: Task[] = [];

    list(): Task[] {
        return this.tasks;
    }

    listWithFilter(filterDto: GetTasksFilterDto): Task[] {
        const {status, search} = filterDto;

        let tasks = this.list();
        if (status) {
            tasks = tasks.filter(task => task.status === status);
        }
        if (search) {
            tasks = tasks.filter(task =>
                task.title.toLowerCase().includes(search.toLowerCase()) ||
                task.description.toLowerCase().includes(search.toLowerCase()));
        }
        return tasks;
    }

    getById(id: string): Task {
        return this.tasks.find(task => task.id === id);
    }

    updateTaskStatus(id: string, status: TaskStatus): Task {
        const task = this.getById(id);
        task.status = status;
        return task;
    }

    create(createTaskDto: CreateTaskDto): Task {
        const {title, description} = createTaskDto;
        const task: Task = {
            id: uuidv4(),
            title,
            description,
            status: TaskStatus.OPEN
        }
        this.tasks.push(task);
        return task;
    }

    delete(id: string): void {
        this.tasks = this.tasks.filter(task => task.id !== id);
    }
}