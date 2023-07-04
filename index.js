// Discord
const Discord = require("discord.js");
const admin = require('firebase-admin');
const { max } = require("underscore");
const fs = require("fs");

const { GoogleAuth } = require('google-auth-library');
const { google } = require('googleapis');


const serviceAccount = require("./firebaseCredentials.json");
admin.initializeApp({ credential: admin.credential.cert(serviceAccount), databaseURL: "https://ngcpollbot-default-rtdb.europe-west1.firebasedatabase.app/" });

const SPREADSHEET_ID = "1NBtTkwCeRNX80dKTXykR8zeYtLe2v7FWgWQ2Efu5tT4";
const CREDENTIALS = {
    "type": "service_account",
    "project_id": "zkn-discord-bots",
    "private_key_id": "4e2ec39f743e466381cc252cf3f4fb5aa64f743e",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCmvgCgfvfh9YUL\nkt1G3oktDpI7Wsw0rMltp9Haw5fs5OteW0EXHKAYQX4ZDuNlOzR/FE7hIG/lVuB6\nkoVkGr42qRzf/RxMh5OEtIe45h2XvEmkQ3l63U/XfuvQPnWyNEul5okB0w6O64RF\ngUsrBfirggZDf7MMBHaZXr+ssGcAWlF4NrtgzufXqFgkod9wD+zr+fXBRo+Q/QKQ\nN54GwNgTodzmt2j6zU0d57A09nklsfW9/VK8W4oxoNGFfYJyHkoj08j9tQLE5KSc\njdiQz1GJcFpOEx+I9HN/D39INua6PHEUkZDl3U0GfuRmIHxR9nl18dUW+b870u6K\n9rZLiCQfAgMBAAECggEABqp54/CvgD0MgJXyeq7S1RZMCktq9oAh3VxkK1a+cB4G\nutLzGzVtwQp9PAs4VAe15Y6uSJm/X2/FsaDB7GqVSCIioWHBC94vq5J8CoxIipRg\nbUy1QpAubPMKAl08307v50X8HDKP1m7b7ttoYePvOQwNrA0i30weYatEBmdW9tCU\n5OkiP6Pv7PfB6cAGHV3OCx5FuTK4yCK2cI8zV3TjhbA9W2Rjok6EfbRFz9iU2dwv\n387BT27FWkVJ53P0Hz7iOKX70OLBoD3jhK2h7uqUZ8cHZG5Kt/ry88YH7H1kV110\ny3c6FKk1xETRjn6aZlUF4S6fVp5ka9BgrLB/iPhFIQKBgQDpVWO6IQ6oSwm1NaLX\naGUd1I7Ec9iS0xk39TIPhYUKrQBStRCuerSUkkuIKwkt0cqzajPfv6pqcALUV76C\nQ0QSreBGE3X9F87VeGLNe+82/uiQEr/6vbrQ4RO0hGalvxOovnHwA8T14yx0YdQ5\nADGf166NrdY0DRrfJOV+y/tR2wKBgQC28Jk+JPXV7yRpuUMM+ZrXmYmYiS9CbEDz\nUvJqSbY8JcZfPNCkvaOWIToaWQiVvVQiR2n5nO2gobN31HQAQuHj3eUBREdgDtew\nZ6vD5SSRIEb94Bg1xM8KUIBQ96qm6pGDEVVpySaQcmjtix86oSpynKaAWh4qbfT7\nwKCiDdW0DQKBgHjKmqj1igf3aJwlmxpWUdpielIbAqfnnmuIhJTicyA2tS8byvn4\nTdmH7pAcb1EIBR5iQV54c3lMaTqR/e6jce8Vkj/UvUT7eTirbMKhgRIAXlaPTlE4\nvSh7DF9sF1OAmmXFyWgOG32LUC0jo+CqSAZOem+f6X7iteGE0UWVxZH3AoGAUtFn\nPpfy5w/lNyuUrDoPnE042mI4j+R8HuvNLMsEAgTD4negqQPlG+Ec8bKezVMx1Hbq\nBgPCG/c4TSZUAY5FvyfENaeYfGcbxBOa0gtZW432NZaOv0DCzhOVk5IboocMqv5c\n4ZAbskbpM6jI0X0Gv24lfnPNtj2jK5mP3u1Ocr0CgYEAz4A3u/XnaO/C/6QWth0r\naTVxfmsRBLTzx5Dc3cT1bnevuMhNXDa4nxasnhsHWYpzFL7L6ZZp3q88JWsFSDPw\n4jLtwSoQ8dXWp7RK0By3KTOuQJqvvIIpA9U7+m1qNDxNxJHpN5TAU93dg9wbMCm6\n7Lfl4vvITboG2fqgy9lMBaM=\n-----END PRIVATE KEY-----\n",
    "client_email": "service-account@zkn-discord-bots.iam.gserviceaccount.com",
    "client_id": "107495389926767480580",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/service-account%40zkn-discord-bots.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
};

const DONATION_ADDRESS = "0x3EE72fF879086BA16694CE94C88d3cF2880eab40";
const FREE_VERSION_ROLES_LIMIT = 4;
const POLL_DONATION_TEXT_FREQUENCY = 3;
const DAY_IN_MILLIS = 1000 * 60 * 60 * 24;
const FREE_VERSION_WEEKLY_POLLS_LIMIT = 4;
const DEFAULT_EMBED_COLOR = Discord.Colors.Orange;

const client = new Discord.Client({
    intents: [
        // "32767", // All Intents
        "1", // Guilds
        // "128", // GuidVoiceStates
        "512", // GuildMessages
        // "256", // GuildPresences
    ],
});

let pollsCount = 0;
let pollsRoles = JSON.parse(fs.readFileSync("pollsRoles.json"));
const polls = JSON.parse(fs.readFileSync("polls.json"));

const usersPolls = {};
let premiumCodes = {};
// let premiumCodes = { "a": "a", "b": "b", "c": "c" };
let premiumMembers = {};

admin.database().ref("premiumCodes").get().then(res => premiumCodes = res.val());
admin.database().ref("premiumMembers").get().then(res => premiumMembers = res.val());

const savePolls = () => fs.writeFileSync("polls.json", JSON.stringify(polls));
const prettifyDate = date => String(date).length === 1 ? `0${date}` : date;
const getPollExpirationMessage = poll => {
    const createdAt = new Date(poll.createdAt);
    const expiration = new Date(createdAt.getTime() + poll.expirationHours * 1000 * 60 * 60 + poll.expirationMinutes * 1000 * 60);
    return `Created: ${createdAt.getMonth()+1}/${createdAt.getDate()}/${createdAt.getFullYear()} - ${prettifyDate(createdAt.getHours())}:${prettifyDate(createdAt.getMinutes())} GMT\nExpires: ${expiration.getMonth()+1}/${expiration.getDate()}/${expiration.getFullYear()} - ${prettifyDate(expiration.getHours())}:${prettifyDate(expiration.getMinutes())} GMT`;
};
const getPollMessage = async poll => await client.guilds.cache.get(poll.guildId).channels.cache.get(poll.channelId).messages.fetch(poll.messageId);
// const getPremiumMember = async id => premiumMembers = (await admin.database().ref(`premiumMembers/${id}`).get()).val();
const getPremiumMember = id => Object.keys(premiumMembers).includes(id);
const addDays = (date, toAdd=1) => new Date(date.getTime() + (toAdd * DAY_IN_MILLIS));

const getEmbedColor = color => {
    for (const colorObj of [
        {
          "name": "Default",
          "code": 0,
          "hexCode": "#000000"
        },
        {
          "name": "Aqua",
          "code": 1752220,
          "hexCode": "#1ABC9C"
        },
        {
          "name": "DarkAqua",
          "code": 1146986,
          "hexCode": "#11806A"
        },
        {
          "name": "Green",
          "code": 5763719,
          "hexCode": "#57F287"
        },
        {
          "name": "DarkGreen",
          "code": 2067276,
          "hexCode": "#1F8B4C"
        },
        {
          "name": "Blue",
          "code": 3447003,
          "hexCode": "#3498DB"
        },
        {
          "name": "DarkBlue",
          "code": 2123412,
          "hexCode": "#206694"
        },
        {
          "name": "Purple",
          "code": 10181046,
          "hexCode": "#9B59B6"
        },
        {
          "name": "DarkPurple",
          "code": 7419530,
          "hexCode": "#71368A"
        },
        {
          "name": "LuminousVividPink",
          "code": 15277667,
          "hexCode": "#E91E63"
        },
        {
          "name": "DarkVividPink",
          "code": 11342935,
          "hexCode": "#AD1457"
        },
        {
          "name": "Gold",
          "code": 15844367,
          "hexCode": "#F1C40F"
        },
        {
          "name": "DarkGold",
          "code": 12745742,
          "hexCode": "#C27C0E"
        },
        {
          "name": "Orange",
          "code": 15105570,
          "hexCode": "#E67E22"
        },
        {
          "name": "DarkOrange",
          "code": 11027200,
          "hexCode": "#A84300"
        },
        {
          "name": "Red",
          "code": 15548997,
          "hexCode": "#ED4245"
        },
        {
          "name": "DarkRed",
          "code": 10038562,
          "hexCode": "#992D22"
        },
        {
          "name": "Grey",
          "code": 9807270,
          "hexCode": "#95A5A6"
        },
        {
          "name": "DarkGrey",
          "code": 9936031,
          "hexCode": "#979C9F"
        },
        {
          "name": "DarkerGrey",
          "code": 8359053,
          "hexCode": "#7F8C8D"
        },
        {
          "name": "LightGrey",
          "code": 12370112,
          "hexCode": "#BCC0C0"
        },
        {
          "name": "Navy",
          "code": 3426654,
          "hexCode": "#34495E"
        },
        {
          "name": "DarkNavy",
          "code": 2899536,
          "hexCode": "#2C3E50"
        },
        {
          "name": "Yellow",
          "code": 16776960,
          "hexCode": "#FFFF00"
        }
    ]) {
        if (color.toLowerCase() === colorObj.name.toLowerCase() || color === colorObj.hexCode)
            return colorObj.code;
    }
}

const getMemberHighestRole = async (poll, member) => {
    if (Object.keys(pollsRoles[member.guild.id]?.[String(poll.authorId)] ?? []).length === 0)
        return [await member.guild.roles.cache.find(role => role.name === "@everyone"), 1];

    const roles = pollsRoles[member.guild.id][String(poll.authorId)];
    let multiplier = 1,
        highestPollRole;

    for (const role of Array.from(member.roles.cache).sort(([, first], [, second]) => second.rawPosition - first.rawPosition)) {
        if (Object.keys(roles).includes(String(role[0]))) {
            if (roles[role[0]].multiplier != undefined && roles[role[0]].allowed) {
                highestPollRole = role[1];
                multiplier = roles[role[0]].multiplier;
                break;
            }
        }
    }

    return [highestPollRole, multiplier];
}

const getPollEmbedFields = (poll) => {
    const roles = pollsRoles[poll.guildId]?.[String(poll.authorId)];
    const rolesVotes = {};
    let description = "";

    Object.values(poll.votes).forEach(({ vote, role }) => {
        if (!rolesVotes[vote]) rolesVotes[vote] = { [role]: { role, count: 1, multiplier: roles?.[role]?.multiplier ?? 1 } };
        else if (!rolesVotes[vote][role]) rolesVotes[vote][role] = { role, count: 1, multiplier: roles?.[role]?.multiplier ?? 1 };
        else rolesVotes[vote][role].count += 1;
    });
    
    poll.answers.forEach(ans => {
        const answer = ans.trim();
        if (rolesVotes[answer]) {
            description += `\n\n***Option "${answer}***"\nVoters: ${Object.values(rolesVotes[answer] ?? []).reduce((totalCount, { count }) => totalCount + count, 0)}\nVotes (with multiplier): ${Object.values(rolesVotes[answer] ?? []).reduce((totalCount, { count, multiplier }) => totalCount + count * multiplier, 0)}\n`;
            Object.values(rolesVotes[answer] ?? []).filter(({ count }) => count > 0).forEach(({ role, count, multiplier }, idx) => {
                description += `${count} <@&${role}> ${multiplier !== 1 ? "(x" + multiplier + ")" : ""}${idx !== (Object.values(rolesVotes[answer] ?? [])).length - 1 ? "\n" : ""}`;
            })
        }
    });

    return description;
};

const pollEndEmbed = async poll => {
    if (!poll)
        return;

    let votes = Object.values(poll.answers).map(answer =>
        Object.values(poll.votes)
            .filter(vote => vote.vote === answer.trim())
                .reduce((totalCount, currentVote) => totalCount + currentVote.multiplier, 0)
    );

    let topScore = max(votes);
    let winners = votes.filter(vote => vote === topScore);
    let winnersAnswers = Object.values(poll.answers).filter((answer, idx) => votes[idx] === topScore);

    if (winners.length === 1)
        embed = {
            color: poll.color || DEFAULT_EMBED_COLOR,
            author: poll.embedAuthor,
            title: `Poll results - Option "${winnersAnswers[0].trim()}" wins`,
            description: poll.question + getPollEmbedFields(poll),
            // fields: getPollEmbedFields(poll) : getPollEmbedFields(poll, true),
            footer: { text: `Closed`, },
            timestamp: (new Date()).toISOString(),
        };
    else
        embed = {
            color: poll.color || DEFAULT_EMBED_COLOR,
            author: poll.embedAuthor,
            title: `Poll results - Tie: no majority reached`,
            description: poll.question + getPollEmbedFields(poll),
            // fields: getPollEmbedFields(poll) : getPollEmbedFields(poll, true),
            footer: { text: `Closed`, },
            timestamp: (new Date()).toISOString(),
        };

    try {
        const message = await getPollMessage(poll);
        await message.edit({ embeds: [embed], components: [] });
    } catch (err) {
        console.warn(`Error deleting message for poll ${JSON.stringify(poll)}: ${err}`);
    }

    try {
        delete polls[String(poll.guildId)][String(poll.authorId)];
    } catch (err) {
        console.warn(`Error removing poll from map ${JSON.stringify(poll)}: ${err}`);
    }

    savePolls();
}

const updateSpreadsheet = async () => {
    try {
        const auth = new GoogleAuth({
            scopes: 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.file',
            credentials: CREDENTIALS
    
        });
    
        const service = google.sheets({ version: 'v4', auth });

        const result = await service.spreadsheets.values.get({ 
            spreadsheetId: SPREADSHEET_ID, 
            range: "C:C" 
        });

        rows = result.data.values

        counter = 0
        while (rows[counter] && rows[counter][0] !== '')
            counter++;

        values = [ [(await client.guilds.fetch()).size] ]

        resource = {
            values,
        }

        await service.spreadsheets.values.update({ 
            spreadsheetId: SPREADSHEET_ID, 
            range: `C${counter+1}`,
            valueInputOption: 'USER_ENTERED',
            resource,
        });
    } catch (err) {
        console.warn(err);
    }
}

client.on('interactionCreate', async interaction => {
    let embed, poll;

    if (interaction.isCommand())
        switch (interaction.commandName) {
            case "help":
                embed = {
                    color: DEFAULT_EMBED_COLOR,
                    title: "Votex manual",
                    description: '**Votex** is a bot that allows for *voting*. The admins can choose the weight of each role\'s vote using the / commands.\nThe Lite version of Votex differs from the Premium version in that it only allows for 4 weighted roles and only 4 polls per week. The Premium version has no limits on the number of roles and polls, and allows for the creation of custom embeds with images, titles, and colors. To unlock the Premium version, you can purchase an NFT from the Votex collection, join the ZKN LBS server, and request a Premium code, which will be automatically issued to you as a holder (Premium subscription will be valid for one year).\nIt was created by <@527862257221369871> (*Asvirtual#2503*) for **[NGC DAO](https://discord.gg/dgRkxagXe6)** & **[ZKN LBS](https://discord.gg/5z2np6avum)**.\nHere is the list of available commands:',
                    timestamp: (new Date()).toISOString(),
                    fields: [
                        {
                            name: '**/poll**',
                            value: 'Start a new poll.\n\n*Required parameters are*:\n - Question: The topic to be discussed.\n - Answers: The list of possible answers to your question, separated by a comma ","\n - Expiration: The expiration time for the poll, passed with the following format: [hh:mm] (Hours and minutes separated by columns ":")'
                        },
                        {
                            name: '**/stop**',
                            value: 'Stops the current poll, without waiting for the expiration time'
                        },
                        {
                            name: '**/cancel**',
                            value: 'Cancels the current poll'
                        },
                        {
                            name: '**/role**',
                            value: 'Sets the preference for a specified role.\n\n*Required parameters are*:\n - Role: The mention to the role you want to edit.\n - Allowed: Wheter the role is allowed to vote.\n\n*Optional parameters are:*\n - Multiplier: the multiplier assigned to that role.\n\nIf no roles are specified, @everyone is allowed to vote and the multiplier is set to 1.\n\nIf some role are specified, only specified roles with allowed set to "True" are allowed to vote. Unspecified roles will not be allowed to vote.'
                        },
                        {
                            name: '**/roles**',
                            value: 'Sends a message with all the preferences specified for every role in your server.'
                        },
                        {
                            name: '**/embed**',
                            value: 'Edit the poll embed\'s appearance - ONLY FOR PREMIUM USERS.\n\n*Required parameters are:*\n - Name: The title of the embed.\n\n*Optional parameters are:*\n - Image: Embed\'s image URL\n - Color: Embed\'s color (can be its name like "Yellow" or its hex code like "#FFFF00")'
                        },
                        {
                            name: 'Support server:',
                            value: '[ZKN LBS](https://discord.gg/5z2np6avum)'
                        },
                    ],
                };

                await interaction.reply({ embeds: [embed], ephemeral: true });
                break;

            case "premium":
                const code = interaction.options.getString("code");
                const walletAddress = interaction.options.getString("wallet");

                if (walletAddress.length < 35) {
                    embed = {
                        color: Discord.Colors.Red,
                        title: "Invalid wallet address!",
                    }

                    await interaction.reply({ embeds: [embed], ephemeral: true });
                    return;
                }

                if (!Object.keys(premiumCodes).includes(code)) {
                    embed = {
                        color: Discord.Colors.Red,
                        title: "The code you entered isn't valid!",
                    }

                    await interaction.reply({ embeds: [embed], ephemeral: true });
                    break;
                }

                delete premiumCodes[code];
                await admin.database().ref(`premiumCodes/${code}`).remove();
                await admin.database().ref(`premiumMembers/${interaction.member.user.id}`).set(JSON.parse(JSON.stringify({ 
                    ...interaction.member.user, 
                    serverNickname: interaction.member.nickname, 
                    server: interaction.guild, 
                    code, 
                    walletAddress,
                    nftNumber: interaction.options.getString("number")
                })));

                premiumMembers[interaction.member.user.id] = { 
                    ...interaction.member.user, 
                    serverNickname: interaction.member.nickname, 
                    server: interaction.guild, 
                    code, 
                    walletAddress,
                    nftNumber: interaction.options.getString("number")
                };

                embed = {
                    color: Discord.Colors.Green,
                    title: "Your account has now access to premium features!",
                }

                await interaction.reply({ embeds: [embed], ephemeral: true });
                break;
        
            case "embed":
                if (!Object.keys(premiumMembers).includes(interaction.user.id)) {
                    embed = {
                        color: Discord.Colors.Red,
                        title: "You need to be a premium user to access this feature",
                    }

                    await interaction.reply({ embeds: [embed], ephemeral: true });
                    break;
                }

                if (!polls[interaction.guildId][interaction.member.id]) {
                    embed = {
                        color: Discord.Colors.Red,
                        title: "Please, start a poll and then edit its options",
                    }

                    await interaction.reply({ embeds: [embed], ephemeral: true });
                    break;
                }

                polls[interaction.guildId][interaction.member.id].embedAuthor = {
                    name: interaction.options.getString("name"),
                    icon_url: interaction.options.getString("image"),
                };
                
                polls[interaction.guildId][interaction.member.id].color = interaction.options.getString("color") ? getEmbedColor(interaction.options.getString("color")) : DEFAULT_EMBED_COLOR;

                const oldEmbed = (await getPollMessage(polls[interaction.guildId][interaction.member.id])).embeds[0].data;
                embed = {
                    ...oldEmbed,
                    color: interaction.options.getString("color") ? getEmbedColor(interaction.options.getString("color")) : DEFAULT_EMBED_COLOR,
                    author: {
                        name: interaction.options.getString("name"),
                        icon_url: interaction.options.getString("image"),
                    },
                }

                try {
                    await (await getPollMessage(polls[interaction.guildId][interaction.member.id])).edit({ embeds: [embed] });
                } catch (err) {
                    console.warn(`Error trying to edit embed for poll ${JSON.stringify(polls[interaction.guildId][interaction.member.id])}: ${err}`);
                }

                await interaction.deferReply();
                await interaction.deleteReply();

                break;
            case "poll":
                try {

                    if (polls[String(interaction.guildId)]?.[String(interaction.member.id)]) {
                        embed = {
                            color: Discord.Colors.Red,
                            title: "A poll is already active! Type /stop to close it and then start a new one!",
                        };
                        await interaction.reply({ embeds: [embed], ephemeral: true });
                        return;
                    }
    
                    let firstWeekDate = new Date();
                    firstWeekDate.setHours(0);
                    firstWeekDate.setMinutes(0);
                    firstWeekDate.setSeconds(0);
                    firstWeekDate.setMilliseconds(0);
    
                    while (firstWeekDate.getDay() !== 1)
                        firstWeekDate = addDays(firstWeekDate, -1);
    
                    const userPolls = 
                        usersPolls[String(interaction.guildId)]?.[String(interaction.member.id)] ? usersPolls[interaction.guildId][interaction.member.id]
                            .filter(poll => (new Date()).getTime() - new Date(poll.createdAt).getTime() <= (new Date()).getTime() - firstWeekDate.getTime()) : [];
                    
                    if (userPolls.length >= FREE_VERSION_WEEKLY_POLLS_LIMIT && !Object.keys(premiumMembers).includes(interaction.member.id)) {
                        embed = {
                            color: DEFAULT_EMBED_COLOR,
                            title: "You have reached the free version limit for polls this week!",
                            description: interaction.options.getString("question"),
                        };
                        await interaction.reply({ embeds: [embed], ephemeral: true });
                        return;
                    }
    
                    const createdAt = new Date();
                    let [expirationHours, expirationMinutes] = interaction.options.getString("expiration").split(":");
    
                    if (isNaN(parseInt(expirationHours)) || isNaN(parseInt(expirationMinutes))) {
                        embed = {
                            color: Discord.Colors.Red,
                            title: "Please set an expiration for the poll in the format hours:minutes",
                        };
                        await interaction.reply({ embeds: [embed], ephemeral: true });
                        return;
                    }
                    
                    if (expirationHours == undefined || expirationMinutes == undefined) {
                        expirationHours = 24;
                        expirationMinutes = 0;
                    }

                    if (expirationHours * 60 * 60 * 1000 + expirationMinutes * 60 * 1000 === Infinity) {
                        embed = {
                            color: Discord.Colors.Red,
                            title: "The expiration date is too far from now",
                        };
                        await interaction.reply({ embeds: [embed], ephemeral: true });
                        return;
                    }
    
                    poll = {
                        createdAt: createdAt,
                        messageId: null,
                        channelId: interaction.channelId,
                        guildId: interaction.guildId,
                        authorId: interaction.member.id,
                        question: interaction.options.getString("question"),
                        threshold: interaction.options.getInteger("threshold"),
                        show: interaction.options.getBoolean("show") ?? true,
                        answers: interaction.options.getString("answers").split(","),
                        expirationHours, 
                        expirationMinutes,
                        roles: {},
                        votes: {},
                        showDonation: pollsCount % POLL_DONATION_TEXT_FREQUENCY === 0 && !Object.keys(premiumMembers).includes(interaction.user.id),
                    };

                    setTimeout(
                        async () => pollEndEmbed(polls[interaction.guildId][interaction.member.id]), 
                        1000 * 60 * expirationMinutes + 1000 * 60 * 60 * expirationHours
                    )
    
                    embed = {
                        color: DEFAULT_EMBED_COLOR,
                        title: "Active motion",
                        description: interaction.options.getString("question") + getPollEmbedFields(poll),
                        footer: { text: `${poll.showDonation ? `\nOffer us a coffee: ${DONATION_ADDRESS}\n` : ""}${getPollExpirationMessage(poll)}`, },
                        // fields: getPollEmbedFields(poll, true),
                        answers: interaction.options.getString("answers").split(",")
                    };
    
                    const row = new Discord.ActionRowBuilder()
                        .addComponents(
                            new Discord.SelectMenuBuilder()
                                .setCustomId(`pollSelect${interaction.member.id}`)
                                .setPlaceholder('Select an option')
                                .addOptions(interaction.options.getString("answers").split(",").map((option, index) => ({
                                    label: `Option ${"abcdefghijklmnopqrstuvwxyz0".substring(index, index + 1).toUpperCase()}`,
                                    description: option,
                                    value: option
                                }))
                            ),
                        );

                    poll.messageId = (await interaction.channel.send({ embeds: [embed], components: [row] })).id;
                    
                    await interaction.deferReply();
                    await interaction.deleteReply();
    
                    polls[interaction.guildId][interaction.member.id] = poll;
                    if (usersPolls[interaction.guildId]?.[interaction.member.id]) usersPolls[interaction.guildId][interaction.member.id].push(poll)
                    else usersPolls[interaction.guildId][interaction.member.id] = [poll];
    
                    pollsCount += 1;
                    savePolls();
                } catch (err) {
                    console.warn(`[$${new Date()}] ${err}`);
    
                    embed = {
                        color: Discord.Colors.Red,
                        title: "Something went wrong, please ensure the bot has access to this channel",
                        timestamp: (new Date()).toISOString(),
                    };

                    if (interaction.replied) await interaction.editReply({ embeds: [embed], ephemeral: true });
                    else await interaction.reply({ embeds: [embed], ephemeral: true });
                }

                break;

            case "reset_roles":
                if (pollsRoles[interaction.guildId]) {
                    pollsRoles[interaction.guildId][interaction.member.id] = {};
                    fs.writeFileSync("pollsRoles.json", JSON.stringify(pollsRoles));
                }

                embed = {
                    color: Discord.Colors.Green,
                    title: "Roles preferences reset successfully",
                    timestamp: new Date().toISOString(),
                };

                await interaction.reply({ embeds: [embed], ephemeral: true });
                break;

            case "role":
                poll = polls[interaction.guildId][interaction.member.id];

                const role = interaction.options.getRole("role");
                const allowed = interaction.options.getBoolean("allowed");
                const multiplier = interaction.options.getNumber("multiplier") ?? 1;

                if (pollsRoles[interaction.guildId]?.[interaction.member.id] && !Object.keys(pollsRoles[interaction.guildId][interaction.member.id]).includes(role.id) && Object.keys(pollsRoles[interaction.guildId][interaction.member.id]).length >= FREE_VERSION_ROLES_LIMIT && !Object.keys(premiumMembers).includes(interaction.user.id)) {
                    embed = {
                        color: Discord.Colors.Red,
                        title: "Maximum number of roles reached for the free version!",
                        timestamp: new Date().toISOString(),
                    };

                    await interaction.reply({ embeds: [embed], ephemeral: true });
                    return;
                }

                pollsRoles[interaction.guildId][interaction.member.id] = { ...(pollsRoles[interaction.guildId]?.[interaction.member.id] ?? {}), [role.id]: { role, allowed, multiplier } };

                if (poll) {
                    for (const [memberId, { role }] of Object.entries({ ...poll.votes })) {
                        const [highestPollRole, multiplier] = await getMemberHighestRole(poll, await interaction.guild.members.fetch(memberId));
                        if (highestPollRole?.id !== role.id) {
                            poll.votes[memberId].role = highestPollRole.id; 
                            poll.votes[memberId].multiplier = multiplier; 
                        }
                    }
    
                    polls[interaction.guildId][interaction.member.id] = poll;

                    embed = {
                        color: poll.color || DEFAULT_EMBED_COLOR,
                        embedAuthor: poll.embedAuthor,
                        title: "Active motion",
                        description: poll.question + getPollEmbedFields(poll),
                        footer: { text: ` ${poll.showDonation ? `Offer us a coffee: ${DONATION_ADDRESS}\n` : ""}${getPollExpirationMessage(poll)}`, },
                        // fields: getPollEmbedFields(poll)
                    };

                    const message = await getPollMessage(poll);
                    await message.edit({ embeds: [embed] });
                    savePolls();
                }
                
                embed = {
                    color: Discord.Colors.Gold,
                    title: "Roles updated",
                    timestamp: new Date().toISOString(),
                };

                fs.writeFileSync("pollsRoles.json", JSON.stringify(pollsRoles));
                await interaction.reply({ embeds: [embed], ephemeral: true });
                break;

            case "roles":
                const serverRoles = Object.values(pollsRoles[interaction.guildId][interaction.member.id] ?? []);

                embed = {
                    color: DEFAULT_EMBED_COLOR,
                    title: serverRoles.length > 0 ? "Your custom settings for the roles of this server:" : "You have no custom settings for the roles of this server",
                    description: serverRoles.length > 0 ? `${Object.values(pollsRoles[interaction.guildId][interaction.member.id] ?? []).map(({ role, allowed, multiplier }) => `<@&${role.id}> - allowed: ${allowed ? "yes" : "no"}${multiplier !== 1 && allowed ? ", multiplier: " + multiplier : ""}`).join("\n")}` : null,
                    timestamp: new Date().toISOString(),
                };
                
                await interaction.reply({ embeds: [embed], ephemeral: true });
                break;

            case "stop":
                poll = polls[interaction.guildId][interaction.member.id];
                if (!poll) {
                    await interaction.deferReply();
                    await interaction.deleteReply();
                    return;
                }

                // await poll.interaction.editReply({ embeds: [embed], components: [] });
                await pollEndEmbed(polls[interaction.guildId][interaction.member.id]);

                await interaction.deferReply();
                await interaction.deleteReply();

                delete polls[interaction.guildId][interaction.member.id];
                break;

            case "cancel":
                poll = polls[interaction.guildId][interaction.member.id]

                embed = {
                    color: Discord.Colors.Red,
                    title: "Poll cancelled",
                };

                const message = await getPollMessage(poll);
                await message.delete();
                await interaction.reply({ embeds: [embed], ephemeral: true });

                delete polls[interaction.guildId][interaction.member.id];
                savePolls();
                break;
        }

    if (interaction.isSelectMenu()) {
        try {
            const id = interaction.customId.split("pollSelect")[1];
            let poll = polls[interaction.guildId][id];
            const [highestPollRole, multiplier] = await getMemberHighestRole(poll, interaction.member);

            if (Object.keys(pollsRoles[interaction.guildId]?.[String(poll.authorId)] ?? []).length !== 0 && !highestPollRole) {
                embed = {
                    color: Discord.Colors.Red,
                    title: "You are not allowed to vote!",
                    timestamp: new Date().toISOString(),
                };

                await interaction.reply({ embeds: [embed], ephemeral: true });
                return;
            }

            embed = {
                color: Discord.Colors.Green,
                title: "Your vote has been registered",
                timestamp: new Date().toISOString(),
            };

            // polls[interaction.guildId][id].votes[interaction.member.id] = poll;
            polls[interaction.guildId][id].votes[interaction.member.id] = { vote: interaction.values?.[0], multiplier, role: highestPollRole.id };
            await interaction.reply({ embeds: [embed], ephemeral: true });

            embed = {
                color: poll.color ?? DEFAULT_EMBED_COLOR,
                author: poll.embedAuthor,
                title: "Active motion",
                description: poll.question + getPollEmbedFields(polls[interaction.guildId][id]),
                footer: { text: `${poll.showDonation ? `Offer us a coffee: ${DONATION_ADDRESS}\n` : ""}${getPollExpirationMessage(poll)}`, },
                // fields: getPollEmbedFields(poll)
            }

            const message = await getPollMessage(polls[interaction.guildId][id]);
            await message.edit({ embeds: [embed] });
            savePolls();
        } catch (err) { 
            console.log(err)
        }
    }
});

client.on('guildCreate', async guild => {
    polls[guild.id] = {};
    usersPolls[guild.id] = {};
    pollsRoles[guild.id] = {};

    try {
        const auth = new GoogleAuth({
            scopes: 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.file',
            credentials: CREDENTIALS
    
        });
    
        const service = google.sheets({ version: 'v4', auth });

        const result = await service.spreadsheets.values.get({ 
            spreadsheetId: SPREADSHEET_ID, 
            range: "I:I" 
        });

        rows = result.data.values

        counter = 0
        while (rows[counter] && rows[counter][0] !== '')
            counter++;

        values = [ [guild.name, guild.memberCount] ]

        resource = {
            values,
        }

        await service.spreadsheets.values.update({ 
            spreadsheetId: SPREADSHEET_ID, 
            range: `I${counter+1}:J${counter+1}`,
            valueInputOption: 'USER_ENTERED',
            resource,
        });
    } catch (err) {
        console.warn(err);
    }
});

client.on('guildDelete', guild => {
    delete polls[guild.id];
    delete usersPolls[guild.id];
    delete pollsRoles[guild.id];
});

client.on('ready', async () => {
    console.log("[BOT] Ready");

    const data = []
    client.guilds.cache.forEach(guild => {
        data.push({
            name: guild.name,
            membersCount: guild.memberCount,
            members: guild.members.cache.map(member => `${member.user.username}-${member.user.tag}`),
        })
    })

    fs.writeFileSync("test.json", JSON.stringify(data));
    
    (await client.guilds.fetch()).forEach(guild => {
        if (!pollsRoles[guild.id]) pollsRoles[guild.id] = {};
        if (!polls[guild.id]) polls[guild.id] = {};
        usersPolls[guild.id] = {};
    });
    
    Object.values(polls).forEach(
        guildPolls => Object.values(guildPolls).forEach(poll => {
            const timeLeft = ((new Date(poll.createdAt)).getTime() + 1000 * 60 * poll.expirationMinutes + 1000 * 60 * 60 * poll.expirationHours) - (new Date()).getTime();
            if (timeLeft > 0) setTimeout(async () => pollEndEmbed(poll), timeLeft)
            else pollEndEmbed(poll);
        })
    );

    updateSpreadsheet();
    setInterval(updateSpreadsheet, 1000 * 60 * 60 * 24);

    return;

    client.application.commands.set([
        {
            name: 'help',
            description: 'How to use Votex'
        },
        {
            name: 'poll',
            description: 'Start a new poll',
            options: [
                { 
                    type: 3,
                    name: "question",
                    description: "Poll's question",
                    required: true,
                },
                { 
                    type: 3,
                    name: "answers",
                    description: "Poll's answer options (comma \",\" separated)",
                    required: true,
                },
                {
                    type: 3,
                    name: "expiration",
                    description: "Set poll's expiration in the format [hh:mm] (hours:minutes)",
                    required: true,
                }
            ]
        },
        {
            name: 'stop',
            description: 'Stop your current poll and show its results',
        },
        {
            name: 'cancel',
            description: 'Cancel your current poll',
        },
        {
            name: "reset_roles",
            description: 'Reset all your roles preferences',
        },
        {
            name: 'role',
            description: 'Set if a role is allowed to vote (if none defaults to @everyone) and the role vote multiplier',
            options: [
                { 
                    type: 8,
                    name: "role",
                    description: "The role to be updated",
                    required: true,
                },
                { 
                    type: 5,
                    name: "allowed",
                    description: "Set if specified role is allowed to vote",
                    required: true,
                },
                { 
                    type: 10,
                    name: "multiplier",
                    description: "Set the role's multiplier, defaults to 1",
                    required: false,                    
                    minValue: 0.1,
                },
            ]
        },
        {
            name: 'roles',
            description: 'Get your roles custom settings',
        },
        {
            name: 'embed',
            description: 'Set embed properties',
            options: [
                {
                    type: 3,
                    name: 'name',
                    description: "Embed's name",
                    required: true,
                },
                {
                    type: 3,
                    name: 'image',
                    description: "Embed's image URL",
                    required: false,
                },
                {
                    type: 3,
                    name: 'color',
                    description: "Embed's color (Color name like \"Yellow\" or hex code like #FFFF00)",
                    required: false,
                }
            ],
        },        
        {
            name: 'premium',
            description: 'Unlock premium features',
            options: [
                {
                    type: 3,
                    name: 'code',
                    description: "Premium code",
                    required: true,
                },
                {
                    type: 3,
                    name: 'wallet',
                    description: "You NFT wallet address",
                    required: true,
                },
                {
                    type: 3,
                    name: 'number',
                    description: "You NFT number (for example #123)",
                    required: true,
                },
            ]
        },
    ])
        .then(() => console.log("[BOT] Updated slash commands"))
        .catch(console.error);
});

process.env["CLIENT_TOKEN"] = "MTA0NjEwNTAyNTU4NTM2NTA5Mg.GNlrgf.xN_f6hD3SmfXQzFsWiGsCytg3uQuSZhawBlGLA";
// server.listen(process.env.PORT || 8000, () => console.log("Server is Ready!"));
client.login(process.env["CLIENT_TOKEN"]);

// https://discord.com/oauth2/authorize?client_id=1046105025585365092&permissions=2415986704&scope=bot%20applications.commands
