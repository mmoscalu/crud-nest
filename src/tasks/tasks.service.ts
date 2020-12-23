import {Injectable, NotFoundException} from '@nestjs/common';
import {CreateTaskDto} from "./dto/create-task.dto";
import {TaskRepository} from "./task.repository";
import {InjectRepository} from "@nestjs/typeorm";
import {Task} from "./task.entity";
import {DeleteResult} from "typeorm";
import {TaskStatus} from "./task-status.enum";
import {GetTasksFilterDto} from "./dto/get-tasks-filter.dto";
import {User} from "../auth/user.entity";
import {GetUser} from "../auth/get-user.decorator";

@Injectable()
export class TasksService {

    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository
    ) {
    }

    async list(
        filterDto: GetTasksFilterDto,
        user: User
    ): Promise<Task[]> {
        return this.taskRepository.list(filterDto, user);
    }


    async getById(
        id: number,
        user: User
    ): Promise<Task> {
        const task: Task = await this.taskRepository.findOne({where: {id, userId: user.id}});

        if (!task) {
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }

        return task;
    }


    async updateTaskStatus(
        id: number,
        status: TaskStatus,
        user: User
    ): Promise<Task> {
        const task: Task = await this.getById(id, user);
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

    async delete(
        id: number,
        user: User
    ): Promise<void> {
        const result: DeleteResult = await this.taskRepository.delete({id, userId: user.id});
        if (result.affected === 0) {
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }
    }
}