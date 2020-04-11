const request = require('request');
const cheerio = require('cheerio');

request('https://news.google.com/covid19/map?hl=fr&gl=FR&ceid=FR:fr', (error, response, html) => {
    if (!error && response.statusCode == 200) {
        const $ = cheerio.load(html);

        const siteTable = $('#yDmH0d > c-wiz > div > div.FVeGwb.ARbOBb > div.BP0hze > div.y3767c > div > div > c-wiz.dzRe8d.pym81b > div > table > tbody > tr ');

        const out = siteTable.text();

        var data = []

        siteTable.each((index, element) => {
            //console.log($(element).text());
            var dataAll = []
            $(element.children).each((index1, element2) => {
                //console.log($(element2).text());
                dataAll.push($(element2).text())
            });
            data.push({
                'Emplacement': dataAll[0],
                'Confirmés': dataAll[1],
                'Cas pour 1 million de personnes': dataAll[2],
                'Personnes guéries': dataAll[3],
                'Décès': dataAll[4]
            })
        });
        console.log(data)
       
    }
});