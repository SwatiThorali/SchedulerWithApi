
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ScheduleComponent, EventSettingsModel, DayService, WeekService, WorkWeekService, TimelineViewsService, MonthService, View, AgendaService, ActionEventArgs, actionBegin, DragAndDropService, PopupOpenEventArgs, EventRenderedArgs, popupOpen, RecurrenceEditor, CurrentAction, CallbackFunction, CellClickEventArgs, EJ2Instance, ResourceDetails, PopupCloseEventArgs, NavigatingEventArgs, TimeScaleModel, GroupModel, TimelineMonthService, } from '@syncfusion/ej2-angular-schedule';
import { Button, ButtonComponent, ChangeEventArgs, CheckBox, CheckBoxComponent, ClickEventArgs, RadioButton } from '@syncfusion/ej2-angular-buttons';
import { CheckBoxModule } from '@syncfusion/ej2-angular-buttons';
import { Query } from '@syncfusion/ej2-data';
import { extend, createElement, addClass, removeClass, isNullOrUndefined, Internationalization, closest } from '@syncfusion/ej2-base';
import { myserviceService } from './service/myservice.service';
import { DropDownList, DropDownListComponent, Fields } from '@syncfusion/ej2-angular-dropdowns';
import { blockData, quickInfoTemplateData, resourceData, timelineResourceData } from "./data";
import { TextBoxComponent } from '@syncfusion/ej2-angular-inputs';
import { schedulermodel } from './schedulermodel';
import { insertmodel } from './schedulermodel';


@Component({
  selector: 'app-root',

  // specifies the template string for the Schedule component
  templateUrl: './app.component.html',
  styleUrls: ['app.component.css'],
  providers: [DayService, WeekService, WorkWeekService, MonthService, DragAndDropService, TimelineViewsService, TimelineMonthService],
  encapsulation: ViewEncapsulation.None

})
export class AppComponent implements OnInit {
  title = 'app';

  constructor(public service: myserviceService) {
  }
  ngOnInit(): void {
    //throw new Error('Method not implemented.');
  }

  @ViewChild("halfday")
  public halfdayObj!: CheckBoxComponent;
  @ViewChild("addButton")
  public addButton!: ButtonComponent;
  @ViewChild('eventTypeObj') public eventTypeObj!: DropDownListComponent;
  @ViewChild('titleObj') public titleObj!: TextBoxComponent;
  @ViewChild('notesObj') public notesObj!: TextBoxComponent;
  public selectedDate: Date = new Date();
  private selectionTarget!: Element;
  public currentView: View = 'TimelineWeek'
  public virtualScroll = true;
  public getSchedulerView: any = [];
  public groupData: GroupModel = {
    enableCompactView: false,
    resources: ['User'],
  };

  public userDataSource: object[] = [
    { Name: 'Alice', EmployeeId: 1, Color: '#bbdc00', Rolename: 'Service Administrator' },
    { Name: 'Nancy', EmployeeId: 2, Color: '#FF5733', Rolename: 'Engineer' },
    { Name: 'Robert', EmployeeId: 3, Color: '#3346FF', Rolename: ' Engineer' },
    { Name: 'Robson', EmployeeId: 4, Color: '#9e5fff', Rolename: ' Engineer' },
    { Name: 'Laura', EmployeeId: 5, Color: '#FF3342', Rolename: 'Engineer' },
    { Name: 'Margaret', EmployeeId: 6, Color: '#FF33E3', Rolename: 'Engineer' }
  ];

  public getEmployeeName(value: ResourceDetails): string {
    return (value as ResourceDetails).resourceData[(value as ResourceDetails).resource.textField!] as string;
  }

  public getEmployeeRolename(value: ResourceDetails): string {
    const resourceName: string = (value as ResourceDetails).resourceData[(value as ResourceDetails).resource.textField!] as string;
    return (value as ResourceDetails).resourceData['Rolename'] as string;
  }

  public getEmployeeImageName(value: ResourceDetails): string {
    return this.getEmployeeName(value).toLowerCase();
  }

  public onPopupClose(args: PopupCloseEventArgs): void {
    console.log(args);
    if (args.type == "Editor")
      this.scheduleObj.eventWindow.refresh();
    this.firsthalf = this.secondhalf = false;
    console.log(this.firsthalf,this.secondhalf);
    
  }

  public onEventRendered(args: EventRenderedArgs): void {
    const categoryColor: string = args.data['CategoryColor'] as string;
    if (!args.element || !categoryColor) {
      return;
    }
    if (this.scheduleObj.currentView === 'Agenda') {
      (args.element.firstChild as HTMLElement).style.borderLeftColor = categoryColor;
    } else {
      args.element.style.backgroundColor = categoryColor;
    }
  }

  public onNavigating(args: NavigatingEventArgs) {
    let weekView: boolean = args.action === 'view' ? args.currentView === 'TimelineWeek' : this.scheduleObj.currentView === 'TimelineWeek';
    this.scheduleObj.headerRows = weekView ? [{ option: 'Date' }] : [{ option: 'Date' }, { option: 'Hour' }];
  }

  public timeScale: TimeScaleModel = { enable: true, interval: 240, slotCount: 1 };
  firsthalf = false;
  secondhalf = false;

  public onPopupOpen(args: PopupOpenEventArgs): void {
    this.selectionTarget = null!;
    this.selectionTarget = args.target!;

    if (args.type == 'QuickInfo' && args.target && args.target.classList.contains('e-appointment')) {

      const formElement: HTMLElement = args.element.querySelector(
        '.e-event-popup'
      ) as HTMLElement;
      const buttonEle: HTMLElement = createElement('button', {
        className: 'e-start-stop e-text-ellipsis e-lib e-flat',
        innerHTML: "Start"
      });

      (formElement.querySelector('.e-popup-footer') as HTMLElement).appendChild(buttonEle);
      const button: Button = new Button({
      });
      button.appendTo(buttonEle);
      button.element.onclick = (): void => {

        alert("Task has been started");
        this.scheduleObj.closeQuickInfoPopup();
      };
    }

    const allday = document.querySelector('.e-all-day-container');

    if (args.type === 'Editor') {
      if ((document.querySelector('#StartTime') as any).ej2_instances[0].value.getHours() == 8) {
        console.log("firsthalfff", (document.querySelector('#StartTime') as any).ej2_instances[0].value.getHours());
        this.secondhalf = false;
        this.firsthalf = true;
      } else if (
        (
          document.querySelector('#StartTime') as any
        ).ej2_instances[0].value.getHours() == 12
      ) {
        console.log("secondHalff", (document.querySelector('#StartTime') as any).ej2_instances[0].value.getHours());
        this.firsthalf = false;
        this.secondhalf = true;
      }
      allday!.addEventListener('click', function (event) {

        const checked = ((event.currentTarget as HTMLElement).querySelector('.e-checkbox') as any).ej2_instances[0].checked;
        if (checked) {
          (document.querySelector('#IsFirstHalf') as any)!.ej2_instances[0].checked = false;
          (document.querySelector('#IsSecondHalf') as any)!.ej2_instances[0].checked = false;

        }

      });

      let dialog = (args.element as any).ej2_instances[0];
      dialog.open = (e: any) => {
        let startTimeObj =
          e.element.querySelector('#StartTime').ej2_instances[0];
        startTimeObj.renderDayCell = (args: any) => {
          /*Date need to be disabled*/
          if (args.date.getDay() === 0 || args.date.getDay() === 6) {
            args.isDisabled = true;
          }
          let endTimeObj =
            e.element.querySelector('#EndTime').ej2_instances[0];
          endTimeObj.renderDayCell = (args: any) => {
            if (args.date.getDay() === 0 || args.date.getDay() === 6) {
              args.isDisabled = true;
            }
          }
        };
      };

      if (!args.element.querySelector('.custom-field-container')) {
        // Create required custom elements in initial time
        const formElement: HTMLElement = args.element.querySelector(
          '.e-schedule-form'
        ) as HTMLElement;
        const container: HTMLElement = createElement('div', {
          className: 'custom-field-container',
        });
        const inputEle: HTMLElement = createElement('input', {
          className: 'e-checkbox',
          id: 'IsFirstHalf',
          attrs: { label: 'FirstHalf' },
        });
        (
          formElement.querySelector('.e-all-day-time-zone-row') as HTMLElement
        ).appendChild(container);
        container.appendChild(inputEle);
        const checkbox: CheckBox = new CheckBox({
          label: 'First Half',
          change: this.onFirstHalfChange.bind(this),
          checked: this.firsthalf,


        });
        checkbox.appendTo(inputEle);
        inputEle.setAttribute('name', 'IsFirstHalf');

        const row: HTMLElement = createElement('div', {
          className: 'custom-field-row'
        });
        if (!args.element.querySelector('.custom-field-container1')) {
          // Create required custom elements in initial time
          const formElement: HTMLElement = args.element.querySelector(
            '.e-schedule-form'
          ) as HTMLElement;
          const container: HTMLElement = createElement('div', {
            className: 'custom-field-container1',
          });
          const inputEle: HTMLElement = createElement('input', {
            className: 'e-checkbox',
            id: 'IsSecondHalf',
            attrs: { label: 'Second' },
          });
          (
            formElement.querySelector('.e-all-day-time-zone-row') as HTMLElement
          ).appendChild(container);
          container.appendChild(inputEle);
          const checkbox: CheckBox = new CheckBox({
            label: 'Second Half',
            change: this.onSecondHalfChange.bind(this),
            checked: this.secondhalf,
          });
          checkbox.appendTo(inputEle);
          inputEle.setAttribute('name', 'IsSecondHalf');

          const row: HTMLElement = createElement('div', {
            className: 'custom-field-row1'
          });
        }
      }
    }
  }

  private onFirstHalfChange(args: ChangeEventArgs): void {

    const timezonediv: HTMLElement = document.querySelector(
      `.e-time-zone-container `

    ) as HTMLElement;

    if (args.checked == true) {
      //document.querySelector('.e-time-zone-container')!.classList.add('e-disable');
      (document.querySelector('#IsAllDay') as any)!.ej2_instances[0].checked = false;
      (document.querySelector('#IsSecondHalf') as any)!.ej2_instances[0].checked = false;
      (document.querySelector('#StartTime') as any).ej2_instances[0].format = "MM/dd/yy h:mm a";
      (document.querySelector('#StartTime') as any).ej2_instances[0].format = "M/dd/yy h:mm a";
      (document.querySelector('#EndTime') as any).ej2_instances[0].format = "MM/dd/yy h:mm a";
      (document.querySelector('#EndTime') as any).ej2_instances[0].format = "M/dd/yy h:mm a";
      (document.querySelector('#StartTime') as any).ej2_instances[0].value.setHours(8, 0, 0);
      (document.querySelector('#EndTime') as any).ej2_instances[0].value.setHours(12, 0, 0);
      (document.querySelector('#StartTime') as any).ej2_instances[0].dataBind();
    }
  }

  private onSecondHalfChange(args: ChangeEventArgs): void {

    if (args.checked == true) {
      // document.querySelector('.e-time-zone-container')!.classList.add('e-disable');
      (document.querySelector('#IsAllDay') as any)!.ej2_instances[0].checked = false;
      (document.querySelector('#IsFirstHalf') as any)!.ej2_instances[0].checked = false;
      (document.querySelector('#StartTime') as any).ej2_instances[0].format = "MM/dd/yy h:mm a";
      (document.querySelector('#StartTime') as any).ej2_instances[0].format = "M/dd/yy h:mm a";
      (document.querySelector('#EndTime') as any).ej2_instances[0].format = "MM/dd/yy h:mm a";
      (document.querySelector('#EndTime') as any).ej2_instances[0].format = "M/dd/yy h:mm a";
      (document.querySelector('#StartTime') as any).ej2_instances[0].value.setHours(12, 0, 0);
      (document.querySelector('#EndTime') as any).ej2_instances[0].value.setHours(16, 0, 0);
      (document.querySelector('#StartTime') as any).ej2_instances[0].dataBind();

    }
  }
  
  // ngoninIt(): void {
  //   this.getschedule;
  // }
  public eventSettings: EventSettingsModel = {

    enableTooltip: true
  };
  @ViewChild('scheduleObj')
  public scheduleObj!: ScheduleComponent;
  getschedule() {
    this.service.getSchedule().subscribe(res => {
      let data: any = res;
      this.getSchedulerView = [];
      Object.entries(res).map(x => {
        console.log(x);
        this.getSchedulerView.push({
          Id: data[x[0]].id,
          StartTime: data[x[0]].startTime,
          EndTime: data[x[0]].endTime,
          IsAllDay: data[x[0]].isAllDay,
          Subject: data[x[0]].subject,
          Description: data[x[0]].description,
          Location: data[x[0]].location,
          HalfDay: data[x[0]].halfDay,
          EmployeeId: data[x[0]].employeeId,
          UserId: data[x[0]].userId,
          Username: data[x[0]].username,
          RoleId: data[x[0]].roleId,
          Rolename: data[x[0]].rolename,
          Imageurl: data[x[0]].imageurl
        });
      })
      this.scheduleObj.eventSettings.dataSource = this.getSchedulerView;
    }
    )
  }

  getUsers() {
    this.service.getUsers().subscribe(res => {
    })
  }

  scheduler!: schedulermodel;
  public onActionBegin(args: any): void {
    if (args.requestType == "toolbarItemRendering" && args.name == 'actionBegin') {
      this.getschedule();
    }
    else if (args.requestType == 'eventCreate' && args.name == 'actionBegin') {
      console.log(args.data[0]);

      var abc: insertmodel = {
        "id": args.data[0].Id,
        "subject": args.data[0].Subject,
        "description": args.data[0].Description,
        "location": args.data[0].Location,
        "startTime": args.data[0].StartTime,
        "endTime": args.data[0].EndTime,
        "isAllDay": args.data[0].IsAllDay,
        "halfDay": "PM",
        "employeeId": args.data[0].UserId
      }
      this.service.postSchedule(abc).subscribe();
    }

    else if (args.requestType == 'eventChange' && args.name == 'actionBegin' && args.changedRecords != null) {
      console.log(args);
      var abc: insertmodel = {
        "id": args.data.Id,
        "subject": args.data.Subject,
        "description": args.data.Description,
        "location": args.data.Location,
        "startTime": args.data.StartTime,
        "endTime": args.data.EndTime,
        "isAllDay": args.data.IsAllDay,
        "halfDay": "PM",
        "employeeId": args.data.UserId
      }

      this.service.updateSchedule(abc).subscribe()
    }

    else if (args.requestType == "eventRemove" && args.name == 'actionBegin') {
      this.service.deleteSchedule(args.data[0].Id).subscribe(
        res => {
          console.log("success!");
        },
        err => { console.log(err); }
      )
    }
  }
}




