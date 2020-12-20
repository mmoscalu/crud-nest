import {BadRequestException, PipeTransform} from "@nestjs/common";
import {TaskStatus} from "../task-status.enum";

export class TaskStatusValidationPipe implements PipeTransform {

    readonly allowedStatus: TaskStatus[] = [
        TaskStatus.OPEN,
        TaskStatus.IN_PROGRESS,
        TaskStatus.DONE
    ]

    transform(status: any): string {
        status = status.toUpperCase();
        if (!this.isStatusValid(status)) {
            throw new BadRequestException(`${status} is not valid status`);
        }
        return status;
    }

    isStatusValid(status: TaskStatus) {
        const index: number = this.allowedStatus.indexOf(status);
        return index !== -1;
    }
}