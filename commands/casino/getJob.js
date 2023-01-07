const { CommandType } = require("wokcommands");
const { mongoClient } = require("../..");

const jobs = [
    {
        name:"Tesla Investor",
        earnings:-10000
    }, 
    {
        name:"Tech CEO",
        earnings:2000
    },
    {
        name:"Taxi Driver",
        earnings:250
    },
    {
        name:"Fry Cook (making french fries all day)",
        earnings:300
    },
    {
        name:"Discord Moderator",
        earnings:150
    },
    {
        name:"EECS370 IA",
        earnings:300
    },
    {
        name:"EECS281 IA",
        earnings: 301
    }
]

module.exports = {
    // Required for slash commands
    description: "Pick this if you are unemployed! 😀",
    // Create a legacy and slash command
    type: CommandType.BOTH,
    callback: async ({user}) => {
        try {
            let db = await mongoClient.db('botCasino');
            let _user = await db.collection('users').findOne(
                {
                    user_id:user.id,
                }
            );
            if(_user == undefined || _user == null || _user == NaN) {
                return {
                    content: "To play, you need to join the casino first. Do so by running the `/joincasino` command!"
                }
            }
            if(!_user.employed) {
                var random_job = jobs[Math.floor(Math.random()*jobs.length)];
                db.collection('users').updateOne({user_id:user.id},{
                    $set: {
                        employed:true,
                        income:random_job.earnings
                    },
                    $inc: {
                        coins:random_job.earnings
                    }
                });
             return {
                content: "🤑 Congratulations! You've been hired as a " + random_job.name + "! You'll be earning an income of " + random_job.earnings + ", and a starting bonus of this amount has been added to your bank account."
             }
            } else {
                return {
                    content: "☠️ Sorry, you've already got a job! Why are you trying to get another? Save some for the rest of us!",
                }
            }
        } catch(e) {
            console.error(e);
            return { 
                content: "☠️ Oops! Something went wrong on my end."
            }
        }
    }
}