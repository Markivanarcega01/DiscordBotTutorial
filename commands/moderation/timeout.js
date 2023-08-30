const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
  PermissionsBitField,
} = require("discord.js");
const ms = require("ms");
module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    const mentionable = interaction.options.get("target-user").value;
    const duration = interaction.options.get("duration")?.value;
    const reason =
      interaction.options.get("reason")?.value || "No reason provided";

    await interaction.deferReply();
    let targetUser;
    //const targetUser = await interaction.guild.members.fetch(mentionable);
    try {
      targetUser = await interaction.guild.members.fetch(mentionable);
    } catch (error) {
      targetUser = null
    }
    if (!targetUser) {
      await interaction.editReply("That user doesnt exist in this server");
      return;
    }
    if (targetUser.user.bot) {
      await interaction.editReply("I cannot timeout a bot");
      return;
    }
    if (targetUser.id === interaction.guild.ownerId) {
      await interaction.editReply(
        "Cant timeout the user because it is the server owner"
      );
      return;
    }
    const msDuration = ms(duration);
    if (isNaN(msDuration)) {
      await interaction.editReply("Please provide a valid timeout duration");
      return;
    }
    if (msDuration < 5000 || msDuration > 2.419e9) {
      await interaction.editReply(
        "Timeout duration cannot be less than 5 seconds or more than 28 days"
      );
      return;
    }
    const targetUserRolePosition = targetUser.roles.highest.position; //Highest role of the target user
    const requestUserRolePosition = interaction.member.highest; // Highest role of the user running the command
    const botRolePosition = interaction.guild.members.me.roles.highest.position; //Highest role of the bot
    if (targetUserRolePosition >= requestUserRolePosition) {
      await interaction.editReply(
        "You cant timeout that user,because it has a higher or same role than you"
      );
      return;
    }

    if (targetUserRolePosition >= botRolePosition) {
      await interaction.editReply(
        "I cant timeout that user because it is higher or equal than me"
      );
      return;
    }
    // timeout the target user
    try {
      const {default:prettyMs} = await import("pretty-ms");
      if (targetUser.isCommunicationDisabled()) {
        await targetUser.timeout(msDuration, reason);
        await interaction.editReply(
          `${targetUser}'s timeout has been updated to ${prettyMs(msDuration, {
            verbose: true,
          })} \n Reason:${reason}`
        );
        return
      }
      await targetUser.timeout(msDuration, reason);
      await interaction.editReply(`${targetUser} was timeout for ${prettyMs(msDuration, {
        verbose: true,
      })}\n Reason:${reason}`)
    } catch (error) {
      console.log(error);
      await interaction.editReply("Error in timeout");
    }
  },
  name: "timeout",
  description: "Timeout a user",
  options: [
    {
      name: "target-user",
      description: "the user you want to timeout",
      type: ApplicationCommandOptionType.Mentionable,
      required: true,
    },
    {
      name: "duration",
      description: "Timeout duration (30m, 1h, 1d)",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "reason",
      description: "The reason for the timeout",
      type: ApplicationCommandOptionType.String,
    },
  ],
  permissionsRequired: [PermissionsBitField.Flags.MuteMembers],
  botsPermissions: [PermissionsBitField.Flags.MuteMembers],
};
