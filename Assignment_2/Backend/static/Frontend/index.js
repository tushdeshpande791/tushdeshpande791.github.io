var xhr= new XMLHttpRequest();
var company_profile
var stock_summ
var latest
var chart_data
var index=[]
mnames=['January', 'February', 'March','April','May','June','July','August','September','October','November','December'];
function humandate(epochtime){
    date=new Date(epochtime*1000)
    day=date.getDate();
    month=date.getMonth();
    year=date.getFullYear();
    const final_date = String(day).concat(" ",String(mnames[month]),', ',String(year));
    return final_date;
}
function not_found(){
    document.getElementById("display").style="display:block;"
    document.getElementById("Not_found_tab").style="display:flex;"
    document.getElementById("Company_tab").style="display:none;"
    document.getElementById("Stock_Summary_tab").style="display:none;"
    document.getElementById("Latest_news_tab").style="display:none;"
    document.getElementById("Charts_tab").style="display:none"
}
function company_tab(){
    document.getElementById("logo-image").src=company_profile.logo;
    document.getElementById("company-name").innerHTML=company_profile.name;
    document.getElementById("company-symbol").innerHTML=company_profile.ticker; 
    document.getElementById("company-code").innerHTML=company_profile.exchange; 
    document.getElementById("company-date").innerHTML=company_profile.ipo; 
    document.getElementById("company-cat").innerHTML=company_profile.finnhubIndustry;
    document.getElementById("display").style="display:block;"
    document.getElementById("Not_found_tab").style="display:none;"
    document.getElementById("Company_tab").style="display:block;"
    document.getElementById("Stock_Summary_tab").style="display:none;"
    document.getElementById("Charts_tab").style="display:none"
    document.getElementById("Latest_news_tab").style="display:none;"
}
function stock_summary_tab(){
    document.getElementById("display").style="display:block;"
    document.getElementById("Stock_Summary_tab").style="display:block"
    document.getElementById("Company_tab").style="display:none"
    document.getElementById("Latest_news_tab").style="display:none"
    document.getElementById("Charts_tab").style="display:none"
    document.getElementById("symbol").innerHTML=stock_summ[1][0].symbol;
    document.getElementById("trading-day").innerHTML=humandate(stock_summ[0].t);
    document.getElementById("closing price").innerHTML=stock_summ[0].pc;
    document.getElementById("opening-price").innerHTML=stock_summ[0].o;
    document.getElementById("high-price").innerHTML=stock_summ[0].h;
    document.getElementById("low-price").innerHTML=stock_summ[0].l;
    document.getElementById("change").innerHTML=stock_summ[0].d;
    if (stock_summ[0].d<0){
        document.getElementById("arrow-change").src="static/Frontend/img/RedArrowDown.png"
    }
    else{
        document.getElementById("arrow-change").src="static/Frontend/img/GreenArrowUp.png"
    }
    document.getElementById("change-percent").innerHTML=stock_summ[0].dp
    if (stock_summ[0].dp<0){
        document.getElementById("arrow-percent").src="static/Frontend/img/RedArrowDown.png"
    }
    else{
        document.getElementById("arrow-percent").src="static/Frontend/img/GreenArrowUp.png"
    }
    document.getElementById("strongsell").innerHTML=stock_summ[1][0].strongSell;
    document.getElementById("sell").innerHTML=stock_summ[1][0].sell;
    document.getElementById("hold").innerHTML=stock_summ[1][0].hold;
    document.getElementById("buy").innerHTML=stock_summ[1][0].buy;
    document.getElementById("strongbuy").innerHTML=stock_summ[1][0].strongBuy;
}
function charts_display(){
    document.getElementById("display").style="display:block;"
    document.getElementById("Not_found_tab").style="display:none;"
    document.getElementById("Company_tab").style="display:none;"
    document.getElementById("Stock_Summary_tab").style="display:none;"
    document.getElementById("Latest_news_tab").style="display:none;"
    document.getElementById("Charts_tab").style="display:block;"
}
function charts_tab(){
    var stock_price_data=[]
    var volume_data=[]
    var max_volume=0
    for(let i=0;i<chart_data.results.length;i++){
        day_data=[]
        v_data=[]
        day_data.push((chart_data.results)[i].t)
        day_data.push(chart_data.results[i].c)
        v_data.push((chart_data.results)[i].t)
        current_volume=(chart_data.results)[i].v
        if(current_volume>=max_volume){
            max_volume=current_volume
        }
        v_data.push((chart_data.results)[i].v)
        volume_data.push(v_data) 
        stock_price_data.push(day_data)
    }
    max_volume=max_volume*2;
    (async () => {
        m=moment();
        s=m.format();
        current_date=(s).slice(0,10)
        Highcharts.stockChart('chart_display', {
            rangeSelector: {
                dropdown:'never',
                selected:0,
                inputEnabled:false,
                buttons: [{
                    type: 'day',
                    count: 7,
                    text: '7d',
                    title: 'View 7 days'
                }, {
                    type: 'day',
                    count: 15,
                    text: '15d',
                    title: 'View 15 days'
                }, {
                    type: 'month',
                    count: 1,
                    text: '1m',
                    title: 'View 1 month'
                }, {
                    type: 'month',
                    count:3,
                    text: '3m',
                    title: 'View 3 months'
                }, {
                    type: 'month',
                    count: 6,
                    text: '6m',
                    title: 'View 6 months'
                }]

            },
    
            title: {
                text: 'Stock Price '+ chart_data.ticker + " "+current_date,
                margin: 30,
            },
            subtitle:{
            },
            xAxis:[{
                tickmarkPlacement: 'on',
            }],
            yAxis:[{
                title: {
                    text:'Stock Price',
                },
                opposite: false
            },{
                max: max_volume,
                labels: {
                    align: 'left',
                    x: -4
                },
                title: {
                    text: 'Volume'
                },
                offset:20
            }],
            plotOptions: {
                series: {
                  pointPlacement: 'on'
              }
            },
            navigator: {
                series: {
                    accessibility: {
                        exposeAsGroupOnly: true
                    }
                }
            },
            series: [{
                name: 'Stock Price',
                data: stock_price_data,
                type: 'area',
                threshold: null,
                tooltip: {
                    valueDecimals: 2
                },
                fillColor: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    },
                    stops: [
                        [0, Highcharts.getOptions().colors[0]],
                        [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                    ]
                }
            },{ 
                    type: 'column',
                    color: '#000000',
                    name: 'Volume',
                    pointWidth: 5,
                    data: volume_data,
                    yAxis: 1,
            }]
        });
    })();
}
function latest_news_display(){
    document.getElementById("display").style="display:block;"
    document.getElementById("Stock_Summary_tab").style="display:none"
    document.getElementById("Company_tab").style="display:none"
    document.getElementById("Latest_news_tab").style="display:block"
    document.getElementById("Charts_tab").style="display:none"
    if(index.length<1){
        console.log
        document.getElementById('firstnews').style="display:none"
        document.getElementById('secondnews').style="display:none"
        document.getElementById('thirdnews').style="display:none"
        document.getElementById('fourthnews').style="display:none"
        document.getElementById('fifthnews').style="display:none"
    }
    else if(index.length<2){
        document.getElementById('firstnews').style="display:flex"
        document.getElementById('secondnews').style="display:none"
        document.getElementById('thirdnews').style="display:none"
        document.getElementById('fourthnews').style="display:none"
        document.getElementById('fifthnews').style="display:none"
    }
    else if(index.length<3){
        document.getElementById('firstnews').style="display:flex"
        document.getElementById('secondnews').style="display:flex"
        document.getElementById('thirdnews').style="display:none"
        document.getElementById('fourthnews').style="display:none"
        document.getElementById('fifthnews').style="display:none"
    }
    else if(index.length<4){
        document.getElementById('firstnews').style="display:flex"
        document.getElementById('secondnews').style="display:flex"
        document.getElementById('thirdnews').style="display:flex"
        document.getElementById('fourthnews').style="display:none"
        document.getElementById('fifthnews').style="display:none"
    }
    else if(index.length<5){
        document.getElementById('firstnews').style="display:flex"
        document.getElementById('secondnews').style="display:flex"
        document.getElementById('thirdnews').style="display:flex"
        document.getElementById('fourthnews').style="display:flex"
        document.getElementById('fifthnews').style="display:none"
    }
    else{
        document.getElementById('firstnews').style="display:flex"
        document.getElementById('secondnews').style="display:flex"
        document.getElementById('thirdnews').style="display:flex"
        document.getElementById('fourthnews').style="display:flex"
        document.getElementById('fifthnews').style="display:flex"
    }
}
function latest_news_tab(){
    var count=0
    index=[]
    var i=0
    while(count!=5 && i<latest.length){
        if(latest[i].hasOwnProperty('image') && latest[i].image!="" && latest[i].hasOwnProperty('headline') && latest[i].headline!="" && latest[i].hasOwnProperty('url')  && latest[i].url!="" && latest[i].hasOwnProperty('datetime') && latest[i].datetime!=""){
            count=count+1
            index.push(i)
        }
        i=i+1
    }
    if(index.length<1){
    }
    else if(index.length<2 && index.length>0){
        document.getElementById('n_image1').src=latest[index[0]].image
        document.getElementById('headline1').innerHTML=latest[index[0]].headline
        document.getElementById('date1').innerHTML=humandate(latest[index[0]].datetime)
        document.getElementById('link1').href=latest[index[0]].url
    }
    else if(index.length<3){
        document.getElementById('n_image1').src=latest[index[0]].image
        document.getElementById('headline1').innerHTML=latest[index[0]].headline
        document.getElementById('date1').innerHTML=humandate(latest[index[0]].datetime)
        document.getElementById('link1').href=latest[index[0]].url
        document.getElementById('n_image2').src=latest[index[1]].image
        document.getElementById('headline2').innerHTML=latest[index[1]].headline
        document.getElementById('date2').innerHTML=humandate(latest[index[1]].datetime)
        document.getElementById('link2').href=latest[index[1]].url
    }
    else if(index.length<4){
        document.getElementById('n_image1').src=latest[index[0]].image
        document.getElementById('headline1').innerHTML=latest[index[0]].headline
        document.getElementById('date1').innerHTML=humandate(latest[index[0]].datetime)
        document.getElementById('link1').href=latest[index[0]].url
        document.getElementById('n_image2').src=latest[index[1]].image
        document.getElementById('headline2').innerHTML=latest[index[1]].headline
        document.getElementById('date2').innerHTML=humandate(latest[index[1]].datetime)
        document.getElementById('link2').href=latest[index[1]].url
        document.getElementById('n_image3').src=latest[index[2]].image
        document.getElementById('headline3').innerHTML=latest[index[2]].headline
        document.getElementById('date3').innerHTML=humandate(latest[index[2]].datetime)
        document.getElementById('link3').href=latest[index[2]].url
    }
    else if(index.length<5){
        document.getElementById('n_image1').src=latest[index[0]].image
        document.getElementById('headline1').innerHTML=latest[index[0]].headline
        document.getElementById('date1').innerHTML=humandate(latest[index[0]].datetime)
        document.getElementById('link1').href=latest[index[0]].url
        document.getElementById('n_image2').src=latest[index[1]].image
        document.getElementById('headline2').innerHTML=latest[index[1]].headline
        document.getElementById('date2').innerHTML=humandate(latest[index[1]].datetime)
        document.getElementById('link2').href=latest[index[1]].url
        document.getElementById('n_image3').src=latest[index[2]].image
        document.getElementById('headline3').innerHTML=latest[index[2]].headline
        document.getElementById('date3').innerHTML=humandate(latest[index[2]].datetime)
        document.getElementById('link3').href=latest[index[2]].url
        document.getElementById('n_image4').src=latest[index[3]].image
        document.getElementById('headline4').innerHTML=latest[index[3]].headline
        document.getElementById('date4').innerHTML=humandate(latest[index[3]].datetime)
        document.getElementById('link4').href=latest[index[3]].url
    }
    else{
        document.getElementById('n_image1').src=latest[index[0]].image
        document.getElementById('headline1').innerHTML=latest[index[0]].headline
        document.getElementById('date1').innerHTML=humandate(latest[index[0]].datetime)
        document.getElementById('link1').href=latest[index[0]].url
        document.getElementById('n_image2').src=latest[index[1]].image
        document.getElementById('headline2').innerHTML=latest[index[1]].headline
        document.getElementById('date2').innerHTML=humandate(latest[index[1]].datetime)
        document.getElementById('link2').href=latest[index[1]].url
        document.getElementById('n_image3').src=latest[index[2]].image
        document.getElementById('headline3').innerHTML=latest[index[2]].headline
        document.getElementById('date3').innerHTML=humandate(latest[index[2]].datetime)
        document.getElementById('link3').href=latest[index[2]].url
        document.getElementById('n_image4').src=latest[index[3]].image
        document.getElementById('headline4').innerHTML=latest[index[3]].headline
        document.getElementById('date4').innerHTML=humandate(latest[index[3]].datetime)
        document.getElementById('link4').href=latest[index[3]].url
        document.getElementById('n_image5').src=latest[index[4]].image
        document.getElementById('headline5').innerHTML=latest[index[4]].headline
        document.getElementById('date5').innerHTML=humandate(latest[index[4]].datetime)
        document.getElementById('link5').href=latest[index[4]].url
    }
}
function remove(){
    document.getElementById("search").value="";
    document.getElementById('display').style="display:none;";
}
function datareceiveapicalls(){
    if (xhr.readyState == 4 && xhr.status == 200){
        d=JSON.parse(xhr.responseText)
        if(JSON.stringify(d).length<=2){
            not_found();
            return
        }
        else{
        company_profile=d[0]
        stock_summ=d[1]
        latest=d[2]
        chart_data=d[3]
        document.getElementById("display").style="display:none;"
        company_tab();
        charts_tab();
        latest_news_tab();
        }
    }
}
function call_apis(){
    var symbol=document.getElementById("search").value;
    symbol=symbol.toUpperCase()
    xhr.open('GET', '/apicalls?symbol=' + symbol,true)
    xhr.send();
    xhr.onreadystatechange=datareceiveapicalls;
}
