var navIsSolid = false;
var screenWidth = $(window).width();
var grVol, t, tt, previousTitle, duration, played, remaining, currentSongId;
var recheck = 0;
var currentSelectedRating = 0;
var currentSongFavorite = 0;

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
                backgroundColor: "#111111cc"
            }, "fast");
            $("#navBot").animate({
                backgroundColor: "#111111cc"
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
            $("#ratinginfo").fadeOut(500, function() {
                $.get("/js/get_rating.php", {
                    songid: currentSongId
                }, function(data) {
                    ratingSelectOutput(data);
                });
                $(this).fadeIn(600);
            });
            $("#favorite_icon").fadeOut(500, function() {
                $.get("/js/get_favorite.php", {
                    songid: currentSongId
                }, function(data) {
                    console.log(data);
                    if (data == "1") {
                        $("#favorite_icon").attr('src', '/images/assets/favorite_1.png');
                        currentSongFavorite = 1;
                    } else {
                        $("#favorite_icon").attr('src', '/images/assets/favorite_0.png');
                        currentSongFavorite = 0;
                    }
                });
                $(this).fadeIn(600);
            });
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

function matchCountry() {
    var val = $("#country").val();
    var obj = $("#countries").find("option[value='" + val + "']");
    if (obj != null && obj.length > 0) {
        if (val == "United States (Domestic and APO/FPO/DPO Mail)") {
            $("#usZipCode").css("display", "block");
            var zipVal = $("#zipCode").val();
            var validZip = /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(zipVal);
            if (validZip) {
                $("#calculateBtn").prop("disabled", false);
            } else {
                $("#calculateBtn").prop("disabled", true);
                $("#checkout").prop("disabled", true);
            }
        } else {
            $("#usZipCode").css("display", "none");
            $("#calculateBtn").prop("disabled", false);
        }
    } else {
        $("#checkout").prop("disabled", true);
        $("#calculateBtn").prop("disabled", true);
    }
    $("#shippingTotal").html("(calculate)");
    $("#shippingOptionsResponse").html("");
    $("#shippingOptionsTitle").css("display", "none");
}

function calculateShip() {
    $("#calculateBtn").addClass("is-loading");
    var country = $("#country").val();
    var zipCode = $("#zipCode").val();
    $.post("calculateShipping.php", {
        "country": country,
        "zipCode": zipCode
    }).done(function(data) {
        $("#shippingOptionsTitle").css("display", "block");
        $("#shippingOptionsResponse").html(data);
        $("#calculateBtn").removeClass("is-loading");
        $("#calculateBtn").prop("disabled", true);
    }).fail(function() {});
}

function calculateDisc() {
    $("#calculateDisc").addClass("is-loading");
    $.post("calculateDiscount.php", function(data) {});
}

function shippingSelected() {
    var value = $('input[name="selectedShipping"]:checked').val();
    $("#shippingTotal").html("$" + value);
    var subTotal = $("#subTotal").html().substring(1);
    var discountAmt = $("#discountTotal").html().substring(1);
    var gTotal = 0;
    if (isNaN(discountAmt)) {
        gTotal = usdFormat(parseFloat(value) + parseFloat(subTotal));
    } else {
        gTotal = usdFormat(parseFloat(value) + parseFloat(subTotal) - parseFloat(discountAmt));
    }
    $("#grandTotal").html("$" + gTotal);
    $("#checkout").prop("disabled", false);
    $("#calculateBtn").prop("disabled", true);
    $.post('storeShipping.php', {
        'shipping': value
    });
}

function usdFormat(number) {
    console.log(number);
    number = number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    return number;
}

function modalToggleLogin() {
    $("#modalLoginContainer").toggleClass('is-active');
}

function modalToggleDob() {
    $("#modalDobContainer").toggleClass('is-active');
}

function modalToggleTerms() {
    $("#modalTermsContainer").toggleClass('is-active');
}

function modalTogglePrivacy() {
    $("#modalPrivacyContainer").toggleClass('is-active');
}

function login() {
    $("#modalLogin").addClass("is-loading");
    let user = $("#user").val();
    let pass = $("#pass").val();
    $.post("/login/loginProcess.php", {
        user: user,
        pass: pass
    }, function(data) {
        $("#modalLogin").removeClass("is-loading");
        if (data.error) {
            if (data.userError != "") {
                $("#userError").html(data.userError);
            }
            if (data.passError != "") {
                $("#passError").html(data.passError);
            }
        } else {
            $("#loginInfo").html(data.info);
            modalToggleLogin();
        }
    }, "JSON");
}

function rating_hover(stars) {
    ratingSelectOutput(stars);
}

function rating_out() {
    ratingSelectOutput(currentSelectedRating);
}

function rating_click(stars) {
    $.get("/js/rating.php", {
        songid: currentSongId,
        rating: stars
    }, function(data) {
        var delayAmt = 2500;
        switch (data) {
            case "1":
                $("#rating_desc").html("You are not logged in.").show().delay(delayAmt).fadeOut();
                break;
            case "2":
                $("#rating_desc").html("Not connected to station.").show().delay(delayAmt).fadeOut();
                break;
            case "3":
                $("#rating_desc").html("Invalid rating.").show().delay(delayAmt).fadeOut();
                break;
            case "4":
                $("#rating_desc").html("Rating not submit (bad song ID).").show().delay(delayAmt).fadeOut();
                break;
            case "5":
                $("#rating_desc").html("Rating not submit (not a recent song).").show().delay(delayAmt).fadeOut();
                break;
            case "6":
                $("#rating_desc").html("Thanks for rating!").show().delay(delayAmt).fadeOut();
                currentSelectedRating = stars;
                break;
            default:
                $("#rating_desc").html("Rating not submit (unknown error).").show().delay(delayAmt).fadeOut();
        }
    });
    ratingSelectOutput(stars);
}

function ratingSelectOutput(stars) {
    switch (stars) {
        case 0:
            $("#rating_star_1").attr('src', '/images/assets/rating_star_none.png');
            $("#rating_star_2").attr('src', '/images/assets/rating_star_none.png');
            $("#rating_star_3").attr('src', '/images/assets/rating_star_none.png');
            $("#rating_star_4").attr('src', '/images/assets/rating_star_none.png');
            $("#rating_star_5").attr('src', '/images/assets/rating_star_none.png');
            break;
        case 1:
            $("#rating_star_1").attr('src', '/images/assets/rating_star.png');
            $("#rating_star_2").attr('src', '/images/assets/rating_star_none.png');
            $("#rating_star_3").attr('src', '/images/assets/rating_star_none.png');
            $("#rating_star_4").attr('src', '/images/assets/rating_star_none.png');
            $("#rating_star_5").attr('src', '/images/assets/rating_star_none.png');
            break;
        case 2:
            $("#rating_star_1").attr('src', '/images/assets/rating_star.png');
            $("#rating_star_2").attr('src', '/images/assets/rating_star.png');
            $("#rating_star_3").attr('src', '/images/assets/rating_star_none.png');
            $("#rating_star_4").attr('src', '/images/assets/rating_star_none.png');
            $("#rating_star_5").attr('src', '/images/assets/rating_star_none.png');
            break;
        case 3:
            $("#rating_star_1").attr('src', '/images/assets/rating_star.png');
            $("#rating_star_2").attr('src', '/images/assets/rating_star.png');
            $("#rating_star_3").attr('src', '/images/assets/rating_star.png');
            $("#rating_star_4").attr('src', '/images/assets/rating_star_none.png');
            $("#rating_star_5").attr('src', '/images/assets/rating_star_none.png');
            break;
        case 4:
            $("#rating_star_1").attr('src', '/images/assets/rating_star.png');
            $("#rating_star_2").attr('src', '/images/assets/rating_star.png');
            $("#rating_star_3").attr('src', '/images/assets/rating_star.png');
            $("#rating_star_4").attr('src', '/images/assets/rating_star.png');
            $("#rating_star_5").attr('src', '/images/assets/rating_star_none.png');
            break;
        case 5:
            $("#rating_star_1").attr('src', '/images/assets/rating_star.png');
            $("#rating_star_2").attr('src', '/images/assets/rating_star.png');
            $("#rating_star_3").attr('src', '/images/assets/rating_star.png');
            $("#rating_star_4").attr('src', '/images/assets/rating_star.png');
            $("#rating_star_5").attr('src', '/images/assets/rating_star.png');
            break;
        default:
            $("#rating_star_1").attr('src', '/images/assets/rating_star_none.png');
            $("#rating_star_2").attr('src', '/images/assets/rating_star_none.png');
            $("#rating_star_3").attr('src', '/images/assets/rating_star_none.png');
            $("#rating_star_4").attr('src', '/images/assets/rating_star_none.png');
            $("#rating_star_5").attr('src', '/images/assets/rating_star_none.png');
    }
}

function favorite_click(favId) {
    var fromPlayer = false;
    if (favId == null) {
        fromPlayer = true;
        favId = currentSongId;
    }
    var delayAmt = 2500;
    if (currentSongFavorite == 0) {
        $.post("/js/add_favorite.php", {
            id: favId
        }, function(data) {
            console.log(data);
            if (data.RESULT == "Success") {
                if (fromPlayer) {
                    $("#favorite_icon").attr('src', '/images/assets/favorite_1.png');
                    $("#rating_desc").html("Song added as favorite").show().delay(delayAmt).fadeOut();
                    currentSongFavorite = 1;
                }
            } else {
                $("#rating_desc").html(data.ERROR).show().delay(delayAmt).fadeOut();
            }
        });
    } else {
        $.post("/js/remove_favorite.php", {
            id: favId
        }, function(data) {
            console.log(data);
            if (data.RESULT == "Success") {
                if (fromPlayer) {
                    $("#favorite_icon").attr('src', '/images/assets/favorite_0.png');
                    $("#rating_desc").html("Song removed from favorites").show().delay(delayAmt).fadeOut();
                    currentSongFavorite = 0;
                }
            } else {
                $("#rating_desc").html(data.ERROR).show().delay(delayAmt).fadeOut();
            }
        });
    }
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
    $("#volSlider").on("input change", function() {
        grVol = $(this).val();
        $("#songVolPercent").html(Math.round(grVol * 100) + "%");
        adjustVolume(grVol);
    });
    $(window).resize(function() {
        screenWidth = $(window).width();
    });
    document.getElementById("loginModalOpenBtn").addEventListener("click", function(event) {
        event.preventDefault();
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