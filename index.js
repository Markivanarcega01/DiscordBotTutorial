const {
  Client,
  IntentsBitField,
  Embed,
  EmbedBuilder,
  ActivityType,
} = require("discord.js");
const eventHandler = require("./handlers/eventHandler");
const mongoose = require("mongoose");
require("dotenv").config();
const { DisTube } = require("distube");
const { SpotifyPlugin } = require("@distube/spotify");

const embed = new EmbedBuilder();

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildPresences,
    IntentsBitField.Flags.GuildVoiceStates,
  ],
});

client.distube = new DisTube(client, {
  emitNewSongOnly: true,
  leaveOnFinish: true,
  emitAddSongWhenCreatingQueue: false,
  plugins: [new SpotifyPlugin()],
});

module.exports = client;

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("connected to db");
    eventHandler(client);
    client.distube.on("playSong", (queue, song) => {
      embed
        .setColor("Green")
        .setDescription(`Now playing :musical_note: ${song.name} :musical_note:`);
      queue.textChannel.send({ embeds: [embed], ephemeral: true });
    });
    client.login(process.env.TOKEN);
  } catch (error) {
    console.log(error);
  }
})();

// client.on("messageCreate", (message) => {
//   if (message.author.bot) {
//     return;
//   }
//   if (message.content === "Hello") {
//     return message.reply("Hi");
//   }
// });

// client.on("interactionCreate", (interaction) => {
//   if (!interaction.isChatInputCommand()) return;

//   if (interaction.commandName === "add") {
//     const num1 = interaction.options.get("first-number")?.value;
//     const num2 = interaction.options.get("second-number")?.value;
//     // yung ? optional chaining ang tawag, para incase na mali yung ireturn nung variable is hindi mag crash yung app

//     interaction.reply(`Sum is: ${num1 + num2}`);
//   }
//   if (interaction.commandName === "ping") {
//     interaction.reply("pong!");
//   }

//   if (interaction.commandName === "embed") {
//     const embed = new EmbedBuilder()
//       .setTitle("Embed Title")
//       .setDescription("Sample embed")
//       .setColor("Random")
//       .addFields(
//         { name: "Field title", value: "Sample value", inline: true },
//         { name: "2Field title", value: "2Sample value", inline: true }
//       );

//     interaction.reply({ embeds: [embed] });
//   }
// });

// client.on('messageCreate',(message)=>{
//     if(message.content === 'embed'){
//         const embed = new EmbedBuilder()
//       .setTitle("Embed Title")
//       .setDescription("Sample embed")
//       .setColor("Random")
//       .addFields(
//         { name: "Field title", value: "Sample value", inline: true },
//         { name: "2Field title", value: "2Sample value", inline: true }
//       );

//     message.channel.send({ embeds: [embed] });
//     }
// })

// let status = [
//   {
//     name:'Title1',
//     type:ActivityType.Streaming,
//     url:`https://www.youtube.com/watch?v=OqxHy8sCtvA&list=PLpmb-7WxPhe0ZVpH9pxT5MtC4heqej8Es&index=6`
//   },
//   {
//     name:'Title2',
//     type:ActivityType.Listening,
//     url:`https://www.youtube.com/watch?v=OqxHy8sCtvA&list=PLpmb-7WxPhe0ZVpH9pxT5MtC4heqej8Es&index=6`
//   },
//   {
//     name:'Title3',
//     type:ActivityType.Playing,
//     url:`https://www.youtube.com/watch?v=OqxHy8sCtvA&list=PLpmb-7WxPhe0ZVpH9pxT5MtC4heqej8Es&index=6`
//   }
// ]
// client.on("ready", () => {
//   console.log("ready");

//   setInterval(()=>{
//     let random = Math.floor(Math.random()* status.length)
//     client.user.setActivity(status[random])
//   },10000)
// });

// client.on("interactionCreate", async (interaction) => {
//   try {
//     if (!interaction.isButton()) return;
//     await interaction.deferReply({ ephemeral: true });
//     const role = interaction.guild.roles.cache.get(interaction.customId);
//     if (!role) {
//       interaction.editReply({
//         content: "Role not found",
//       });
//       return;
//     }

//     const hasRole = interaction.member.roles.cache.has(role.id);

//     if (hasRole) {
//       await interaction.member.roles.remove(role);
//       await interaction.editReply(`Role ${role} has been removed`);
//       return;
//     }
//     await interaction.member.roles.add(role);
//     await interaction.editReply(`Role ${role} has been added`);
//   } catch (error) {
//     console.log(error);
//   }
// });
