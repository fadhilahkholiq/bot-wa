const qrcode = require("qrcode-terminal");
const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");
const axios = require("axios");

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true, args: ['--no-sandbox'],
	executablePath: '/usr/bin/chromium-browser',
  }
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
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
  const updateInterval = 10800000;
  setInterval(async () => {
    await scanAndSendPeriodicMessages();
  }, updateInterval);
});

function sendPeriodicMessage(groupId) {
  client.getChatById(groupId).then(async (groupChat) => {
    try {
      const apiResponse = await axios.get("https://quotes-islami.run-us-west2.goorm.site/quotes_api.php");
      const quoteContent = apiResponse.data.quotes;
      const quoteAuthor = apiResponse.data.author;
      const quoteTitle = apiResponse.data.kitab;
      const messageContent = `*${quoteAuthor}* berkata,\r\n\r\n_"${quoteContent}"_\r\n\r\n📚 ${quoteTitle}`;
      await groupChat.sendMessage(messageContent);
      console.log(`[+] Quotes by ${quoteAuthor} was successfully sent!`);
    } catch (error) {
      console.error("[+] Error fetching data from API.");
    }
  }).catch((error) => {
    console.error("[+] Error getting group chat!");
  });
}

async function downloadVideo(url) {
  try {
    const response = await axios.get(`https://quotes-islami.run-us-west2.goorm.site/tiktok_api.php?url=${url}`);
	const responseData = response.data;
	if (responseData.success) {
		const downloadUrls = responseData.url;
		const mediatok = await MessageMedia.fromUrl(downloadUrls);
		await client.sendMessage(message.from, mediatok);
		console.log('[+] Video has been successfully downloaded!');
	} else {
		console.error('[+] Video download failed!');
	}
  } catch (error) {
    	console.error('[+] Error accessing API!');
  }
}

client.on('message', async (message) => {
  if (message.body.startsWith('.tiktok')) {
    const url = message.body.split(' ')[1];
    if (url) {
      await downloadVideo(url);
    } else {
      message.reply('Invalid usage. Please provide a video URL.');
    }
  }
});

client.on("message", async (message) => {
  if (message.type === "image" && message.body === ".sticker") {
    const media = await message.downloadMedia();
    client.sendMessage(message.from, media, {
      sendMediaAsSticker: true,
      stickerName: "Sticker",
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
    await chat.sendMessage(text, { mentions });
  }
});

client.initialize();
