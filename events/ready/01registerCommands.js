const { testServer } = require("../../config.json");
const areCommandsDifferent = require("../../utils/areCommandsDifferent");
const getApplicationCommands = require("../../utils/getApplicationCommands");
const getLocalCommands = require("../../utils/getLocalCommands");
module.exports = async(client) => {
  try {
    const localCommands = getLocalCommands();
    const applicationCommands = await getApplicationCommands(client,testServer)

    for(const localCommand of localCommands){
        const {name,description,options} = localCommand

        const existingCommand = await applicationCommands.cache.find((cmd)=>
        cmd.name === name)

        if(existingCommand){
            if(localCommand.deleted){ // .deleted is from ping.js a property
                await applicationCommands.delete(existingCommand.id)
                console.log(`Deleted commands ${name}`)
                continue;
            }
            if(areCommandsDifferent(existingCommand,localCommand)){
                await applicationCommands.edit(existingCommand.id,{
                    description,options
                })
                console.log(`Edited commands ${name}`)
            }
        }else{
            if(localCommand.deleted){
                console.log(`Skipping registering commands ${name} as its set to delete`)
                continue
            }
            await applicationCommands.create({
                name,description,options
            })

            console.log(`Commands is registered ${name}`)
        }
    }
  } catch (error) {
    console.log(error);
  }
};
