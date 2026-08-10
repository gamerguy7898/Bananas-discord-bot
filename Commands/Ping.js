const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'ping',
  description: '🏓 Check bot latency & connection status',

  async execute(interaction, h) {
    const latency = Date.now() - interaction.createdTimestamp;
    const apiLatency = Math.round(interaction.client.ws.ping);

    // Status colors based on latency
    let statusColor, statusText;
    if (apiLatency < 100) { statusColor = '#2ECC71'; statusText = '🟢 Excellent'; }
    else if (apiLatency < 250) { statusColor = '#F1C40F'; statusText = '🟡 Good'; }
    else if (apiLatency < 500) { statusColor = '#E67E22'; statusText = '🟠 Fair'; }
    else { statusColor = '#E74C3C'; statusText = '🔴 High'; }

    const pingEmbed = new EmbedBuilder()
      .setColor(statusColor)
      .setTitle('🏓 Pong!')
      .setDescription('**Banana Pillow Bot — Connection Status**')
      .addFields(
        { name: '⏱️ Latency', value: `**${latency}ms**`, inline: true },
        { name: '🔌 API Ping', value: `**${apiLatency}ms**`, inline: true },
        { name: '📊 Status', value: statusText, inline: true }
      )
      .setFooter({ text: '🍌 Banana Pillow • Always Fresh', iconURL: interaction.client.user.displayAvatarURL() })
      .setTimestamp();

    await interaction.reply({ embeds: [pingEmbed] });
  }
};
