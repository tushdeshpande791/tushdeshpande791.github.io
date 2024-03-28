import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SearchformComponent } from '../searchform/searchform.component';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor(){
  }
}
