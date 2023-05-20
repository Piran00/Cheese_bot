const Discord = require('discord.js');
const cron = require('node-cron');
const wtf = require('wtf_wikipedia');

const client = new Discord.Client();
const channelId = 'insert_channel_id_here'; // replace with the ID of the channel you want to post in
let postedArticles = [];

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

cron.schedule('0 0 * * *', () => {
  wtf.random('cheese').then(doc => {
    const title = doc.title();
    const summary = doc.summary();

    if (postedArticles.includes(title)) {
      // If the article has already been posted, search again
      return cron.schedule('0 0 * * *', () => {
        wtf.random('cheese').then(doc => {
          const newTitle = doc.title();
          const newSummary = doc.summary();

          if (!postedArticles.includes(newTitle)) {
            const embed = new Discord.MessageEmbed()
              .setTitle(newTitle)
              .setDescription(newSummary)
              .setURL(doc.url());

            const channel = client.channels.cache.get(channelId);
            channel.send(embed);

            postedArticles.push(newTitle);
          }
        });
      });
    }

    const embed = new Discord.MessageEmbed()
      .setTitle(title)
      .setDescription(summary)
      .setURL(doc.url());

    const channel = client.channels.cache.get(channelId);
    channel.send(embed);

    postedArticles.push(title);
  });
});

client.login('insert_bot_token_here'); // replace with your bot token
