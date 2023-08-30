const { Client, Interaction, EmbedBuilder } = require("discord.js");
const Playlist = require("../../models/Playlist");
require("dotenv").config();

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    const playlist = await Playlist.find({
      guildId: process.env.GUILD_ID,
    });
    const embed = new EmbedBuilder();
    try {
      await interaction.deferReply();
      embed.setColor("Green").setDescription(`List of playlist`);
      for (let list in playlist) {
        embed.addFields({
          name: `${playlist[list].playlistName}`,
          value: `${playlist[list].songs.join(',').replace(',',`\n`)}`
        });
      }
      return interaction.editReply({ embeds: [embed], ephemeral: true });
    } catch (error) {
      console.log(error);
    }
  },
  name: "show-playlist",
  description: "Shows the list of playlist in the server",
};
