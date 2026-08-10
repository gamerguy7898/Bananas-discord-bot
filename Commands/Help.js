const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'help',
  description: '📜 View all Banana Pillow commands',

  async execute(interaction, h) {
    const helpEmbed = new EmbedBuilder()
      .setColor('#FFE135')
      .setTitle('🍌 Banana Pillow — Command Center')
      .setDescription('**Your all-in-one Discord bot** • Below is every command available')
      .addFields(
        {
          name: '🛡️ 𝗠𝗢𝗗𝗘𝗥𝗔𝗧𝗜𝗢𝗡',
          value: '`/warn` `/mute` `/unmute` `/kick` `/ban` `/unban` `/purge` `/slowmode` `/lock` `/unlock` `/automod` `/modlogs`',
          inline: false
        },
        {
          name: '🎮 𝗚𝗔𝗠𝗜𝗡𝗚 & 𝗟𝗙𝗚',
          value: '`/lfg` `/queue` `/leavequeue` `/roll` `/stats` `/leaderboard` `/availability` `/game add/list`',
          inline: false
        },
        {
          name: '🎉 𝗙𝗨𝗡 & 𝗠𝗜𝗡𝗜-𝗚𝗔𝗠𝗘𝗦',
          value: '`/coinflip` `/8ball` `/choose` `/rps` `/trivia` `/hangman` `/daily` `/joke` `/fact`',
          inline: false
        },
        {
          name: '🍌 𝗕𝗔𝗡𝗔𝗡𝗔 𝗣𝗜𝗟𝗟𝗢𝗪',
          value: '`/banana` `/pillow` `/rank` `/level` `/shop` `/buy` `/balance` `/bananamood`',
          inline: false
        },
        {
          name: '🔧 𝗢𝗪𝗡𝗘𝗥 𝗢𝗡𝗟𝗬',
          value: '`/restart` `/shutdown` `/eval` `/setxp` `/resetuser`',
          inline: false
        }
      )
      .setFooter({
        text: '🍌 Banana Pillow • Type / before every command',
        iconURL: interaction.client.user.displayAvatarURL()
      })
      .setTimestamp();

    await interaction.reply({ embeds: [helpEmbed] });
  }
};
