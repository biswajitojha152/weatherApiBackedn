const http = require('http');
const fs = require('fs');

const homeFile = fs.readFileSync('home.html', "utf-8");

const requests = require('requests');

const replaceVal = (tempVal,orgVal)=>{
    let temperature = tempVal.replace('{%tempval%}',orgVal.main.temp);
         temperature = temperature.replace('{%tempmin%}',orgVal.main.temp_min);
         temperature = temperature.replace('{%tempmax%}',orgVal.main.temp_max);
         temperature = temperature.replace('{%location%}',orgVal.name);
         temperature = temperature.replace('{%country%}',orgVal.sys.country);
         temperature = temperature.replace('{%tempstatus%}',orgVal.weather[0].main);

         return temperature;
}

server = http.createServer((req, res) => {
    if (req.url == '/') {
        requests('https://api.openweathermap.org/data/2.5/weather?q=pune&appid=b50d67c9bf2a886efbf5d721705003c6', { streaming:true })
            .on('data', (chunk)=> {
                const objdata= JSON.parse(chunk);
                const arrData = [objdata];
                // console.log(arrData[0].main.temp);
                const realTimedata = arrData.map((val)=> replaceVal(homeFile,val)).join("");  //to convert array to strings using .join method
                res.write(realTimedata);
            })
            .on('end', (err)=> {
                if (err) return console.log('connection closed due to errors', err);
                res.end();
                console.log('end');
            });
    }
    else {
        res.writeHead(404,{'content-type':'text/html'})
        res.end("File not found");
    }

})


server.listen(8000, '127.0.0.1', () => {
    console.log('server running 5000');
})