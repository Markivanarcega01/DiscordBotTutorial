const User = require('../../models/User')
const {Client,Interaction} = require('discord.js')

const dailyAmount = 1000

module.exports = {
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    callback:async(client,interaction)=>{
        if(interaction.channelId !== "1116366168681369753"){
            interaction.reply({
                content:'You cannot run this command on this channel',
                ephemeral:true
            })
            return
        }
        try {
            await interaction.deferReply()

            let query= {
                userId:interaction.member.id,
                guildId:interaction.guild.id,
            }

            let user = await User.findOne(query)

            if(user){
                const lastDailyDate = user.lastDaily.toDateString()
                const currentDate = new Date().toDateString()

                if(lastDailyDate === currentDate){
                    interaction.editReply('You already collected your dailies today, Come back tomorrow')
                    return
                }
            }else{
                user = new User({
                    ...query,
                    lastDaily:new Date(),

                })
            }
            user.balance += dailyAmount;
            await user.save()

            interaction.editReply(`${dailyAmount} was added to your balance. Your new balance is ${user.balance}`)
        } catch (error) {
            console.log(`Error with /daily: ${error}`)
        }
    },
    name:'daily',
    description:'Collect your dailies',
    
}