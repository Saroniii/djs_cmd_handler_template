const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const path = './commands';
const token = process.env.token;
const prefix = '!'
client.cmds = new Discord.Collection();

client.once('ready', () => {
    console.log('Bot Started...');
    const cmdFiles = fs.readdirSync(path).filter(file_data => file_data.endsWith('.js'));
    loadCmdFiles(cmdFiles)
    console.log('Bot is now up and running!')
});

const loadCmdFiles = (cmdFiles) => {
    for (const file of cmdFiles) {
        try {
            const cmd = require(`${path}/${file}`);
            client.cmds.set(`${cmd.name}`, cmd);
            console.log(
                `Success to load '${file}'.`
            );
        } catch (error) {
            console.log(
                `File '${file}' could not be read due to the following error:\n${error}`
            );
        };
    };
};

client.on('message', message => {

    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();

    if (!client.cmds.has(command)) return;

    try {
        client.cmds.get(command).execute(message, args);
    } catch (error) {
        console.log(
            `An error has occurred.\n${error}`
        );
        return;
    }
}
);

client.login(token);