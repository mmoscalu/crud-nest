import {Body, Controller, Delete, Get, Param, Patch, Post, Query, UsePipes, ValidationPipe} from '@nestjs/common';
import {TasksService} from "./tasks.service";
import {Task, TaskStatus} from "./task.model";
import {CreateTaskDto} from "./dto/create-task.dto";
import {GetTasksFilterDto} from "./dto/get-tasks-filter.dto";

@Controller('tasks')
export class TasksController {

    constructor(
        private tasksService: TasksService
    ) {
    }

    @Get()
    list(@Query() filterDto: GetTasksFilterDto): Task[] {
        if (Object.keys(filterDto).length) {
            return this.tasksService.listWithFilter(filterDto);
        } else {
            return this.tasksService.list();
        }
    }

    @Get('/:id')
    getById(@Param('id') id: string): Task {
        return this.tasksService.getById(id);
    }

    @Patch('/:id/status')
    updateTaskStatus(
        @Param('id') id: string,
        @Body('status') status: TaskStatus
    ): Task {
        return this.tasksService.updateTaskStatus(id, status);
    }

    @Post()
    @UsePipes(ValidationPipe)
    create(@Body() createTaskDto: CreateTaskDto): Task {
        return this.tasksService.create(createTaskDto);
    }

    @Delete('/:id')
    delete(@Param('id') id: string): void {
        this.tasksService.delete(id);
    }
}