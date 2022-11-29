
import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { ScheduleComponent, EventSettingsModel, DayService, WeekService, WorkWeekService, TimelineViewsService, MonthService, View, AgendaService, ActionEventArgs, actionBegin, DragAndDropService, PopupOpenEventArgs, EventRenderedArgs, popupOpen, RecurrenceEditor, CurrentAction, CallbackFunction, CellClickEventArgs, EJ2Instance, ResourceDetails, PopupCloseEventArgs, NavigatingEventArgs, TimeScaleModel, GroupModel, } from '@syncfusion/ej2-angular-schedule';
import { Button, ButtonComponent, ChangeEventArgs, CheckBox, CheckBoxComponent, ClickEventArgs, RadioButton } from '@syncfusion/ej2-angular-buttons';
import { CheckBoxModule } from '@syncfusion/ej2-angular-buttons';
import { Query } from '@syncfusion/ej2-data';

import { extend, createElement, addClass, removeClass, isNullOrUndefined, Internationalization, closest } from '@syncfusion/ej2-base';
import { myserviceService } from './service/myservice.service';
import { DropDownList, DropDownListComponent, Fields } from '@syncfusion/ej2-angular-dropdowns';
import { blockData, quickInfoTemplateData, resourceData, timelineResourceData } from "./data";
import { TextBoxComponent } from '@syncfusion/ej2-angular-inputs';
import { schedulermodel } from './schedulermodel';




@Component({
  selector: 'app-root',

  // specifies the template string for the Schedule component
  templateUrl: './app.component.html',
  styleUrls: ['app.component.css'],
  providers: [DayService, WeekService, WorkWeekService, MonthService, DragAndDropService, TimelineViewsService],
  encapsulation: ViewEncapsulation.None

})
export class AppComponent {
  title = 'app';

  constructor(public service: myserviceService) {
  }
  @ViewChild("scheduleObj")
  public scheduleObj!: ScheduleComponent;
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
  public categoryDataSource: Record<string, any>[] = [
    { text: 'Nancy [Admin]', id: 1, color: '#df5286' },
    { text: 'Steven [Software Engineer]', id: 2, color: '#7fa900' },
    { text: 'Robert [Support Engineer]', id: 3, color: '#ea7a57' },
    { text: 'Smith [Human Resource]', id: 4, color: '#5978ee' },
    { text: 'Michael [Technical Manager]', id: 5, color: '#df5186' }
  ];


  public eventSettings: EventSettingsModel = {
    dataSource: extend([], resourceData.concat(timelineResourceData), blockData, true) as Record<string, any>[],

    enableTooltip: true
  };
  public group: GroupModel = {
    enableCompactView: true,
    resources: ['Employee'],
  };

  public employeeDataSource: Record<string, any>[] = [
    { Text: 'Alice', Id: 1, GroupId: 1, Color: '#bbdc00', Designation: 'Service Administrator' },
    { Text: 'Nancy', Id: 2, GroupId: 2, Color: '#FF5733', Designation: 'Engineer' },
    { Text: 'Robert', Id: 3, GroupId: 1, Color: '#3346FF', Designation: ' Engineer' },
    { Text: 'Robson', Id: 4, GroupId: 2, Color: '#9e5fff', Designation: ' Engineer' },
    { Text: 'Laura', Id: 5, GroupId: 1, Color: '#FF3342', Designation: 'Engineer' },
    { Text: 'Margaret', Id: 6, GroupId: 2, Color: '#FF33E3', Designation: 'Engineer' }
  ];

  public getEmployeeName(value: ResourceDetails): string {
    return (value as ResourceDetails).resourceData[(value as ResourceDetails).resource.textField!] as string;
  }

  public getEmployeeDesignation(value: ResourceDetails): string {
    const resourceName: string = (value as ResourceDetails).resourceData[(value as ResourceDetails).resource.textField!] as string;
    return (value as ResourceDetails).resourceData['Designation'] as string;
  }

  public getEmployeeImageName(value: ResourceDetails): string {
    return this.getEmployeeName(value).toLowerCase();
  }




  public onPopupClose(args: PopupCloseEventArgs): void {
    console.log(args);
    if (args.type == "Editor")
      this.scheduleObj.eventWindow.refresh();

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
      console.log((document.querySelector('#StartTime') as any).ej2_instances[0].value.getHours());
      // console.log("bbbbb   ",document.getElementById('IsFirstHalf'))
      // if ((document.querySelector('#StartTime') as any).ej2_instances[0].value.getHours() == 8)
      // (document.querySelector('#IsFirstHalf') as any)!.ej2_instances[0].checked = true;

      allday!.addEventListener('click', function (event) {

        const checked = ((event.currentTarget as HTMLElement).querySelector('.e-checkbox') as any).ej2_instances[0].checked;
        if (checked) {
          (document.querySelector('#IsFirstHalf') as any)!.ej2_instances[0].checked = false;
          (document.querySelector('#IsSecondHalf') as any)!.ej2_instances[0].checked = false;
          // document.querySelector('.default-field-container')!.classList.add('e-disable');

        }

      });






      //   if (!args.element.querySelector('.custom-field-row')) {
      //     let row: HTMLElement = createElement('div', { className: 'custom-field-row' });
      //     let formElement: HTMLElement = <HTMLElement>args.element.querySelector('.e-schedule-form');
      //     formElement.firstChild!.insertBefore(row, args.element.querySelector('.e-title-location-row'));
      //     let container: HTMLElement = createElement('div', { className: 'custom-field-row' });
      //     let inputEle: HTMLInputElement = createElement('input', {
      //         className: 'e-field', attrs: { name: 'EventType' }
      //     }) as HTMLInputElement;
      //     container.appendChild(inputEle);
      //     row.appendChild(container);
      //     let drowDownList: DropDownList = new DropDownList({
      //         dataSource: [
      //             { text: 'Start', value: 'start', id:'start' },
      //             { text: 'Stop', value: 'stop', id:'stop' }

      //         ],
      //         fields: { text: 'text', value: 'value' },
      //         value: (args.data as { [key: string]: Object })['EventType'] as string,
      //          placeholder: 'Work Status',
      //         change:onChange
      //     });
      //     function onChange(args:any){
      //       debugger;
      //       // You can add your code here.
      //       alert("Event Start/Stop Called");
      //       console.log(args);
      //     }
      //     drowDownList.appendTo(inputEle);
      //     inputEle.setAttribute('name', 'EventType');
      // }
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
          // checked:true,


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
            // checked:true,


          });
          checkbox.appendTo(inputEle);
          inputEle.setAttribute('name', 'IsSecondHalf');

          const row: HTMLElement = createElement('div', {
            className: 'custom-field-row1'
          });
          //   const defaultContainer: HTMLElement = createElement('div', {
          //     className: 'default-field-container ',
          //   });
          //   const inputEle1: HTMLElement = createElement('input', {
          //     className: 'e-field',
          //     attrs: { label: 'Radiobutton' },
          //   });

          //   inputEle1.setAttribute('data-name', 'state');
          //   const inputEle2: HTMLElement = createElement('input', {
          //     className: 'e-field',
          //     attrs: { label: 'Radiobutton' },
          //   });
          //   inputEle2.setAttribute('data-name', 'state');
          //   formElement.firstChild!.insertBefore(
          //     defaultContainer,
          //     args.element.querySelector('.e-time-zone-row')
          //   );
          //   defaultContainer.appendChild(inputEle1);
          //   defaultContainer.appendChild(inputEle2);
          //   const radiobutton1: RadioButton = new RadioButton({
          //     label: 'First Half',
          //     name: 'state',
          //     value: '1',
          //     checked: true,

          //     change: this.OnfirstsecondhalfChange.bind(this)

          //   });
          //   radiobutton1.appendTo(inputEle1);

          //   const radiobutton2: RadioButton = new RadioButton({
          //     label: 'Second Half',
          //     name: 'state',
          //     value: '2',
          //     change: this.OnfirstsecondhalfChange.bind(this)
          //   });


          //   radiobutton2.appendTo(inputEle2);





          // }

        }
      }
    }
  }



  private onFirstHalfChange(args: ChangeEventArgs): void {
    // const radiobuttondiv: HTMLElement = document.querySelector(
    //   '.default-field-container'
    // ) as HTMLElement;
    const timezonediv: HTMLElement = document.querySelector(
      `.e-time-zone-container `

    ) as HTMLElement;




    if (args.checked == true) {

      // addClass([radiobuttondiv], 'e-enable');
      // document.querySelector('.default-field-container')!.classList.value='default-field-container'
      // document.querySelector('.default-field-container')!.classList.add('e-enable');
      document.querySelector('.e-time-zone-container')!.classList.add('e-disable');
      (document.querySelector('#IsAllDay') as any)!.ej2_instances[0].checked = false;
      (document.querySelector('#IsSecondHalf') as any)!.ej2_instances[0].checked = false;


      // document.querySelector('.e-all-day-container')!.classList.add('e-disable');
      (document.querySelector('#StartTime') as any).ej2_instances[0].format = "MM/dd/yy h:mm a";
      (document.querySelector('#StartTime') as any).ej2_instances[0].format = "M/dd/yy h:mm a";
      (document.querySelector('#EndTime') as any).ej2_instances[0].format = "MM/dd/yy h:mm a";
      (document.querySelector('#EndTime') as any).ej2_instances[0].format = "M/dd/yy h:mm a";
      (document.querySelector('#StartTime') as any).ej2_instances[0].value.setHours(8, 0, 0);
      (document.querySelector('#EndTime') as any).ej2_instances[0].value.setHours(12, 0, 0);
      (document.querySelector('#StartTime') as any).ej2_instances[0].dataBind();




    } else {

      // removeClass([radiobuttondiv], 'e-enable');
      document.querySelector('.e-time-zone-container')!.classList.remove('e-disable');
      //document.querySelector('.e-all-day-container')!.classList.remove('e-disable');



    }


  }
  private onSecondHalfChange(args: ChangeEventArgs): void {
    // const radiobuttondiv: HTMLElement = document.querySelector(
    //   '.default-field-container'
    // ) as HTMLElement;
    const timezonediv: HTMLElement = document.querySelector(
      `.e-time-zone-container `

    ) as HTMLElement;




    if (args.checked == true) {

      // addClass([radiobuttondiv], 'e-enable');
      // document.querySelector('.default-field-container')!.classList.value='default-field-container'
      // document.querySelector('.default-field-container')!.classList.add('e-enable');
      document.querySelector('.e-time-zone-container')!.classList.add('e-disable');
      (document.querySelector('#IsAllDay') as any)!.ej2_instances[0].checked = false;
      (document.querySelector('#IsFirstHalf') as any)!.ej2_instances[0].checked = false;

      // document.querySelector('.e-all-day-container')!.classList.add('e-disable');
      (document.querySelector('#StartTime') as any).ej2_instances[0].format = "MM/dd/yy h:mm a";
      (document.querySelector('#StartTime') as any).ej2_instances[0].format = "M/dd/yy h:mm a";
      (document.querySelector('#EndTime') as any).ej2_instances[0].format = "MM/dd/yy h:mm a";
      (document.querySelector('#EndTime') as any).ej2_instances[0].format = "M/dd/yy h:mm a";
      (document.querySelector('#StartTime') as any).ej2_instances[0].value.setHours(12, 0, 0);
      (document.querySelector('#EndTime') as any).ej2_instances[0].value.setHours(16, 0, 0);
      (document.querySelector('#StartTime') as any).ej2_instances[0].dataBind();




    } else {

      // removeClass([radiobuttondiv], 'e-enable');
      document.querySelector('.e-time-zone-container')!.classList.remove('e-disable');
      //document.querySelector('.e-all-day-container')!.classList.remove('e-disable');



    }


  }








  private onChange(args: ChangeEventArgs): void {
    console.log("aaaaaaaaaa", (document.querySelector('#IsAllDay') as any).ej2_instances[0].checked);

    const radiobuttondiv: HTMLElement = document.querySelector(
      '.default-field-container'
    ) as HTMLElement;
    if (args.checked) {


      addClass([radiobuttondiv], 'e-enable');
    } else {
      removeClass([radiobuttondiv], 'e-enable');

    }
  }





  ngoninIt() {
    this.getschedule;
  }
  public getschedule() {
    this.service.getSchedule().subscribe(res => {
        let data: any = res;
        this.getSchedulerView = [];
        Object.entries(res).map(x=>{
          console.log(x);
          this.getSchedulerView.push({
            Id: data[x[0]].id,
            StartTime: data[x[0]].startTime,
            EndTime: data[x[0]].endTime,
            IsAllDay: data[x[0]].isAllDay,
            Subject: data[x[0]].subject,
            Description: data[x[0]].description,
            Location: data[x[0]].location
          });
        })
        // for (let i = 0; i < data.length; i++) {

        //   this.getSchedulerView.push({
        //     Id: data[i].id,
        //     StartTime: data[i].startTime,
        //     EndTime: data[i].endTime,
        //     IsAllDay: data[i].isAllDay,
        //     Subject: data[i].subject,
        //     Description: data[i].description,
        //     Location: data[i].location,


        //   })

        // }
        this.scheduleObj.eventSettings.dataSource = this.getSchedulerView;
     
        // this.scheduleObj.refreshEvents();
        console.log(this.eventSettings.dataSource);
        console.log(this.getSchedulerView);


        console.log("success!");
      },
      err => { console.log(err); }
    )
  }

  scheduler!: schedulermodel;
  public onActionBegin(args: any): void {

    console.log("2" + args.addedRecords == null);
    console.log("4" + args.changedRecords != null);

    if (args.requestType == "toolbarItemRendering" && args.name == 'actionBegin') {
      this.getschedule();
    }
    else if (args.requestType == 'eventCreate' && args.name == 'actionBegin') {
      console.log(args.data[0]);
      
      var abc: schedulermodel = {
        "description": args.data[0].Description,
        "id": args.data[0].Id,
        "subject": args.data[0].Subject,
        "location": args.data[0].Location,
        "endTime": args.data[0].EndTime,
        "startTime": args.data[0].StartTime,
        "isAllDay": args.data[0].IsAllDay,
        "halfDay":"PM",
        "employeeId":10
      }

      this.service.postSchedule(abc).subscribe();

    }

    else if (args.requestType == 'eventChange' && args.name == 'actionBegin' && args.changedRecords != null) {
      console.log(args);
      
      var abc: schedulermodel = {
        "description": args.data.Description,
        "id": args.data.Id,
        "subject": args.data.Subject,
        "location": args.data.Location,
        "endTime": args.data.EndTime,
        "startTime": args.data.StartTime,
        "isAllDay": args.data.IsAllDay,
        "halfDay":"PM",
        "employeeId":10
      }
      this.service.updateSchedule(args.data.Id,abc).subscribe(result=>{
        console.log(result);
        
      })
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




  private onchange1() {
    (document.querySelector('#StartTime') as any).ej2_instances[0].format = "M/dd/yy h:mm a";
    (document.querySelector('#EndTime') as any).ej2_instances[0].format = "M/dd/yy h:mm a";
    (document.querySelector('#StartTime') as any).ej2_instances[0].value.setHours(8, 0, 0);
    (document.querySelector('#EndTime') as any).ej2_instances[0].value.setHours(12, 0, 0);
    (document.querySelector('#StartTime') as any).ej2_instances[0].dataBind();
    console.log("working")
  }

  private onchange2() {
    console.log((document.querySelector('#StartTime') as any).ej2_instances[0].value);
    (document.querySelector('#StartTime') as any).ej2_instances[0].format = "MM/dd/yy h:mm a";
    (document.querySelector('#StartTime') as any).ej2_instances[0].format = "M/dd/yy h:mm a";
    (document.querySelector('#EndTime') as any).ej2_instances[0].format = "MM/dd/yy h:mm a";
    (document.querySelector('#EndTime') as any).ej2_instances[0].format = "M/dd/yy h:mm a";
    (document.querySelector('#StartTime') as any).ej2_instances[0].value.setHours(2, 0, 0);
    (document.querySelector('#EndTime') as any).ej2_instances[0].value.setHours(18, 0, 0);
    (document.querySelector('#StartTime') as any).ej2_instances[0].dataBind();
    console.log("working1")
    console.log((document.querySelector('#StartTime') as any).ej2_instances[0].value);
  }

  public onAddClick(): void {
    this.onCloseClick();
    const data: Object = this.scheduleObj.getCellDetails(this.scheduleObj.getSelectedElements()) as Object;
    const eventData: { [key: string]: Object } = this.scheduleObj.eventWindow.getObjectFromFormData('e-quick-popup-wrapper');
    this.scheduleObj.eventWindow.convertToEventData(data as { [key: string]: Object }, eventData);
    eventData['Id'] = this.scheduleObj.eventBase.getEventMaxID() as number + 1;
    this.scheduleObj.addEvent(eventData);
  }
  public onEditClick(args: any): void {
    if (this.selectionTarget) {
      let eventData: { [key: string]: Object } = this.scheduleObj.getEventDetails(this.selectionTarget) as { [key: string]: Object };
      let currentAction: CurrentAction = 'Save';
      if (!isNullOrUndefined(eventData['RecurrenceRule']) && eventData['RecurrenceRule'] !== '') {
        if (args.target.classList.contains('e-edit-series')) {
          currentAction = 'EditSeries';
          eventData = this.scheduleObj.eventBase.getParentEvent(eventData, true);
        } else {
          currentAction = 'EditOccurrence';
        }
      }
      this.scheduleObj.openEditor(eventData, currentAction);
    }
  }
  public onDeleteClick(args: any): void {
    this.onCloseClick();
    if (this.selectionTarget) {
      const eventData: { [key: string]: Object } = this.scheduleObj.getEventDetails(this.selectionTarget) as { [key: string]: Object };
      let currentAction: CurrentAction | undefined = undefined;
      if (!isNullOrUndefined(eventData['RecurrenceRule']) && eventData['RecurrenceRule'] !== '') {
        currentAction = args.target.classList.contains('e-delete-series') ? 'DeleteSeries' : 'DeleteOccurrence';
      }
      this.scheduleObj.deleteEvent(eventData, currentAction);
    }
  }
  public onCloseClick(): void {
    this.scheduleObj.quickPopup.quickPopupHide();
  }
  public onCustomClick(): void {
    alert("customized icon triggered");
  }
}




