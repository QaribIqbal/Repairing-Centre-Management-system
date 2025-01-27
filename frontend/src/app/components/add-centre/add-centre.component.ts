import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { ApiService } from '../../api.service';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule,FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import {  PipeTransform } from '@angular/core';
import { AsyncPipe, DecimalPipe } from '@angular/common';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { NgbHighlight } from '@ng-bootstrap/ng-bootstrap';

interface Country {
	// name: string;
	// flag: string;
	// area: number;
	// population: number;
  serial_No: number;
  Type: string;
  companyName: string;
  dateOfArrival: string;
  Sid: number;
  Cid: number;
  contact_No: string;
}

let COUNTRIES: Country[] = [];

@Component({
  selector: 'app-add-centre',
  imports: [ReactiveFormsModule,CommonModule,ButtonModule,FormsModule,DecimalPipe, AsyncPipe, ReactiveFormsModule, NgbHighlight],
  templateUrl: './add-centre.component.html',
  styleUrls: ['./add-centre.component.css'],
  providers: [DecimalPipe],
})
export class AddCentreComponent {
  private pipe!: DecimalPipe;
  countries$!: Observable<Country[]>;
	filter = new FormControl('', { nonNullable: true });

  addCentreForm: FormGroup;
  appliances: any[] = [];
centreId!:number;
  constructor(private fb: FormBuilder, private api: ApiService,pipe: DecimalPipe) {
    this.pipe = pipe;
    this.addCentreForm = this.fb.group({
      Cid: ['', Validators.required]
       });
      this.countries$ = this.filter.valueChanges.pipe(
        startWith(''),
        map((text) => this.search(text)) // Now calls the search method defined in the class
      );
  }
  private search(text: string): Country[] {
    const term = text.toLowerCase();
    return COUNTRIES.filter((country) => {
      return (
        country.contact_No.toLowerCase().includes(term) ||
        this.pipe?.transform(country.serial_No)?.includes(term) ||
        country.dateOfArrival.toLowerCase().includes(term) ||
        country.Type.toLowerCase().includes(term) ||
        country.companyName.toLowerCase().includes(term) ||
        this.pipe.transform(country.Sid)?.includes(term)
      );
    });
  }
  onSubmit() {
    if (this.addCentreForm.valid) {
      const apibody={ Cid : this.addCentreForm.value.Cid};
      console.log('Form Submitted:', apibody);
      this.api.addCentre(apibody).subscribe({
        next:(response) => {
            if (response.status === 200 || response.success) {
              Swal.fire('Success!', 'Centre added successfully.', 'success');
              this.addCentreForm.reset(); // Reset the form after successful submission
            }
          },
          error:(error) => {
            console.error('API Error:', error);
            Swal.fire('Error!', 'An error occurred while adding the centre.', 'error');
          }
    });
    }
  }

fetchAppliances() {
  if (this.centreId) {
    this.api.getApplicance(this.centreId).subscribe({
      next: (response) => {
        console.log('API Response:', response); // Log the response

        // Check if the response is an array
        if (Array.isArray(response)) {
          // Assign the response to COUNTRIES
          COUNTRIES = [...response];

          // Re-trigger filtering with updated data
          this.countries$ = this.filter.valueChanges.pipe(
            startWith(''),
            map((text) => this.search(text))
          );

          console.log('Updated COUNTRIES:', COUNTRIES); // Debug: Log updated COUNTRIES
        } else {
          console.error('Unexpected response format:', response);
          Swal.fire('Error!', 'Unexpected response format from server.', 'error');
        }
      },
      error: (error) => {
        console.error('API Error:', error);
        Swal.fire('Error!', 'An error occurred while fetching appliances.', 'error');
      }
    });
  } else {
    Swal.fire('Warning!', 'Please enter a valid Centre ID.', 'warning');
  }
}


}
