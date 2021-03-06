import {EntityRepository, Repository, SelectQueryBuilder} from "typeorm";
import {Task} from "./task.entity";
import {CreateTaskDto} from "./dto/create-task.dto";
import {TaskStatus} from "./task-status.enum";
import {GetTasksFilterDto} from "./dto/get-tasks-filter.dto";
import {User} from "../auth/user.entity";
import {GetUser} from "../auth/get-user.decorator";
import {InternalServerErrorException, Logger} from "@nestjs/common";

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
    logger: Logger = new Logger('TaskRepository');

    async list(
        filterDto: GetTasksFilterDto,
        @GetUser() user: User
    ): Promise<Task[]> {
        const {status, search} = filterDto;
        const query: SelectQueryBuilder<Task> = this.createQueryBuilder('task');
        query.where('task.userId = :userId', {userId: user.id});
        if (status) {
            query.andWhere('task.status = :status', {status})
        }
        if (search) {
            query.andWhere('(task.title LIKE :search OR task.description LIKE :search)', {search: `%${search}%`})
        }

        try {
            return await query.getMany();
        } catch (error) {
            this.logger.error(`Failed to get task for ${user.username}. Filters: ${JSON.stringify(filterDto)}`, error.stack);
            throw new InternalServerErrorException();
        }

    }

    async createTask(
        createTaskDto: CreateTaskDto,
        user: User
    ): Promise<Task> {
        const {title, description} = createTaskDto;
        const task: Task = new Task();
        task.title = title;
        task.description = description;
        task.status = TaskStatus.OPEN;
        task.user = user;
        await task.save();
        delete task.user;
        return task;
    }
}