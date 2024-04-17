const express = require('express');
const app = express();
const mongoose=require('mongoose');
const axios = require('axios');
const dbURI='mongodb+srv://tndesh01:Mongodbisno1$@cluster0.luifdzi.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0'
mongoose.connect(dbURI)
  .then((result)=> console.log('connected to db'))
  .catch((err)=> console.log(err));
app.listen(process.env.PORT || 3000);
const path = require('path');
const Watch = require('./models/watchlist');
const Port=require('./models/portfolio');
const Wall=require('./models/wallet');

app.use(express.static(path.join(__dirname, '../dist/browser')));
app.set('trust proxy', true);
app.get("/", (req,res)=>{
  res.redirect('/search/home')
});
app.get("/search/home", (req,res)=>{
  res.sendfile(path.join(__dirname, '../dist/browser/index.html'));
})
app.get("/add-watchlist/:ticker/:name",(req,res)=>{
  const ticker=req.params.ticker
  const name=req.params.name
  const watch=new Watch({
    ticker:`${ticker}`,
    company_name:`${name}`
  });
  watch.save()
    .then((result)=>{
      res.send(result)
    }) 
    .catch((err)=>{
      console.log(err)
    });
      
})
app.get("/buy/:amount",(req,res)=>{
  const amount=req.params.amount
  Wall.updateOne(
    {_id:'66031909f1edc038fa6bfa42'},
    {$inc: {amount:`${-amount}`}},
    {upsert: true}
  )
  .then((response)=>{
    res.send(response)
  })
  .catch((err)=>{
    console.log(err)
  })
})
app.get("/sell/:amount",(req,res)=>{
  const amount=req.params.amount
  Wall.updateOne(
    {_id:'66031909f1edc038fa6bfa42'},
    {$inc: {amount:`${amount}`}},
    {upsert: true}
  )
  .then((response)=>{
    res.send(response)
  })
  .catch((err)=>{
    console.log(err)
  })
})
app.get("/fetchwallet",(req,res)=>{
  Wall.find()
  .then(async (result)=>{
    res.send(result)
  }) 
  .catch((err)=>{
    console.log(err)
  });
})  
app.get("/update-portbuy/:ticker/:compname/:num_of_stocks/:totalcost",(req,res)=>{
  const ticker=req.params.ticker
  const compname=req.params.compname
  const num_of_stocks=Number(req.params.num_of_stocks)
  const totalcost=Number(req.params.totalcost)
  Port.updateOne(
    {ticker:`${ticker}`},
    {ticker:`${ticker}`,company_name:`${compname}`,$inc:{num_of_stocks:`${num_of_stocks}`,totalcost:`${(totalcost).toFixed(2)}`}},
    {upsert:true}
    )
    .then((response)=>{
      res.send(response)
    })
    .catch((err)=>{
      console.log(err)
    });
})
app.get("/update-portsell/:ticker/:compname/:num_of_stocks/:totalcost",(req,res)=>{
  const ticker=req.params.ticker
  const compname=req.params.compname
  const num_of_stocks=Number(req.params.num_of_stocks)
  const totalcost=Number(req.params.totalcost)
  Port.updateOne(
    {ticker:`${ticker}`},
    {ticker:`${ticker}`,company_name:`${compname}`,$inc:{num_of_stocks:`${-num_of_stocks}`,totalcost:`${(-totalcost).toFixed(2)}`}},
    {upsert:true}
    )
    .then((response)=>{
      res.send(response)
    })
    .catch((err)=>{
      console.log(err)
    });

  
})
app.get("/get-port",(req,res)=>{
  responsequote=[]
  positive=[]
  nochange=[]
  Port.find()
    .then(async (result)=>{
      for(let i=0;i<result.length;i++)  {
        const response=await axios.get(`https://finnhub.io/api/v1/quote?symbol=${result[i].ticker}&token=cmu2hnpr01qsv99lvjdgcmu2hnpr01qsv99lvje0`)
        responsequote.push(response.data)
        if(result[i].num_of_stocks==0){
          res.send([],[],[],[])
        }
        if((response.data.c).toFixed(2)-Number(((result[i].totalcost).toFixed(2)/(result[i].num_of_stocks).toFixed(2)).toFixed(2))<0){
          positive.push(false)
          nochange.push(false)
        }
        else if((response.data.c).toFixed(2)-Number(((result[i].totalcost).toFixed(2)/(result[i].num_of_stocks).toFixed(2)).toFixed(2))==0){
          nochange.push(true)
          positive.push(false)
        }
        else{
          nochange.push(false)  
          positive.push(true)
        }
      }
      res.send([result,responsequote,positive,nochange])
    })
    .catch((err)=>{
      console.log(err)
    });
})
app.get("/remove-port/:ticker",(req,res)=>{
  const ticker=req.params.ticker
  Port.deleteOne({ticker:`${ticker}`})
    .then((response)=>{
      res.send(response)
    })
    .catch((err)=>{
      console.log(err)
    });
})
app.get("/get-watchlist",(req,res)=>{
  responsequote=[]
  positive=[]
  nochange=[]
  Watch.find()
  .then(async (result)=>{
    for(let i=0;i<result.length;i++){
      const response=await axios.get(`https://finnhub.io/api/v1/quote?symbol=${result[i].ticker}&token=cmu2hnpr01qsv99lvjdgcmu2hnpr01qsv99lvje0`)
      responsequote.push(response.data)
      if(response.data.d<0){
        positive.push(false)
        nochange.push(false)

      }
      else if(response.data.d==0){
        positive.push(false)
        nochange.push(true)
      }
      else{
        positive.push(true)
        nochange.push(false)

      }
    }
    res.send([result,responsequote,positive,nochange])
  }) 
  .catch((err)=>{
    console.log(err)
  });
})
app.get("/remove-watchlist/:ticker",(req,res)=>{
  
  const ticker=req.params.ticker
  Watch.deleteOne({ticker:`${ticker}`})
    .then((response)=>{
      res.send(response)
    })
    .catch((err)=>{
      console.log(err)
    });
})
app.get('/details/:ticker', async (req,res)=>{
  res.set('Access-Control-Allow-Origin', '*');

  const ticker=req.params.ticker;
  const response1= await axios.get(`https://finnhub.io/api/v1/stock/profile2?symbol=${ticker}&token=cmu2hnpr01qsv99lvjdgcmu2hnpr01qsv99lvje0`)
  if ('ticker' in response1.data){
    const response2= await axios.get(`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=cmu2hnpr01qsv99lvjdgcmu2hnpr01qsv99lvje0`)
    const response3= await axios.get(`https://finnhub.io/api/v1/stock/peers?symbol=${ticker}&token=cmu2hnpr01qsv99lvjdgcmu2hnpr01qsv99lvje0`)
    res.send([response1.data,response2.data,response3.data])
  }
  else{
    res.send([response1.data])
  }
})
app.get('/quote/:ticker',async (req,res)=>{
  res.set('Access-Control-Allow-Origin', '*');
  const ticker=req.params.ticker;
  const response=await axios.get(`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=cmu2hnpr01qsv99lvjdgcmu2hnpr01qsv99lvje0`)
  res.send(response.data)
})
app.get('/:ticker', async (req,res)=>{
  res.set('Access-Control-Allow-Origin', '*');
  const ticker=req.params.ticker;
  const response= await axios.get(`https://finnhub.io/api/v1/search?q=${ticker}&token=cmu2hnpr01qsv99lvjdgcmu2hnpr01qsv99lvje0`)
  res.send(response.data)
})
app.get('/news/:ticker/:from/:to', async (req,res)=>{
  res.set('Access-Control-Allow-Origin', '*');
  const ticker=req.params.ticker;
  const from=req.params.from
  const to=req.params.to  
  const response= await axios.get(`https://finnhub.io/api/v1/company-news?symbol=${ticker}&from=${from}&to=${to}&token=cmu2hnpr01qsv99lvjdgcmu2hnpr01qsv99lvje0`)
  res.send(response.data)
})
app.get('/polygon/:frame/:ticker/:from/:to', async (req,res)=>{
  
  const ticker=req.params.ticker;
  res.set('Access-Control-Allow-Origin', '*');
  const from=req.params.from
  const to=req.params.to
  const frame=req.params.frame
  const response= await axios.get(`https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/${frame}/${from}/${to}?adjusted=true&
  sort=asc&apiKey=QKZJbijv8KNP9sO5F0vNgBdVII5FyHpR`)
  res.send(response.data)
})
app.get('/polygon/:ticker', async (req,res)=>{
  res.set('Access-Control-Allow-Origin', '*');

  const ticker=req.params.ticker;
  const response1= await axios.get(`https://finnhub.io/api/v1/stock/insider-sentiment?symbol=${ticker}&from=2022-01-01&token=cmu2hnpr01qsv99lvjdgcmu2hnpr01qsv99lvje0`)
  const response2= await axios.get(`https://finnhub.io/api/v1/stock/recommendation?symbol=${ticker}&token=cmu2hnpr01qsv99lvjdgcmu2hnpr01qsv99lvje0`)
  const response3= await axios.get(`https://finnhub.io/api/v1/stock/earnings?symbol=${ticker}&token=cmu2hnpr01qsv99lvjdgcmu2hnpr01qsv99lvje0`)

  res.send([response1.data,response2.data,response3.data]) 
}) 
app.get("/watchlist",(req,res)=>{
  res.send('<p>Hello world</p>')

})
app.get("/portfolio",(req,res)=>{
  console.log("Something")
  res.send('<p>Hello world</p>')

})