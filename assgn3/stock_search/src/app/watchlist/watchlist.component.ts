import { AfterContentInit, AfterViewInit, ChangeDetectorRef, Component, input, NgZone, OnInit, ViewEncapsulation, ChangeDetectionStrategy, ViewChild} from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { GlobalService } from '../global.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { NgbAlert, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable, interval } from 'rxjs';
import { SearchformComponent } from '../searchform/searchform.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-watchlist',
  standalone: true,
  imports: [NavbarComponent,MatProgressSpinnerModule,CommonModule,HttpClientModule,NgbAlertModule],
  templateUrl: './watchlist.component.html',
  styleUrl: './watchlist.component.css',
  encapsulation:ViewEncapsulation.None
})
export class WatchlistComponent implements AfterViewInit{
  positive:boolean[]=[]
  nochange: boolean[]=[]
  constructor(private http:HttpClient,private r:Router,public g:GlobalService,private cdr:ChangeDetectorRef){

  }
  ngAfterViewInit(): void {
    this.fetchwatchlist()
  }
  ngOnInit(): void {
  }
  isloading:boolean=true
  emptydata:boolean=false
  results:any
  quoteresults:any
  callapiwatchget(): Observable<any> {
    return this.http.get<any>(`/get-watchlist`)
  }
  fetchwatchlist(){
    this.quoteresults=[]
    this.positive=[]
    this.callapiwatchget()
      .subscribe(response=>{
        if(response[0].length==0){ 
          this.emptydata=true
        }
        this.isloading=false
        this.results=response[0]
        this.quoteresults=response[1]
        this.positive=response[2]
        this.nochange=response[3]
      })
  }
  callapiwatchremove(ticker:string): Observable<any> {
    return this.http.get<any>(`/remove-watchlist/${ticker}`)
  }
  removewatchlist(ticker:string){
    this.callapiwatchremove(ticker)
      .subscribe(response=>{
        this.fetchwatchlist()
        this.cdr.detectChanges()
      })
  }
  gototicker(ticker:string) { 
    this.g.watchlistsymbol=true
    this.g.watchsymbol=ticker
    this.g.isLoadedResultapi=true
    this.g.call=true
    this.g.symbol=ticker
    this.g.chart_data=[]
    this.g.final_dataohlc=[]
    this.g.final_datavolume=[]
    this.g.visited=false
    this.g.index=[]
    this.g.response=[]
    this.g.visited1=false
    this.g.results1=[]
    this.g.results2=[]
    this.g.results3=[]
    this.r.navigateByUrl(`/search/home`)
  }


}
