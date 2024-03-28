import { Component, OnInit } from '@angular/core';
import {Chart, StockChart} from   'angular-highcharts'
import { ChartModule } from 'angular-highcharts';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../global.service';
import { SearchformComponent } from '../searchform/searchform.component';
@Component({
  selector: 'app-linechart',
  standalone: true,
  imports: [ChartModule, HttpClientModule,SearchformComponent,CommonModule],
  templateUrl: './linechart.component.html',
  styleUrl: './linechart.component.css'
})
export class LinechartComponent{
  constructor(private http:HttpClient,public s:SearchformComponent, public g:GlobalService){

  }
  chart_data:number[]=[]
  isLoadedresult=false
  onedaybefore(datestring:string){
    const date = new Date(datestring);
    date.setDate(date.getDate() - 1);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0'); 
    const result = `${year}-${month}-${day}`;
    return result;
  }
  callapichart(ticker:string,from:string,to:string,frame:string): Observable<any> {
    return this.http.get<any>(`polygon/${frame}/${ticker}/${from}/${to}`)
  }
  fetchchartdata(ticker:string,frame:string):number[][]{
    if(this.s.isLoadedResultapi && this.g.chart_data.length!=0){
      this.isLoadedresult=true
      return this.g.chart_data
    }
    let from,to
    if(this.s.market){
      to=this.s.time.split(' ')[0]
      from=this.onedaybefore(this.s.time)
    }
    else{
      to=this.s.timestamp.split(' ')[0]
      from=this.onedaybefore(this.s.timestamp)
    }
    let final_data:number[][]=[]
    this.callapichart(ticker,from,to,frame)
      .subscribe(response=>{
        if (response.results!=undefined){
        for(let i=0;i<response.results.length;i++){
          let data1:number[]=[]
          data1.push(response.results[i].t-25200000)
          data1.push(response.results[i].c)
          final_data.push(data1)
        }
        }
        this.isLoadedresult=true
        this.g.chart_data=final_data
      },error=>{
        console.error(error)
      });
      return final_data;
  }
  data1:number[][]=this.fetchchartdata(this.s.symbol,'hour')
  linechart1=new StockChart({
    chart:{
      backgroundColor:'#F4F4F4',
    },
    rangeSelector:{
      enabled:false
    },
    navigator:{
      enabled:false
    },
    title:{
      text:`${this.s.symbol} Hourly Price Variation`,
      style:{
        color: '#818285',
        fontFamily:'Roboto Medium',
        fontWeight:''
      }
    },
    yAxis:{
      opposite:true,
      labels:{
        style:{
        }
      }
    },
    xAxis:{
      labels:{
        style:{
        }
      }
    },
    plotOptions: {
      series: {
          color: '#FF0000'
      }
    },
    series:[
      {
        type:'line',
        name:this.s.symbol,
        data:this.data1,
        tooltip: {
          valueDecimals: 2
        },
      } as any
    ],
  });
  linechart2=new StockChart({
    chart:{
      backgroundColor:'#F4F4F4',
    },
    rangeSelector:{
      enabled:false
    },
    navigator:{
      enabled:false
    },
    title:{
      text:`${this.s.symbol} Hourly Price Variation`,
      style:{
        color: '#818285',
        fontFamily:'Roboto Medium',
        fontWeight:''
      }
    },
    
    yAxis:{
      opposite:true,
      labels:{
        style:{
        }
      }
    },
    xAxis:{
      labels:{
        style:{
        }
      }
    },
    plotOptions: {
      series: {
          color: 'green'
      }
    },
    series:[
      {
        type:'line',
        name:this.s.symbol,
        data:this.data1,
        tooltip: {
          valueDecimals: 2
        },
      } as any
    ],
  });

  linechart3=new StockChart({
    chart:{
      backgroundColor:'#F4F4F4',
    },
    rangeSelector:{
      enabled:false
    },
    navigator:{
      enabled:false
    },
    title:{
      text:`${this.s.symbol} Hourly Price Variation`,
      style:{
        color: 'black',
        fontFamily:'Roboto Medium',
        fontWeight:''
      }
    },
    
    yAxis:{
      opposite:true,
      labels:{
        style:{
        }
      }
    },
    xAxis:{
      labels:{
        style:{
        }
      }
    },
    plotOptions: {
      series: {
          color: 'green'
      }
    },
    series:[
      {
        type:'line',
        name:this.s.symbol,
        data:this.data1,
        tooltip: {
          valueDecimals: 2
        },
      } as any
    ],
  });
}
