import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { AppRoutingModule } from '../../app.routes';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-homepage',
  imports: [ButtonModule,RouterLink],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {

}
