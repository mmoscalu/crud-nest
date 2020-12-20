import {Injectable, NotFoundException} from '@nestjs/common';
import {CreateTaskDto} from "./dto/create-task.dto";
import {TaskRepository} from "./task.repository";
import {InjectRepository} from "@nestjs/typeorm";
import {Task} from "./task.entity";
import {DeleteResult} from "typeorm";
import {TaskStatus} from "./task-status.enum";

@Injectable()
export class TasksService {

    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository
    ) {
    }

    // list(): Task[] {
    //     return this.tasks;
    // }
    //
    // listWithFilter(filterDto: GetTasksFilterDto): Task[] {
    //     const {status, search} = filterDto;
    //
    //     let tasks = this.list();
    //     if (status) {
    //         tasks = tasks.filter(task => task.status === status);
    //     }
    //     if (search) {
    //         tasks = tasks.filter(task =>
    //             task.title.toLowerCase().includes(search.toLowerCase()) ||
    //             task.description.toLowerCase().includes(search.toLowerCase()));
    //     }
    //     return tasks;
    // }


    async getById(id: number): Promise<Task> {
        const task: Task = await this.taskRepository.findOne(id);

        if (!task) {
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }

        return task;
    }


    async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
        const task: Task = await this.getById(id);
        task.status = status;
        await task.save();
        return task;
    }

    async create(createTaskDto: CreateTaskDto): Promise<Task> {
        return this.taskRepository.createTask(createTaskDto);
    }

    async delete(id: number): Promise<void> {
        const result: DeleteResult = await this.taskRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }
    }
}