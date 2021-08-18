var navIsSolid = false;
var screenWidth = $(window).width();
var grVol, t, tt, previousTitle, duration, played, remaining, currentSongId;
var recheck = 0;
var currentSelectedRating = 0;
var currentSongFavorite = 0;
var hostname = "http://localhost:5501"

function getCookie(cname) {
    var name = cname + "=";
    var dc = decodeURIComponent(document.cookie);
    var ca = dc.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
    }
    return "";
}

function navPositionCheck() {
    var aTop = 100;
    var aCur = $(this).scrollTop();
    if ((aTop - aCur) < 0) {
        if (!navIsSolid) {
            $("#navTop").animate({
                backgroundColor: "rgba(62, 15, 75, 0.8)"
            }, "fast");
            $("#navBot").animate({
                backgroundColor: "rgba(62, 15, 75, 0.8)"
            }, "fast");
            navIsSolid = true;
        }
    } else {
        if (navIsSolid) {
            $("#navTop").animate({
                backgroundColor: "transparent"
            }, "fast");
            $("#navBot").animate({
                backgroundColor: "transparent"
            }, "fast");
            navIsSolid = false;
        }
    }
}

function navInitialPositionCheck() {
    var aTop = 100;
    var aCur = $(this).scrollTop();
    if ((aTop - aCur) < 0) {
        if (!navIsSolid) {
            $("#navTop").css({
                backgroundColor: "#111111cc"
            });
            $("#navBot").css({
                backgroundColor: "#111111cc"
            });
            navIsSolid = true;
        }
    }
}

function getNowPlaying() {
    $.getJSON('/api/playing', function(data) {
        title = data["SONGINFO"]["TITLE"];
        artist = data["SONGINFO"]["ARTIST"];
        album = data["SONGINFO"]["ALBUM"];
        year = data["SONGINFO"]["YEAR"];
        circle = data["SONGINFO"]["CIRCLE"];
        duration = data["SONGTIMES"]["DURATION"];
        played = data["SONGTIMES"]["PLAYED"];
        remaining = data["SONGTIMES"]["REMAINING"];
        currentSongId = data["SONGDATA"]["SONGID"];
        albumArt = data["MISC"]["ALBUMART"];
        if (albumArt != "") artImgSrc = "https://gensokyoradio.net/images/albums/500/" + albumArt;
        else artImgSrc = "https://gensokyoradio.net/images/assets/gr-logo-placeholder.png";
        if (title != "" && title != previousTitle && !isNaN(played) && remaining >= 0) {
            $("#playerTitle").animate({
                left: '100px',
                opacity: 0
            }, 500);
            $("#playerArtist").animate({
                left: '100px',
                opacity: 0
            }, 500);
            $("#playerAlbum").animate({
                left: '100px',
                opacity: 0
            }, 500);
            $("#playerCircle").animate({
                left: '100px',
                opacity: 0
            }, 500);
            $("#playerArt").fadeOut(500, function() {
                $('<img/>').attr('src', artImgSrc).on('load', function() {
                    $(this).remove();
                    $('#playerArt').attr("src", artImgSrc).fadeIn(500);
                    $("#playerTitle").html(title).delay(100).animate({
                        left: '0px',
                        opacity: 1
                    }, 1000);
                    $("#playerArtist").html(artist).delay(200).animate({
                        left: '0px',
                        opacity: 1
                    }, 1000);
                    $("#playerAlbum").html(album).delay(300).animate({
                        left: '0px',
                        opacity: 1
                    }, 1000);
                    $("#playerCircle").html(circle).delay(400).animate({
                        left: '0px',
                        opacity: 1
                    }, 1000);
                    $('#bg1').fadeOut(1500, function() {
                        $(this).css('background-image', 'url(' + artImgSrc + ')').fadeIn(3000);
                    });
                });
            });
            $('<img/>').attr('src', artImgSrc).on('load', function() {
                $(this).remove();
                $("#songBarTitle").html(title);
                $("#songBarArtist").html(artist + " - ");
                $("#songBarAlbum").html(album + " (" + circle + ")");
                $("#songBarImage").attr('src', artImgSrc);
            });
            let curPercent = (played / duration) * 100;
            $("#durationBar").stop().css("width", curPercent + "%").animate({
                width: "100%"
            }, (remaining * 1000), "linear");
            clearTimeout(t);
            if (remaining < 10) {
                t = setTimeout(getNowPlaying, 5000);
            } else {
                t = setTimeout(getNowPlaying, remaining * 1000);
            }
            previousTitle = title;
            recheck = 0;
        } else {
            recheck++;
            var n;
            switch (recheck) {
                case 1:
                    n = Math.floor((Math.random() * 10) + 1);
                    break;
                case 2:
                    n = Math.floor((Math.random() * 10) + 10);
                    break;
                case 3:
                    n = Math.floor((Math.random() * 15) + 15);
                    break;
                case 4:
                    n = Math.floor((Math.random() * 15) + 30);
                    break;
                default:
                    n = Math.floor((Math.random() * 20) + 45);
                    break;
            }
            clearTimeout(t);
            t = setTimeout(getNowPlaying, (n * 1000));
        }
    });
}

function getCommands() {
    if(window.location.href != `${hostname}/cmds`) return;
    $.getJSON("/api/cmds", (d) => {

    });
}

function secondTick() {
    clearTimeout(tt);
    if (played != "" && !isNaN(played) && remaining >= 0) {
        let curS = (played % 60) + '';
        let curM = Math.floor(played / 60) + '';
        let durS = (duration % 60) + '';
        let durM = Math.floor(duration / 60) + '';
        $("#playerCounter").html(curM + ":" + curS.padStart(2, '0') + " / " + durM + ":" + durS.padStart(2, '0'));
        $("#songBarCounter").html(curM + ":" + curS.padStart(2, '0') + " / " + durM + ":" + durS.padStart(2, '0'));
        played++;
    } else {
        $("#playerCounter").html("--:-- / --:--");
        $("#songBarCounter").html("--:-- / --:--");
    }
    tt = setTimeout(secondTick, 1000);
}
if (getCookie("grvolume") != "") {
    grVol = getCookie("grvolume");
} else {
    grVol = .42;
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; path=/; " + expires;
}

$(function() {
    navInitialPositionCheck();
    getNowPlaying();
    secondTick();
    if (window.location.hash) {
        $(this).delay(250).queue(function() {
            window.scrollBy(0, -150);
        });
    }
    $(window).scroll(function() {
        navPositionCheck();
    });
    $(".navbar-burger").click(function() {
        $(".navbar-burger").toggleClass("is-active");
        $(".navbar-menu").toggleClass("is-active");
    });
    $(window).resize(function() {
        screenWidth = $(window).width();
    });
});
document.addEventListener('DOMContentLoaded', () => {
    (document.querySelectorAll('.notification .delete') || []).forEach(($delete) => {
        const $notification = $delete.parentNode;
        $delete.addEventListener('click', () => {
            $notification.parentNode.removeChild($notification);
        });
    });
});