import {Injectable, NotFoundException} from '@nestjs/common';
import {CreateTaskDto} from "./dto/create-task.dto";
import {TaskRepository} from "./task.repository";
import {InjectRepository} from "@nestjs/typeorm";
import {Task} from "./task.entity";
import {DeleteResult} from "typeorm";
import {TaskStatus} from "./task-status.enum";
import {GetTasksFilterDto} from "./dto/get-tasks-filter.dto";
import {User} from "../auth/user.entity";

@Injectable()
export class TasksService {

    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository
    ) {
    }

    async list(filterDto: GetTasksFilterDto): Promise<Task[]> {
        return this.taskRepository.list(filterDto);
    }


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

    async create(
        createTaskDto: CreateTaskDto,
        user: User
    ): Promise<Task> {
        return this.taskRepository.createTask(createTaskDto, user);
    }

    async delete(id: number): Promise<void> {
        const result: DeleteResult = await this.taskRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }
    }
}