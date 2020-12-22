import {EntityRepository, Repository, SelectQueryBuilder} from "typeorm";
import {Task} from "./task.entity";
import {CreateTaskDto} from "./dto/create-task.dto";
import {TaskStatus} from "./task-status.enum";
import {GetTasksFilterDto} from "./dto/get-tasks-filter.dto";
import {User} from "../auth/user.entity";

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {

    async list(filterDto: GetTasksFilterDto): Promise<Task[]> {
        const {status, search} = filterDto;
        const query: SelectQueryBuilder<Task> = this.createQueryBuilder('task');
        if (status) {
            query.andWhere('task.status = :status', {status})
        }
        if (search) {
            query.andWhere('(task.title LIKE :search OR task.description LIKE :search)', {search: `%${search}%`})
        }
        return await query.getMany();
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
        return task;
    }
}