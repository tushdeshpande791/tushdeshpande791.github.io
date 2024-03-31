import { AfterContentInit, AfterViewInit, ChangeDetectorRef, Component, input, NgZone, OnInit, ViewEncapsulation, ChangeDetectionStrategy, ViewChild, inject, TemplateRef} from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { GlobalService } from '../global.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { ModalDismissReasons, NgbAlert, NgbAlertModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject, debounceTime, interval, tap } from 'rxjs';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';


@Component({
    selector: 'app-portfolio',
    standalone: true,
    templateUrl: './portfolio.component.html',
    styleUrl: './portfolio.component.css',
    imports: [NavbarComponent,NgbAlertModule,MatProgressSpinnerModule,CommonModule,HttpClientModule,FormsModule],
    encapsulation:ViewEncapsulation.None
})
export class PortfolioComponent implements AfterViewInit,OnInit{
  private _message2$ = new Subject<string>();
	private _message3$ = new Subject<string>();
    successMessage2 = '';
	successMessage3 = '';
    @ViewChild('selfClosingbuy', { static: false })
  selfClosingbuy: NgbAlert = new NgbAlert;
    @ViewChild('selfClosingsell', { static: false })
    selfClosingsell: NgbAlert = new NgbAlert;
    
    constructor(private r: Router,private cdr:ChangeDetectorRef,private http:HttpClient,public g:GlobalService){
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
  ngAfterViewInit(): void {
    // throw new Error('Method not implemented.');
  }
    ngOnInit(): void {
      // this.fetchwallet()
      this.fetchport()
      this.fetchwallet()

    }
    private modalService = inject(NgbModal);
	closeResult = '';
	open(content: TemplateRef<any>,i:number) {  
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
		(result) => {
		this.closeResult = `Closed with: ${result}`;
        this.updateportbuy(i)
        this.walletbuy(Number(this.total))
        this._message2$.next(`${this.results[i].ticker} bought successfully.`);
        this.disabled=true
        this.total='0.00'
        // this.r.navigateByUrl(`/portfolio`)
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
    open1(content1: TemplateRef<any>,i:number) {
        this.modalService.open(content1, { ariaLabelledBy: 'modal-basic-title' }).result.then(
        (result) => {
        this.closeResult = `Closed with: ${result}`;
        this.updateportsell(i)
        this.walletsell(Number(this.total))
        this._message3$.next(`${this.results[i].ticker} sold successfully.`);
        // this.cdr.detectChanges()
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
    callapiportget(): Observable<any> {
        return this.http.get<any>(`/get-port`)
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


    positive:boolean[]=[]
    nochange: boolean[]=[]
    isloading:boolean=true
    emptydata:boolean=false
    results:any
    isloadedresult:boolean=false
    quoteresults:any
    fetchport(){
    this.isloadedresult=false
    this.quoteresults=[]
    this.positive=[]
    this.callapiportget()
        .subscribe(response=>{
        if(response[0]?.length==0){ 
            this.emptydata=true
            this.isloadedresult=false
        }
        else{
        // this.isloading=false
        this.results=response[0]
        this.quoteresults=response[1]
        this.positive=response[2]
        this.nochange=response[3]
        this.isloadedresult=true
        }
        this.isloading=false
        // this.cdr.detectChanges()
        })
    }
      gototicker(ticker:string) {
        this.g.watchlistsymbol=true
        this.g.watchsymbol=ticker
        this.g.isLoadedResultapi=true
        this.g.symbol=ticker
        this.g.call=true
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
        this.r.navigateByUrl(`/search/home`)
      }
      public total:string='0.00'
      public quantity:number=0
      public disabled:boolean=true
      public nomoney:boolean=false
      public nostock:boolean=false
      public tickerbought:boolean=false
    calculatetotalsell(quantity:number,i:number){
        this.disabled=false
        this.nostock=false
        if(quantity!=null && quantity>0){
        this.total=(this.quoteresults[i].c*quantity).toFixed(2)
        this.quantity=quantity
        if(quantity>this.results[i].num_of_stocks){
          this.disabled=true
          this.nostock=true
        }
        // this.cdr.detectChanges()
        }
        else{
        this.disabled=true
          this.total='0.00'
        }
      }
    calculatetotal(quantity:number,i:number){
        this.disabled=false
        this.nomoney=false
        if(quantity!=null && quantity>0){
        this.total=(this.quoteresults[i].c*quantity).toFixed(2)
        this.quantity=quantity
        if(this.quoteresults[i].c*quantity>this.g.wallet){
          this.disabled=true
          this.nomoney=true
        }
        // this.cdr.detectChanges()
        }
        else{
        this.disabled=true
          this.total='0.00'
        }
      }
    callapibuy(ticker:string,name:string,num_stock:number,totalcost:string): Observable<any> {
        return this.http.get<any>(`update-portbuy/${ticker}/${name}/${num_stock}/${totalcost}`)
    }
    fetchwallet(){
      this.callapiwalletfetch()
          .subscribe(response=>{
            this.g.wallet=response[0].amount
            // this.cdr.detectChanges()
          })
    }
    walletbuy(amount:number){
      this.callapiwalletbuy(amount)
          .subscribe(response=>{
            this.fetchwallet()
            // this.cdr.detectChanges()
          })
    }
    walletsell(amount:number){
      this.callapiwalletsell(amount)
          .subscribe(response=>{
            this.fetchwallet()
            // this.cdr.detectChanges()
          })
    }
    updateportbuy(i:number){
        this.callapibuy(this.results[i].ticker,this.results[i].company_name,this.quantity,this.total)
          .subscribe(response=>{
            this.fetchport()
            this.quantity=0
            // this.cdr.detectChanges()
          })
      }
    callapiportremove(ticker:string): Observable<any> {
        return this.http.get<any>(`/remove-port/${ticker}`)
      }
    removeport(ticker:string){
        this.callapiportremove(ticker)
          .subscribe(response=>{
            this.fetchport()
            // this.cdr.detectChanges()
          })
      }
    callapisell(ticker:string,name:string,num_stock:number,totalcost:string): Observable<any> {
        return this.http.get<any>(`update-portsell/${ticker}/${name}/${num_stock}/${totalcost}`)
      }
    updateportsell(i:number){
      // this.isloading=true
      // this.isloadedresult=false
        this.callapisell(this.results[i].ticker,this.results[i].company_name,this.quantity,((this.results[i].totalcost/this.results[i].num_of_stocks)*this.quantity).toFixed(2))
          .subscribe(response=>{
            if(this.results[i].num_of_stocks==this.quantity){
            this.removeport(this.results[i].ticker)
            this.cdr.detectChanges()
            }
            this.fetchport()
            this.quantity=0
            this.cdr.detectChanges()
          })
      }
      callapiport(): Observable<any> {
        return this.http.get<any>(`/get-port`)
      }
      isport(ticker:string){  
        this.callapiport()
          .subscribe(response=>{
            for(let i=0;i<response.length;i++){
              if(response[i].ticker==ticker){
                this.tickerbought=true
                this.g.tickerbought=true
                // this.cdr.detectChanges()
                break
              }
            this.tickerbought=false
            this.g.tickerbought=false
            // this.cdr.detectChanges()
            }
          })
      }
}
