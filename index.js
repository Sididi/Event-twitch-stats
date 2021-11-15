#!/usr/bin/env node
'use strict';

/*  */
const axios = require('axios');
const cheerio = require('cheerio');

/* */
const config = require('./config.json');

/* */
const startDate = new Date(config.start_date);
const endDate = new Date(config.end_date);

/* */
const data = {};

const getStreamerData = async (streamer) => {

    axios.get('https://twitchtracker.com/' + streamer + '/streams')
        .then(page => {
            
            if (page.data) {
                const $ = cheerio.load(page.data);

                const streamerData = $('#streams tbody tr').map((i, el) => {

                    const date = new Date($(el).find('a').text());
                    if (date > startDate && date < endDate) {

                        return $(el).contents().map((i, el) => {
                            if (i % 2 && i > 1 && i < 13)
                                return $(el).text().trim();
                        }).toArray();
                    }

                    return null;

                }).toArray();

                data[streamer] = streamerData;
                console.log(data);
            }

        })
        .catch(err => {
	    console.error(err);
	    return null;
	});
}


/* Async anonymous func (to setup everything) */
(async () => {

    config.streamers.forEach(async (streamer) => {
	await new Promise(resolve => setTimeout(resolve, 10000));
        await getStreamerData(streamer);
    })

    console.log(data);
    
})();
