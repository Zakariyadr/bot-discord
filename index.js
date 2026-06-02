const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { joinVoiceChannel, VoiceConnectionStatus } = require('@discordjs/voice');

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates 
    ] 
});

// IDs dyal l-VC o Server
const GUILD_ID = '1469820300823760932';
const CHANNEL_ID = '1469823070205120554';

function toScriptStyle(text) {
    const scriptChars = {
        'A': '𝓐', 'B': '𝓑', 'C': '𝓒', 'D': '𝓓', 'E': '𝓔', 'F': '𝓕', 'G': '𝓖', 'H': '𝓗', 'I': '𝓘',
        'J': '𝓙', 'K': '𝓚', 'L': '𝓛', 'M': '𝓜', 'N': '𝓝', 'O': '𝓞', 'P': '𝓟', 'Q': '𝓠', 'R': '𝓡',
        'S': '𝓢', 'T': '𝓣', 'U': '𝓤', 'V': '𝓥', 'W': '𝓦', 'X': '𝓧', 'Y': '驰', 'Z': '𝓩',
        'a': '𝓪', 'b': '𝓫', 'c': '𝓬', 'd': '𝓭', 'e': '𝓮', 'f': '𝓯', 'g': '𝓰', 'h': '𝓱', 'i': '𝓲',
        'j': '𝓳', 'k': '𝓴', 'l': '𝓵', 'm': '𝓶', 'n': '𝓷', 'o': '𝓸', 'p': '𝓹', 'q': '𝓺', 'r': '𝓻',
        's': '𝓼', 't': '𝓽', 'u': '𝓾', 'v': '𝓿', 'w': '𝔀', 'x': '𝔁', 'y': '𝔂', 'z': '𝔃'
    };
    return text.split('').map(char => scriptChars[char] || char).join('');
}

const commandsPerPage = 5;
const separator = "___________________________\n";
const leftArrow = '<a:White_Arrow_Left:1499185614996766773>'; 
const rightArrow = '<a:White_Arrow_Right:1499185543328829530>';

const commandsMngt = [
    "`$addrole`\n└ Add a role to a user", "`$removerole`\n└ Remove a role from a user",
    "`$oldrole`\n└ Re-assign the old role to a user", "`$addemoji`<:Nlight_Diamond:1498877768467877968>\n└ Add an emoji to the server",
    "`$addreact`\n└ Add a reaction to a message", "`$removereact`\n└ Remove a reaction from a message",
    "`$crole`\n└ Create a new role", "`$embed`\n└ Send a custom embed message",
    "`$emoji-info`\n└ Show info about an emoji", "`$firstmessage`\n└ Jump to the first message in a channel",
    "`$hide`\n└ Hide a channel from members", "`$unhide`\n└ Unhide a channel",
    "`$lock`\n└ Lock a channel", "`$unlock`\n└ Unlock a channel",
    "`$inrole`\n└ List all users with a specific role", "`$restore`\n└ Restore a previously removed role",
    "`$send`\n└ Send a DM to a user", "`$sendrole`<:Nlight_Diamond:1498877768467877968>\n└ Send a DM to all users with a role",
    "`$tax`\n└ Calculate the Discord role tax", "`$temprole`\n└ Temporarily assign a role to a user",
    "`$boosters`\n└ Show all server boosters", "`$voicecount`\n└ Display live voice channel stats",
    "`$devsay`<:Nlight_Diamond:1498877768467877968>\n└ Send an announcement as the bot"
];

const commandsMod = [
    "`$ban`\n└ Ban a member", "`$kick`\n└ Kick a member", "`$mute`\n└ Mute a member",
    "`$warn`\n└ Warn a member", "`$unmute`\n└ Unmute a member", "`$clear`\n└ Delete messages"
];

const commandsDonate = [
    "`$premium` <:Nlight_Diamond:1498877768467877968>\n└ View premium perks", "`$redeem`\n└ Use a gift code", "`$status`\n└ Check subscription"
];

let currentPages = { mngt: 0, mod: 0, donate: 0 };

const mainDescription = () => {
    return `I'm here to add a spark of joy and a touch of magic to your server! Whether it's fun games, smart tools, or just keeping the vibe alive, I've got you covered.\n\n` +
           `> For *check commands*, use \`$checkhelp\` to view all check commands\n` +
           `> To *set up logging*, use \`$setup-logs\` for all server activity\n\n` +
           `**Select a category below to view commands <:7_:1499088348739010690>**`;
};

// Fonction bach i-welli i-dkhol l-VC
function connectToVC() {
    const guild = client.guilds.cache.get(GUILD_ID);
    const channel = client.channels.cache.get(CHANNEL_ID);

    if (guild && channel) {
        joinVoiceChannel({
            channelId: channel.id,
            guildId: guild.id,
            adapterCreator: guild.voiceAdapterCreator,
            selfDeaf: true,
            selfMute: false,
            group: client.user.id
        });
    }
}

client.on('ready', () => {
    console.log(`✅ Nady! Online smito: ${client.user.tag}`);
    connectToVC();
});

// Bach may-khrejch ila t-t9at3at l-connection walla chi 7ed kharjou
client.on('voiceStateUpdate', (oldState, newState) => {
    if (oldState.member.id === client.user.id && !newState.channelId) {
        console.log("⚠️ 7awelt n-khrej? Ghadi n-rje3 l-VC!");
        setTimeout(() => connectToVC(), 3000); 
    }
});

client.on('messageCreate', async message => {
    if (message.author.bot || !message.content.startsWith('$')) return;

    const args = message.content.slice(1).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'help') {
        const helpEmbed = new EmbedBuilder()
          .setAuthor({ name: 'Olivya Help', iconURL: 'https://cdn.discordapp.com/emojis/1498875964015513680.webp?size=40&animated=true'})
            .setTitle('Hi there! Im Olivya ♡')
            .setDescription(mainDescription())
            .setImage('https://i.pinimg.com/originals/3a/9f/d9/3a9fd91902765c1f2b58339cbcac5734.gif')
            .setColor('#2b2d31')
            .setFooter({ text: 'gg/trpl', iconURL: client.user.displayAvatarURL() });

        const menuRow = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('select_category')
                .setPlaceholder('Management')
                .addOptions([
                    { label: 'Management', value: 'mngt', emoji: '⚙️' },
                    { label: 'Moderation', value: 'mod', emoji: '🛡️' },
                    { label: 'Donating', value: 'donate', emoji: '💎' }
                ])
        );

        const buttonRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setLabel('Get Premium').setEmoji('<:1485747551784144896:1499040835050672260>').setStyle(ButtonStyle.Secondary).setCustomId('premium'),
            new ButtonBuilder().setLabel('Support').setEmoji('<:1485750743549083698:1499040862330556587>').setStyle(ButtonStyle.Secondary).setCustomId('support')
        );

        await message.reply({ embeds: [helpEmbed], components: [menuRow, buttonRow] });
    }
    // ... commands okhrin (addrole, ban, etc.)
});

client.on('interactionCreate', async interaction => {
    const dataMap = { mngt: commandsMngt, mod: commandsMod, donate: commandsDonate };
    const titles = { mngt: "Management", mod: "Moderation", donate: "Donating" };

    if (interaction.isStringSelectMenu() && interaction.customId === 'select_category') {
        await interaction.deferUpdate();
        const category = interaction.values[0];
        currentPages[category] = 0;
        const totalPages = Math.ceil(dataMap[category].length / commandsPerPage);
        const currentCommands = dataMap[category].slice(0, commandsPerPage).join('\n\n');
        
        const catText = `**${toScriptStyle(titles[category] + " Commands")}**\n${separator}${currentCommands}\n${separator}`;
        const updateEmbed = EmbedBuilder.from(interaction.message.embeds[0]).setDescription(catText);

        const paginationRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId(`${category}_prev`).setEmoji(leftArrow).setStyle(ButtonStyle.Secondary).setDisabled(true),
            new ButtonBuilder().setCustomId(`${category}_page`).setLabel(`1/${totalPages}`).setStyle(ButtonStyle.Secondary).setDisabled(true),
            new ButtonBuilder().setCustomId(`${category}_next`).setEmoji(rightArrow).setStyle(ButtonStyle.Secondary).setDisabled(totalPages <= 1)
        );

        await interaction.editReply({ embeds: [updateEmbed], components: [interaction.message.components[0], paginationRow, interaction.message.components[1]] });
    }

    if (interaction.isButton()) {
        if (interaction.customId.includes('_next') || interaction.customId.includes('_prev')) {
            await interaction.deferUpdate();
            const [category, action] = interaction.customId.split('_');
            const totalPages = Math.ceil(dataMap[category].length / commandsPerPage);

            if (action === 'next' && currentPages[category] < totalPages - 1) currentPages[category]++;
            if (action === 'prev' && currentPages[category] > 0) currentPages[category]--;

            const currentCommands = dataMap[category].slice(currentPages[category] * commandsPerPage, (currentPages[category] + 1) * commandsPerPage).join('\n\n');
            const catText = `**${toScriptStyle(titles[category] + " Commands")}**\n${separator}${currentCommands}\n${separator}`;
            const updateEmbed = EmbedBuilder.from(interaction.message.embeds[0]).setDescription(catText);

            const paginationRow = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId(`${category}_prev`).setEmoji(leftArrow).setStyle(ButtonStyle.Secondary).setDisabled(currentPages[category] === 0),
                new ButtonBuilder().setCustomId(`${category}_page`).setLabel(`${currentPages[category] + 1}/${totalPages}`).setStyle(ButtonStyle.Secondary).setDisabled(true),
                new ButtonBuilder().setCustomId(`${category}_next`).setEmoji(rightArrow).setStyle(ButtonStyle.Secondary).setDisabled(currentPages[category] === totalPages - 1)
            );

            await interaction.editReply({ embeds: [updateEmbed], components: [interaction.message.components[0], paginationRow, interaction.message.components[2]] });
        }
    }
});

client.login('token');
