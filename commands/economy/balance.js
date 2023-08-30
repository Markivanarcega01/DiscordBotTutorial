const {
  ApplicationCommandOptionType,
  Client,
  Interaction,
} = require("discord.js");
const User = require('../../models/User')

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    if (!interaction.inGuild()) {
      interaction.reply({
        content: "You can only run this command inside a server",
        ephemeral: true,
      });
      return;
    }
    const targetUserId = interaction.options.get('user')?.value || interaction.member.id
    await interaction.deferReply()
    try {
        let query = {
            userId: targetUserId,
            guildId:interaction.guild.id
        }
        const user = await User.findOne(query)
        if(!user){
            interaction.editReply(`${targetUserId} doesnt have a profile yet`)
            return
        }
        interaction.editReply(
            targetUserId === interaction.member.id
            ? `Your balance is ${user.balance}`
            : `${targetUserId.name} balance is ${user.balance}`
        )
    } catch (error) {}
  },
  name: "balance",
  description: "See yours or someone else balance",
  options: [
    {
      name: "user",
      description: "The user whose balance you want to get",
      type: ApplicationCommandOptionType.User,
    },
  ],
};
