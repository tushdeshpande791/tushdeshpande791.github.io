import { AfterContentInit, AfterViewInit, ChangeDetectorRef, Component, OnInit,TemplateRef,ViewEncapsulation, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { SearchformComponent } from '../searchform/searchform.component';
import { ModalDismissReasons, NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GlobalService } from '../global.service';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule,HttpClientModule,SearchformComponent,RouterModule,NgbDatepickerModule],
  templateUrl: './news.component.html',
  styleUrl: './news.component.css',
  encapsulation: ViewEncapsulation.None
})
  export class NewsComponent implements OnInit,AfterViewInit,AfterContentInit {
encodeurl(arg0: any) {
return encodeURIComponent(arg0)
}
urlencode: any;
  constructor(private http:HttpClient, public s:SearchformComponent, private cdr: ChangeDetectorRef,public g:GlobalService){

  }
  public mnames=['January', 'February', 'March','April','May','June','July','August','September','October','November','December'];
  humandate(epochtime:number){
      let date=new Date(epochtime*1000)
      let day=date.getDate();
      let month=date.getMonth();
      let year=date.getFullYear();
      const final_date = String(this.mnames[month]).concat(" ",String(day),', ',String(year));
      return final_date;
  }
  public modalService = inject(NgbModal);
  closeResult = ''; 
	open(content: TemplateRef<any>) {
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
			(result) => {
				this.closeResult = `Closed with: ${result}`;
			},
			(reason) => {
				this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
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
  ngOnInit(): void {
    this.fetchnews(this.s.symbol)
  }
  ngAfterViewInit(): void {
  }
  ngAfterContentInit():void{
  }
  public response:any
  public index:any
  oneweekbefore(datestring:string){
    const date = new Date(datestring);
    date.setDate(date.getDate() - 7);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0'); 
    const result = `${year}-${month}-${day}`;
    return result;
  }
  isLoadedResult=false
  callapinews(ticker:string,from:string,to:string): Observable<any> {
    return this.http.get<any>(`/news/${ticker}/${from}/${to}`)
  }
  fetchnews(ticker:string){
    if(this.s.isLoadedResultapi && this.g.visited1){
      this.index=this.g.index
      this.response=this.g.response
      this.isLoadedResult=true
    }
    else{
    let from,to
    to=this.s.time.split(' ')[0]
    from=this.oneweekbefore(to)

    this.callapinews(ticker,from,to)
      .subscribe(response=>{
        this.response=response
        let count=0
        let index=[]
        var i=0
        while(count!=20 && i<response.length){
          if(response[i].hasOwnProperty('image') && response[i].image!="" && response[i].hasOwnProperty('headline') && response[i].headline!="" && response[i].hasOwnProperty('url')  && response[i].url!="" && response[i].hasOwnProperty('datetime') && response[i].datetime!=""){
            count=count+1
            index.push(i)
            this.cdr.detectChanges()
        }
        i=i+1
        }
        this.index=index
        this.cdr.detectChanges()
        this.isLoadedResult=true
        this.g.index=this.index
        this.g.response=this.response
        this.g.visited1=true
      },error=>{
        console.error(error)
      });
    }
  }

}
