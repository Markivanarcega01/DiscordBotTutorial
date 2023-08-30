const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
  EmbedBuilder,
  PermissionFlagsBits,
  VoiceChannel,
  GuildEmoji,
} = require("discord.js");
const client_import = require("../../index"); // distube object from index
const Playlist = require("../../models/Playlist");
module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    let song = interaction.options.get("song-title").value; // add a feature where it checks the value if it is present in the database
    const checkInputIfInPlaylist = await Playlist.findOne({
      playlistName: song,
    });
    let songs;
    if (checkInputIfInPlaylist) {
      songs = checkInputIfInPlaylist.songs;
    } else {
      songs = song.split(",").map((song) => {
        return song.trim();
      });
    }
    const voiceChannel = interaction.member.voice.channel;
    const queue = await client_import.distube.getQueue(interaction);
    const embed = new EmbedBuilder();
    let arrayofsearchresult = [];
    if (!voiceChannel) {
      embed
        .setColor("Red")
        .setDescription(
          "You must be in a voice channel to execute the music commands"
        );
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
    for (let i = 0; i < songs.length; i++) {
      let search = await client_import.distube.search(songs[i]); // array of results upon searching
      arrayofsearchresult.push(search[0]); //push the first result into the array
    }
    const playlist = await client_import.distube.createCustomPlaylist(
      arrayofsearchresult
    ); // add each song to the playlist
    try {
      await interaction.deferReply();
      await client_import.distube.play(voiceChannel, playlist, {
        textChannel: interaction.channel,
        member: interaction.member,
      });
      if (queue) {
        embed
          .setColor("Green")
          .setDescription(
            `:musical_note: ${[...songs]} :musical_note: added to the queue`
          );
        interaction.editReply({ embeds: [embed], ephemeral: true });
      } else if (songs.length !== 1) {
        embed
          .setColor("Green")
          .setDescription(
            `Playlist enqueued :musical_note: ${[...songs]} :musical_note:`
          );
        interaction.editReply({ embeds: [embed], ephemeral: true });
      }else{
        interaction.editReply(`Requested by: ${interaction.user.tag}`)
      }
    } catch (error) {
      embed
        .setColor("Red")
        .setDescription(`Something wen't wrong please try again`);
      interaction.editReply({ embeds: [embed], ephemeral: true });
    }
  },
  name: "play",
  description: "Plays a song in the server",
  options: [
    {
      name: "song-title",
      description: "Song/List of songs(,)/playlist name",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
};
