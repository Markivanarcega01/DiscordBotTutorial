const { devs, testServer } = require("../../config.json");
const getLocalCommands = require("../../utils/getLocalCommands");
const { Interaction, Client } = require("discord.js");
/**
 * @param {Client} client
 * @param {Interaction} interaction
 */
module.exports = async (client, interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const localCommands = getLocalCommands();
  try {
    const commandObject = localCommands.find(
      (cmd) => cmd.name === interaction.commandName
    );
    if (!commandObject) return;

    if (commandObject.devOnly) {
      if (!devs.includes(interaction.member.id)) {
        interaction.reply({
          content: "Only developers are allowed to run this command",
          ephemeral: true,
        });
        return;
      }
    }
    if (commandObject.testOnly) {
      if (!interaction.guild.id === testServer) {
        interaction.reply({
          content: "This command cannot be ran here",
          ephemeral: true,
        });
        return;
      }
    }
    if (commandObject.permissionsRequired?.length) {
      for (const permission of commandObject.permissionsRequired) {
        if (!interaction.member.permissions.has(permission)) {
          interaction.reply({
            content: "not enough permissions",
            ephemeral: true,
          });
          return;
        }
      }
    }
    if (commandObject.botsPermissions?.length) {
      for (const permission of commandObject.botsPermissions) {
        const bot = interaction.guild.members.me;

        if (!bot.permissions.has(permission)) {
          interaction.reply({
            content: "I dont have enought permissions",
            ephemeral: true,
          });
          return;
        }
      }
    }
    await commandObject.callback(client, interaction);
  } catch (error) {
    console.log(error)
  }
};
