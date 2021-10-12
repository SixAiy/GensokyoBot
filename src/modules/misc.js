/*
    #####################################################################
    # File: misc.js
    # Title: A Radio Music Bot
    # Author: SixAiy <me@sixaiy.com>
    # Version: 5.2
    # Description:
    #  A Discord bot for playing the Gensokyo Radio.
    #####################################################################

    #####################################################################
    # License
    #####################################################################
    # Copyright 2021 Contributing Authors
    # This program is distributed under the terms of the GNU GPL.
    ######################################################################
*/

"use strict"

let 
    mod = require('../util/mod').Module("misc"),
    conf = require('../conf');


// FUN COMMANDS
mod.command("stab", {
    interaction: true,
    desc: "Shows a anime gif of stabbing",
    rank: 0,
    func: async function(app, msg, args, rank) {
        let 
            imgs = [
                'https://i.imgur.com/VjggulR.gif',
                'https://gifimage.net/wp-content/uploads/2017/09/anime-stab-gif.gif',
                'https://i.gifer.com/E65b.gif',
                'https://thumbs.gfycat.com/EmotionalCompleteGourami-size_restricted.gif',
                'https://gifimage.net/wp-content/uploads/2017/09/anime-stab-gif-1.gif',
                'https://i.gifer.com/C3aD.gif',
                'https://thumbs.gfycat.com/BogusInsecureAmericanpainthorse-size_restricted.gif'
            ],
            rand = Math.floor(Math.random() * imgs.length),
            img = imgs[rand],
            em = app.bot.makeEmbed();

        em.color(conf.embed_color);
        em.image(img);

        msg.createEmbed(em);
    }
});
mod.command("facedesk", {
    interaction: true,
    desc: "Gif of Anime facedesking",
    rank: 0,
    func: async function(app, msg, args, rank) {
        let 
            imgs = [
                "https://i.imgur.com/csdvorU.gif",
                "https://i.imgur.com/YwOdlnD.gif",
                "https://i.imgur.com/t7Xn8zZ.gif",
                "https://i.imgur.com/iu1XVCQ.gif",
                "https://i.imgur.com/WRFeyEq.gif",
                "https://i.imgur.com/DOhTPd1.gif",
                "https://i.imgur.com/LF2mIBJ.gif",
                "https://i.imgur.com/I7FNAId.gif",
                "https://i.imgur.com/mn9V2Ht.gif",
                "https://i.imgur.com/lfz4gYB.gif",
                "https://i.imgur.com/VnptZ2X.gif",
                "https://i.imgur.com/S85GSma.gif"
            ],
            rand = Math.floor(Math.random() * imgs.length),
            img = imgs[rand],
            em = app.bot.makeEmbed();

        em.color(conf.embed_color);
        em.image(img);

        msg.createEmbed(em);
    }
});
mod.command("hug", {
    interaction: true,
    desc: "You can hug someone",
    rank: 0,
    func: async function(app, msg, args, rank) {
        let 
            imgs = [
                "https://i.imgur.com/JrnxI9M.gif",
                "https://i.imgur.com/wQ63uWq.gif",
                "https://i.imgur.com/l1a8pPB.gif",
                "https://i.imgur.com/NA0KTrW.gif",
                "https://i.imgur.com/zKDs4E4.gif",
                "https://i.imgur.com/6Xgkuh0.gif",
                "https://i.imgur.com/6VGJmQH.gif",
                "https://i.imgur.com/PUGIfYr.gif",
                "https://i.imgur.com/axhxWEK.gif",
                "https://i.imgur.com/SFhrpdI.gif",
                "https://i.imgur.com/OTtWXbs.gif",
                "https://i.imgur.com/3zGl5on.gif",
                "https://i.imgur.com/wBbgpKQ.gif",
                "https://i.imgur.com/muAzb8A.gif",
                "https://i.imgur.com/Jr5YVQx.gif",
                "https://i.imgur.com/Vz95HoQ.gif",
                "https://i.imgur.com/NVSlQsr.gif",
                "https://i.imgur.com/GM5njAQ.gif",
                "https://i.imgur.com/o1zH31L.gif"
            ],
            rand = Math.floor(Math.random() * imgs.length),
            img = imgs[rand],
            em = app.bot.makeEmbed();

        em.color(conf.embed_color);
        em.image(img);

        msg.createEmbed(em);
    }
})
mod.command("pat", {
    interaction: true,
    desc: "Pat someone",
    rank: 0,
    func: async function(app, msg, args, rank) {
        let 
            imgs = [
                'https://i.imgur.com/Iye3UIa.png',
                "https://i.imgur.com/LeMuU6C.png",
                "https://i.imgur.com/5Cb7uGV.jpg",
                "https://i.imgur.com/RF301YT.jpg",
                "https://i.imgur.com/jM0x0nf.jpg",
                "https://i.imgur.com/BbY0wuV.jpg",
                "https://i.imgur.com/GjcMlCK.jpg",
                "https://i.imgur.com/ESrFjRk.jpg",
                "https://i.imgur.com/POqbCmY.png",
                "https://i.imgur.com/JKsykmS.jpg",
                "https://i.imgur.com/hbFEFqF.png",
                "https://i.imgur.com/uy6uSnv.jpg",
                "https://i.imgur.com/f0tiMtS.jpg",
                "https://i.imgur.com/mXjNv3Q.jpg",
                "https://i.imgur.com/mPkrrOu.gif",
                "https://i.imgur.com/cThKWAS.gif",
                "https://i.imgur.com/o3tFicO.gif",
                "https://i.imgur.com/iqfuv5x.gif",
                "https://i.imgur.com/7GXp58X.gif",
                "https://i.imgur.com/Ofrpy9z.gif",
                "https://i.imgur.com/GkoqIPv.gif",
                "https://i.imgur.com/7zyGtwl.gif",
                "https://i.imgur.com/DzkDUYp.jpg",
                "https://i.imgur.com/MMtEnZp.jpg",
                "https://i.imgur.com/y5zZbjn.jpg",
                "https://i.imgur.com/lAQ69xW.png",
                "https://i.imgur.com/u0VILdI.png",
                "https://i.imgur.com/TBNP0BH.jpg",
                "https://i.imgur.com/t6jN5CN.jpg",
                "https://i.imgur.com/chb7lGf.jpg",
                "https://i.imgur.com/qQPUUpk.jpg",
                "https://i.imgur.com/BAQ4cZY.jpg",
                "https://i.imgur.com/ajf59dF.jpg",
                "https://i.imgur.com/i88xMnp.gif",
                "https://i.imgur.com/k1H6Tze.jpg",
                "https://i.imgur.com/Ahhrc09.gif",
                "https://i.imgur.com/Qi6jj4h.jpg",
                "https://i.imgur.com/9gMwylh.gif",
                "https://i.imgur.com/qhncr0N.gif",
                "https://i.imgur.com/KbkBzyA.gif",
                "https://i.imgur.com/RAR4H7E.gif",
                "https://i.imgur.com/tWHWOvi.gif",
                "https://i.imgur.com/NLfpe3A.gif",
                "https://i.imgur.com/XJCmEBQ.jpg",
                "https://i.imgur.com/SlnpeK5.gif"
            ],
		    rand = Math.floor(Math.random() * imgs.length),
            img = imgs[rand],
            em = app.bot.makeEmbed();

        em.color(conf.embed_color);
        em.image(img);

        msg.createEmbed(em);
    }
});
mod.command("roll", {
    interaction: true,
    desc: "You roll around",
    rank: 0,
    func: async function(app, msg, args, rank) {
        let
            imgs = [
                'https://i.imgur.com/7sLGFSl.gif',
                "https://i.imgur.com/jPSfgwF.gif",
                "https://i.imgur.com/ZBWNpDu.gif",
                "https://i.imgur.com/fA5GcPS.gif",
                "https://i.imgur.com/e1N5piq.gif",
                "https://i.imgur.com/dTMdzp4.gif",
                "https://i.imgur.com/8QtvuwP.gif",
                "https://i.imgur.com/oXTU2ei.gif",
                "https://i.imgur.com/abkgBka.gif",
                "https://i.imgur.com/BpM7Fjm.gif",
                "https://i.imgur.com/NKsCmGh.gif",
                "https://i.imgur.com/UlDw4V4.gif",
                "https://i.imgur.com/BWwFVJp.gif",
                "https://i.imgur.com/rqmlgqV.gif",
                "https://i.imgur.com/2lf222q.gif",
                "https://i.imgur.com/BxUESni.gif",
                "https://i.imgur.com/Zkqu4A0.gif",
                "https://i.imgur.com/K5BpTCo.gif",
                "https://i.imgur.com/GR88Qap.gif",
                "https://i.imgur.com/SWgSIrQ.gif",
                "https://i.imgur.com/bk58dPD.gif",
                "https://i.imgur.com/vFjZBmG.gif",
                "https://i.imgur.com/1wGMcRS.gif",
                "https://i.imgur.com/5wGCWPK.gif",
                "https://i.imgur.com/tJlB1rH.gif",
                "https://i.imgur.com/SUPSA2L.gif",
                "https://i.imgur.com/NS7tHxX.gif",
                "https://i.imgur.com/65FW8vY.gif",
                "https://i.imgur.com/TXOjoLh.gif",
                "https://i.imgur.com/qLhmEfN.gif",
                "https://i.imgur.com/QXLOKrM.gif",
                "https://i.imgur.com/D14Vmbe.gif",
                "https://i.imgur.com/iUAHLDa.gif",
                "https://i.imgur.com/tY5YzNh.gif"
            ],
		    rand = Math.floor(Math.random() * imgs.length),
            img = imgs[rand],
            em = app.bot.makeEmbed();

        em.color(conf.embed_color);
        em.image(img);

        msg.createEmbed(em);
    }
});
mod.command("anime", {
    interaction: true,
    desc: "shows a gif of Animeeee!!",
    rank: 0,
    func: async function(app, msg, args, rank) {
        let em = app.bot.makeEmbed();

        em.color(conf.embed_color);
        em.image("http://i.imgur.com/93VahIh.png");

        msg.createEmbed(em);
    }
});

exports.mod = mod;