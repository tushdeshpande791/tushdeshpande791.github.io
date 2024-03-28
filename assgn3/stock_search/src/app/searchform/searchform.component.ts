import { AfterContentInit, AfterViewInit, ChangeDetectorRef, Component, input, NgZone,inject, TemplateRef, OnInit, ViewEncapsulation, ChangeDetectionStrategy, ViewChild, AfterViewChecked, AfterContentChecked} from '@angular/core';
import { ModalDismissReasons, NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {MatAutocompleteModule} from '@angular/material/autocomplete'
import {MatInputModule} from '@angular/material/input'
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Observable, interval } from 'rxjs';
import { FormsModule } from "@angular/forms";
import { NgbAlert, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import {MatTabsModule} from '@angular/material/tabs';
import moment from 'moment';
import * as momentNs from 'moment'
import { LinechartComponent } from '../linechart/linechart.component';
import { VolumesmachartComponent } from '../volumesmachart/volumesmachart.component';
import { InsightComponent } from '../insight/insight.component';
import { NewsComponent } from '../news/news.component';
import { Router, RouterModule } from '@angular/router';
import { NavbarComponent } from "../navbar/navbar.component";
import { debounceTime, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { GlobalService } from '../global.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-searchform',
    standalone: true,
    templateUrl: './searchform.component.html',
    styleUrl: './searchform.component.css',
    imports: [MatAutocompleteModule, MatInputModule, RouterModule, MatProgressSpinnerModule, CommonModule, HttpClientModule, FormsModule, NgbAlertModule, MatTabsModule, LinechartComponent, VolumesmachartComponent, InsightComponent, NewsComponent, NavbarComponent],
    changeDetection: ChangeDetectionStrategy.Default,
    encapsulation:ViewEncapsulation.None

})
export class SearchformComponent implements OnInit,AfterContentChecked{
	private _message$ = new Subject<string>();
	private _message1$ = new Subject<string>();
	private _message2$ = new Subject<string>();
	private _message3$ = new Subject<string>();

	successMessage = '';
	successMessage1 = '';
	successMessage2 = '';
	successMessage3 = '';

	@ViewChild('selfClosingAlert', { static: false })
  selfClosingAlert: NgbAlert = new NgbAlert;
  @ViewChild('selfClosingremove', { static: false })
  selfClosingremove: NgbAlert = new NgbAlert;
  @ViewChild('selfClosingbuy', { static: false })
  selfClosingbuy: NgbAlert = new NgbAlert;
  @ViewChild('selfClosingsell', { static: false })
  selfClosingsell: NgbAlert = new NgbAlert;
  // empty: boolean;
  constructor(public http:HttpClient, private r:Router,public g:GlobalService,private cdr: ChangeDetectorRef){
    this._message$
			.pipe(
				takeUntilDestroyed(),
				tap((message) => (this.successMessage = message)),
				debounceTime(5000),
			)
			.subscribe(() => this.selfClosingAlert?.close());
      
    this._message1$
			.pipe(
				takeUntilDestroyed(),
				tap((message1) => (this.successMessage1 = message1)),
				debounceTime(5000),
			)
			.subscribe(() => this.selfClosingremove?.close());

    this._message2$
    .pipe(
      takeUntilDestroyed(),
      tap((message2) => (this.successMessage2 = message2)),
      debounceTime(5000),
    )
      .subscribe(() => this.selfClosingbuy?.close());

    this._message3$
    .pipe(
      takeUntilDestroyed(),
      tap((message3) => (this.successMessage3 = message3)),
      debounceTime(5000),
    )
      .subscribe(() => this.selfClosingsell?.close());
  }
  ngOnInit(): void {
    if(this.g.isLoadedResultapi){
      this.g.call=true
      this.LoadResults()
      if(this.g.market){
      this.fetchquote()
      this.setupinterval()
      }
      this.iswatchlisted(this.symbol)
      this.isport(this.symbol)
      this.fetchwallet()
      this.stocksticker(this.symbol)
    }
    else if(this.g.invalidticker){
      this.invalidticker=this.g.invalidticker
    }
    else{
      this.empty=this.g.empty
    }
  }
  ngAfterContentChecked(){
    if(this.g.call){
      setTimeout(() => {
        (<HTMLInputElement>document.getElementById("search")).value=this.g.symbol
      },0);
    }
    if(this.g.call){
    this.LoadInput()
    }
  }
  LoadInput(){
    this.g.call=false;
    (<HTMLInputElement>document.getElementById("search")).value=this.g.symbol
    if(this.g.watchlistsymbol){ 
      this.empty=false
      this.invalidticker=false
      this.fetchCompany(this.g.watchsymbol)
    }
    if(this.g.invalidticker){
      this.isLoadedResultapi=false
    }
  }
  public searchstr:string=""
  public moment = moment();
  public mom=momentNs
  isLoadingResult=false
  isLoadingResult2=false
  isLoadedResultapi=false
  watchlisted:boolean=false
  empty:boolean=false
  invalidticker=false
  positive=false
  market=false
  public timestring:string=''
  public timestamp:string=''
  options:String[] = [];
  public symbol:string=""
  public name=""
  public exchange=""
  public src=""
  public curr_price:number=0
  public c:number=0
  public cp:number=0
  public nochange=false
  public h:number=0
  public l:number=0
  public o:number=0
  public pc:number=0
  public d:string=""
  public industry:string=""
  public url:string=""
  public peers:string[]=[]
  public peer1=""
  public peer2=""
  public peer3=""
  public peer4=""
  public peer5=""
  public peer6=""
  public peer7=""
  public peer8=""
  public peer9=""
  public peer10=""
  public time:string=""
  public inputval:string=""
  public tickertotal:string=""
  LoadResults(){
      this.isLoadedResultapi=this.g.isLoadedResultapi
      this.empty=this.g.empty
      this.invalidticker=this.g.invalidticker
      this.positive=this.g.positive
      this.market=this.g.market
      this.timestring=this.g.timestring
      this.timestamp=this.g.timestamp
      this.symbol=this.g.symbol
      this.name=this.g.name
      this.exchange=this.g.exchange
      this.src=this.g.src
      this.curr_price=this.g.curr_price
      this.c=this.g.c
      this.cp=this.g.cp
      this.h=this.g.h
      this.l=this.g.l
      this.o=this.g.o
      this.pc=this.g.pc
      this.d=this.g.d
      this.industry=this.g.industry
      this.url=this.g.url
      this.peers=this.g.peers
      this.peer1=this.g.peer1
      this.peer2=this.g.peer2
      this.peer3=this.g.peer3
      this.peer4=this.g.peer4
      this.peer5=this.g.peer5
      this.peer6=this.g.peer6
      this.peer7=this.g.peer7
      this.peer8=this.g.peer8
      this.peer9=this.g.peer9
      this.peer10=this.g.peer10
      this.time=this.g.time;
      this.watchlisted=this.g.watchlisted
      this.tickerbought=this.g.tickerbought
  }
  private modalService = inject(NgbModal);
	closeResult = '';

	open(content: TemplateRef<any>) {
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
			(result) => {
				this.closeResult = `Closed with: ${result}`;
        this.updateportbuy()
        this.walletbuy(Number(this.total))
        this._message2$.next(`${this.symbol} bought successfully.`);
        this.disabled=true
        this.total='0.00'
			},
			(reason) => {
				this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        this.total='0.00'
        this.nomoney=false
        this.disabled=true
        this.quantity=0
			},
		);
	}
  open1(content1: TemplateRef<any>) {
		this.modalService.open(content1, { ariaLabelledBy: 'modal-basic-title' }).result.then(
			(result) => {
				this.closeResult = `Closed with: ${result}`;
        this.updateportsell()
        this.walletsell(Number(this.total))
        // this.g.wallet+= Number(this.total)
        this._message3$.next(`${this.symbol} sold successfully.`);
        this.disabled=true
        this.total='0.00'

			},
			(reason) => {
				this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        this.total='0.00'
        this.nostock=false
        this.disabled=true
        this.quantity=0
			},
		);
	}
	private getDismissReason(reason: any): string {
		switch (reason) {
			case ModalDismissReasons.ESC:
				return 'by pressing ESC';
			case ModalDismissReasons.BACKDROP_CLICK:
				return 'by clicking on a backdrop';
			default:
				return `with: ${reason}`;
		}
	}

  OnClick(){
    let inputValue = (<HTMLInputElement>document.getElementById("search")).value;

    if(inputValue!=''){
    this.options=[];
    this.isLoadingResult=false
    this.empty=false
    this.g.empty=false
    inputValue=inputValue.toUpperCase()
    this.inputval=inputValue
    this.g.inputval=inputValue
    this.fetchCompany(inputValue)
    }
    else{
      this.invalidticker=false
      this.g.invalidticker=false
      this.isLoadedResultapi=false
      this.g.isLoadedResultapi=false
      this.empty=true
      this.g.empty=true
    }
  }
  onselect(){
    this.OnClick();
  }
  Remove(){
    (<HTMLInputElement>document.getElementById("search")).value=""
    this.options=[];
    this.isLoadingResult=false
    this.searchstr=""
    this.isLoadedResultapi=false
    this.invalidticker=false
    this.empty=false
    this.g.empty=false
    this.g.isLoadedResultapi=false
    this.g.chart_data=[]
    this.g.invalidticker=false
    this.watchlisted=false
    this.g.watchlisted=false
    this.g.chart_data=[]
    this.g.final_dataohlc=[]
    this.g.final_datavolume=[]
    this.g.visited=false
    this.g.visited1=false
    this.g.index=[]
    this.g.response=[]
    this.g.results1=[]
    this.g.results2=[]
    this.positive=false
    this.g.positive=false
    this.cdr.detectChanges()
    this.g.results3=[]
    this.r.navigateByUrl(`/search/home`)
  }
  public total:string='0.00'
  public quantity:number=0
  public disabled:boolean=true
  public nomoney:boolean=false
  public nostock:boolean=false
  public stocksowned:number=0
  public tickerbought:boolean=false
  calculatetotalsell(quantity:number){
    this.disabled=false
    this.nostock=false
    if(quantity!=null && quantity>0){
    this.total=(this.curr_price*quantity).toFixed(2)
    this.quantity=quantity
    if(quantity>this.stocksowned){
      this.disabled=true
      this.nostock=true
    }
    this.cdr.detectChanges()
    }
    else{
    this.disabled=true
      this.total='0.00'
    }
  }
  calculatetotal(quantity:number){
    this.disabled=false
    this.nomoney=false
    if(quantity!=null && quantity>0){
    this.total=(this.curr_price*quantity).toFixed(2)
    this.quantity=quantity
    if(this.curr_price*quantity>this.g.wallet){
      this.disabled=true
      this.nomoney=true
    }
    this.cdr.detectChanges()
    }
    else{
    this.disabled=true
      this.total='0.00'
    }
  }
  callapibuy(ticker:string,name:string,num_stock:number,totalcost:string): Observable<any> {
    return this.http.get<any>(`update-portbuy/${ticker}/${name}/${num_stock}/${totalcost}`)
  }
  updateportbuy(){
    this.callapibuy(this.symbol,this.name,this.quantity,this.total)
      .subscribe(response=>{
        this.tickerbought=true
        this.g.tickerbought=true
        this.quantity=0
        this.stocksticker(this.symbol)

      })
  }
  callapiportremove(ticker:string): Observable<any> {
    return this.http.get<any>(`/remove-port/${ticker}`)
  }
  removeport(ticker:string){
    this.callapiportremove(ticker)
      .subscribe(response=>{
        this.cdr.detectChanges()
      })
  }
  callapisell(ticker:string,name:string,num_stock:number,totalcost:string): Observable<any> {
    return this.http.get<any>(`update-portsell/${ticker}/${name}/${num_stock}/${totalcost}`)
  }
  updateportsell(){
    this.callapisell(this.symbol,this.name,this.quantity,((Number(this.tickertotal)/this.stocksowned)*this.quantity).toFixed(2))
      .subscribe(response=>{
        if(this.stocksowned==this.quantity){
          this.removeport(this.symbol)
          this.stocksowned=0
          this.tickerbought=false
          this.g.tickerbought=false
          this.cdr.detectChanges()
        }
        this.stocksticker(this.symbol)
        this.quantity=0
      })
  }
  callapiport(): Observable<any> {
    return this.http.get<any>(`/get-port`)
  }
  stocksticker(ticker:string):number{
    this.callapiport()
      .subscribe(response=>{
        for(let i=0;i<response[0].length;i++){
          if(response[0][i].ticker==ticker){
            this.stocksowned=response[0][i].num_of_stocks
            this.tickertotal=response[0][i].totalcost
            this.cdr.detectChanges()
          }
        }
      })
      return 0
  }
  isport(ticker:string){  
  this.tickerbought=false
  this.g.tickerbought=false
    this.callapiport()
      .subscribe(response=>{
        for(let i=0;i<response[0].length;i++){
          if(response[0][i].ticker==ticker){
            this.tickerbought=true
            this.g.tickerbought=true
            this.cdr.detectChanges()
            break
          }
        this.tickerbought=false
        this.g.tickerbought=false
        this.cdr.detectChanges()
        }
      })
  }
  callapiwalletbuy(amount:number): Observable<any> {
    return this.http.get<any>(`/buy/${amount}`)
  }
  callapiwalletsell(amount:number): Observable<any> {
    return this.http.get<any>(`/sell/${amount}`)
  }
  callapiwalletfetch(): Observable<any> {
    return this.http.get<any>(`/fetchwallet`)
  }
  fetchwallet(){
    this.callapiwalletfetch()
        .subscribe(response=>{
          this.g.wallet=response[0].amount
          this.cdr.detectChanges()
        })
  }
  walletbuy(amount:number){
    this.callapiwalletbuy(amount)
        .subscribe(response=>{
          this.fetchwallet()
          this.cdr.detectChanges()
        })
  }
  walletsell(amount:number){
    this.callapiwalletsell(amount)
        .subscribe(response=>{
          this.fetchwallet()
          this.cdr.detectChanges()
        })
  }
  callapisearch(ticker:string): Observable<any> {
    return this.http.get<any>(`/${ticker}`)
  }
  fetchSearch(ticker:string){
    this.g.searchstr=ticker
    this.options=[];
    this.isLoadingResult=true;
    this.callapisearch(ticker)
      .subscribe(response=>{
        for(let i=0;i<response.result.length;i++){
          if (response.result[i].type=='Common Stock' && !response.result[i].symbol.includes('.')){
            this.options.push(response.result[i].symbol+' | '+response.result[i].description)
          }
        }
        this.isLoadingResult=false
      },error=>{
        console.error(error)
      });
  }
  callapi(ticker:string): Observable<any> {
    return this.http.get<any>(`/details/${ticker}`)
  }
  fetchCompany(ticker:string){
    this.options=[];
    this.time="";
    (<HTMLInputElement>document.getElementById("search")).value=ticker
    this.time="";
    this.invalidticker=false
    this.isLoadingResult2=true
    this.positive=false
    this.g.positive=false
    this.g.nochange=false
    this.nochange=false
    this.isLoadedResultapi=false  
    this.iswatchlisted(ticker)
    this.isport(ticker)
    this.stocksticker(ticker)
    this.g.chart_data=[]
    this.g.final_dataohlc=[]
    this.g.final_datavolume=[]
    this.g.visited=false
    this.g.visited1=false
    this.g.index=[]
    this.g.response=[]
    this.g.results1=[]
    this.g.results2=[]
    this.g.results3=[]
    this.callapi(ticker)
      .subscribe(response=>{
        this.isLoadingResult2=false
        if (!('ticker' in response[0])){
          this.invalidticker=true
          this.g.invalidticker=true
          this.g.symbol=ticker
          this.g.isLoadedResultapi=true
          this.g.call=true
          this.r.navigateByUrl(`/search/${this.g.symbol}`)
        }
        else{
          this.symbol=response[0].ticker
          this.g.symbol=this.symbol
          this.name=response[0].name
          this.g.name=this.name
          this.exchange=response[0].exchange
          this.g.exchange=this.exchange
          this.src=response[0].logo
          this.g.src=this.src
          this.curr_price=response[1].c.toFixed(2)
          this.g.curr_price=this.curr_price
          this.c=response[1].d.toFixed(2)
          this.g.c=this.c
          this.cp=response[1].dp.toFixed(2)
          this.g.cp=this.cp
          this.time=this.currenttime()
          let timestamp=this.moment.unix()
          if(timestamp-response[1].t<=300){
          this.market=true
          this.g.market=true
          }
          else{
            let momentobj=moment.unix(response[1].t) 
            let timestamp=momentobj.local().format()
            this.timestamp=timestamp.split('T')[0]+' '+timestamp.split('T')[1].slice(0,-6)
            this.g.timestamp=this.timestamp
            this.market=false
            this.g.market=false
          }
          this.g.time=this.time
          this.timestring=this.time.split(' ')[0]
          this.g.timestring=this.timestring
          if(this.c > 0){
            this.positive=true
            this.g.positive=true
          }
          else if(this.c==0){
            this.nochange=true
            this.g.nochange=true
          }
          else{
            this.positive=false
            this.g.positive=false
          }
          this.h=response[1].h.toFixed(2)
          this.g.h=this.h
          this.l=response[1].l.toFixed(2)
          this.g.l=this.l
          this.o=response[1].o.toFixed(2)
          this.g.o=this.o
          this.pc=response[1].pc.toFixed(2)
          this.g.pc=this.pc
          this.d=response[0].ipo
          this.g.d=this.d
          this.industry=response[0].finnhubIndustry
          this.g.industry=this.industry
          this.url=response[0].weburl
          this.g.url=this.url
          this.peers=response[2]
          this.peers = [...new Set(this.peers)]
          this.g.peers=this.peers
          let count=1
          for(let i=0;i<this.peers.length;i++){
            if(!this.peers[i].includes('.')){
              if(count==1){
              this.peer1=this.peers[i]+','
              this.g.peer1=this.peer1
              count+=1
              continue
              }
              if(count==2){
                this.peer2=this.peers[i]+',' 
                this.g.peer2=this.peer2  
                count+=1
              continue

              }
              if(count==3){
                this.peer3=this.peers[i]+','   
                this.g.peer3=this.peer3
                count+=1
              continue
              }
              if(count==4){
                this.peer4=this.peers[i]+','
                this.g.peer4=this.peer4   
                count+=1
              continue
              }
              if(count==5){
                this.peer5=this.peers[i]+','   
                this.g.peer5=this.peer5
                count+=1
              continue


              }
              if(count==6){
                this.peer6=this.peers[i]+','
                this.g.peer6=this.peer6   
                count+=1
              continue


              }
              if(count==7){
                this.peer7=this.peers[i]+','   
                this.g.peer7=this.peer7
                count+=1
              continue


              }
              if(count==8){
                this.peer8=this.peers[i]+','
                this.g.peer8=this.peer8   
                count+=1
              continue


              }
              if(count==9){
                this.peer9=this.peers[i]+',' 
                this.g.peer9=this.peer9  
                count+=1
              continue


              }
              if(count==10){
                this.peer10=this.peers[i]+','  
                this.g.peer10=this.peer10 
                count+=1
              continue
              }
            }
          }
          this.isLoadedResultapi=true;
          this.g.watchlistsymbol=false;
          this.g.isLoadingResult=false
          this.g.isLoadingResult2=false
          this.g.isLoadedResultapi=true
          this.g.empty=false
          this.g.invalidticker=false
          this.g.call=true
          this.r.navigateByUrl(`/search/${this.symbol}`)
        }
        
      },error=>{
        console.error(error)
      });
  }
  peerclick(ticker:string){
    ticker=ticker.slice(0,-1)
    this.g.watchlistsymbol=true
    this.g.watchsymbol=ticker
    this.g.isLoadedResultapi=true
    this.g.call=true
    this.g.symbol=ticker
    this.g.chart_data=[]
    this.g.final_dataohlc=[]
    this.g.final_datavolume=[]
    this.g.results1=[]
    this.g.results2=[]
    this.g.results3=[]
    this.g.index=[]
    this.g.response=[]
    this.g.visited=false
    this.g.visited1=false
    this.r.navigateByUrl(`/search/home`)
  }
  callapiquote(ticker:string): Observable<any> {
    return this.http.get<any>(`/quote/${ticker}`)
  }
  fetchquote(){
    this.callapiquote(this.symbol)
      .subscribe(response=>{
        this.c=response.d.toFixed(2)
        this.curr_price=response.c.toFixed(2)
        this.cp=response.dp.toFixed(2)
        if(this.c<0){
          this.positive=false
          this.g.positive=false
        }
        this.g.c=this.c
        this.g.curr_price=this.curr_price
        this.g.cp=this.cp
        this.time=this.currenttime()
        this.h=response.h.toFixed(2)
        this.g.h=this.h
        this.l=response.l.toFixed(2)
        this.g.l=this.l
        this.o=response.o.toFixed(2)
        this.g.o=this.o
        this.pc=response.pc.toFixed(2)
        this.g.pc=this.pc
        this.cdr.detectChanges();
      },error=>{
        console.error(error)
      });
  }
  currenttime(){
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0'); 
    const hours = String(date.getHours()).padStart(2, '0'); 
    const minutes = String(date.getMinutes()).padStart(2, '0'); 
    const seconds = String(date.getSeconds()).padStart(2, '0'); 
    const result = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return result;
  }
  callapiinterval(){
    this.fetchquote()
    this.cdr.detectChanges();
  }
  public interval:any
  setupinterval(){
    setTimeout(() => {
      this.interval = setInterval(() => {
        this.callapiinterval()
      }, 15000);
    },0);
  }
  callapiwatchadd(ticker:string,name:string): Observable<any> {
    return this.http.get<any>(`/add-watchlist/${ticker}/${name}`)
  }
  callapiwatchget(): Observable<any> {
    return this.http.get<any>(`/get-watchlist`)
  }
  iswatchlisted(ticker:string){
    this.watchlisted=false
    this.g.watchlisted=false
    this.callapiwatchget()
      .subscribe(response=>{
        for(let i=0;i<response[0].length;i++){
          if(response[0][i].ticker==ticker){
            this.watchlisted=true
            this.g.watchlisted=true
            this.cdr.detectChanges()
            break
          }
        this.watchlisted=false
        this.g.watchlisted=false
        this.cdr.detectChanges()
        }
      })
  }
  callapiwatchremove(ticker:string): Observable<any> {
    return this.http.get<any>(`/remove-watchlist/${ticker}`)
  }
  removewatchlist(ticker:string){
    this.callapiwatchremove(ticker)
      .subscribe(response=>{
        this.cdr.detectChanges()
      })
  }
  watchlist() {
    this.watchlisted=true
    this.g.watchlisted=true
    this.callapiwatchadd(this.symbol,this.name)
      .subscribe(response=>{
      })
		this._message$.next(`${this.symbol} added to Watchlist.`);
    this.cdr.detectChanges()
  }
  unwatch(){
    this.watchlisted=false
    this.g.watchlisted=false
    this.removewatchlist(`${this.symbol}`)
		this._message1$.next(`${this.symbol} removed from Watchlist.`);

    this.cdr.detectChanges()
  }
  ngOnDestroy(){
    clearInterval(this.interval)
  }

}
