const { mongoClient } = require("../..");
const { reactionRoleMessage } = require("../..");
const wait = require('node:timers/promises').setTimeout;

function getRandomSelection() {
    return (["🪨", "📃", "✂️"])[Math.floor(Math.random() * 3)];
}

module.exports = async (interaction, user) => {
    //console.log("Event triggered");
    if (interaction.isButton()) {
        let db = await mongoClient.db('botCasino');
        let _user = await db.collection('users').findOne({ user_id: user.id, });
        let opp = getRandomSelection();
        await interaction.deferUpdate();
        await wait(10);
        let first_colon = interaction.customId.indexOf(":"),
            second_colon = interaction.customId.indexOf(":",first_colon+1);
        let playType = interaction.customId.substring(0, interaction.customId.indexOf(":")),
            betAmount = parseInt(interaction.customId.substring(first_colon + 1, second_colon)),
            verification_id = interaction.customId.substring(second_colon+1,interaction.customId.length);
        if(verification_id != _user.user_id) { return; }
        console.log("Interaction event triggered. " + "playType==" + playType + ", user==" + interaction.user + ", betAmt==" + betAmount);
        var game_multiplier = 0;
        if(playType == "rock") {
            game_multiplier = (opp == "📃") ? -1 : ((opp == "✂️") ? 1 : 0);
        } else if(playType == "paper") {
            game_multiplier = (opp == "📃") ? -1 : ((opp == "✂️") ? 1 : 0);
        } else if(playType == "scissors") {
            game_multiplier = (opp == "📃") ? -1 : ((opp == "✂️") ? 1 : 0);
        }
        playType = (playType == "rock") ? "🪨" : ((playType == "scissors") ? "✂️" : "📃");
        await interaction.editReply({ 
            content:   `Time for some old-fashioned roshambo! Rock, paper, or scissors? Pick one!
                        You chose ${playType}!\n`,
            components: [] 
        });
        let final_message = ``;
        if(game_multiplier == 0) {
            final_message = `🤦 A tie! ${user.username}'s get their bet back. `
        } else if(game_multipler == -1) {
            final_message = `☠️ Fail! ${user.username}'s bet of ${betAmount} coins has evaporated from existence! 😵`
        } else {
            final_message = `Victory! ${user.username} wins back their bet of ${betAmount}! 🥳💃🎉`
        }
        await wait(1000);
        await interaction.editReply({ 
            content:   `Time for some old-fashioned roshambo! Rock, paper, or scissors? Pick one!
            You chose ${playType}
            Your opponent chose ${opp}`,
            components: [] 
        });
        await wait(1000);
        await interaction.editReply({ 
            content:   `Time for some old-fashioned roshambo! Rock, paper, or scissors? Pick one!
                        You chose ${playType}
                        Your opponent chose ${opp}
                        ${final_message}`,
            components: [] 
        });
        db.collection('users').updateOne({ user_id: user.id }, { $inc: { coins: game_multiplier * betAmount } });
        // if (playType == "rock") {
        //     await interaction.editReply({ content: 'Time for some old-fashioned roshambo! Rock, paper, or scissors? Pick one!\nYou chose 🪨!\n', components: [] });
        //     await wait(2000);
        //     await interaction.editReply({ content: 'Time for some old-fashioned roshambo! Rock, paper, or scissors? Pick one!\nYou chose 🪨!\nYour opponent chose ' + opp + "!", components: [] });
        //     await wait(1000);
        //     await interaction.editReply({ content: 'Time for some old-fashioned roshambo! Rock, paper, or scissors? Pick one!\nYou chose 🪨!\nYour opponent chose ' + opp + "!", components: [] });
        //     if (opp == "🪨") {
        //         await interaction.editReply({ content: 'Time for some old-fashioned roshambo! Rock, paper, or scissors? Pick one!\nYou chose 🪨!\nYour opponent chose ' + opp + "!" + '\nThat\'s a tie! You get your bet back.', components: [] });
        //     } else if (opp == "📃") {
        //         await interaction.editReply({ content: 'Time for some old-fashioned roshambo! Rock, paper, or scissors? Pick one!\nYou chose 🪨!\nYour opponent chose ' + opp + "!" + '\nYou win your bet of ' + betAmount + '. 🥳💃🎉', components: [] });
        //         db.collection('users').updateOne({ user_id: user.id }, { $inc: { coins: betAmount } });
        //     } else if (opp == "✂️") {
        //         await interaction.editReply({ content: 'Time for some old-fashioned roshambo! Rock, paper, or scissors? Pick one!\nYou chose 🪨!\nYour opponent chose ' + opp + "!" + '\nSorry, you lose ' + betAmount + '. Better luck next time! 🤦😬', components: [] });
        //         db.collection('users').updateOne({ user_id: user.id }, { $dec: { coins: betAmount } });
        //     }
        // } else if (playType == "paper") {
        //     await interaction.editReply({ content: 'Time for some old-fashioned roshambo! Rock, paper, or scissors? Pick one!\nYou chose 📃!\n', components: [] });
        //     await wait(2000);
        //     await interaction.editReply({ content: 'Time for some old-fashioned roshambo! Rock, paper, or scissors? Pick one!\nYou chose 📃!\nYour opponent chose ' + opp, components: [] });
        //     await wait(1000);
        //     if (opp == "🪨") {
        //         await interaction.editReply({ content: 'Time for some old-fashioned roshambo! Rock, paper, or scissors? Pick one!\nYou chose 📃!\nYour opponent chose ' + opp + "!" + '\nYou win your bet of ' + betAmount + '. 🥳💃🎉', components: [] });
        //         db.collection('users').updateOne({ user_id: user.id }, { $inc: { coins: betAmount } });
        //     } else if (opp == "📃") {
        //         await interaction.editReply({ content: 'Time for some old-fashioned roshambo! Rock, paper, or scissors? Pick one!\nYou chose 📃!\nYour opponent chose ' + opp + "!" + '\nThat\'s a tie! You get your bet back.', components: [] });
        //     } else if (opp == "✂️") {
        //         await interaction.editReply({ content: 'Time for some old-fashioned roshambo! Rock, paper, or scissors? Pick one!\nYou chose 📃!\nYour opponent chose ' + opp + "!" + '\nSorry, you lose ' + betAmount + '. Better luck next time! 🤦😬', components: [] });
        //         db.collection('users').updateOne({ user_id: user.id }, { $dec: { coins: betAmount } });
        //     }
        // } else if (playType == "scissors") {
        //     await interaction.editReply({ content: 'Time for some old-fashioned roshambo! Rock, paper, or scissors? Pick one!\nYou chose ✂️!\n', components: [] });
        //     await wait(2000);
        //     await interaction.editReply({ content: 'Time for some old-fashioned roshambo! Rock, paper, or scissors? Pick one!\nYou chose ✂️!\nYour opponent chose ' + opp + "!", components: [] });
        //     await wait(1000);
        //     if (opp == "🪨") {
        //         await interaction.editReply({ content: 'Time for some old-fashioned roshambo! Rock, paper, or scissors? Pick one!\nYou chose ✂️!\nYour opponent chose ' + opp + "!" + '\nSorry, you lose ' + betAmount + '. Better luck next time! 🤦😬', components: [] });
        //         db.collection('users').updateOne({ user_id: user.id }, { $dec: { coins: betAmount } });
        //     } else if (opp == "📃") {
        //         await interaction.editReply({ content: 'Time for some old-fashioned roshambo! Rock, paper, or scissors? Pick one!\nYou chose ✂️!\nYour opponent chose ' + opp + "!" + '\nYou win your bet of ' + betAmount + '. 🥳💃🎉', components: [] });
        //         db.collection('users').updateOne({ user_id: user.id }, { $inc: { coins: betAmount } });
        //     } else if (opp == "✂️") {
        //         await interaction.editReply({ content: 'Time for some old-fashioned roshambo! Rock, paper, or scissors? Pick one!\nYou chose ✂️!\nYour opponent chose ' + opp + "!" + '\nThat\'s a tie! You get your bet back.', components: [] });
        //     }
        // }
    }
};