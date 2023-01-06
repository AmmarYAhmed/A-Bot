const { CommandType } = require("wokcommands");
const { mongoClient } = require("../..");

module.exports = {
    // Required for slash commands
    description: "Go to work! Make some money.",
    // Create a legacy and slash command
    type: CommandType.BOTH,
    callback: async ({user}) => {
        let db = await mongoClient.db('botCasino');
        let users = await db.collection('users');
        let _user = await users.findOne(
            {
                user_id:user.id,
            }
        );
        if(!_user.employed) {
            return {
                content: "Sorry, you are unemployed! Get a job first, using the command `<not_implemented>`!",
            }
        } else {
            let earnings = _user.income;
            // users.updateOne({user_id:user.id},{
            //     $inc: {
            //         coins: earnings,
            //     },
            //     $set: {
            //         bonusAvailable:false,
            //     }
            // });
            return {
                content: "Nice! Come back in one hour to claim your paycheck of " + earnings + " coins!"
            }
        }
    }
}