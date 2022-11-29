
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ScheduleModule } from '@syncfusion/ej2-angular-schedule';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { DayService, WeekService, WorkWeekService, MonthService, AgendaService, MonthAgendaService,PopupOpenEventArgs} from '@syncfusion/ej2-angular-schedule';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { DateTimePickerModule } from '@syncfusion/ej2-angular-calendars';
import { TextBoxModule} from '@syncfusion/ej2-angular-inputs';


/**
 * Module
 */
@NgModule({
    imports: [
        BrowserModule,
        TextBoxModule,
        ButtonModule,
        
        ScheduleModule,
      
        HttpClientModule,
        DropDownListModule,
        DateTimePickerModule,
        

    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent],
    providers: [DayService, 
                WeekService, 
                WorkWeekService, 
                MonthService,
                AgendaService,
                MonthAgendaService]
})
export class AppModule { }