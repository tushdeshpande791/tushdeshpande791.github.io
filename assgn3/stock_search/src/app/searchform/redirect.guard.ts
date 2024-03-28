import { Injectable, OnInit, Optional } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SearchformComponent } from './searchform.component';
import { GlobalService } from '../global.service';
@Injectable({
  providedIn: 'root'
})
export class RedirectGuard implements OnInit{
  constructor(private router: Router, public g:GlobalService) {}
  ngOnInit(): void {
  }

  canActivate(): boolean {
    let redirect=false
    if(this.g.isLoadedResultapi){
        redirect = true; 
    }
    if (redirect){
      this.router.navigateByUrl(`search/${this.g.symbol}`);
      return false;
    }
    return true;
  }
  }