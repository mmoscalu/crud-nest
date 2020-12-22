import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    UseGuards,
    UsePipes,
    ValidationPipe
} from '@nestjs/common';
import {TasksService} from "./tasks.service";
import {CreateTaskDto} from "./dto/create-task.dto";
import {Task} from "./task.entity";
import {TaskStatusValidationPipe} from "./pipes/task-status-validation.pipe";
import {TaskStatus} from "./task-status.enum";
import {GetTasksFilterDto} from "./dto/get-tasks-filter.dto";
import {AuthGuard} from "@nestjs/passport";
import {GetUser} from "../auth/get-user.decorator";
import {User} from "../auth/user.entity";

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {

    constructor(
        private tasksService: TasksService
    ) {
    }

    @Get()
    list(@Query(ValidationPipe) filterDto: GetTasksFilterDto): Promise<Task[]> {
        return this.tasksService.list(filterDto);
    }

    @Get('/:id')
    getById(@Param('id', ParseIntPipe) id: number): Promise<Task> {
        return this.tasksService.getById(id);
    }

    @Patch('/:id/status')
    updateTaskStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body('status', TaskStatusValidationPipe) status: TaskStatus
    ): Promise<Task> {
        return this.tasksService.updateTaskStatus(id, status);
    }

    @Post()
    @UsePipes(ValidationPipe)
    create(
        @Body() createTaskDto: CreateTaskDto,
        @GetUser() user: User
    ): Promise<Task> {
        return this.tasksService.create(createTaskDto, user);
    }

    @Delete('/:id')
    delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.tasksService.delete(id);
    }
}