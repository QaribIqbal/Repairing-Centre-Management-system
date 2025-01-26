import { DatePickerModule } from 'primeng/datepicker';
import { CalendarModule } from 'primeng/calendar';
import { FloatLabelModule } from 'primeng/floatlabel';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-add-appliance',
  imports: [FloatLabelModule,CalendarModule,DatePickerModule,CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './add-appliance.component.html',
  styleUrl: './add-appliance.component.css'
})
export class AddApplianceComponent {
date2: any;
date3: any;
startDate: Date | null = null; // Holds the selected start date
endDate: Date | null = null;

}
