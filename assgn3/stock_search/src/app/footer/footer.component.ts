import { Component } from '@angular/core';
import {MatSidenavModule} from '@angular/material/sidenav';
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [MatSidenavModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {

}
