const { Client, GatewayIntentBits, PermissionsBitField, EmbedBuilder, ActivityType, Collection, REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

// =============== EDIT THESE 4 VALUES ===============
const TOKEN = process.env.BANANA_TOKEN || 'PUT_YOUR_BOT_TOKEN_HERE';
const CLIENT_ID = '1536478839839133726';
const GUILD_ID = '1536478839839133726';
const OWNER_IDS = ['1536478839839133726'];
// =====================================================

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildModeration,
  ],
  presence: {
    status: 'online',
    activities: [{ name: '🍌 Banana Pillow | /help', type: ActivityType.Playing }]
  }
});

// === DATA STORAGE (auto-saves) ===
const DATA_PATH = path.join(__dirname, 'banana_data.json');
let data = {
  users: {},
  queues: {},
  automod: { enabled: false, antiSpam: true, antiLinks: true, antiInvites: true },
  games: ['Roblox', 'GTA', 'Minecraft', 'Valorant'],
  shop: {
    'vip': { name: '🍌 VIP Role', cost: 500, desc: 'Special VIP role' },
    'xpboost': { name: '✨ XP Boost', cost: 200, desc: '2x XP for 24h' },
    'color': { name: '🎨 Custom Color', cost: 100, desc: 'Custom role color' }
  },
  availability: {}
};

function loadData() {
  if (fs.existsSync(DATA_PATH)) data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
  else saveData();
}
function saveData() {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}
loadData();

// === SHARED TOOLS — ALL YOUR COMMAND FILES USE THESE ===
global.h = {
  isAdmin: member => member.permissions.has(PermissionsBitField.Flags.Administrator),
  isOwner: userId => OWNER_IDS.includes(userId),
  ensureUser: id => {
    if (!data.users[id]) data.users[id] = { xp: 0, level: 1, coins: 0, warns: [], daily: 0 };
  },
  getLevelXP: level => Math.floor(50 * Math.pow(1.5, level - 1)),
  addXP: (id, amount) => {
    h.ensureUser(id);
    data.users[id].xp += amount;
    while (data.users[id].xp >= h.getLevelXP(data.users[id].level)) {
      data.users[id].xp -= h.getLevelXP(data.users[id].level);
      data.users[id].level++;
    }
    saveData();
  },
  parseDuration: str => {
    const match = str.match(/^(\d+)([smhd])$/);
    if (!match) return null;
    const num = parseInt(match[1]), unit = match[2];
    if (unit === 's') return num * 1000;
    if (unit === 'm') return num * 60 * 1000;
    if (unit === 'h') return num * 60 * 60 * 1000;
    if (unit === 'd') return num * 24 * 60 * 60 * 1000;
    return null;
  },
  data,
  saveData,
  EmbedBuilder
};

// === LOAD ALL COMMAND FILES FROM /commands FOLDER ===
client.commands = new Collection();
const commandsFolder = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsFolder).filter(file => file.endsWith('.js'));
const allCommands = [];

for (const file of commandFiles) {
  const command = require(path.join(commandsFolder, file));
  client.commands.set(command.name, command);
  allCommands.push(command);
}

// === REGISTER SLASH COMMANDS TO DISCORD ===
async function registerCommands() {
  const rest = new REST({ version: '10' }).setToken(TOKEN);
  try {
    console.log('🔄 Registering slash commands...');
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: allCommands });
    console.log('✅ All commands registered successfully!');
  } catch (error) {
    console.error('❌ Error registering commands:', error);
  }
}

// === BOT READY ===
client.on('ready', async () => {
  console.log(`🍌 Banana Pillow logged in as ${client.user.tag}`);
  await registerCommands();
});

// === RUN COMMANDS WHEN TYPED ===
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;
  try {
    await command.execute(interaction, h);
  } catch (error) {
    console.error(`❌ Error running /${interaction.commandName}:`, error);
    interaction.reply?.({ content: '❌ Error running this command!', ephemeral: true });
  }
});

// === LOGIN ===
client.login(TOKEN);
