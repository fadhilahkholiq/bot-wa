const qrcode = require("qrcode-terminal");
const {
	Client,
	LocalAuth
} = require("whatsapp-web.js");
const axios = require("axios");

const client = new Client({
	authStrategy: new LocalAuth({
		dataPath: 'session'
	}),
	puppeteer: {
		headless: true,
		args: ['--no-sandbox'],
	}
});

client.on("qr", (qr) => {
	qrcode.generate(qr, {
		small: true
	});
});

async function scanAndSendPeriodicMessages() {
	const chats = await client.getChats();
	chats.forEach((chat) => {
		if (chat.isGroup) {
			sendPeriodicMessage(chat.id._serialized);
		}
	});
}

client.on("ready", () => {
	console.log("[+] This is JFlavors, bot is ready to go!");
	const updateInterval = 28800000;
	setInterval(async () => {
		await scanAndSendPeriodicMessages();
	}, updateInterval);
});

function sendPeriodicMessage(groupId) {
	client.getChatById(groupId).then(async (groupChat) => {
			try {
				const apiResponse = await axios.get("https://qutipan.000webhostapp.com/");
				const quoteContent = apiResponse.data.quotes;
				const quoteAuthor = apiResponse.data.author;
				const quoteTitle = apiResponse.data.kitab;
				const messageContent = `*${quoteAuthor}* berkata,\r\n\r\n_"${quoteContent}"_\r\n\r\n📚 ${quoteTitle}`;
				await groupChat.sendMessage(messageContent);
				console.log(`[+] Quotes by ${quoteAuthor} was successfully sent!`);
			} catch (error) {
				console.error("[+] Error fetching data from API.");
			}
		})
		.catch((error) => {
			console.error("[+] Error getting group chat!");
		});
}

async function downloadVideo(url, message) {
	try {
		const response = await axios.get(`https://api.lolhuman.xyz/api/tiktok?apikey=bd20a85773ccc8587cf4e30d&url=${url}`);
		if (response.data) {
			const response2 = await axios.get(`https://api.lolhuman.xyz/api/shortlink4?apikey=bd20a85773ccc8587cf4e30d&url=${encodeURIComponent(response.data.result.link)}`);
			const finalurl = response2.data.result;
			const messageContent = `⬇ *TIKTOK DOWNLOADER*\r\n\r\nLink Download:\r\n🔗 ${finalurl}`;
			await client.sendMessage(message.from, messageContent);
			console.log('[+] TikTok link successfully sent!');
		}
	} catch (error) {
		console.error('[+] Error accessing API!');
	}
}

client.on('message', async (message) => {
	if (message.body.startsWith('.tt')) {
		const url = message.body.split(' ')[1];
		if (url) {
			await downloadVideo(url, message);
		} else {
			message.reply('Tolong beri tautan videonya juga.');
		}
	}
});

async function downloadIG(url, message) {
	try {
		const response = await axios.get(`https://api.lolhuman.xyz/api/instagram?apikey=bd20a85773ccc8587cf4e30d&url=${url}`);
		if (response.data) {
			const response2 = await axios.get(`https://api.lolhuman.xyz/api/shortlink4?apikey=bd20a85773ccc8587cf4e30d&url=${encodeURIComponent(response.data.result[0])}`);
			const finalurl = response2.data.result;
			const messageContent = `⬇ *INSTAGRAM DOWNLOADER*\r\n\r\nLink Download:\r\n🔗 ${finalurl}`;
			await client.sendMessage(message.from, messageContent);
			console.log('[+] Instagram link successfully sent!');
		}
	} catch (error) {
		console.error('[+] Error accessing API!');
	}
}

client.on('message', async (message) => {
	if (message.body.startsWith('.ig')) {
		const url = message.body.split(' ')[1];
		if (url) {
			await downloadIG(url, message);
		} else {
			message.reply('Tolong beri tautan videonya juga.');
		}
	}
});

async function downloadFB(url, message) {
	try {
		const response = await axios.get(`https://api.lolhuman.xyz/api/facebook?apikey=bd20a85773ccc8587cf4e30d&url=${url}`);
		if (response.data) {
			const response2 = await axios.get(`https://api.lolhuman.xyz/api/shortlink4?apikey=bd20a85773ccc8587cf4e30d&url=${encodeURIComponent(response.data.result[0])}`);
			const finalurl = response2.data.result;
			const messageContent = `⬇ *FACEBOOK DOWNLOADER*\r\n\r\nLink Download:\r\n🔗 ${finalurl}`;
			await client.sendMessage(message.from, messageContent);
			console.log('[+] Facebook link successfully sent!');
		}
	} catch (error) {
		console.error('[+] Error accessing API!');
	}
}

client.on('message', async (message) => {
	if (message.body.startsWith('.fb')) {
		const url = message.body.split(' ')[1];
		if (url) {
			await downloadFB(url, message);
		} else {
			message.reply('Tolong beri tautan videonya juga.');
		}
	}
});

async function downloadYT(url, message) {
	try {
		const response = await axios.get(`https://api.lolhuman.xyz/api/ytvideo2?apikey=bd20a85773ccc8587cf4e30d&url=${url}`);
		if (response.data) {
			const response2 = await axios.get(`https://api.lolhuman.xyz/api/shortlink4?apikey=bd20a85773ccc8587cf4e30d&url=${encodeURIComponent(response.data.result.link)}`);
			const finalurl = response2.data.result;
			const messageContent = `⬇ *YOUTUBE DOWNLOADER*\r\n\r\nLink Download:\r\n🔗 ${finalurl}`;
			await client.sendMessage(message.from, messageContent);
			console.log('[+] YouTube link successfully sent!');
		}
	} catch (error) {
		console.error('[+] Error accessing API!');
	}
}

client.on('message', async (message) => {
	if (message.body.startsWith('.yt')) {
		const url = message.body.split(' ')[1];
		if (url) {
			await downloadYT(url, message);
		} else {
			message.reply('Tolong beri tautan videonya juga.');
		}
	}
});

async function downloadTW(url, message) {
	try {
		const response = await axios.get(`https://api.lolhuman.xyz/api/twitter?apikey=bd20a85773ccc8587cf4e30d&url=${url}`);
		if (response.data) {
			const response2 = await axios.get(`https://api.lolhuman.xyz/api/shortlink4?apikey=bd20a85773ccc8587cf4e30d&url=${encodeURIComponent(response.data.result.media[0].url)}`);
			const finalurl = response2.data.result;
			const messageContent = `⬇ *TWITTER VIDEO DOWNLOADER*\r\n\r\nLink Download:\r\n🔗 ${finalurl}`;
			await client.sendMessage(message.from, messageContent);
			console.log('[+] Twitter link successfully sent!');
		}
	} catch (error) {
		console.error('[+] Error accessing API!');
	}
}

client.on('message', async (message) => {
	if (message.body.startsWith('.tw')) {
		const url = message.body.split(' ')[1];
		if (url) {
			await downloadTW(url, message);
		} else {
			message.reply('Tolong beri tautan videonya juga.');
		}
	}
});

client.on('message', async (message) => {
	if (message.body === ".menu") {
		const messageContent = `🍉 *FRNDLY BOT*\r\n\r\n🦉 Fitur WhatsApp:\r\n*.sticker* (Buat Sticker)\r\n*.everyone* (Tag Member)\r\n\r\n🦉 Fitur Downloader:\r\n*.ig* (Instagram Post & Video)\r\n*.fb* (Facebook Video)\r\n*.yt* (YouTube Video)\r\n*.tt* (TikTok Video)\r\n*.tw* (Twitter Video)\r\n\r\n🦉 Donasi:\r\n*DANA* 085156819451 (Kholiq Fadhilah)`;
		await client.sendMessage(message.from, messageContent);
	}
});

client.on("message", async (message) => {
	if (message.type === "image" && message.body === ".sticker") {
		const media = await message.downloadMedia();
		client.sendMessage(message.from, media, {
			sendMediaAsSticker: true,
			stickerName: "El Nepotisme",
			stickerAuthor: "JFlavors",
		});
	}
});

client.on("message", async (msg) => {
	if (msg.body === ".everyone") {
		const chat = await msg.getChat();
		let text = "";
		let mentions = [];
		for (let participant of chat.participants) {
			const contact = await client.getContactById(participant.id._serialized);
			mentions.push(contact);
			text += `@${participant.id.user} `;
		}
		await chat.sendMessage(text, {
			mentions
		});
	}
});

client.on('message', async (message) => {
    if (message.body === '.quit') {
        const chat = await message.getChat();
        await chat.leave();
        console.log('[+] Left the group as per user request.');
    }
});

client.initialize();
