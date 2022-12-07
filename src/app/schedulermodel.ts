export class schedulermodel {
    id!: number;
    subject!: string;
    description!: string;
    location!: string;
    startTime!: Date;
    endTime!: Date;
    isAllDay!: boolean;
    halfDay!: string;
    userId!: number;
    username!: string;
    roleId!: number;
    rolename!: string;
    imageurl!: string;
    employeeId!: number;


}

export class insertmodel
{
    id!: number;
    subject!: string;
    description!: string;
    location!: string;
    startTime!: string;
    endTime!: string;
    isAllDay!: boolean;
    halfDay!: string;
    employeeId!: number;
 
}