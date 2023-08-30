const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
  PermissionsBitField,
} = require("discord.js");
module.exports = {
  /**
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    const targetUserId = interaction.options.get("target-user").value;
    const reason =
      interaction.options.get("reason")?.value || "No reason provided";
    await interaction.deferReply();
    let targetUser;
    //const targetUser = await interaction.guild.members.fetch(targetUserId);
    // dito nagkakaerror kasi napupunta to sa event loop kaya sa huli pa ulet natatawag
    // dibale yung tamang responses ng bot sa catch ko na ihahandle
    try {
      targetUser = await interaction.guild.members.fetch(targetUserId);
    } catch (error) {
      targetUser = null;
    }
    if (!targetUser) {
      await interaction.editReply("That user doesnt exist in this server");
      return;
    }
    if (targetUser.id === interaction.guild.ownerId) {
      await interaction.editReply(
        "Cant kick the user because it is the server owner"
      );
      return;
    }

    const targetUserRolePosition = targetUser.roles.highest.position; //Highest role of the target user
    const requestUserRolePosition = interaction.member.highest; // Highest role of the user running the command
    const botRolePosition = interaction.guild.members.me.roles.highest.position; //Highest role of the bot
    if (targetUserRolePosition >= requestUserRolePosition) {
      await interaction.editReply(
        "You cant kick that user,because it has a higher or same role than you"
      );
      return;
    }

    if (targetUserRolePosition >= botRolePosition) {
      await interaction.editReply(
        "I cant kick that user because it is higher or equal than me"
      );
      return;
    }
    // kick the target user
    try {
      await targetUser.kick({ reason });
      await interaction.editReply(
        `User ${targetUser} was kicked \n Reason: ${reason}`
      );
    } catch (error) {
      console.log(`Error in kicking`);
      await interaction.editReply("Error in kicking");
    }
  },
  deleted: false,
  name: "kick",
  description: "kicks a member from the server",
  // devOnly:true,
  // testOnly:true,
  options: [
    {
      name: "target-user",
      description: "the user you want to kick",
      required: true,
      type: ApplicationCommandOptionType.Mentionable,
    },
    {
      name: "reason",
      description: "Reason for kicking",
      type: ApplicationCommandOptionType.String,
    },
  ],

  permissionsRequired: [PermissionsBitField.Flags.KickMembers],
  botsPermissions: [PermissionsBitField.Flags.KickMembers],
};
