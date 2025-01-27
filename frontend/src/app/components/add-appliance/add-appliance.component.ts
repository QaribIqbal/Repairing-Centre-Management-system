import { ApiService } from './../../api.service';
import { DatePickerModule } from 'primeng/datepicker';
 import { CalendarModule } from 'primeng/calendar';
import { FloatLabelModule } from 'primeng/floatlabel';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import Swal from 'sweetalert2';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
@Component({
  selector: 'app-add-appliance',
  imports: [
    FloatLabelModule,
     CalendarModule,
    DatePickerModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './add-appliance.component.html',
})
export class AddApplianceComponent {
  date2: any;
  date3: any;
  startDate: Date | null = null; // Holds the selected start date
  endDate: Date | null = null;
  addApplianceForm!: FormGroup<any>;

  constructor(private fb: FormBuilder,private service: ApiService) {
    this.addApplianceForm = this.fb.group({
      clientName: ['', Validators.required],
      clientPhone: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      clientAddress: ['', Validators.required],
      serialNo: ['', Validators.required],
      applianceType: ['', Validators.required],
      companyName: ['', Validators.required],
      dateOfArrival: ['', Validators.required],
      centreNumber: ['', Validators.required],
      storeNumber: ['', Validators.required],
    });
  }
  onSubmit() {
    if (this.addApplianceForm.valid) {
      console.log('Form Submitted:', this.addApplianceForm.value);
      const apiBody = {
        serial_No: this.addApplianceForm.value.serialNo,
        Type: this.addApplianceForm.value.applianceType,
        companyName: this.addApplianceForm.value.companyName,
        dateOfArrival: this.addApplianceForm.value.dateOfArrival,
        Sid: this.addApplianceForm.value.storeNumber,
        Cid: this.addApplianceForm.value.centreNumber,
        Name: this.addApplianceForm.value.clientName,
        contact_No: this.addApplianceForm.value.clientPhone,
        address: this.addApplianceForm.value.clientAddress,
      };
      this.service.storeAppliance(apiBody).subscribe({
        next: (response) => {
        //  if (response.status === 200) {
            Swal.fire({
              title: 'Success!',
              text: 'Appliance added successfully.',
              icon: 'success',
              confirmButtonText: 'OK'
            });
            // Optionally, reset the form after successful submission
            this.addApplianceForm.reset();
         // }
        },
        error: (error) => {
          console.error('API Error:', error);
          Swal.fire({
            title: 'Error!',
            text: 'An error occurred while adding the appliance.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      });
    } else {
      alert('Form Invalid');
    }
  }
}
