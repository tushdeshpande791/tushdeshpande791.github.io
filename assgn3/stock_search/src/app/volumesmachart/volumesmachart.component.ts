'use client'
import { AfterViewInit, Component, OnInit } from '@angular/core';
import {StockChart} from   'angular-highcharts'
import { ChartModule,HIGHCHARTS_MODULES } from 'angular-highcharts';
import * as more from 'highcharts/highcharts-more';
import * as exporting from 'highcharts/modules/exporting';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HighchartsChartModule } from 'highcharts-angular';
import IndicatorsAll from "highcharts/indicators/indicators-all";
import { HttpClient } from '@angular/common/http';
import { SearchformComponent } from '../searchform/searchform.component';
import * as Highcharts from "highcharts/highstock";
import { Options } from "highcharts/highstock";
import HC_indic from 'highcharts/indicators/indicators';
import * as HC_rsi from 'highcharts/indicators/rsi';
import I from "highcharts/indicators/indicators";
import { run } from 'node:test';
import { GlobalService } from '../global.service';
let indicators = require('highcharts/indicators/indicators');
let vbp = require('highcharts/indicators/volume-by-price')
import HighchartsSMA from 'highcharts/indicators/indicators';

@Component({
  selector: 'app-volumesmachart',
  standalone: true,
  imports: [ChartModule,CommonModule,HttpClientModule,SearchformComponent,HighchartsChartModule,ChartModule],
  providers: [
    { provide: HIGHCHARTS_MODULES, useFactory: () => [ more, exporting ] } // add as factory to your providers
  ],
  templateUrl: './volumesmachart.component.html',
  styleUrl: './volumesmachart.component.css'
})
export class VolumesmachartComponent implements OnInit, AfterViewInit{
myScriptElement: HTMLScriptElement;
results: boolean=false

constructor(public s:SearchformComponent, public g:GlobalService,private http:HttpClient){

      this.myScriptElement = document.createElement("script");
   }
  ngOnInit(): void {
    indicators(Highcharts);
    vbp(Highcharts);
    IndicatorsAll(Highcharts);
  }
  ngAfterViewInit(){
    if(!this.g.invalidticker){
      this.results=true
    }
    else{
    this.results=false
    }
  }
  
  loadedcomponent:boolean=true
  public str:string=this.s.time.split(' ')[0];
  chart_data:Number[]=[]
  isLoadedresult=false
  onedaybefore(datestring:string){
    const date = new Date(datestring);
    date.setFullYear(date.getFullYear() - 2);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const result = `${year}-${month}-${day}`;

    return result;
  }
  data1:Number[][][]=this.fetchchartdata(this.s.symbol,'day')
  callapivolume(ticker:string,from:string,to:string,frame:string): Observable<any> {
    return this.http.get<any>(`polygon/${frame}/${ticker}/${from}/${to}`)
  }
  fetchchartdata(ticker:string,frame:string):Number[][][]{
    if(this.s.isLoadedResultapi && this.g.final_dataohlc.length!=0){
      this.isLoadedresult=true
      return [this.g.final_dataohlc,this.g.final_datavolume] 
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
    let final_dataohlc:Number[][]=[]
    let final_datavolume:Number[][]=[]
    this.callapivolume(ticker,from,to,frame)
      .subscribe(response=>{
        for(let i=0;i<response.results.length;i++){
          let data1:Number[]=[]
          let data2:Number[]=[]
          data1.push(response.results[i].t)
          data1.push(response.results[i].o)
          data1.push(response.results[i].h)
          data1.push(response.results[i].l)
          data1.push(response.results[i].c)
          data2.push(response.results[i].t)
          data2.push(response.results[i].v)
          final_dataohlc.push(data1)
          final_datavolume.push(data2)
        }
        this.g.final_dataohlc=final_dataohlc
        this.g.final_datavolume=final_datavolume
        this.isLoadedresult=true
      },error=>{
        console.error(error)
      });
      return [final_dataohlc,final_datavolume];
  }
  volumechart=new StockChart({
    chart:{
      backgroundColor:'#F4F4F4',
    },
    
    rangeSelector: {
      selected: 2
  },

  title: {
      text:  `${this.s.symbol} Historical`,
      style:{
        fontFamily:'Roboto Medium',
        fontWeight: ''
      }
  },

  subtitle: {
      text: 'With SMA and Volume by Price technical indicators',
      style:{
        fontFamily:'Roboto Regular'
      }
  },

  yAxis: [{
      startOnTick: false,
      endOnTick: false,
      labels: {
          align: 'right',
          x: -3
      },
      title: {
          text: 'OHLC'
      },
      height: '60%',
      lineWidth: 2,
      resize: {
          enabled: true
      }
  }, {
      labels: {
          align: 'right',
          x: -3
      },
      title: {
          text: 'Volume'
      },
      top: '65%',
      height: '35%',
      offset: 0,
      lineWidth: 2
  }],

  tooltip: {
      split: true
  },

  series: [{
      type: 'candlestick',
      name: 'AAPL',
      id: 'aapl',
      zIndex: 2,
      data: this.data1[0]
  }, {
      type: 'column',
      name: 'Volume',
      id: 'volume',
      data: this.data1[1],
      yAxis: 1
  },{
      type: 'vbp',
      linkedTo: 'aapl',
      params: {
          volumeSeriesID: 'volume'
      },
      dataLabels: {
          enabled: false
      },
      zoneLines: {
          enabled: false
      }
      },
      {
        type: 'sma',
        linkedTo: 'aapl',
        zIndex: 1,
        marker: {
            enabled: false
        }}]
});
Highcharts=Highcharts;
  chartOptions:Options={
    
      rangeSelector: {
        selected: 2
    },
  
    title: {
        text:  `${this.s.symbol} Historical`
    },
  
    subtitle: {
        text: 'With SMA and Volume by Price technical indicators'
    },
  
    yAxis: [{
        startOnTick: false,
        endOnTick: false,
        labels: {
            align: 'right',
            x: -3
        },
        title: {
            text: 'OHLC'
        },
        height: '60%',
        lineWidth: 2,
        resize: {
            enabled: true
        }
    }, {
        labels: {
            align: 'right',
            x: -3
        },
        title: {
            text: 'Volume'
        },
        top: '65%',
        height: '35%',
        offset: 0,
        lineWidth: 2
    }],
  
    tooltip: {
        split: true
    },
  
    series: [{
        type: 'candlestick',
        name: 'AAPL',
        id: 'aapl',
        zIndex: 2,
        data: this.data1[0]
    }, {
        type: 'column',
        name: 'Volume',
        id: 'volume',
        data: this.data1[1],
        yAxis: 1
    },{
        type: 'vbp',
        linkedTo: 'aapl',
        params: {
            volumeSeriesID: 'volume'
        },
        dataLabels: {
            enabled: false
        },
        zoneLines: {
            enabled: false
        }
        },
        {
          type: 'sma',
          linkedTo: 'aapl',
          zIndex: 1,
          marker: {
              enabled: false
          }}]
  }
}
