const { Client, Interaction, EmbedBuilder } = require("discord.js");
const client_import = require("../../index"); // distube object from index
require("dotenv").config();
module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    const voiceChannel = interaction.member.voice.channel;
    const botGuild = client.guilds.cache.get(process.env.GUILD_ID);
    const botMember = botGuild.members.cache.get(process.env.CLIENT_ID);
    const embed = new EmbedBuilder();
    await interaction.deferReply();
    if (!voiceChannel) {
      embed
        .setColor("Red")
        .setDescription(
          "You must be in a voice channel to execute the music commands"
        );
      return interaction.editReply({ embeds: [embed], ephemeral: true });
    }
    if (!botMember.voice.channel) {
      embed
        .setColor("Red")
        .setDescription(`${client.user.tag} is not in a voice channel`);
      return interaction.editReply({ embeds: [embed], ephemeral: true });
    }
    try {
      await client_import.distube.skip(interaction);
      embed.setColor("Green").setDescription("Skipped");
      return interaction.editReply({ embeds: [embed], ephemeral: true });
    } catch (error) {
      embed.setColor("Red").setDescription("There is no up next song");
      return interaction.editReply({ embeds: [embed], ephemeral: true });
    }
  },
  name: "skip",
  description: "skip the song or playlist in queue",
};
