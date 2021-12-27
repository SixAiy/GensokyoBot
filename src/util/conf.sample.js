"use strict"

module.exports = {
    version:        5.8,
    env:            "",
    server:         "",
    firstRegister:  false,
    token:          "",

    color:          0x8960fd,

    domain:         "https://gensokyobot.com",

    api_port:       4023,
    api_lKey:       "",
    api_rKey:       "",

    fm_api:         "https://api.sixaiy.com/api/station/playing",
    fm_stream:      "https://fm.gensokyobot.com/mobile",

    intents:        [ "guilds", "guildMessages", "guildMembers", "guildInteractions", "guildVoiceStates" ],

    reChannels:     ["920939667497558036", "919974561322266694", "174821093633294338"],
    reGuilds:       ["269896638628102144", "174820236481134592"],
    mguild:         "269896638628102144",
    owner:          "188571987835092992",

    status:     { s: "online", x: { name: "", type: 0 } }
};