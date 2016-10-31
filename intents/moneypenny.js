var moneypennyAPI = require('../lib/api_moneypenny'),
    moneypenny;


moneypenny = function (app) {

    app.intent('whoReportsTo', { slots: {"NAME": "NAME"} }, function (request, response) {
        let mgr = request.slot("NAME");
        console.log(`in whoReportsTo with ${mgr}`);

        if (mgr === undefined) {
            response.say('I had trouble understanding the name of the manager of the team you were requesting. Please try again');
            response.shouldEndSession(false, 'I\'m sorry, I didnt get that. Try saying that again.').send();
        } else {
            moneypennyAPI.getReportingTeam(mgr).then( (team) => {
                for (member in team) {
                    if (!indexOf(member) === team.length-2) {
                        response.say(`${member} .`);
                    } else {
                        response.say(`and ${member}`);
                    }
                };
                response.say(`report to ${mgr}.`);
            }).catch( (error) => {
                console.log(error);
                response.say(`Did you ask for the direct reports of of ${mgt}?  I either didn\'t understand you, that person doesn't work here, or we are experiencing an error. Please try again`);
                response.shouldEndSession(false, 'I\'m sorry, I didnt get that. Try saying that again.').send();
            });
        }
        return false;
    });

    app.intent('reportsToWho', { slots: {"NAME": "NAME"} }, function(request, response) {
        let member = request.slot("NAME");
        console.log(`in reports reportsToWho with ${member}`);

        if (member === undefined) {
            response.say(`I either didn\'t understand the name of ${member}, or that person doesn't work here. Please try again`);
            response.shouldEndSession(false, 'I\'m sorry, I didnt get that. Try saying that again.').send();
        } else {
            moneypennyAPI.getManagersOf(member).then( (mgrs) => {
                response.say(`${member} reports to.`)
                for (mgr in mgrs) {
                    if (!indexOf(mgr) === mgrs.length-2) {
                        response.say(`${mgr} .`);
                    } else {
                        response.say(`and ${mgr}`);
                    }
                };
            }).catch( (error) => {
                response.say(`Did you ask for the managers of ${member}?  I either didn\'t understand you, that person doesn't work here, or we are experiencing an error. Please try again`);
                response.shouldEndSession(false, 'I\'m sorry, I didnt get that. Try saying that again.').send();
                console.log(error);
            });
        }
        return false;
    });

    app.intent('showPictureOf', { slots: { "NAME": "NAME"} }, function(request, reponse) {
        let person = request.slot("NAME");

        if (person === undefined) {
            response.say(`I either didn\'t understand the name of ${person}, or that person doesn't work here. Please try again`);
            response.shouldEndSession(false, 'I\'m sorry, I didnt get that. Try saying that again.').send();
        } else {
            moneypennyAPI.getPicture(person).then( (picture) => {
                if (picture) {
                    putPictureOnTV(picture);
                } else {
                    response.say(`I'm sorry, we couldn\'t get the picture of ${person} on the TV`);
                }
            }).catch( (error) => {
                response.say(`Did you ask for the picture of ${person}?  I either didn\'t understand you, that person doesn't have a pciture, or we are experiencing an error. Please try again`);
                response.shouldEndSession(false, 'I\'m sorry, I didnt get that. Try saying that again.').send();
            });
        }
    });

    app.intent('whoLeadsTeam', { slots: {"TEAM": "TEAM"} }, function(request, response) {
        // TODO: ADD LOGIC FOR EXTRACTING THE WORD "TEAM" OUT OF SLOT FOR THE API REQUEST 
        let teamName = request.slot("TEAM");

        if (teamName === undefined) {
            response.say(`I either didn\'t understand the name of the ${teamName} team, or that team doesn\'t exist. Please try again`);
            response.shouldEndSession(false, 'I\'m sorry, I didnt get that. Try saying that again.').send();
        } else {
            moneypennyAPI.getTeamLeader(teamName).then( (teamLead) => {
                response.say(`The team lead for ${teamName} is ${teamLead}`);
            }).catch( (error) => {
                response.say(`Did you ask for the team leader of ${teamName}?  I either didn\'t understand you, that team doesn't exist, or we are experiencing an error. Please try again`);
                response.shouldEndSession(false, 'I\'m sorry, I didnt get that. Try saying that again.').send();
            });
        }
    });

}