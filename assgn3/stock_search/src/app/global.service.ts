import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  call: boolean=false;
  final_dataohlc: Number[][]=[]
  final_datavolume: Number[][]=[]
  results1: any;
  results2: any;
  results3: any;
  public visited:boolean=false
  index: any;
  response: any;
  visited1: boolean=false;

  constructor() { }
  isLoadingResult=false
  isLoadingResult2=false
  isLoadedResultapi=false
  empty:boolean=false
  invalidticker=false
  positive=false
  market=false
  public timestring:string=''
  public timestamp:string=''
  public symbol:string=""
  public name=""
  public exchange=""
  public src=""
  public curr_price:number=0
  public c:number=0
  public cp:number=0
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
  public watchlisted:boolean=false
  public watchlistsymbol:boolean=false
  public wallet:number=0
  public tickerbought:boolean=false
  public watchsymbol:string=''
  public nochange=false
  public inputval:string=""
  public searchstr:string=""
  public chart_data:number[][]=[]
  public results:any
  public quoteresults:any
}
