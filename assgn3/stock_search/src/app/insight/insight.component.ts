import { Component, OnInit } from '@angular/core';
import {Chart, StockChart} from   'angular-highcharts'
import { ChartModule } from 'angular-highcharts';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { SearchformComponent } from '../searchform/searchform.component';
import { GlobalService } from '../global.service';

@Component({
  selector: 'app-insight',
  standalone: true,
  imports: [ChartModule, HttpClientModule,SearchformComponent,CommonModule],
  templateUrl: './insight.component.html',
  styleUrl: './insight.component.css'
})
export class InsightComponent implements OnInit{
  constructor(private http:HttpClient,public s:SearchformComponent,public g:GlobalService){

  }
  ngOnInit(): void {
    this.fetchSearch(this.s.symbol)
  }
  earning_estimate_data:number[]=[]
  earning_actual_data:number[]=[] 
  quarter_data:string[]=[]
  public mspr_sum:string=''
  public mspr_positive_sum:string=''
  public mspr_negative_sum:string=''
  public change_sum:string=''
  public change_positive_sum:string=''
  public change_negative_sum:string=''
  buy:number[]=[]
  hold:number[]=[]
  sell:number[]=[]
  strongbuy:number[]=[]
  strongsell:number[]=[]
  period:string[]=[]
  public categoryLinks = {
    1:'',
    2:'',
    3:'',
    4:''
};
  formatNumber(n: number): string {    //taken from Chatgpt
    if (n % 1 !== 0) {
        return n.toFixed(2);
    } else {
        return n.toString();
    }
}

  callapisearch(ticker:string): Observable<any> {
    return this.http.get<any>(`/polygon/${ticker}`)
  }
  isLoadedResult=false
  fetchSearch(ticker:string){
    if(this.s.isLoadedResultapi && this.g.visited){
      let mspr_negative_sum=0
        let mspr_positive_sum=0
        let mspr_sum=0
        let change_negative_sum=0
        let change_positive_sum=0
        let change_sum=0
        for(let i=0;i<this.g.results1.data.length;i++){
          change_sum+=this.g.results1.data[i].change
          mspr_sum+=this.g.results1.data[i].mspr
          if(this.g.results1.data[i].change>=0){
            change_positive_sum+=this.g.results1.data[i].change
          }
          else{
            change_negative_sum+=this.g.results1.data[i].change
          }
          if(this.g.results1.data[i].mspr>=0){
            mspr_positive_sum+=this.g.results1.data[i].mspr
          }
          else{
            mspr_negative_sum+=this.g.results1.data[i].mspr
          }
        }
        this.mspr_negative_sum=this.formatNumber(mspr_negative_sum)
        this.mspr_sum=this.formatNumber(mspr_sum)
        this.mspr_positive_sum=this.formatNumber(mspr_positive_sum)
        this.change_negative_sum=this.formatNumber(change_negative_sum)
        this.change_positive_sum=this.formatNumber(change_positive_sum)
        this.change_sum=this.formatNumber(change_sum)
        for(let i=0;i<this.g.results2.length;i++){
          this.buy.push(this.g.results2[i].buy)
          this.hold.push(this.g.results2[i].hold)
          this.sell.push(this.g.results2[i].sell)
          this.strongbuy.push(this.g.results2[i].strongBuy)
          this.strongsell.push(this.g.results2[i].strongSell)
          this.period.push(this.g.results2[i].period.slice(0,-3))
        }
        let quarter_data:number[]=[]
        for(let i=0;i<this.g.results3.length;i++){
          this.quarter_data.push(`${this.g.results3[i].period} Surprise: ${this.g.results3[i].surprise}`)
          let quarter_num=this.g.results3[i].quarter
          if (quarter_num==1){
          this.categoryLinks[1]=`${this.g.results3[i].period} Surprise: ${this.g.results3[i].surprise}`
          }
          if (quarter_num==2){
            this.categoryLinks[2]=`${this.g.results3[i].period} Surprise: ${this.g.results3[i].surprise}`
            }
          if (quarter_num==3){
              this.categoryLinks[3]=`${this.g.results3[i].period} Surprise: ${this.g.results3[i].surprise}`
          }
          if (quarter_num==4){
                this.categoryLinks[4]=`${this.g.results3[i].period} Surprise: ${this.g.results3[i].surprise}`
          }
          this.earning_estimate_data.push(this.g.results3[i].estimate)
          this.earning_actual_data.push(this.g.results3[i].actual)
        }
      this.isLoadedResult=true
  
    }
    else{
    this.callapisearch(ticker)
      .subscribe(response=>{
        let mspr_negative_sum=0
        let mspr_positive_sum=0
        let mspr_sum=0
        let change_negative_sum=0
        let change_positive_sum=0
        let change_sum=0
        for(let i=0;i<response[0].data.length;i++){
          change_sum+=response[0].data[i].change
          mspr_sum+=response[0].data[i].mspr
          if(response[0].data[i].change>=0){
            change_positive_sum+=response[0].data[i].change
          }
          else{
            change_negative_sum+=response[0].data[i].change
          }
          if(response[0].data[i].mspr>=0){
            mspr_positive_sum+=response[0].data[i].mspr
          }
          else{
            mspr_negative_sum+=response[0].data[i].mspr
          }
        }
        this.mspr_negative_sum=this.formatNumber(mspr_negative_sum)
        this.mspr_sum=this.formatNumber(mspr_sum)
        this.mspr_positive_sum=this.formatNumber(mspr_positive_sum)
        this.change_negative_sum=this.formatNumber(change_negative_sum)
        this.change_positive_sum=this.formatNumber(change_positive_sum)
        this.change_sum=this.formatNumber(change_sum)
        for(let i=0;i<response[1].length;i++){
          this.buy.push(response[1][i].buy)
          this.hold.push(response[1][i].hold)
          this.sell.push(response[1][i].sell)
          this.strongbuy.push(response[1][i].strongBuy)
          this.strongsell.push(response[1][i].strongSell)
          this.period.push(response[1][i].period.slice(0,-3))
        }
        for(let i=0;i<response[2].length;i++){
          if(response[2][i].actual==null){
            response[2][i].actual=0
          }
          if(response[2][i].surprise==null){
            response[2][i].surprise=0
          }
          if(response[2][i].surprisePercent==null){
            response[2][i].surprisePercent=0
          }
          if(response[2][i].estimate==null){
            response[2][i].estimate=0
          }
          this.quarter_data.push(`${response[2][i].period} Surprise: ${response[2][i].surprise}`)
          let quarter_num=response[2][i].quarter
          if (quarter_num==1){
          this.categoryLinks[1]=`${response[2][i].period} Surprise: ${response[2][i].surprise}`
          }
          if (quarter_num==2){
            this.categoryLinks[2]=`${response[2][i].period} Surprise: ${response[2][i].surprise}`
            }
          if (quarter_num==3){
              this.categoryLinks[3]=`${response[2][i].period} Surprise: ${response[2][i].surprise}`
          }
          if (quarter_num==4){
                this.categoryLinks[4]=`${response[2][i].period} Surprise: ${response[2][i].surprise}`
          }
          this.earning_estimate_data.push(response[2][i].estimate)
          this.earning_actual_data.push(response[2][i].actual)
        }
        this.isLoadedResult=true
        this.g.results1=response[0]
        this.g.results2=response[1]
        this.g.results3=response[2]
        this.g.visited=true
      },error=>{
        console.error(error)
      });
    }
  }
  column_chart=new Chart({
    
    chart: {
      type: 'column',
      backgroundColor:'#F4F4F4',
  },
  title: {
      text: 'Recommendation Trends',
      style:{
        fontFamily:'Roboto Medium',
        fontWeight:''
      }
  },
  xAxis: {
      categories: this.period
  },
  yAxis: {
      min: 0,
      title: {
          text: '#Analysis'
      },
      stackLabels: {
          enabled: false
      }
  },
  legend: {
      align: 'center',
      x: 0,
      verticalAlign: 'bottom',
      y: 0,
      shadow: false
  },
  tooltip: {
      headerFormat: '<b>{point.x}</b><br/>',
      pointFormat: '{series.name}: {point.y}<br/>'
  },
  plotOptions: {
    series:{
      animation:true
    },
      column: {
          stacking: 'normal',
          dataLabels: {
              enabled: true
          }
      }
  },
  credits: {
    enabled: false
},
  series: [{
      name: 'Strong Buy',
      type:'column',
      data: this.strongbuy,
      color: '#23683A'
    }, {
      name: 'Buy',
      type:'column',
      data: this.buy,
      color: '#2EB05B'
  }, {
      name: 'Hold',
      type:'column',
      data: this.hold,
      color: '#B68236'
  },{
    name: 'Sell',
    type:'column',
    data: this.sell,
    color:  '#F45D5E'
},{
  name: 'Strong Sell',
  type:'column',
  data: this.strongsell,  
  color: '#793333'
}]
  });
spline_chart= new Chart({
  chart: {
    type: 'spline',
    backgroundColor:'#F4F4F4',
},
credits:{
  enabled:false
},
title: {
    text: 'Historical EPS Surprises',
    style:{
      fontFamily:'Roboto Medium',
      fontWeight:''
    } 
},
xAxis: [{
  categories: this.quarter_data,
  labels:{
    style:{
    }
  },
  minPadding: 0.2,
  maxPadding:0.1,
},{
  labels: {
    enabled: false
  },
  gridLineWidth: 0,
  tickWidth: 0,
  lineWidth: 1, 
  lineColor: 'black',
}],
yAxis: {
    title: {
        text: 'Quarterly EPS'
    },
  },
legend: {
  align:'center',
  itemStyle:{
    border: '10',
    borderRadius: 2
  },
    enabled: true
},
plotOptions: {  
    spline: {
        marker: {
            enabled: true
        }
    }
},
series: [{
    name: 'Actual',
    type:'spline',
    data: this.earning_actual_data

},{
  name:'Estimate',
  type:'spline',
  data: this.earning_estimate_data
}]
})

}
