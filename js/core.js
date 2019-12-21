// 为Date原型添加format方法，方便日期格式化
Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

$(function () {
    {
        const themeColors = ["#2196F3", "#f44336", "#9c27b0", "#4caf50", "#3f51b5", "#795548", "#607d8b", "#009688"]
        const themeColorsLightness = ["#BDE0FB", "#FCC7C3", "#E1BFE7", "#CAE7CB", "#C6CBE9", "#D7CCC8", "#D0D8DC", "#B3E0DC"]
        let randomColor = Math.floor((Math.random() * themeColors.length));
        document.querySelector(':root').style.setProperty('--main-theme-color', themeColors[randomColor]); // 主题色赋值
        document.querySelector(':root').style.setProperty('--main-theme-lightness-color', themeColorsLightness[randomColor]); // 主题亮色赋值
    }
    $(".main-card .main-menu-container .main-menu-item").click(function () {
        if (!$(this).hasClass("active")) {
            $(".main-card .main-menu-container .main-menu-item.active").removeClass("active");
            $(this).addClass("active");
            switch ($(this).attr("data-page")) {
                case "home":
                    $(".child-card-container.active").removeClass("active");
                    $(".child-articles-card-container.active").removeClass("active");
                    $(".placeholder-card").addClass("active");
                    break;
                case "articles":
                    $(".child-card-container.active").removeClass("active");
                    $(".child-articles-card-container.active").removeClass("active");
                    $(".child-card-container[data-page='articles']").addClass("active");
                    $(".child-articles-card-container").addClass("active");
                    $(".placeholder-card").removeClass("active");
                    break;
                case "donate":
                    $(".child-card-container.active").removeClass("active");
                    $(".child-articles-card-container.active").removeClass("active");
                    $(".child-card-container[data-page='donate']").addClass("active");
                    $(".placeholder-card").removeClass("active");
                    break;
                case "pen":
                    $(".child-card-container.active").removeClass("active");
                    $(".child-articles-card-container.active").removeClass("active");
                    $(".child-card-container[data-page='pen']").addClass("active");
                    $(".placeholder-card").removeClass("active");
                    break;
                default:
                    break;
            }
        }
    });

    {
        function getArticle(page) {
            $.ajax({
                url: `https://daidr.me/wp-json/wp/v2/posts?per_page=20&page=${page}`,
                cache: false,
                success: function (data) {
                    if (!(data["code"] == "rest_post_invalid_page_number")) {
                        for (const key in data) {
                            if (!data[key]["categories"].includes(14)) {
                                $(".child-card-container[data-page='articles']").append(`<a class="article-card-link" href="${data[key]["link"]}" target="_blank"><div class="article-card">
                <div class="article-card-image" draggable="false"
                    style="background-image:url(${data[key]["post_medium_image_300"] || "https://daidr.me/wp-content/themes/Akina-Siren/images/temp.jpg"})"></div>
                <p class="article-card-title" title="${data[key]["title"]["rendered"]}">${data[key]["title"]["rendered"]}</p>
                <p class="article-card-date">创作于 ${new Date(data[key]["date"]).format("yyyy/MM/dd")}</p>
                <p class="article-card-summary">${delHtmlTag(data[key]["excerpt"]["rendered"])}</p>
                <div class="article-card-meta">
                    <span><i class="ri-book-open-fill"></i> ${data[key]["pageviews"]} 阅读</span>
                    <span><i class="ri-chat-1-fill"></i> ${data[key]["total_comments"]} 评论</span>
                    <span><i class="ri-folder-5-fill"></i> ${data[key]["category_name"]}</span>
                </div>
            </div></a>`)
                            }
                        }
                        getArticle(page + 1)
                    }
                }
            });
        }
        getArticle(1);
    }

    /*     {
            (function getAboutPage() {
                $.ajax({
                    url: `https://daidr.me/wp-json/wp/v2/pages/136`,
                    cache: false,
                    success: function (data) {
                        $(".child-card-container[data-page='about'] div").html(data["content"]["rendered"]);
                    }
                });
            })()
        } */

    {
        let articleContainer = $(".child-card-container[data-page='articles']")[0], delayed;
        articleContainer.onwheel = function (event) {
            //event.preventDefault();
            if (event["shiftKey"] == false) {
                clearTimeout(delayed);
                delayed = setTimeout(() => {
                    clearTimeout(delayed);
                    var step = 500;
                    if (event.deltaY < 0) {
                        this.scrollLeft -= step;
                    } else {
                        this.scrollLeft += step;
                    }
                }, 10);
            }
        }
        articleContainer.onscroll = function (event) {
            let scrollLeft = event["target"]["scrollLeft"];
            let scrollWidth = event["target"]["scrollWidth"] - event["target"]["offsetWidth"];
            if (scrollLeft == 0) {
                $(".child-articles-card-container-mask-l").fadeOut();
                $(".child-articles-card-container-mask-r").fadeIn();
            } else if (scrollLeft < scrollWidth) {
                $(".child-articles-card-container-mask-l").fadeIn();
                $(".child-articles-card-container-mask-r").fadeIn();
            } else {
                $(".child-articles-card-container-mask-l").fadeIn();
                $(".child-articles-card-container-mask-r").fadeOut();
            }
        }
    }

    {
        let discordClipboard = new ClipboardJS('.main-card-icon-item[Title="Discord"]');
        discordClipboard.on('success', function (e) {
            iziToast.show({
                message: 'Discord account has been copied to the clipboard!',
                icon: 'ri-check-line',
                iconColor: 'var(--main-theme-color)',
                closeOnClick: true,
                close: false,
                progressBar: false,
                class: 'tips',
                position: 'bottomCenter',
                timeout: 2500
            });
            e.clearSelection();
        });
    }
});

function delHtmlTag(str) {
    return str.replace(/<[^>]+>/g, "");//去掉所有的html标记
}