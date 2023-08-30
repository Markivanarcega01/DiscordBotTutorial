const {
  ApplicationCommandOptionType,
  Client,
  Interaction,AttachmentBuilder
} = require("discord.js");
const Level = require("../../models/Level");
const canvacord = require('canvacord')
const calculateLevelXp = require('../../utils/calculateLevelXp')

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    if (interaction.channelId !== "1116366168681369753") {
      interaction.reply("You cannot run this command on this channel");
      return;
    }
    await interaction.deferReply();

    const mentionedUserId = interaction.options.get("target-user")?.value;
    const targetUserId = mentionedUserId || interaction.member.id;
    const targetUserObj = await interaction.guild.members.fetch(targetUserId);

    const fetchLevel = await Level.findOne({
      userId: targetUserId,
      guildId: interaction.guild.id,
    });

    if (!fetchLevel) {
      interaction.editReply(
        mentionedUserId
          ? `${targetUserObj.user.tag} doesn't have any levels yet. Try again when they chat a little more`
          : `You dont have any levels yet`
      );
      return
    }

    //sort the levels to find the rank of the request
    let allLevels = await Level.find({
        guildId: interaction.guild.id,
    }).select('-_id userId level xp');

    allLevels.sort((a,b)=>{
        if(a.level === b.level){
            return b.xp - a.xp
        }else{
            return b.level - a.level
        }
    })

    let currentRank = allLevels.findIndex((lvl)=> lvl.userId === targetUserId) + 1
    const rank = new canvacord.Rank()
        .setAvatar(targetUserObj.user.displayAvatarURL({size:256}))
        .setRank(currentRank)
        .setLevel(fetchLevel.level)
        .setCurrentXP(fetchLevel.xp)
        .setRequiredXP(calculateLevelXp(fetchLevel.level))
        .setStatus(targetUserObj.presence.status)
        .setProgressBar('#FFC300','COLOR')
        .setUsername(targetUserObj.user.username)
        .setDiscriminator(targetUserObj.user.discriminator)
    
    const data = await rank.build()
    const attachment = new AttachmentBuilder(data)
    interaction.editReply({files:[attachment]})
  },
  name: "level",
  description: `Shows your/Someone's level`,
  options: [
    {
      name: "target-user",
      description: "The user whose level you want to see",
      type: ApplicationCommandOptionType.Mentionable,
    },
  ],
};
