const {
  Client,
  Interaction,
  EmbedBuilder,
} = require("discord.js");
const client_import = require("../../index");
require('dotenv').config()

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    const voiceChannel = interaction.member.voice.channel;
    const botGuild = client.guilds.cache.get(process.env.GUILD_ID)
    const botMember = botGuild.members.cache.get(process.env.CLIENT_ID)
    const embed = new EmbedBuilder();
    await interaction.deferReply();
    //console.log(voiceChannel.members)
    if (!voiceChannel) {
      embed
        .setColor("Red")
        .setDescription(
          "You must be in a voice channel to execute the music commands"
        );
      return interaction.editReply({ embeds: [embed], ephemeral: true });
    }
    if(!botMember.voice.channel){
        embed
        .setColor("Red")
        .setDescription(
          `${client.user.tag} is not in a voice channel`
        );
      return interaction.editReply({ embeds: [embed], ephemeral: true });  
    }
    try {
      await client_import.distube.stop(interaction);
      embed
        .setColor("Green")
        .setDescription(
          "Music stopped"
        );
      return interaction.editReply({ embeds: [embed], ephemeral: true });
    } catch (error) {
        embed
        .setColor("Red")
        .setDescription(
          "Something went wrong"
        );
      return interaction.editReply({ embeds: [embed], ephemeral: true });
    }
  },
  name: "stop",
  description: "Stop music bot from playing a song",
};
