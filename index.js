// require the discord.js module
const fs = require('fs');
const Discord = require('discord.js');
const {
	prefix,
	token
} = require('./config.json');
// create a new Discord client
const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}

// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', () => {
	client.user.setUsername('ShutupKyle');
	console.log('Ready!');
});

client.on('message', message => {

	if (!message.content.startsWith(prefix) || message.author.bot) return;

	// Create an args variable that slices off the prefix entirely, removes the leftover whitespaces and then splits it into an array by spaces.
	const args = message.content.slice(prefix.length).trim().split(/ +/);
	// Create a command variable by calling args.shift(), which will take the first element in array and return it while also removing it from the original array (so that you don't have the command name string inside the args array).
	const commandName = args.shift().toLowerCase();


	/* If there isn't a command with that name, exit early. If there is, .get() the command and call its .execute() method while passing
	 * in your message and args variables as the method arguments. In case something goes wrong, log the error and report back to the member to let them know.
	 */
	if (!client.commands.has(commandName)) return;

	const command = client.commands.get(commandName);
	if (command.args && !args.length) {
		return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
	}
	try {
		command.execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}


});

// login to Discord with your app's token
client.login(token);