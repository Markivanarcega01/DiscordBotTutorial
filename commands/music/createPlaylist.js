const Playlist = require("../../models/Playlist");
const {
  ApplicationCommandOptionType,
  Client,
  Interaction,
  EmbedBuilder,
} = require("discord.js");
require("dotenv").config();


module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    const playlistName = interaction.options.get("playlist-name").value;
    const inputSongs = interaction.options.get("song-list").value;
    const songs = inputSongs.split(",").map((song) => {
      return song.trim();
    });
    const embed = new EmbedBuilder();
    try {
      await interaction.deferReply();
      const playlistNameChecker = await Playlist.findOne({playlistName:playlistName})
      if(playlistNameChecker){
        embed
        .setColor("Red")
        .setDescription(
          "Playlist name already exist"
        );
      return interaction.editReply({ embeds: [embed], ephemeral: true });
      }
      const playlist = await Playlist.create({
        guildId: process.env.GUILD_ID,
        playlistName: playlistName,
        songs: songs,
      });
      if (playlist) {
        embed
        .setColor("Green")
        .setDescription(
          "Playlist created"
        );
      return interaction.editReply({ embeds: [embed], ephemeral: true });
      }
    } catch (error) {
            embed
            .setColor("Red")
            .setDescription(
              "Error in creating the playlist"
            );
            return interaction.editReply({ embeds: [embed], ephemeral: true });
    }
  },
  name: "create-playlist",
  description: "Create your own playlist",
  options: [
    {
      name: "playlist-name",
      description: "Name of the playlist",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "song-list",
      description: "List of the songs(Separated by comma(,))",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
};
