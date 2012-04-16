(function() {
    var a,
    b;
    if (typeof $ == "undefined" || $ === null)
        return;
    b = !1,
    $(window).on("beforeunload", function() {
        b = !0
    }),
    $(window).on("unload", function() {
        b = !0
    }),
    a = function() {
        return $.browser != null && ($.browser.webkit || $.browser.opera || $.browser.msie && parseInt($.browser.version) >= 8 || $.browser.mozilla) && $.browser.version != null && $.browser.version !== "0"
    } ();
    if (!a)
        return;
    window.onerror = function(a, c, d) {
        var e;
        if (b || !d)
            return;
        if (c != null ? !c.match(/assets.github.com|github.dev/) : !void 0)
            return;
        e = {
            message: a,
            filename: c,
            lineno: d,
            url: window.location.href,
            readyState: document.readyState,
            referrer: document.referrer,
            browser: $.browser
        },
        $.ajax({
            type: "POST",
            url: "/errors",
            data: {
                error: e
            }
        }),
        window.errors == null && (window.errors = []),
        window.errors.push(e)
        },
    window.location.hash === "#b00m" && b00m()
    }).call(this),
function() {
    var a;
    window.GitHub == null && (window.GitHub = {}),
    GitHub.Profile = function() {
        function a() {}
        return a.prototype.enable = function() {
            this.installJqueryHooks()
            },
        a.prototype.disable = function() {
            this.uninstallJqueryHooks()
            },
        a.prototype.countParentNodes = function(a) {
            var b;
            b = 0;
            while (a = a.parentNode)
                b++;
            return b
        },
        a.prototype.computeNodesStats = function() {
            var a,
            b,
            c,
            d,
            e,
            f,
            g;
            e = 0,
            b = 0,
            d = document.getElementsByTagName("*");
            for (f = 0, g = d.length; f < g; f++)
                c = d[f],
            a = this.countParentNodes(c),
            e += a,
            a > b && (b = a);
            return {
                total: d.length,
                maxDepth: b,
                averageDepth: e / d.length
            }
        },
        a.prototype.computeByteSize = function(a) {
            var b,
            c,
            d,
            e;
            b = 0;
            for (d = 0, e = a.length; 0 <= e ? d < e: d > e; 0 <= e ? d++:d--)
                c = a.charCodeAt(d),
            c <= 127 ? b += 1: c <= 2047 ? b += 2: c <= 65535 ? b += 3: b += 4;
            return b
        },
        a.prototype.computeSerializedDomSize = function() {
            return this.computeByteSize(document.body.innerHTML)
            },
        a.prototype.findScripts = function() {
            return document.getElementsByTagName("script")
            },
        a.prototype.findStylesheetLinks = function() {
            var a,
            b,
            c,
            d,
            e;
            d = document.getElementsByTagName("link"),
            e = [];
            for (b = 0, c = d.length; b < c; b++)
                a = d[b],
            a.rel === "stylesheet" && e.push(a);
            return e
        },
        a.prototype.inlineEventAttrs = ["onmouseover", "onmouseout", "onmousedown", "onmouseup", "onclick", "ondblclick", "onmousemove", "onload", "onerror", "onbeforeunload", "onfocus", "onblur", "ontouchstart", "ontouchend", "ontouchmove"],
        a.prototype.hasInlineScript = function(a) {
            var b,
            c,
            d,
            e;
            if (a.href && a.href.indexOf("javascript:") === 0)
                return ! 0;
            e = this.inlineEventAttrs;
            for (c = 0, d = e.length; c < d; c++) {
                b = e[c];
                if (a.getAttribute(b))
                    return ! 0
            }
            return ! 1
        },
        a.prototype.findInlineScripts = function() {
            var a,
            b,
            c,
            d,
            e;
            d = document.getElementsByTagName("*"),
            e = [];
            for (b = 0, c = d.length; b < c; b++)
                a = d[b],
            this.hasInlineScript(a) && e.push(a);
            return e
        },
        a.prototype.findInlineStyles = function() {
            var a,
            b,
            c,
            d,
            e;
            d = document.getElementsByTagName("*"),
            e = [];
            for (b = 0, c = d.length; b < c; b++)
                a = d[b],
            a.style.cssText.length > 0 && e.push(a);
            return e
        },
        a.prototype.findGlobals = function() {
            var a,
            b,
            c,
            d,
            e;
            d = {};
            for (c in window)
                d[c] = !0;
            a = document.createElement("iframe"),
            a.style.display = "none",
            a.src = "about:blank",
            document.body.appendChild(a);
            for (c in a.contentWindow)
                delete d[c];
            document.body.removeChild(a),
            e = [];
            for (b in d)
                e.push(b);
            return e
        },
        a.prototype.findJqueryEventHandlers = function() {
            var a,
            b,
            c,
            d,
            e,
            f,
            g,
            h,
            i,
            j,
            k,
            l,
            m,
            n;
            f = document.getElementsByTagName("*"),
            a = {},
            m = $(document).data("events");
            for (d in m) {
                c = m[d],
                a[d] == null && (a[d] = []);
                for (g = 0, j = c.length; g < j; g++)
                    b = c[g],
                a[d].push(b)
                }
            for (h = 0, k = f.length; h < k; h++) {
                e = f[h],
                n = $(e).data("events");
                for (d in n) {
                    c = n[d],
                    a[d] == null && (a[d] = []);
                    for (i = 0, l = c.length; i < l; i++)
                        b = c[i],
                    a[d].push(b)
                    }
            }
            return a
        },
        a.prototype.installJqueryHooks = function() {
            var a,
            b,
            c,
            d,
            e,
            f,
            g,
            h,
            i = this;
            this.jqueryReadyTotal = 0,
            this.jqueryFindTotal = 0,
            this.jqueryFindCalls = {},
            this.jqueryMatchTotal = 0,
            this.jqueryMatchCalls = {},
            this.oldJqueryReady = jQuery.ready,
            this.oldJqueryFnReady = jQuery.fn.ready,
            this.oldJqueryFind = jQuery.find,
            this.oldJqueryMatches = jQuery.find.matches,
            this.oldJqueryMatchesSelector = jQuery.find.matchesSelector,
            e = function() {
                return i.jqueryReadyTotal++,
                i.oldJqueryReady.apply(i, arguments)
                },
            b = function() {
                return i.jqueryReadyTotal++,
                i.oldJqueryFnReady.apply(i, arguments)
                },
            a = function(a) {
                var b;
                return (b = i.jqueryFindCalls)[a] == null && (b[a] = 0),
                i.jqueryFindCalls[a]++,
                i.jqueryFindTotal++,
                i.oldJqueryFind.apply(i, arguments)
                },
            c = function(a) {
                var b;
                return (b = i.jqueryMatchCalls)[a] == null && (b[a] = 0),
                i.jqueryMatchCalls[a]++,
                i.jqueryMatchTotal++,
                i.oldJqueryMatches.apply(i, arguments)
                },
            d = function(a, b) {
                var c;
                return (c = i.jqueryMatchCalls)[b] == null && (c[b] = 0),
                i.jqueryMatchCalls[b]++,
                i.jqueryMatchTotal++,
                i.oldJqueryMatchesSelector.apply(i, arguments)
                },
            h = this.oldJqueryFind;
            for (f in h)
                g = h[f],
            a[f] = g;
            jQuery.ready = e,
            jQuery.fn.ready = b,
            jQuery.find = a,
            jQuery.find.matches = c,
            jQuery.find.matchesSelector = d
        },
        a.prototype.uninstallJqueryHooks = function() {
            jQuery.ready = this.oldJqueryReady,
            jQuery.fn.ready = this.oldJqueryFnReady,
            jQuery.find = this.oldJqueryFind,
            jQuery.find.matches = this.oldJqueryMatches,
            jQuery.find.matchesSelector = this.oldJqueryMatchesSelector
        },
        a.prototype.sendReport = function(a) {
            var b,
            c,
            d,
            e;
            d = "profile." + a,
            c = this.computeNodesStats(),
            $stats.gauge("" + d + ".dom.nodes", c.total),
            $stats.gauge("" + d + ".dom.max-depth", c.maxDepth),
            $stats.gauge("" + d + ".dom.average-depth", c.averageDepth),
            $stats.gauge("" + d + ".dom.serialized-size", this.computeSerializedDomSize()),
            $stats.gauge("" + d + ".handlers.ready", this.jqueryReadyTotal),
            e = this.findJqueryEventHandlers();
            for (a in e)
                b = e[a],
            $stats.gauge("" + d + ".handlers." + a, b.length);
            $stats.gauge("" + d + ".script-tags", this.findScripts().length),
            $stats.gauge("" + d + ".stylesheet-links", this.findStylesheetLinks().length),
            $stats.gauge("" + d + ".inline-scripts", this.findInlineScripts().length),
            $stats.gauge("" + d + ".inline-styles", this.findInlineStyles().length),
            $stats.gauge("" + d + ".globals", this.findGlobals().length),
            $stats.gauge("" + d + ".jquery.find", this.jqueryFindTotal),
            $stats.gauge("" + d + ".jquery.match", this.jqueryMatchTotal)
            },
        a
    } (),
    GitHub.profile = new GitHub.Profile,
    window.$profile = GitHub.profile;
    if (a = location.search.match(/profile=(\w+)/))
        $(function() {
        return setTimeout(function() {
            return GitHub.profile.sendReport(a[1])
            }, 0)
        }),
    GitHub.profile.enable()
    }.call(this),
window.Modernizr = function(a, b, c) {
    function C(a) {
        j.cssText = a
    }
    function D(a, b) {
        return C(n.join(a + ";") + (b || ""))
        }
    function E(a, b) {
        return typeof a === b
    }
    function F(a, b) {
        return !! ~ ("" + a).indexOf(b)
        }
    function G(a, b) {
        for (var d in a)
            if (j[a[d]] !== c)
            return b == "pfx" ? a[d] : !0;
        return ! 1
    }
    function H(a, b) {
        for (var d in a)
            if (b[a[d]] !== c)
            return a[d];
        return ! 1
    }
    function I(a, b) {
        var c = a.charAt(0).toUpperCase() + a.substr(1),
        d = (a + " " + p.join(c + " ") + c).split(" ");
        return E(b, "object") ? (d = (a + " " + q.join(c + " ") + c).split(" "), H(d, b)) : G(d, b)
        }
    function K() {
        e.input = function(c) {
            for (var d = 0, e = c.length; d < e; d++)
                u[c[d]] = c[d] in k;
            return u.list && (u.list = !!b.createElement("datalist") && !!a.HTMLDataListElement),
            u
        } ("autocomplete autofocus list placeholder max min multiple pattern required step".split(" ")),
        e.inputtypes = function(a) {
            for (var d = 0, e, f, h, i = a.length; d < i; d++)
                k.setAttribute("type", f = a[d]),
            e = k.type !== "text",
            e && (k.value = l, k.style.cssText = "position:absolute;visibility:hidden;", /^range$/.test(f) && k.style.WebkitAppearance !== c ? (g.appendChild(k), h = b.defaultView, e = h.getComputedStyle && h.getComputedStyle(k, null).WebkitAppearance !== "textfield" && k.offsetHeight !== 0, g.removeChild(k)) : /^(search|tel)$/.test(f) || (/^(url|email)$/.test(f) ? e = k.checkValidity && k.checkValidity() === !1: /^color$/.test(f) ? (g.appendChild(k), g.offsetWidth, e = k.value != l, g.removeChild(k)) : e = k.value != l)),
            t[a[d]] = !!e;
            return t
        } ("search tel url email datetime date month week time datetime-local number range color".split(" "))
        }
    var d = "2.1pre",
    e = {},
    f = !0,
    g = b.documentElement,
    h = "modernizr",
    i = b.createElement(h),
    j = i.style,
    k = b.createElement("input"),
    l = ":)",
    m = {}.toString,
    n = " -webkit- -moz- -o- -ms- -khtml- ".split(" "),
    o = "Webkit Moz O ms Khtml",
    p = o.split(" "),
    q = o.toLowerCase().split(" "),
    r = {
        svg: "http://www.w3.org/2000/svg"
    },
    s = {},
    t = {},
    u = {},
    v = [],
    w,
    x = function(a, c, d, e) {
        var f,
        i,
        j,
        k = b.createElement("div"),
        l = b.body,
        m = l ? l: b.createElement("body");
        if (parseInt(d, 10))
            while (d--)
            j = b.createElement("div"),
        j.id = e ? e[d] : h + (d + 1),
        k.appendChild(j);
        return f = ["&#173;", "<style>", a, "</style>"].join(""),
        k.id = h,
        m.innerHTML += f,
        m.appendChild(k),
        g.appendChild(m),
        i = c(k, a),
        l ? k.parentNode.removeChild(k) : m.parentNode.removeChild(m),
        !!i
    },
    y = function(b) {
        var c = a.matchMedia || a.msMatchMedia;
        if (c)
            return c(b).matches;
        var d;
        return x("@media " + b + " { #" + h + " { position: absolute; } }", function(b) {
            d = (a.getComputedStyle ? getComputedStyle(b, null) : b.currentStyle)["position"] == "absolute"
        }),
        d
    },
    z = function() {
        function d(d, e) {
            e = e || b.createElement(a[d] || "div"),
            d = "on" + d;
            var f = d in e;
            return f || (e.setAttribute || (e = b.createElement("div")), e.setAttribute && e.removeAttribute && (e.setAttribute(d, ""), f = E(e[d], "function"), E(e[d], "undefined") || (e[d] = c), e.removeAttribute(d))),
            e = null,
            f
        }
        var a = {
            select: "input",
            change: "input",
            submit: "form",
            reset: "form",
            error: "img",
            load: "img",
            abort: "img"
        };
        return d
    } (),
    A = {}.hasOwnProperty,
    B; ! E(A, "undefined") && !E(A.call, "undefined") ? B = function(a, b) {
        return A.call(a, b)
        }: B = function(a, b) {
        return b in a && E(a.constructor.prototype[b], "undefined")
        };
    var J = function(c, d) {
        var f = c.join(""),
        g = d.length;
        x(f, function(c, d) {
            var f = b.styleSheets[b.styleSheets.length - 1],
            h = f ? f.cssRules && f.cssRules[0] ? f.cssRules[0].cssText: f.cssText || "": "",
            i = c.childNodes,
            j = {};
            while (g--)
                j[i[g].id] = i[g];
            e.touch = "ontouchstart" in a || a.DocumentTouch && b instanceof DocumentTouch || (j.touch && j.touch.offsetTop) === 9,
            e.csstransforms3d = (j.csstransforms3d && j.csstransforms3d.offsetLeft) === 9,
            e.generatedcontent = (j.generatedcontent && j.generatedcontent.offsetHeight) >= 1,
            e.fontface = /src/i.test(h) && h.indexOf(d.split(" ")[0]) === 0
        }, g, d)
        } (['@font-face {font-family:"font";src:url("https://")}', ["@media (", n.join("touch-enabled),("), h, ")", "{#touch{top:9px;position:absolute}}"].join(""), ["@media (", n.join("transform-3d),("), h, ")", "{#csstransforms3d{left:9px;position:absolute}}"].join(""), ['#generatedcontent:after{content:"', l, '";visibility:hidden}'].join("")], ["fontface", "touch", "csstransforms3d", "generatedcontent"]);
    s.flexbox = function() {
        return I("flexOrder")
        },
    s["flexbox-legacy"] = function() {
        return I("boxDirection")
        },
    s.canvas = function() {
        var a = b.createElement("canvas");
        return !! a.getContext && !!a.getContext("2d")
        },
    s.canvastext = function() {
        return !! e.canvas && !!E(b.createElement("canvas").getContext("2d").fillText, "function")
        },
    s.webgl = function() {
        try {
            var d = b.createElement("canvas"),
            e;
            e = !(!a.WebGLRenderingContext || !d.getContext("experimental-webgl") && !d.getContext("webgl")),
            d = c
        } catch(f) {
            e = !1
        }
        return e
    },
    s.touch = function() {
        return e.touch
    },
    s.geolocation = function() {
        return !! navigator.geolocation
    },
    s.postmessage = function() {
        return !! a.postMessage
    },
    s.websqldatabase = function() {
        return !! a.openDatabase
    },
    s.indexedDB = function() {
        return !! I("indexedDB", a)
        },
    s.hashchange = function() {
        return z("hashchange", a) && (b.documentMode === c || b.documentMode > 7)
        },
    s.history = function() {
        return !! a.history && !!history.pushState
    },
    s.draganddrop = function() {
        var a = b.createElement("div");
        return "draggable" in a || "ondragstart" in a && "ondrop" in a
    },
    s.websockets = function() {
        for (var b = -1, c = p.length;++b < c;)
            if (a[p[b] + "WebSocket"])
            return ! 0;
        return "WebSocket" in a
    },
    s.rgba = function() {
        return C("background-color:rgba(150,255,150,.5)"),
        F(j.backgroundColor, "rgba")
        },
    s.hsla = function() {
        return C("background-color:hsla(120,40%,100%,.5)"),
        F(j.backgroundColor, "rgba") || F(j.backgroundColor, "hsla")
        },
    s.multiplebgs = function() {
        return C("background:url(https://),url(https://),red url(https://)"),
        /(url\s*\(.*?){3}/.test(j.background)
        },
    s.backgroundsize = function() {
        return I("backgroundSize")
        },
    s.borderimage = function() {
        return I("borderImage")
        },
    s.borderradius = function() {
        return I("borderRadius")
        },
    s.boxshadow = function() {
        return I("boxShadow")
        },
    s.textshadow = function() {
        return b.createElement("div").style.textShadow === ""
    },
    s.opacity = function() {
        return D("opacity:.55"),
        /^0.55$/.test(j.opacity)
        },
    s.cssanimations = function() {
        return I("animationName")
        },
    s.csscolumns = function() {
        return I("columnCount")
        },
    s.cssgradients = function() {
        var a = "background-image:",
        b = "gradient(linear,left top,right bottom,from(#9f9),to(white));",
        c = "linear-gradient(left top,#9f9, white);";
        return C((a + "-webkit- ".split(" ").join(b + a) + n.join(c + a)).slice(0, -a.length)),
        F(j.backgroundImage, "gradient")
        },
    s.cssreflections = function() {
        return I("boxReflect")
        },
    s.csstransforms = function() {
        return !! I("transform")
        },
    s.csstransforms3d = function() {
        var a = !!I("perspective");
        return a && "webkitPerspective" in g.style && (a = e.csstransforms3d),
        a
    },
    s.csstransitions = function() {
        return I("transition")
        },
    s.fontface = function() {
        return e.fontface
    },
    s.generatedcontent = function() {
        return e.generatedcontent
    },
    s.video = function() {
        var a = b.createElement("video"),
        c = !1;
        try {
            if (c = !!a.canPlayType)
                c = new Boolean(c),
            c.ogg = a.canPlayType('video/ogg; codecs="theora"').replace(/^no$/, ""),
            c.h264 = a.canPlayType('video/mp4; codecs="avc1.42E01E"').replace(/^no$/, ""),
            c.webm = a.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/, "")
            } catch(d) {}
        return c
    },
    s.audio = function() {
        var a = b.createElement("audio"),
        c = !1;
        try {
            if (c = !!a.canPlayType)
                c = new Boolean(c),
            c.ogg = a.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ""),
            c.mp3 = a.canPlayType("audio/mpeg;").replace(/^no$/, ""),
            c.wav = a.canPlayType('audio/wav; codecs="1"').replace(/^no$/, ""),
            c.m4a = (a.canPlayType("audio/x-m4a;") || a.canPlayType("audio/aac;")).replace(/^no$/, "")
            } catch(d) {}
        return c
    },
    s.localstorage = function() {
        try {
            return localStorage.setItem(h, h),
            localStorage.removeItem(h),
            !0
        } catch(a) {
            return ! 1
        }
    },
    s.sessionstorage = function() {
        try {
            return sessionStorage.setItem(h, h),
            sessionStorage.removeItem(h),
            !0
        } catch(a) {
            return ! 1
        }
    },
    s.webworkers = function() {
        return !! a.Worker
    },
    s.applicationcache = function() {
        return !! a.applicationCache
    },
    s.svg = function() {
        return !! b.createElementNS && !!b.createElementNS(r.svg, "svg").createSVGRect
    },
    s.inlinesvg = function() {
        var a = b.createElement("div");
        return a.innerHTML = "<svg/>",
        (a.firstChild && a.firstChild.namespaceURI) == r.svg
    },
    s.smil = function() {
        return !! b.createElementNS && /SVGAnimate/.test(m.call(b.createElementNS(r.svg, "animate")))
        },
    s.svgclippaths = function() {
        return !! b.createElementNS && /SVGClipPath/.test(m.call(b.createElementNS(r.svg, "clipPath")))
        };
    for (var L in s)
        B(s, L) && (w = L.toLowerCase(), e[w] = s[L](), v.push((e[w] ? "": "no-") + w));
    return e.input || K(),
    e.addTest = function(a, b) {
        if (typeof a == "object")
            for (var d in a)
            B(a, d) && e.addTest(d, a[d]);
        else {
            a = a.toLowerCase();
            if (e[a] !== c)
                return e;
            b = typeof b == "function" ? b() : b,
            g.className += " " + (b ? "": "no-") + a,
            e[a] = b
        }
        return e
    },
    C(""),
    i = k = null,
    a.attachEvent && function() {
        var a = b.createElement("div");
        return a.innerHTML = "<elem></elem>",
        a.childNodes.length !== 1
    } () && function(a, b) {
        function t(a) {
            var b = -1;
            while (++b < g)
                a.createElement(f[b])
            }
        a.iepp = a.iepp || {};
        var d = a.iepp,
        e = d.html5elements || "abbr|article|aside|audio|canvas|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|subline|summary|time|video",
        f = e.split("|"),
        g = f.length,
        h = new RegExp("(^|\\s)(" + e + ")", "gi"),
        i = new RegExp("<(/*)(" + e + ")", "gi"),
        j = /^\s*[\{\}]\s*$/,
        k = new RegExp("(^|[^\\n]*?\\s)(" + e + ")([^\\n]*)({[\\n\\w\\W]*?})", "gi"),
        l = /@media +(?![Print|All])[^{]+\{([^{}]+\{[^{}]+\})+[^}]+\}/g,
        m = b.createDocumentFragment(),
        n = b.documentElement,
        o = b.getElementsByTagName("script")[0].parentNode,
        p = b.createElement("body"),
        q = b.createElement("style"),
        r = /print|all/,
        s;
        d.getCSS = function(a, b) {
            try {
                if (a + "" === c)
                    return ""
            } catch(e) {
                return ""
            }
            var f = -1,
            g = a.length,
            h,
            i,
            j = [];
            while (++f < g) {
                h = a[f];
                if (h.disabled)
                    continue;
                b = h.media || b,
                r.test(b) && (i = h.cssText, b != "print" && (i = i.replace(l, "")), j.push(d.getCSS(h.imports, b), i)),
                b = "all"
            }
            return j.join("")
            },
        d.parseCSS = function(a) {
            var b = [],
            c;
            while ((c = k.exec(a)) != null)
                b.push(((j.exec(c[1]) ? "\n": c[1]) + c[2] + c[3]).replace(h, "$1.iepp-$2") + c[4]);
            return b.join("\n")
            },
        d.writeHTML = function() {
            var a = -1;
            s = s || b.body;
            while (++a < g) {
                var c = b.getElementsByTagName(f[a]),
                d = c.length,
                e = -1;
                while (++e < d)
                    c[e].className.indexOf("iepp-") < 0 && (c[e].className += " iepp-" + f[a])
                }
            m.appendChild(s),
            n.appendChild(p),
            p.className = s.className,
            p.id = s.id,
            p.innerHTML = s.innerHTML.replace(i, "<$1font")
            },
        d._beforePrint = function() {
            if (d.disablePP)
                return;
            q.styleSheet.cssText = d.parseCSS(d.getCSS(b.styleSheets, "all")),
            d.writeHTML()
            },
        d.restoreHTML = function() {
            if (d.disablePP)
                return;
            p.swapNode(s)
            },
        d._afterPrint = function() {
            d.restoreHTML(),
            q.styleSheet.cssText = ""
        },
        t(b),
        t(m);
        if (d.disablePP)
            return;
        o.insertBefore(q, o.firstChild),
        q.media = "print",
        q.className = "iepp-printshim",
        a.attachEvent("onbeforeprint", d._beforePrint),
        a.attachEvent("onafterprint", d._afterPrint)
        } (a, b),
    e._version = d,
    e._prefixes = n,
    e._domPrefixes = p,
    e.mq = y,
    e.hasEvent = z,
    e.testProp = function(a) {
        return G([a])
        },
    e.testAllProps = I,
    e.testStyles = x,
    e.prefixed = function(a, b) {
        return b ? I(a, b) : I(a, "pfx")
        },
    g.className = g.className.replace(/(^|\s)no-js(\s|$)/, "$1$2") + (f ? " js " + v.join(" ") : ""),
    e
} (this, this.document),
function() {
    $.ajaxSetup && $.ajaxSetup({
        beforeSend: function(a, b) {
            var c,
            d;
            if (!b.global)
                return;
            return c = b.context || document,
            d = $.Event("ajaxBeforeSend"),
            $(c).trigger(d, [a, b]),
            d.isDefaultPrevented() ? !1: d.result
        }
    })
    }.call(this),
function() {
    $(document).bind("ajaxBeforeSend", function(a, b, c) {
        if (!c.dataType)
            return b.setRequestHeader("Accept", "*/*;q=0.5, " + c.accepts.script)
        })
    }.call(this),
function() {
    $(document).delegate("a[data-confirm]", "click", function(a) {
        var b;
        if (b = $(this).attr("data-confirm"))
            if (!confirm(b))
            return a.stopImmediatePropagation(),
        !1
    })
    }.call(this),
function() {
    var a;
    $(document).bind("ajaxBeforeSend", function(a, b, c) {
        var d;
        if (c.crossDomain)
            return;
        if (c.type === "GET")
            return;
        if (d = $('meta[name="csrf-token"]').attr("content"))
            return b.setRequestHeader("X-CSRF-Token", d)
        }),
    $(document).delegate("form", "submit", function(b) {
        var c,
        d,
        e,
        f;
        c = $(this);
        if (c.is("form[data-remote]"))
            return;
        if (c.attr("method").toUpperCase() === "GET")
            return;
        if (!a(c.attr("action")))
            return;
        e = $('meta[name="csrf-param"]').attr("content"),
        f = $('meta[name="csrf-token"]').attr("content"),
        e != null && f != null && (c.find("input[name=" + e + "]")[0] || (d = document.createElement("input"), d.setAttribute("type", "hidden"), d.setAttribute("name", e), d.setAttribute("value", f), c.prepend(d)))
        }),
    a = function(a) {
        var b,
        c;
        return b = document.createElement("a"),
        b.href = a,
        c = b.href.split("/", 3).join("/"),
        location.href.indexOf(c) === 0
    }
}.call(this),
function() {
    $(document).delegate("form", "submit", function() {
        var a,
        b,
        c,
        d,
        e,
        f,
        g,
        h,
        i;
        h = $(this).find("input[type=submit][data-disable-with]");
        for (d = 0, f = h.length; d < f; d++)
            b = h[d],
        b = $(b),
        b.attr("data-enable-with", b.val() || "Submit"),
        (c = b.attr("data-disable-with")) && b.val(c),
        b[0].disabled = !0;
        i = $(this).find("button[type=submit][data-disable-with]");
        for (e = 0, g = i.length; e < g; e++)
            a = i[e],
        a = $(a),
        a.attr("data-enable-with", a.html() || ""),
        (c = a.attr("data-disable-with")) && a.html(c),
        a[0].disabled = !0
    }),
    $(document).delegate("form", "ajaxComplete", function() {
        var a,
        b,
        c,
        d,
        e,
        f,
        g,
        h;
        g = $(this).find("input[type=submit][data-enable-with]");
        for (c = 0, e = g.length; c < e; c++)
            b = g[c],
        $(b).val($(b).attr("data-enable-with")),
        b.disabled = !1;
        h = $(this).find("button[type=submit][data-enable-with]");
        for (d = 0, f = h.length; d < f; d++)
            a = h[d],
        $(a).html($(a).attr("data-enable-with")),
        a.disabled = !1
    })
    }.call(this),
function() {
    $(document).delegate("a[data-method]", "click", function(a) {
        var b,
        c,
        d,
        e;
        b = $(this);
        if (b.is("a[data-remote]"))
            return;
        e = b.attr("data-method").toLowerCase();
        if (e === "get")
            return;
        return c = document.createElement("form"),
        c.method = "POST",
        c.action = b.attr("href"),
        c.style.display = "none",
        e !== "post" && (d = document.createElement("input"), d.setAttribute("type", "hidden"), d.setAttribute("name", "_method"), d.setAttribute("value", e), c.appendChild(d)),
        document.body.appendChild(c),
        $(c).submit(),
        a.preventDefault(),
        !1
    })
    }.call(this),
function() {
    $(document).delegate("a[data-remote]", "click", function(a) {
        var b,
        c,
        d,
        e,
        f;
        c = $(this),
        d = {},
        d.context = this;
        if (e = c.attr("data-method"))
            d.type = e;
        if (f = c.attr("href"))
            d.url = f;
        if (b = c.attr("data-type"))
            d.dataType = b;
        return $.ajax(d),
        a.preventDefault(),
        !1
    }),
    $(document).delegate("form[data-remote]", "submit", function(a) {
        var b,
        c,
        d,
        e,
        f,
        g;
        d = $(this),
        e = {},
        e.context = this;
        if (f = d.attr("method"))
            e.type = f;
        if (g = d.attr("action"))
            e.url = g;
        if (b = d.serializeArray())
            e.data = b;
        if (c = d.attr("data-type"))
            e.dataType = c;
        return $.ajax(e),
        a.preventDefault(),
        !1
    })
    }.call(this),
function() {
    var a;
    a = "form[data-remote] input[type=submit],\nform[data-remote] button[type=submit],\nform[data-remote] button:not([type]),\nform[data-remote-submit] input[type=submit],\nform[data-remote-submit] button[type=submit],\nform[data-remote-submit] button:not([type])",
    $(document).delegate(a, "click", function() {
        var a,
        b,
        c,
        d,
        e,
        f;
        e = $(this),
        b = e.closest("form"),
        c = b.find(".js-submit-button-value"),
        (d = e.attr("name")) ? (a = e.is("input[type=submit]") ? "Submit": "", f = e.val() || a, c[0] ? (c.attr("name", d), c.attr("value", f)) : (c = document.createElement("input"), c.setAttribute("type", "hidden"), c.setAttribute("name", d), c.setAttribute("value", f), c.setAttribute("class", "js-submit-button-value"), b.prepend(c))) : c.remove()
        })
    }.call(this),
function(a) {
    function b(b, c, d) {
        d = f(c, d);
        var e = b.currentTarget;
        if (e.tagName.toUpperCase() !== "A")
            throw "$.fn.pjax or $.pjax.click requires an anchor element";
        if (b.which > 1 || b.metaKey)
            return;
        if (location.protocol !== e.protocol || location.host !== e.host)
            return;
        if (e.hash && e.href.replace(e.hash, "") === location.href.replace(location.hash, ""))
            return;
        var g = {
            url: e.href,
            container: a(e).attr("data-pjax"),
            target: e,
            clickedElement: a(e),
            fragment: null
        };
        return a.pjax(a.extend({}, g, d)),
        b.preventDefault(),
        !1
    }
    function c(a) {
        return a.replace(/\?_pjax=true&?/, "?").replace(/_pjax=true&?/, "").replace(/[\?&]$/, "")
        }
    function d(a) {
        var b = document.createElement("a");
        return b.href = a,
        b
    }
    function f(b, c) {
        return b && c ? c.container = b: a.isPlainObject(b) ? c = b: c = {
            container: b
        },
        c.container && (c.container = g(c.container)),
        c
    }
    function g(b) {
        b = a(b);
        if (!b.length)
            throw "no pjax container for " + b.selector;
        if (b.selector !== "" && b.context === document)
            return b;
        if (b.attr("id"))
            return a("#" + b.attr("id"));
        throw "cant get selector for pjax container!"
    }
    a.fn.pjax = function(a, c) {
        return this.live("click", function(d) {
            return b(d, a, c)
            })
        };
    var e = a.pjax = function(b) {
        function o(b, c) {
            var d = a.Event(b, {
                relatedTarget: f
            });
            return n.trigger(d, c),
            !d.isDefaultPrevented()
            }
        b = a.extend(!0, {}, a.ajaxSettings, e.defaults, b),
        a.isFunction(b.url) && (b.url = b.url());
        var f = b.target; ! f && b.clickedElement && (f = b.clickedElement[0]);
        var h = b.url,
        i = d(h).hash,
        j = b.beforeSend,
        k = b.complete,
        l = b.success,
        m = b.error,
        n = b.context = g(b.container),
        p;
        b.beforeSend = function(a, d) {
            h = c(d.url),
            d.timeout > 0 && (p = setTimeout(function() {
                o("pjax:timeout", [a, b]) && a.abort("timeout")
                }, d.timeout), d.timeout = 0),
            a.setRequestHeader("X-PJAX", "true");
            var e;
            if (j) {
                e = j.apply(this, arguments);
                if (e === !1)
                    return ! 1
            }
            if (!o("pjax:beforeSend", [a, d]))
                return ! 1;
            o("pjax:start", [a, b]),
            o("start.pjax", [a, b])
            },
        b.complete = function(a, c) {
            p && clearTimeout(p),
            k && k.apply(this, arguments),
            o("pjax:complete", [a, c, b]),
            o("pjax:end", [a, b]),
            o("end.pjax", [a, b])
            },
        b.error = function(a, d, e) {
            var f = a.getResponseHeader("X-PJAX-URL");
            f && (h = c(f)),
            m && m.apply(this, arguments);
            var g = o("pjax:error", [a, d, e, b]);
            d !== "abort" && g && (window.location = h)
            },
        b.success = function(d, f, g) {
            var j = g.getResponseHeader("X-PJAX-URL");
            j && (h = c(j));
            var k,
            m = document.title;
            if (b.fragment) {
                var n = a("<html>").html(d),
                p = n.find(b.fragment);
                if (!p.length)
                    return window.location = h;
                this.html(p.contents()),
                k = n.find("title").text() || p.attr("title") || p.data("title")
                } else {
                if (!a.trim(d) || /<html/i.test(d))
                    return window.location = h;
                this.html(d),
                k = this.find("title").remove().text()
                }
            k && (document.title = a.trim(k));
            var q = {
                url: h,
                pjax: this.selector,
                fragment: b.fragment,
                timeout: b.timeout
            };
            b.replace ? (e.active = !0, window.history.replaceState(q, document.title, h)) : b.push && (e.active || (window.history.replaceState(a.extend({}, q, {
                url: null
            }), m), e.active = !0), window.history.pushState(q, document.title, h)),
            (b.replace || b.push) && window._gaq && _gaq.push(["_trackPageview"]),
            i !== "" && (window.location.href = i),
            l && l.apply(this, arguments),
            o("pjax:success", [d, f, g, b])
            };
        var q = e.xhr;
        return q && q.readyState < 4 && (q.onreadystatechange = a.noop, q.abort()),
        e.options = b,
        e.xhr = a.ajax(b),
        a(document).trigger("pjax", [e.xhr, b]),
        e.xhr
    };
    e.defaults = {
        timeout: 650,
        push: !0,
        replace: !1,
        data: {
            _pjax: !0
        },
        type: "GET",
        dataType: "html"
    },
    e.click = b;
    var h = "state" in window.history,
    i = location.href;
    a(window).bind("popstate", function(b) {
        var c = !h && location.href == i;
        h = !0;
        if (c)
            return;
        var d = b.state;
        if (d && d.pjax) {
            var e = d.pjax;
            a(e + "").length ? a.pjax({
                url: d.url || location.href,
                fragment: d.fragment,
                container: e,
                push: !1,
                timeout: d.timeout
            }) : window.location = location.href
        }
    }),
    a.inArray("state", a.event.props) < 0 && a.event.props.push("state"),
    a.support.pjax = window.history && window.history.pushState && window.history.replaceState && !navigator.userAgent.match(/((iPod|iPhone|iPad).+\bOS\s+[1-4]|WebApps\/.+CFNetwork)/),
    a.support.pjax || (a.pjax = function(b) {
        var c = a.isFunction(b.url) ? b.url() : b.url,
        d = b.type ? b.type.toUpperCase() : "GET",
        e = a("<form>", {
            method: d === "GET" ? "GET": "POST",
            action: c,
            style: "display:none"
        });
        d !== "GET" && d !== "POST" && e.append(a("<input>", {
            type: "hidden",
            name: "_method",
            value: d.toLowerCase()
            }));
        var f = b.data;
        if (typeof f == "string")
            a.each(f.split("&"), function(b, c) {
            var d = c.split("=");
            e.append(a("<input>", {
                type: "hidden",
                name: d[0],
                value: d[1]
                }))
            });
        else if (typeof f == "object")
            for (key in f)
            e.append(a("<input>", {
            type: "hidden",
            name: key,
            value: f[key]
            }));
        a(document.body).append(e),
        e.submit()
        }, a.pjax.click = a.noop, a.fn.pjax = function() {
        return this
    })
    } (jQuery),
function() {
    $.fn.fire = function(a) {
        var b,
        c,
        d,
        e,
        f,
        g;
        if (b = arguments[1])
            $.isPlainObject(b) ? f = b: $.isArray(b) ? c = b: $.isFunction(b) && (d = b);
        if (b = arguments[2])
            $.isArray(b) ? c = b: $.isFunction(b) && (d = b); (b = arguments[3]) && $.isFunction(b) && (d = b),
        e = this[0],
        f == null && (f = {}),
        f.cancelable == null && (f.cancelable = !!d),
        f.bubbles == null && (f.bubbles = !0),
        c == null && (c = []),
        g = function() {
            var b;
            return b = $.Event(a, f),
            $.event.trigger(b, c, e, !b.bubbles),
            d && !b.isDefaultPrevented() && d.call(e, b),
            b
        };
        if (!f.async)
            return g();
        delete f.async,
        setTimeout(g, 0)
        }
}.call(this),
function() {
    var a,
    b,
    c = function(a, b) {
        return function() {
            return a.apply(b, arguments)
            }
    },
    d = Array.prototype.indexOf || function(a) {
        for (var b = 0, c = this.length; b < c; b++)
            if (b in this && this[b] === a)
            return b;
        return - 1
    };
    a = function() {
        function a() {
            this.onClose = c(this.onClose, this),
            this.onContainerClick = c(this.onContainerClick, this),
            this.onKeyDown = c(this.onKeyDown, this),
            this.onClick = c(this.onClick, this),
            $(document).on("click", ".js-menu-container", this.onContainerClick)
            }
        return a.prototype.activate = function(a) {
            var b = this;
            this.activeContainer && this.deactivate(this.activeContainer),
            $(a).fire("menu:activate", function() {
                return $(document).on("keydown.menu", b.onKeyDown),
                $(document).on("click.menu", b.onClick),
                $(a).on("click.menu", ".js-menu-close", b.onClose),
                b.activeContainer = a,
                $(document.body).addClass("menu-active"),
                $(a).addClass("active"),
                $(a).fire("menu:activated", {
                    async: !0
                })
                })
            },
        a.prototype.deactivate = function(a) {
            var b = this;
            $(a).fire("menu:deactivate", function() {
                return $(document).off("keydown.menu", b.onKeyDown),
                $(document).off("click.menu", b.onClick),
                $(a).off("click.menu", ".js-menu-close", b.onClose),
                b.activeContainer = null,
                $(document.body).removeClass("menu-active"),
                $(a).removeClass("active"),
                $(a).fire("menu:deactivated", {
                    async: !0
                })
                })
            },
        a.prototype.onClick = function(a) {
            if (!this.activeContainer)
                return;
            if (!$(a.target).closest(this.activeContainer)[0])
                return this.deactivate(this.activeContainer)
            },
        a.prototype.onKeyDown = function(a) {
            var b;
            if (!this.activeContainer)
                return;
            if (a.keyCode === 27)
                return (b = this.activeContainer, d.call($(document.activeElement).parents(), b) >= 0) && document.activeElement.blur(),
            this.deactivate(this.activeContainer)
            },
        a.prototype.onContainerClick = function(a) {
            var b,
            c,
            d;
            b = a.currentTarget;
            if (d = $(a.target).closest(".js-menu-target")[0])
                return b === this.activeContainer ? this.deactivate(b) : this.activate(b);
            if (! (c = $(a.target).closest(".js-menu-content")[0]))
                return this.deactivate(b)
            },
        a.prototype.onClose = function(a) {
            return this.deactivate($(a.target).closest(".js-menu-container")[0]),
            !1
        },
        a
    } (),
    b = new a,
    $.fn.menu = function(a) {
        var c,
        d,
        e = this;
        return c = $(this).closest(".js-menu-container")[0],
        d = {
            activate: function() {
                return b.activate(c)
                },
            deactivate: function() {
                return b.deactivate(c)
                }
        },
        typeof d[a] == "function" ? d[a]() : void 0
    }
}.call(this),
function() {
    $(document).ready(function() {
        return $(document.body).pageUpdate()
        }),
    $(document).on("pjax:end", function(a) {
        return $(a.target).pageUpdate()
        }),
    $.pageUpdate = function(a) {
        return $(window).pageUpdate(a)
        },
    $.fn.pageUpdate = function(a) {
        return a ? (this.on("pageUpdate", function(b) {
            return a.apply(b.target, arguments)
            }), this) : this.trigger("pageUpdate")
        }
}.call(this),
function(a, b) {
    function r(a) {
        this._d = a
    }
    function s(a, b) {
        var c = a + "";
        while (c.length < b)
            c = "0" + c;
        return c
    }
    function t(b, c, d, e) {
        var f = typeof c == "string",
        g = f ? {}: c,
        h,
        i,
        j,
        k;
        return f && e && (g[c] = +e),
        h = (g.ms || g.milliseconds || 0) + (g.s || g.seconds || 0) * 1e3 + (g.m || g.minutes || 0) * 6e4 + (g.h || g.hours || 0) * 36e5,
        i = (g.d || g.days || 0) + (g.w || g.weeks || 0) * 7,
        j = (g.M || g.months || 0) + (g.y || g.years || 0) * 12,
        h && b.setTime( + b + h * d),
        i && b.setDate(b.getDate() + i * d),
        j && (k = b.getDate(), b.setDate(1), b.setMonth(b.getMonth() + j * d), b.setDate(Math.min((new a(b.getFullYear(), b.getMonth() + 1, 0)).getDate(), k))),
        b
    }
    function u(a) {
        return Object.prototype.toString.call(a) === "[object Array]"
    }
    function v(b) {
        return new a(b[0], b[1] || 0, b[2] || 1, b[3] || 0, b[4] || 0, b[5] || 0, b[6] || 0)
        }
    function w(b, d) {
        function u(d) {
            var e,
            j;
            switch (d) {
            case "M":
                return f + 1;
            case "Mo":
                return f + 1 + q(f + 1);
            case "MM":
                return s(f + 1, 2);
            case "MMM":
                return c.monthsShort[f];
            case "MMMM":
                return c.months[f];
            case "D":
                return g;
            case "Do":
                return g + q(g);
            case "DD":
                return s(g, 2);
            case "DDD":
                return e = new a(h, f, g),
                j = new a(h, 0, 1),
                ~~ ((e - j) / 864e5 + 1.5);
            case "DDDo":
                return e = u("DDD"),
                e + q(e);
            case "DDDD":
                return s(u("DDD"), 3);
            case "d":
                return i;
            case "do":
                return i + q(i);
            case "ddd":
                return c.weekdaysShort[i];
            case "dddd":
                return c.weekdays[i];
            case "w":
                return e = new a(h, f, g - i + 5),
                j = new a(e.getFullYear(), 0, 4),
                ~~ ((e - j) / 864e5 / 7 + 1.5);
            case "wo":
                return e = u("w"),
                e + q(e);
            case "ww":
                return s(u("w"), 2);
            case "YY":
                return s(h % 100, 2);
            case "YYYY":
                return h;
            case "a":
                return m > 11 ? t.pm: t.am;
            case "A":
                return m > 11 ? t.PM: t.AM;
            case "H":
                return m;
            case "HH":
                return s(m, 2);
            case "h":
                return m % 12 || 12;
            case "hh":
                return s(m % 12 || 12, 2);
            case "m":
                return n;
            case "mm":
                return s(n, 2);
            case "s":
                return o;
            case "ss":
                return s(o, 2);
            case "zz":
            case "z":
                return (b.toString().match(l) || [""])[0].replace(k, "");
            case "Z":
                return (p > 0 ? "+": "-") + s(~~ (Math.abs(p) / 60), 2) + ":" + s(~~ (Math.abs(p) % 60), 2);
            case "ZZ":
                return (p > 0 ? "+": "-") + s(~~ (10 * Math.abs(p) / 6), 4);
            case "L":
            case "LL":
            case "LLL":
            case "LLLL":
            case "LT":
                return w(b, c.longDateFormat[d]);
            default:
                return d.replace(/(^\[)|(\\)|\]$/g, "")
                }
        }
        var e = new r(b),
        f = e.month(),
        g = e.date(),
        h = e.year(),
        i = e.day(),
        m = e.hours(),
        n = e.minutes(),
        o = e.seconds(),
        p = -e.zone(),
        q = c.ordinal,
        t = c.meridiem;
        return d.replace(j, u)
        }
    function x(b, d) {
        function p(a, b) {
            var d;
            switch (a) {
            case "M":
            case "MM":
                e[1] = ~~b - 1;
                break;
            case "MMM":
            case "MMMM":
                for (d = 0; d < 12; d++)
                    if (c.monthsParse[d].test(b)) {
                    e[1] = d;
                    break
                }
                break;
            case "D":
            case "DD":
            case "DDD":
            case "DDDD":
                e[2] = ~~b;
                break;
            case "YY":
                b = ~~b,
                e[0] = b + (b > 70 ? 1900: 2e3);
                break;
            case "YYYY":
                e[0] = ~~Math.abs(b);
                break;
            case "a":
            case "A":
                l = b.toLowerCase() === "pm";
                break;
            case "H":
            case "HH":
            case "h":
            case "hh":
                e[3] = ~~b;
                break;
            case "m":
            case "mm":
                e[4] = ~~b;
                break;
            case "s":
            case "ss":
                e[5] = ~~b;
                break;
            case "Z":
            case "ZZ":
                h = !0,
                d = (b || "").match(o),
                d && d[1] && (f = ~~d[1]),
                d && d[2] && (g = ~~d[2]),
                d && d[0] === "+" && (f = -f, g = -g)
                }
        }
        var e = [0, 0, 1, 0, 0, 0, 0],
        f = 0,
        g = 0,
        h = !1,
        i = b.match(n),
        j = d.match(m),
        k,
        l;
        for (k = 0; k < j.length; k++)
            p(j[k], i[k]);
        return l && e[3] < 12 && (e[3] += 12),
        l === !1 && e[3] === 12 && (e[3] = 0),
        e[3] += f,
        e[4] += g,
        h ? new a(a.UTC.apply({}, e)) : v(e)
        }
    function y(a, b) {
        var c = Math.min(a.length, b.length),
        d = Math.abs(a.length - b.length),
        e = 0,
        f;
        for (f = 0; f < c; f++)~~a[f] !== ~~b[f] && e++;
        return e + d
    }
    function z(a, b) {
        var c,
        d = a.match(n),
        e = [],
        f = 99,
        g,
        h,
        i;
        for (g = 0; g < b.length; g++)
            h = x(a, b[g]),
        i = y(d, w(h, b[g]).match(n)),
        i < f && (f = i, c = h);
        return c
    }
    function A(a, b, d) {
        var e = c.relativeTime[a];
        return typeof e == "function" ? e(b || 1, !!d, a) : e.replace(/%d/i, b || 1)
        }
    function B(a, b) {
        var c = d(Math.abs(a) / 1e3),
        e = d(c / 60),
        f = d(e / 60),
        g = d(f / 24),
        h = d(g / 365),
        i = c < 45 && ["s", c] || e === 1 && ["m"] || e < 45 && ["mm", e] || f === 1 && ["h"] || f < 22 && ["hh", f] || g === 1 && ["d"] || g <= 25 && ["dd", g] || g <= 45 && ["M"] || g < 345 && ["MM", d(g / 30)] || h === 1 && ["y"] || ["yy", h];
        return i[2] = b,
        A.apply({}, i)
        }
    function C(a, b) {
        c.fn[a] = function(a) {
            return a != null ? (this._d["set" + b](a), this) : this._d["get" + b]()
            }
    }
    var c,
    d = Math.round,
    e = {},
    f = typeof module != "undefined",
    g = "months|monthsShort|monthsParse|weekdays|weekdaysShort|longDateFormat|calendar|relativeTime|ordinal|meridiem".split("|"),
    h,
    i = /^\/?Date\((\d+)/i,
    j = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|dddd?|do?|w[o|w]?|YYYY|YY|a|A|hh?|HH?|mm?|ss?|zz?|ZZ?|LT|LL?L?L?)/g,
    k = /[^A-Z]/g,
    l = /\([A-Za-z ]+\)|:[0-9]{2} [A-Z]{3} /g,
    m = /(\\)?(MM?M?M?|dd?d?d|DD?D?D?|YYYY|YY|a|A|hh?|HH?|mm?|ss?|ZZ?|T)/g,
    n = /(\\)?([0-9]+|([a-zA-Z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+|([\+\-]\d\d:?\d\d))/gi,
    o = /([\+\-]|\d\d)/gi,
    p = "1.4.0",
    q = "Month|Date|Hours|Minutes|Seconds|Milliseconds".split("|");
    c = function(c, d) {
        if (c === null)
            return null;
        var e,
        f;
        return c && c._d instanceof a ? e = new a( + c._d) : d ? u(d) ? e = z(c, d) : e = x(c, d) : (f = i.exec(c), e = c === b ? new a: f ? new a( + f[1]) : c instanceof a ? c: u(c) ? v(c) : new a(c)),
        new r(e)
        },
    c.version = p,
    c.lang = function(a, b) {
        var d,
        h,
        i,
        j = [];
        if (b) {
            for (d = 0; d < 12; d++)
                j[d] = new RegExp("^" + b.months[d] + "|^" + b.monthsShort[d].replace(".", ""), "i");
            b.monthsParse = b.monthsParse || j,
            e[a] = b
        }
        if (e[a])
            for (d = 0; d < g.length; d++)
            h = g[d],
        c[h] = e[a][h] || c[h];
        else
            f && (i = require("./lang/" + a), c.lang(a, i))
        },
    c.lang("en", {
        months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
        monthsShort: "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
        weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
        weekdaysShort: "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
        longDateFormat: {
            LT: "h:mm A",
            L: "MM/DD/YYYY",
            LL: "MMMM D YYYY",
            LLL: "MMMM D YYYY LT",
            LLLL: "dddd, MMMM D YYYY LT"
        },
        meridiem: {
            AM: "AM",
            am: "am",
            PM: "PM",
            pm: "pm"
        },
        calendar: {
            sameDay: "[Today at] LT",
            nextDay: "[Tomorrow at] LT",
            nextWeek: "dddd [at] LT",
            lastDay: "[Yesterday at] LT",
            lastWeek: "[last] dddd [at] LT",
            sameElse: "L"
        },
        relativeTime: {
            future: "in %s",
            past: "%s ago",
            s: "a few seconds",
            m: "a minute",
            mm: "%d minutes",
            h: "an hour",
            hh: "%d hours",
            d: "a day",
            dd: "%d days",
            M: "a month",
            MM: "%d months",
            y: "a year",
            yy: "%d years"
        },
        ordinal: function(a) {
            var b = a % 10;
            return~~ (a % 100 / 10) === 1 ? "th": b === 1 ? "st": b === 2 ? "nd": b === 3 ? "rd": "th"
        }
    }),
    c.fn = r.prototype = {
        clone: function() {
            return c(this)
            },
        valueOf: function() {
            return + this._d
        },
        "native": function() {
            return this._d
        },
        toString: function() {
            return this._d.toString()
            },
        toDate: function() {
            return this._d
        },
        format: function(a) {
            return w(this._d, a)
            },
        add: function(a, b) {
            return this._d = t(this._d, a, 1, b),
            this
        },
        subtract: function(a, b) {
            return this._d = t(this._d, a, -1, b),
            this
        },
        diff: function(a, b, e) {
            var f = c(a),
            g = (this.zone() - f.zone()) * 6e4,
            h = this._d - f._d - g,
            i = this.year() - f.year(),
            j = this.month() - f.month(),
            k = this.date() - f.date(),
            l;
            return b === "months" ? l = i * 12 + j + k / 30: b === "years" ? l = i + j / 12: l = b === "seconds" ? h / 1e3: b === "minutes" ? h / 6e4: b === "hours" ? h / 36e5: b === "days" ? h / 864e5: b === "weeks" ? h / 6048e5: h,
            e ? l: d(l)
            },
        from: function(a, b) {
            var d = this.diff(a),
            e = c.relativeTime,
            f = B(d, b);
            return b ? f: (d <= 0 ? e.past: e.future).replace(/%s/i, f)
            },
        fromNow: function(a) {
            return this.from(c(), a)
            },
        calendar: function() {
            var a = this.diff(c().sod(), "days", !0),
            b = c.calendar,
            d = b.sameElse,
            e = a < -6 ? d: a < -1 ? b.lastWeek: a < 0 ? b.lastDay: a < 1 ? b.sameDay: a < 2 ? b.nextDay: a < 7 ? b.nextWeek: d;
            return this.format(typeof e == "function" ? e.apply(this) : e)
            },
        isLeapYear: function() {
            var a = this.year();
            return a % 4 === 0 && a % 100 !== 0 || a % 400 === 0
        },
        isDST: function() {
            return this.zone() < c([this.year()]).zone() || this.zone() < c([this.year(), 5]).zone()
            },
        day: function(a) {
            var b = this._d.getDay();
            return a == null ? b: this.add({
                d: a - b
            })
            },
        sod: function() {
            return this.clone().hours(0).minutes(0).seconds(0).milliseconds(0)
            },
        eod: function() {
            return this.sod().add({
                d: 1,
                ms: -1
            })
            }
    };
    for (h = 0; h < q.length; h++)
        C(q[h].toLowerCase(), q[h]);
    C("year", "FullYear"),
    c.fn.zone = function() {
        return this._d.getTimezoneOffset()
        },
    f && (module.exports = c),
    typeof window != "undefined" && (window.moment = c),
    typeof define == "function" && define.amd && define("moment", [], function() {
        return c
    })
    } (Date),
function() {
    var a;
    a = function(a) {
        var b,
        c,
        d,
        e,
        f,
        g,
        h;
        a == null && (a = document),
        g = $(a).find("time.js-relative-date"),
        h = [];
        for (e = 0, f = g.length; e < f; e++)
            c = g[e],
        (b = moment($(c).attr("datetime"), "YYYY-MM-DDTHH:mm:ssZ")) ? (d = b.fromNow(), d === "a few seconds ago" && (d = "just now"), h.push($(c).text(d))) : h.push(void 0);
        return h
    },
    $.pageUpdate(function(b) {
        return a(this)
        }),
    setInterval(a, 6e4)
    }.call(this),
function() {
    GitHub.commafy = function(a) {
        return a.toString().replace(/(^|[^\w.])(\d{4,})/g, function(a, b, c) {
            return b + c.replace(/\d(?=(?:\d\d\d)+(?!\d))/g, "$&,")
            })
        }
}.call(this),
function() {
    if (window.CanvasRenderingContext2D && CanvasRenderingContext2D.prototype.getImageData) {
        var a = {
            destX: 0,
            destY: 0,
            sourceX: 0,
            sourceY: 0,
            width: "auto",
            height: "auto"
        };
        CanvasRenderingContext2D.prototype.blendOnto = function(b, c, d) {
            var e = {};
            for (var f in a)
                a.hasOwnProperty(f) && (e[f] = d && d[f] || a[f]);
            e.width == "auto" && (e.width = this.canvas.width),
            e.height == "auto" && (e.height = this.canvas.height),
            e.width = Math.min(e.width, this.canvas.width - e.sourceX, b.canvas.width - e.destX),
            e.height = Math.min(e.height, this.canvas.height - e.sourceY, b.canvas.height - e.destY);
            var g = this.getImageData(e.sourceX, e.sourceY, e.width, e.height),
            h = b.getImageData(e.destX, e.destY, e.width, e.height),
            i = g.data,
            j = h.data,
            k,
            l,
            m = j.length,
            n,
            o,
            p,
            q,
            r,
            s,
            t,
            u;
            for (var v = 0; v < m; v += 4) {
                k = i[v + 3] / 255,
                l = j[v + 3] / 255,
                t = k + l - k * l,
                j[v + 3] = t * 255,
                n = i[v] / 255 * k,
                q = j[v] / 255 * l,
                o = i[v + 1] / 255 * k,
                r = j[v + 1] / 255 * l,
                p = i[v + 2] / 255 * k,
                s = j[v + 2] / 255 * l,
                u = 255 / t;
                switch (c) {
                case "normal":
                case "src-over":
                    j[v] = (n + q - q * k) * u,
                    j[v + 1] = (o + r - r * k) * u,
                    j[v + 2] = (p + s - s * k) * u;
                    break;
                case "screen":
                    j[v] = (n + q - n * q) * u,
                    j[v + 1] = (o + r - o * r) * u,
                    j[v + 2] = (p + s - p * s) * u;
                    break;
                case "multiply":
                    j[v] = (n * q + n * (1 - l) + q * (1 - k)) * u,
                    j[v + 1] = (o * r + o * (1 - l) + r * (1 - k)) * u,
                    j[v + 2] = (p * s + p * (1 - l) + s * (1 - k)) * u;
                    break;
                case "difference":
                    j[v] = (n + q - 2 * Math.min(n * l, q * k)) * u,
                    j[v + 1] = (o + r - 2 * Math.min(o * l, r * k)) * u,
                    j[v + 2] = (p + s - 2 * Math.min(p * l, s * k)) * u;
                    break;
                case "src-in":
                    t = k * l,
                    u = 255 / t,
                    j[v + 3] = t * 255,
                    j[v] = n * l * u,
                    j[v + 1] = o * l * u,
                    j[v + 2] = p * l * u;
                    break;
                case "plus":
                case "add":
                    t = Math.min(1, k + l),
                    j[v + 3] = t * 255,
                    u = 255 / t,
                    j[v] = Math.min(n + q, 1) * u,
                    j[v + 1] = Math.min(o + r, 1) * u,
                    j[v + 2] = Math.min(p + s, 1) * u;
                    break;
                case "overlay":
                    j[v] = q <= .5 ? 2 * i[v] * q / l: 255 - (2 - 2 * q / l) * (255 - i[v]),
                    j[v + 1] = r <= .5 ? 2 * i[v + 1] * r / l: 255 - (2 - 2 * r / l) * (255 - i[v + 1]),
                    j[v + 2] = s <= .5 ? 2 * i[v + 2] * s / l: 255 - (2 - 2 * s / l) * (255 - i[v + 2]);
                    break;
                case "hardlight":
                    j[v] = n <= .5 ? 2 * j[v] * n / l: 255 - (2 - 2 * n / k) * (255 - j[v]),
                    j[v + 1] = o <= .5 ? 2 * j[v + 1] * o / l: 255 - (2 - 2 * o / k) * (255 - j[v + 1]),
                    j[v + 2] = p <= .5 ? 2 * j[v + 2] * p / l: 255 - (2 - 2 * p / k) * (255 - j[v + 2]);
                    break;
                case "colordodge":
                case "dodge":
                    i[v] == 255 && q == 0 ? j[v] = 255: j[v] = Math.min(255, j[v] / (255 - i[v])) * u,
                    i[v + 1] == 255 && r == 0 ? j[v + 1] = 255: j[v + 1] = Math.min(255, j[v + 1] / (255 - i[v + 1])) * u,
                    i[v + 2] == 255 && s == 0 ? j[v + 2] = 255: j[v + 2] = Math.min(255, j[v + 2] / (255 - i[v + 2])) * u;
                    break;
                case "colorburn":
                case "burn":
                    i[v] == 0 && q == 0 ? j[v] = 0: j[v] = (1 - Math.min(1, (1 - q) / n)) * u,
                    i[v + 1] == 0 && r == 0 ? j[v + 1] = 0: j[v + 1] = (1 - Math.min(1, (1 - r) / o)) * u,
                    i[v + 2] == 0 && s == 0 ? j[v + 2] = 0: j[v + 2] = (1 - Math.min(1, (1 - s) / p)) * u;
                    break;
                case "darken":
                case "darker":
                    j[v] = (n > q ? q: n) * u,
                    j[v + 1] = (o > r ? r: o) * u,
                    j[v + 2] = (p > s ? s: p) * u;
                    break;
                case "lighten":
                case "lighter":
                    j[v] = (n < q ? q: n) * u,
                    j[v + 1] = (o < r ? r: o) * u,
                    j[v + 2] = (p < s ? s: p) * u;
                    break;
                case "exclusion":
                    j[v] = (q + n - 2 * q * n) * u,
                    j[v + 1] = (r + o - 2 * r * o) * u,
                    j[v + 2] = (s + p - 2 * s * p) * u;
                    break;
                default:
                    j[v] = j[v + 3] = 255,
                    j[v + 1] = v % 8 == 0 ? 255: 0,
                    j[v + 2] = v % 8 == 0 ? 0: 255
                }
            }
            b.putImageData(h, e.destX, e.destY)
            };
        var b = CanvasRenderingContext2D.prototype.blendOnto.supportedBlendModes = "normal src-over screen multiply difference src-in plus add overlay hardlight colordodge dodge colorburn burn darken lighten exclusion".split(" "),
        c = CanvasRenderingContext2D.prototype.blendOnto.supports = {};
        for (var d = 0, e = b.length; d < e;++d)
            c[b[d]] = !0
    }
} (),
function(a) {
    a.fn.autocompleteField = function(b) {
        var c = a.extend({
            searchVar: "q",
            url: null,
            delay: 250,
            useCache: !1,
            extraParams: {},
            autoClearResults: !0,
            dataType: "html",
            minLength: 1
        }, b);
        return a(this).each(function() {
            function h(e) {
                d && d.readyState < 4 && d.abort();
                if (c.useCache && g[e])
                    b.trigger("autocomplete:finish", g[e]);
                else {
                    var f = {};
                    f[c.searchVar] = e,
                    f = a.extend(!0, c.extraParams, f),
                    b.trigger("autocomplete:beforesend"),
                    d = a.get(c.url, f, function(a) {
                        c.useCache && (g[e] = a),
                        b.val() === e && b.trigger("autocomplete:finish", a)
                        }, c.dataType)
                    }
            }
            function i(a) {
                a.length >= c.minLength ? f != a && (h(a), f = a) : b.trigger("autocomplete:clear")
                }
            var b = a(this),
            d,
            e,
            f,
            g = {};
            c.url != null && (b.attr("autocomplete", "off"), b.keyup(function(a) {
                a.preventDefault(),
                clearTimeout(e),
                e = setTimeout(function() {
                    clearTimeout(e),
                    i(b.val())
                    }, c.delay)
                }), b.blur(function() {
                f = null
            }))
            })
        }
} (jQuery),
function(a) {
    a.fn.autosaveField = function(b) {
        var c = a.extend({}, a.fn.autosaveField.defaults, b);
        return this.each(function() {
            var b = a(this);
            if (b.data("autosaved-init"))
                return;
            var d = b.attr("data-field-type") || ":text",
            e = b.find(d),
            f = b.attr("data-action"),
            g = b.attr("data-name"),
            h = e.val(),
            i = function() {
                b.removeClass("errored"),
                b.removeClass("successful"),
                b.addClass("loading"),
                a.ajax({
                    url: f,
                    type: "POST",
                    data: {
                        _method: c.method,
                        field: g,
                        value: e.val()
                        },
                    success: function() {
                        b.addClass("successful"),
                        h = e.val()
                        },
                    error: function() {
                        b.attr("data-reset-on-error") && e.val(h),
                        b.addClass("errored")
                        },
                    complete: function() {
                        b.removeClass("loading")
                        }
                })
                };
            d == ":text" ? (e.blur(function() {
                a(this).val() != h && i()
                }), e.keyup(function() {
                b.removeClass("successful"),
                b.removeClass("errored")
                })) : d == "input[type=checkbox]" && e.change(function() {
                b.removeClass("successful"),
                b.removeClass("errored"),
                i()
                }),
            b.data("autosaved-init", !0)
            })
        },
    a.fn.autosaveField.defaults = {
        method: "put"
    }
} (jQuery),
function(a) {
    function b(a) {
        var b = Math.floor(a / 1e3),
        c = Math.floor(b / 60);
        return b %= 60,
        b = b < 10 ? "0" + b: b,
        c + ":" + b
    }
    function c(a) {
        var b = 0;
        if (a.offsetParent)
            while (a.offsetParent)
            b += a.offsetLeft,
        a = a.offsetParent;
        else
            a.x && (b += a.x);
        return b
    }
    BaconPlayer = {
        sound: null,
        playing: !1,
        sm2: "/js/soundmanager2.js",
        flashURL: "/flash/",
        playOrPause: function(a) {
            this.initSound(a, function() {
                this.playing ? this.pause() : this.play()
                })
            },
        play: function() {
            if (!this.sound)
                return;
            return this.playing = !0,
            this.sound.play(),
            a(".baconplayer .play, .baconplayer .pause").toggle(),
            "playing"
        },
        pause: function() {
            if (!this.sound)
                return;
            return this.playing = !1,
            this.sound.pause(),
            a(".baconplayer .play, .baconplayer .pause").toggle(),
            "paused"
        },
        initSound: function(b, c) {
            if (!window.soundManager)
                return a.getScript(this.sm2, function() {
                soundManager.url = BaconPlayer.flashURL,
                soundManager.debugMode = !1,
                soundManager.onready(function() {
                    BaconPlayer.initSound(b, c)
                    })
                });
            this.sound = soundManager.createSound({
                id: "baconplayer",
                url: b,
                whileplaying: function() {
                    BaconPlayer.moveProgressBar(this),
                    BaconPlayer.setPositionTiming(this)
                    },
                whileloading: function() {
                    BaconPlayer.moveLoadingBar(this),
                    BaconPlayer.setDurationTiming(this)
                    },
                onload: function() {
                    BaconPlayer.setDurationTiming(this, !0)
                    }
            }),
            c.call(this)
            },
        moveProgressBar: function(b) {
            var c = b.position / b.durationEstimate;
            a(".baconplayer .inner-progress").width(this.progressBar().width() * c)
            },
        moveLoadingBar: function(b) {
            var c = b.bytesLoaded / b.bytesTotal;
            a(".baconplayer .loading-progress").width(this.progressBar().width() * c)
            },
        setPositionTiming: function(c) {
            var d = b(c.position);
            a(".baconplayer .position").text(d)
            },
        setDurationTiming: function(c, d) {
            if (!d && this.durationTimingTimer)
                return;
            this.durationTimingTimer = setTimeout(function() {
                BaconPlayer.setDurationTiming(c),
                BaconPlayer.durationTimingTimer = null
            }, 2e3);
            var e = b(c.durationEstimate);
            a(".baconplayer .duration").text(e)
            },
        progressBar: function() {
            return a(".baconplayer .progress")
            },
        setPosition: function(a) {
            var b = this.progressBar()[0],
            d = this.sound,
            e = parseInt(a.clientX),
            f = Math.floor((e - c(b) - 4) / b.offsetWidth * d.durationEstimate);
            isNaN(f) || (f = Math.min(f, d.duration)),
            isNaN(f) || d.setPosition(f)
            },
        startDrag: function(a) {
            if (this.dragging || !this.sound)
                return;
            this.attachDragHandlers(),
            this.dragging = !0,
            this.pause(),
            this.setPosition(a)
            },
        drag: function(a) {
            this.setPosition(a)
            },
        stopDrag: function(a) {
            this.removeDragHandlers(),
            this.dragging = !1,
            this.setPosition(a),
            this.play()
            },
        attachDragHandlers: function() {
            a(document).bind("mousemove.baconplayer", function(a) {
                BaconPlayer.drag(a)
                }),
            a(document).bind("mouseup.baconplayer", function(a) {
                BaconPlayer.stopDrag(a)
                })
            },
        removeDragHandlers: function() {
            a(document).unbind("mousemove.baconplayer"),
            a(document).unbind("mouseup.baconplayer")
            }
    },
    a(function() {
        a(".baconplayer .play, .baconplayer .pause").click(function() {
            return BaconPlayer.playOrPause(this.href),
            !1
        }),
        a(".baconplayer .progress").mousedown(function(a) {
            BaconPlayer.startDrag(a)
            })
        })
    } (jQuery),
function() {
    var a;
    a = document.documentElement,
    $.browser.webkit ? a.className += " webkit": $.browser.mozilla ? a.className += " mozilla": $.browser.msie ? (a.className += " msie", $.browser.version === "9.0" ? a.className += " ie9": $.browser.version === "8.0" ? a.className += " ie8": $.browser.version === "7.0" && (a.className += " ie7")) : $.browser.opera && (a.className += " opera")
    }.call(this),
function(a) {
    function b(b) {
        var c;
        return b && b.constructor == Array && b.length == 3 ? b: (c = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(b)) ? [parseInt(c[1]), parseInt(c[2]), parseInt(c[3])] : (c = /rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(b)) ? [parseFloat(c[1]) * 2.55, parseFloat(c[2]) * 2.55, parseFloat(c[3]) * 2.55] : (c = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(b)) ? [parseInt(c[1], 16), parseInt(c[2], 16), parseInt(c[3], 16)] : (c = /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(b)) ? [parseInt(c[1] + c[1], 16), parseInt(c[2] + c[2], 16), parseInt(c[3] + c[3], 16)] : d[a.trim(b).toLowerCase()]
        }
    function c(c, d) {
        var e;
        do {
            e = a.curCSS(c, d);
            if (e != "" && e != "transparent" || a.nodeName(c, "body"))
                break;
            d = "backgroundColor"
        }
        while (c = c.parentNode);
        return b(e)
        }
    a.each(["backgroundColor", "borderBottomColor", "borderLeftColor", "borderRightColor", "borderTopColor", "color", "outlineColor"], function(d, e) {
        a.fx.step[e] = function(a) {
            a.state == 0 && (a.start = c(a.elem, e), a.end = b(a.end)),
            a.elem.style[e] = "rgb(" + [Math.max(Math.min(parseInt(a.pos * (a.end[0] - a.start[0]) + a.start[0]), 255), 0), Math.max(Math.min(parseInt(a.pos * (a.end[1] - a.start[1]) + a.start[1]), 255), 0), Math.max(Math.min(parseInt(a.pos * (a.end[2] - a.start[2]) + a.start[2]), 255), 0)].join(",") + ")"
        }
    });
    var d = {
        aqua: [0, 255, 255],
        azure: [240, 255, 255],
        beige: [245, 245, 220],
        black: [0, 0, 0],
        blue: [0, 0, 255],
        brown: [165, 42, 42],
        cyan: [0, 255, 255],
        darkblue: [0, 0, 139],
        darkcyan: [0, 139, 139],
        darkgrey: [169, 169, 169],
        darkgreen: [0, 100, 0],
        darkkhaki: [189, 183, 107],
        darkmagenta: [139, 0, 139],
        darkolivegreen: [85, 107, 47],
        darkorange: [255, 140, 0],
        darkorchid: [153, 50, 204],
        darkred: [139, 0, 0],
        darksalmon: [233, 150, 122],
        darkviolet: [148, 0, 211],
        fuchsia: [255, 0, 255],
        gold: [255, 215, 0],
        green: [0, 128, 0],
        indigo: [75, 0, 130],
        khaki: [240, 230, 140],
        lightblue: [173, 216, 230],
        lightcyan: [224, 255, 255],
        lightgreen: [144, 238, 144],
        lightgrey: [211, 211, 211],
        lightpink: [255, 182, 193],
        lightyellow: [255, 255, 224],
        lime: [0, 255, 0],
        magenta: [255, 0, 255],
        maroon: [128, 0, 0],
        navy: [0, 0, 128],
        olive: [128, 128, 0],
        orange: [255, 165, 0],
        pink: [255, 192, 203],
        purple: [128, 0, 128],
        violet: [128, 0, 128],
        red: [255, 0, 0],
        silver: [192, 192, 192],
        white: [255, 255, 255],
        yellow: [255, 255, 0]
        }
} (jQuery),
jQuery.cookie = function(a, b, c) {
    if (typeof b == "undefined") {
        var i = null;
        if (document.cookie && document.cookie != "") {
            var j = document.cookie.split(";");
            for (var k = 0; k < j.length; k++) {
                var l = jQuery.trim(j[k]);
                if (l.substring(0, a.length + 1) == a + "=") {
                    i = decodeURIComponent(l.substring(a.length + 1));
                    break
                }
            }
        }
        return i
    }
    c = c || {},
    b === null && (b = "", c.expires = -1);
    var d = "";
    if (c.expires && (typeof c.expires == "number" || c.expires.toUTCString)) {
        var e;
        typeof c.expires == "number" ? (e = new Date, e.setTime(e.getTime() + c.expires * 24 * 60 * 60 * 1e3)) : e = c.expires,
        d = "; expires=" + e.toUTCString()
        }
    var f = c.path ? "; path=" + c.path: "",
    g = c.domain ? "; domain=" + c.domain: "",
    h = c.secure ? "; secure": "";
    document.cookie = [a, "=", encodeURIComponent(b), d, f, g, h].join("")
    },
DateInput = function(a) {
    function b(c, d) {
        typeof d != "object" && (d = {}),
        a.extend(this, b.DEFAULT_OPTS, d),
        this.input = a(c),
        this.bindMethodsToObj("show", "hide", "hideIfClickOutside", "keydownHandler", "selectDate"),
        this.build(),
        this.selectDate(),
        this.hide(),
        this.input.data("datePicker", this)
        }
    return b.DEFAULT_OPTS = {
        month_names: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        short_month_names: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        short_day_names: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        start_of_week: 1
    },
    b.prototype = {
        build: function() {
            var b = a('<p class="month_nav"><span class="button prev" title="[Page-Up]">&#171;</span> <span class="month_name"></span> <span class="button next" title="[Page-Down]">&#187;</span></p>');
            this.monthNameSpan = a(".month_name", b),
            a(".prev", b).click(this.bindToObj(function() {
                this.moveMonthBy( - 1)
                })),
            a(".next", b).click(this.bindToObj(function() {
                this.moveMonthBy(1)
                }));
            var c = a('<p class="year_nav"><span class="button prev" title="[Ctrl+Page-Up]">&#171;</span> <span class="year_name"></span> <span class="button next" title="[Ctrl+Page-Down]">&#187;</span></p>');
            this.yearNameSpan = a(".year_name", c),
            a(".prev", c).click(this.bindToObj(function() {
                this.moveMonthBy( - 12)
                })),
            a(".next", c).click(this.bindToObj(function() {
                this.moveMonthBy(12)
                }));
            var d = a('<div class="nav"></div>').append(b, c),
            e = "<table><thead><tr>";
            a(this.adjustDays(this.short_day_names)).each(function() {
                e += "<th>" + this + "</th>"
            }),
            e += "</tr></thead><tbody></tbody></table>",
            this.dateSelector = this.rootLayers = a('<div class="date_selector"></div>').append(d, e).insertAfter(this.input),
            a.browser.msie && a.browser.version < 7 && (this.ieframe = a('<iframe class="date_selector_ieframe" frameborder="0" src="#"></iframe>').insertBefore(this.dateSelector), this.rootLayers = this.rootLayers.add(this.ieframe), a(".button", d).mouseover(function() {
                a(this).addClass("hover")
                }), a(".button", d).mouseout(function() {
                a(this).removeClass("hover")
                })),
            this.tbody = a("tbody", this.dateSelector),
            this.input.change(this.bindToObj(function() {
                this.selectDate()
                })),
            this.selectDate()
            },
        selectMonth: function(b) {
            var c = new Date(b.getFullYear(), b.getMonth(), 1);
            if (!this.currentMonth || this.currentMonth.getFullYear() != c.getFullYear() || this.currentMonth.getMonth() != c.getMonth()) {
                this.currentMonth = c;
                var d = this.rangeStart(b),
                e = this.rangeEnd(b),
                f = this.daysBetween(d, e),
                g = "";
                for (var h = 0; h <= f; h++) {
                    var i = new Date(d.getFullYear(), d.getMonth(), d.getDate() + h, 12, 0);
                    this.isFirstDayOfWeek(i) && (g += "<tr>"),
                    i.getMonth() == b.getMonth() ? g += '<td class="selectable_day" date="' + this.dateToString(i) + '">' + i.getDate() + "</td>": g += '<td class="unselected_month" date="' + this.dateToString(i) + '">' + i.getDate() + "</td>",
                    this.isLastDayOfWeek(i) && (g += "</tr>")
                    }
                this.tbody.empty().append(g),
                this.monthNameSpan.empty().append(this.monthName(b)),
                this.yearNameSpan.empty().append(this.currentMonth.getFullYear()),
                a(".selectable_day", this.tbody).click(this.bindToObj(function(b) {
                    this.changeInput(a(b.target).attr("date"))
                    })),
                a("td[date='" + this.dateToString(new Date) + "']", this.tbody).addClass("today"),
                a("td.selectable_day", this.tbody).mouseover(function() {
                    a(this).addClass("hover")
                    }),
                a("td.selectable_day", this.tbody).mouseout(function() {
                    a(this).removeClass("hover")
                    })
                }
            a(".selected", this.tbody).removeClass("selected"),
            a('td[date="' + this.selectedDateString + '"]', this.tbody).addClass("selected")
            },
        selectDate: function(a) {
            typeof a == "undefined" && (a = this.stringToDate(this.input.val())),
            a || (a = new Date),
            this.selectedDate = a,
            this.selectedDateString = this.dateToString(this.selectedDate),
            this.selectMonth(this.selectedDate)
            },
        changeInput: function(a) {
            this.input.val(a).change(),
            this.hide()
            },
        show: function() {
            this.rootLayers.css("display", "block"),
            a([window, document.body]).click(this.hideIfClickOutside),
            this.input.unbind("focus", this.show),
            this.rootLayers.keydown(this.keydownHandler),
            this.setPosition()
            },
        hide: function() {
            this.rootLayers.css("display", "none"),
            a([window, document.body]).unbind("click", this.hideIfClickOutside),
            this.input.focus(this.show),
            this.rootLayers.unbind("keydown", this.keydownHandler)
            },
        hideIfClickOutside: function(a) {
            a.target != this.input[0] && !this.insideSelector(a) && this.hide()
            },
        insideSelector: function(a) {
            var b = this.dateSelector.position();
            return b.right = b.left + this.dateSelector.outerWidth(),
            b.bottom = b.top + this.dateSelector.outerHeight(),
            a.pageY < b.bottom && a.pageY > b.top && a.pageX < b.right && a.pageX > b.left
        },
        keydownHandler: function(a) {
            switch (a.keyCode) {
            case 9:
            case 27:
                this.hide();
                return;
            case 13:
                this.changeInput(this.selectedDateString);
                break;
            case 33:
                this.moveDateMonthBy(a.ctrlKey ? -12: -1);
                break;
            case 34:
                this.moveDateMonthBy(a.ctrlKey ? 12: 1);
                break;
            case 38:
                this.moveDateBy( - 7);
                break;
            case 40:
                this.moveDateBy(7);
                break;
            case 37:
                this.moveDateBy( - 1);
                break;
            case 39:
                this.moveDateBy(1);
                break;
            default:
                return
            }
            a.preventDefault()
            },
        stringToDate: function(a) {
            var b;
            return (b = a.match(/^(\d{1,2}) ([^\s]+) (\d{4,4})$/)) ? new Date(b[3], this.shortMonthNum(b[2]), b[1], 12, 0) : null
        },
        dateToString: function(a) {
            return a.getDate() + " " + this.short_month_names[a.getMonth()] + " " + a.getFullYear()
            },
        setPosition: function() {
            var a = this.input.offset();
            this.rootLayers.css({
                top: a.top + this.input.outerHeight(),
                left: a.left
            }),
            this.ieframe && this.ieframe.css({
                width: this.dateSelector.outerWidth(),
                height: this.dateSelector.outerHeight()
                })
            },
        moveDateBy: function(a) {
            var b = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), this.selectedDate.getDate() + a);
            this.selectDate(b)
            },
        moveDateMonthBy: function(a) {
            var b = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth() + a, this.selectedDate.getDate());
            b.getMonth() == this.selectedDate.getMonth() + a + 1 && b.setDate(0),
            this.selectDate(b)
            },
        moveMonthBy: function(a) {
            var b = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + a, this.currentMonth.getDate());
            this.selectMonth(b)
            },
        monthName: function(a) {
            return this.month_names[a.getMonth()]
            },
        bindToObj: function(a) {
            var b = this;
            return function() {
                return a.apply(b, arguments)
                }
        },
        bindMethodsToObj: function() {
            for (var a = 0; a < arguments.length; a++)
                this[arguments[a]] = this.bindToObj(this[arguments[a]])
            },
        indexFor: function(a, b) {
            for (var c = 0; c < a.length; c++)
                if (b == a[c])
                return c
        },
        monthNum: function(a) {
            return this.indexFor(this.month_names, a)
            },
        shortMonthNum: function(a) {
            return this.indexFor(this.short_month_names, a)
            },
        shortDayNum: function(a) {
            return this.indexFor(this.short_day_names, a)
            },
        daysBetween: function(a, b) {
            return a = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate()),
            b = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate()),
            (b - a) / 864e5
        },
        changeDayTo: function(a, b, c) {
            var d = c * (Math.abs(b.getDay() - a - c * 7) % 7);
            return new Date(b.getFullYear(), b.getMonth(), b.getDate() + d)
            },
        rangeStart: function(a) {
            return this.changeDayTo(this.start_of_week, new Date(a.getFullYear(), a.getMonth()), -1)
            },
        rangeEnd: function(a) {
            return this.changeDayTo((this.start_of_week - 1) % 7, new Date(a.getFullYear(), a.getMonth() + 1, 0), 1)
            },
        isFirstDayOfWeek: function(a) {
            return a.getDay() == this.start_of_week
        },
        isLastDayOfWeek: function(a) {
            return a.getDay() == (this.start_of_week - 1) % 7
        },
        adjustDays: function(a) {
            var b = [];
            for (var c = 0; c < a.length; c++)
                b[c] = a[(c + this.start_of_week) % 7];
            return b
        }
    },
    a.fn.date_input = function(a) {
        return this.each(function() {
            new b(this, a)
            })
        },
    a.date_input = {
        initialize: function(b) {
            a("input.date_input").date_input(b)
            }
    },
    b
} (jQuery),
jQuery.easing.jswing = jQuery.easing.swing,
jQuery.extend(jQuery.easing, {
    def: "easeOutQuad",
    swing: function(a, b, c, d, e) {
        return jQuery.easing[jQuery.easing.def](a, b, c, d, e)
        },
    easeInQuad: function(a, b, c, d, e) {
        return d * (b /= e) * b + c
    },
    easeOutQuad: function(a, b, c, d, e) {
        return - d * (b /= e) * (b - 2) + c
    },
    easeInOutQuad: function(a, b, c, d, e) {
        return (b /= e / 2) < 1 ? d / 2 * b * b + c: -d / 2 * (--b * (b - 2) - 1) + c
    },
    easeInCubic: function(a, b, c, d, e) {
        return d * (b /= e) * b * b + c
    },
    easeOutCubic: function(a, b, c, d, e) {
        return d * ((b = b / e - 1) * b * b + 1) + c
    },
    easeInOutCubic: function(a, b, c, d, e) {
        return (b /= e / 2) < 1 ? d / 2 * b * b * b + c: d / 2 * ((b -= 2) * b * b + 2) + c
    },
    easeInQuart: function(a, b, c, d, e) {
        return d * (b /= e) * b * b * b + c
    },
    easeOutQuart: function(a, b, c, d, e) {
        return - d * ((b = b / e - 1) * b * b * b - 1) + c
    },
    easeInOutQuart: function(a, b, c, d, e) {
        return (b /= e / 2) < 1 ? d / 2 * b * b * b * b + c: -d / 2 * ((b -= 2) * b * b * b - 2) + c
    },
    easeInQuint: function(a, b, c, d, e) {
        return d * (b /= e) * b * b * b * b + c
    },
    easeOutQuint: function(a, b, c, d, e) {
        return d * ((b = b / e - 1) * b * b * b * b + 1) + c
    },
    easeInOutQuint: function(a, b, c, d, e) {
        return (b /= e / 2) < 1 ? d / 2 * b * b * b * b * b + c: d / 2 * ((b -= 2) * b * b * b * b + 2) + c
    },
    easeInSine: function(a, b, c, d, e) {
        return - d * Math.cos(b / e * (Math.PI / 2)) + d + c
    },
    easeOutSine: function(a, b, c, d, e) {
        return d * Math.sin(b / e * (Math.PI / 2)) + c
    },
    easeInOutSine: function(a, b, c, d, e) {
        return - d / 2 * (Math.cos(Math.PI * b / e) - 1) + c
    },
    easeInExpo: function(a, b, c, d, e) {
        return b == 0 ? c: d * Math.pow(2, 10 * (b / e - 1)) + c
    },
    easeOutExpo: function(a, b, c, d, e) {
        return b == e ? c + d: d * ( - Math.pow(2, -10 * b / e) + 1) + c
    },
    easeInOutExpo: function(a, b, c, d, e) {
        return b == 0 ? c: b == e ? c + d: (b /= e / 2) < 1 ? d / 2 * Math.pow(2, 10 * (b - 1)) + c: d / 2 * ( - Math.pow(2, -10 * --b) + 2) + c
    },
    easeInCirc: function(a, b, c, d, e) {
        return - d * (Math.sqrt(1 - (b /= e) * b) - 1) + c
    },
    easeOutCirc: function(a, b, c, d, e) {
        return d * Math.sqrt(1 - (b = b / e - 1) * b) + c
    },
    easeInOutCirc: function(a, b, c, d, e) {
        return (b /= e / 2) < 1 ? -d / 2 * (Math.sqrt(1 - b * b) - 1) + c: d / 2 * (Math.sqrt(1 - (b -= 2) * b) + 1) + c
    },
    easeInElastic: function(a, b, c, d, e) {
        var f = 1.70158,
        g = 0,
        h = d;
        if (b == 0)
            return c;
        if ((b /= e) == 1)
            return c + d;
        g || (g = e * .3);
        if (h < Math.abs(d)) {
            h = d;
            var f = g / 4
        } else
            var f = g / (2 * Math.PI) * Math.asin(d / h);
        return - (h * Math.pow(2, 10 * (b -= 1)) * Math.sin((b * e - f) * 2 * Math.PI / g)) + c
    },
    easeOutElastic: function(a, b, c, d, e) {
        var f = 1.70158,
        g = 0,
        h = d;
        if (b == 0)
            return c;
        if ((b /= e) == 1)
            return c + d;
        g || (g = e * .3);
        if (h < Math.abs(d)) {
            h = d;
            var f = g / 4
        } else
            var f = g / (2 * Math.PI) * Math.asin(d / h);
        return h * Math.pow(2, -10 * b) * Math.sin((b * e - f) * 2 * Math.PI / g) + d + c
    },
    easeInOutElastic: function(a, b, c, d, e) {
        var f = 1.70158,
        g = 0,
        h = d;
        if (b == 0)
            return c;
        if ((b /= e / 2) == 2)
            return c + d;
        g || (g = e * .3 * 1.5);
        if (h < Math.abs(d)) {
            h = d;
            var f = g / 4
        } else
            var f = g / (2 * Math.PI) * Math.asin(d / h);
        return b < 1 ? -0.5 * h * Math.pow(2, 10 * (b -= 1)) * Math.sin((b * e - f) * 2 * Math.PI / g) + c: h * Math.pow(2, -10 * (b -= 1)) * Math.sin((b * e - f) * 2 * Math.PI / g) * .5 + d + c
    },
    easeInBack: function(a, b, c, d, e, f) {
        return f == undefined && (f = 1.70158),
        d * (b /= e) * b * ((f + 1) * b - f) + c
    },
    easeOutBack: function(a, b, c, d, e, f) {
        return f == undefined && (f = 1.70158),
        d * ((b = b / e - 1) * b * ((f + 1) * b + f) + 1) + c
    },
    easeInOutBack: function(a, b, c, d, e, f) {
        return f == undefined && (f = 1.70158),
        (b /= e / 2) < 1 ? d / 2 * b * b * (((f *= 1.525) + 1) * b - f) + c: d / 2 * ((b -= 2) * b * (((f *= 1.525) + 1) * b + f) + 2) + c
    },
    easeInBounce: function(a, b, c, d, e) {
        return d - jQuery.easing.easeOutBounce(a, e - b, 0, d, e) + c
    },
    easeOutBounce: function(a, b, c, d, e) {
        return (b /= e) < 1 / 2.75 ? d * 7.5625 * b * b + c: b < 2 / 2.75 ? d * (7.5625 * (b -= 1.5 / 2.75) * b + .75) + c: b < 2.5 / 2.75 ? d * (7.5625 * (b -= 2.25 / 2.75) * b + .9375) + c: d * (7.5625 * (b -= 2.625 / 2.75) * b + .984375) + c
    },
    easeInOutBounce: function(a, b, c, d, e) {
        return b < e / 2 ? jQuery.easing.easeInBounce(a, b * 2, 0, d, e) * .5 + c: jQuery.easing.easeOutBounce(a, b * 2 - e, 0, d, e) * .5 + d * .5 + c
    }
}),
function(a) {
    function b(b) {
        if (a.facebox.settings.inited)
            return ! 0;
        a.facebox.settings.inited = !0,
        a(document).trigger("init.facebox"),
        e();
        var c = a.facebox.settings.imageTypes.join("|");
        a.facebox.settings.imageTypesRegexp = new RegExp(".(" + c + ")$", "i"),
        b && a.extend(a.facebox.settings, b),
        a("body").append(a.facebox.settings.faceboxHtml);
        var d = [new Image, new Image];
        d[0].src = a.facebox.settings.closeImage,
        d[1].src = a.facebox.settings.loadingImage,
        a("#facebox").find(".b:first, .bl").each(function() {
            d.push(new Image),
            d.slice( - 1).src = a(this).css("background-image").replace(/url\((.+)\)/, "$1")
            }),
        a("#facebox .close").click(a.facebox.close).append('<img src="' + a.facebox.settings.closeImage + '" class="close_image" title="close">')
        }
    function c() {
        var a,
        b;
        return self.pageYOffset ? (b = self.pageYOffset, a = self.pageXOffset) : document.documentElement && document.documentElement.scrollTop ? (b = document.documentElement.scrollTop, a = document.documentElement.scrollLeft) : document.body && (b = document.body.scrollTop, a = document.body.scrollLeft),
        new Array(a, b)
        }
    function d() {
        var a;
        return self.innerHeight ? a = self.innerHeight: document.documentElement && document.documentElement.clientHeight ? a = document.documentElement.clientHeight: document.body && (a = document.body.clientHeight),
        a
    }
    function e() {
        var b = a.facebox.settings;
        b.loadingImage = b.loading_image || b.loadingImage,
        b.closeImage = b.close_image || b.closeImage,
        b.imageTypes = b.image_types || b.imageTypes,
        b.faceboxHtml = b.facebox_html || b.faceboxHtml
    }
    function f(b, c) {
        if (b.match(/#/)) {
            var d = window.location.href.split("#")[0],
            e = b.replace(d, "");
            if (e == "#")
                return;
            a.facebox.reveal(a(e).html(), c)
            } else
            b.match(a.facebox.settings.imageTypesRegexp) ? g(b, c) : h(b, c)
        }
    function g(b, c) {
        var d = new Image;
        d.onload = function() {
            a.facebox.reveal('<div class="image"><img src="' + d.src + '" /></div>', c)
            },
        d.src = b
    }
    function h(b, c) {
        a.get(b, function(b) {
            a.facebox.reveal(b, c)
            })
        }
    function i() {
        return a.facebox.settings.overlay == 0 || a.facebox.settings.opacity === null
    }
    function j() {
        if (i())
            return;
        return a("#facebox_overlay").length == 0 && a("body").append('<div id="facebox_overlay" class="facebox_hide"></div>'),
        a("#facebox_overlay").hide().addClass("facebox_overlayBG").css("opacity", a.facebox.settings.opacity).click(function() {
            a(document).trigger("close.facebox")
            }).fadeIn(200),
        !1
    }
    function k() {
        if (i())
            return;
        return a("#facebox_overlay").fadeOut(200, function() {
            a("#facebox_overlay").removeClass("facebox_overlayBG"),
            a("#facebox_overlay").addClass("facebox_hide"),
            a("#facebox_overlay").remove()
            }),
        !1
    }
    a.facebox = function(b, c) {
        a.facebox.loading(),
        b.ajax ? h(b.ajax, c) : b.image ? g(b.image, c) : b.div ? f(b.div, c) : a.isFunction(b) ? b.call(a) : a.facebox.reveal(b, c)
        },
    a.extend(a.facebox, {
        settings: {
            opacity: .2,
            overlay: !0,
            loadingImage: "/facebox/loading.gif",
            closeImage: "/facebox/closelabel.png",
            imageTypes: ["png", "jpg", "jpeg", "gif"],
            faceboxHtml: '    <div id="facebox" style="display:none;">       <div class="popup">         <div class="content">         </div>         <a href="#" class="close"></a>       </div>     </div>'
        },
        loading: function() {
            b();
            if (a("#facebox .loading").length == 1)
                return ! 0;
            j(),
            a("#facebox .content").empty().append('<div class="loading"><img src="' + a.facebox.settings.loadingImage + '"/></div>'),
            a("#facebox").show().css({
                top: c()[1] + d() / 10,
                left: a(window).width() / 2 - a("#facebox .popup").outerWidth() / 2
            }),
            a(document).bind("keydown.facebox", function(b) {
                return b.keyCode == 27 && a.facebox.close(),
                !0
            }),
            a(document).trigger("loading.facebox")
            },
        reveal: function(b, c) {
            a(document).trigger("beforeReveal.facebox"),
            c && a("#facebox .content").addClass(c),
            a("#facebox .content").append(b),
            a("#facebox .loading").remove(),
            a("#facebox .popup").children().fadeIn("normal"),
            a("#facebox").css("left", a(window).width() / 2 - a("#facebox .popup").outerWidth() / 2),
            a(document).trigger("reveal.facebox").trigger("afterReveal.facebox")
            },
        close: function() {
            return a(document).trigger("close.facebox"),
            !1
        }
    }),
    a.fn.facebox = function(c) {
        function d() {
            a.facebox.loading(!0);
            var b = this.rel.match(/facebox\[?\.(\w+)\]?/);
            return b && (b = b[1]),
            f(this.href, b),
            !1
        }
        if (a(this).length == 0)
            return;
        return b(c),
        this.bind("click.facebox", d)
        },
    a(document).bind("close.facebox", function() {
        a(document).unbind("keydown.facebox"),
        a("#facebox").fadeOut(function() {
            a("#facebox .content").removeClass().addClass("content"),
            a("#facebox .loading").remove(),
            a(document).trigger("afterClose.facebox")
            }),
        k()
        })
    } (jQuery),
function(a) {
    a.fn.fancyplace = function(b) {
        var c = a.extend({}, a.fn.fancyplace.defaults, b);
        return this.each(function() {
            var b = a(this).hide(),
            c = a("#" + b.attr("for")),
            d = b.attr("data-placeholder-mode") == "sticky";
            d ? (c.keyup(function() {
                a.trim(c.val()) == "" ? b.show() : b.hide()
                }), c.keyup()) : (c.focus(function() {
                b.hide()
                }), c.blur(function() {
                a.trim(c.val()) == "" && b.show()
                }), c.blur())
            })
        },
    a.fn.fancyplace.defaults = {}
} (jQuery),
jQuery.fn.farbtastic = function(a) {
    return $.farbtastic(this, a),
    this
},
jQuery.farbtastic = function(a, b) {
    var a = $(a).get(0);
    return a.farbtastic || (a.farbtastic = new jQuery._farbtastic(a, b))
    },
jQuery._farbtastic = function(a, b) {
    var c = this;
    $(a).html('<div class="farbtastic"><div class="color"></div><div class="wheel"></div><div class="overlay"></div><div class="h-marker marker"></div><div class="sl-marker marker"></div></div>');
    var d = $(".farbtastic", a);
    c.wheel = $(".wheel", a).get(0),
    c.radius = 84,
    c.square = 100,
    c.width = 194,
    navigator.appVersion.match(/MSIE [0-6]\./) && $("*", d).each(function() {
        if (this.currentStyle.backgroundImage != "none") {
            var a = this.currentStyle.backgroundImage;
            a = this.currentStyle.backgroundImage.substring(5, a.length - 2),
            $(this).css({
                backgroundImage: "none",
                filter: "progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true, sizingMethod=crop, src='" + a + "')"
            })
            }
    }),
    c.linkTo = function(a) {
        typeof c.callback == "object" && $(c.callback).unbind("keyup", c.updateValue),
        c.color = null;
        if (typeof a == "function")
            c.callback = a;
        else if (typeof a == "object" || typeof a == "string")
            c.callback = $(a),
        c.callback.bind("keyup", c.updateValue),
        c.callback.get(0).value && c.setColor(c.callback.get(0).value);
        return this
    },
    c.updateValue = function(a) {
        this.value && this.value != c.color && c.setColor(this.value)
        },
    c.setColor = function(a) {
        var b = c.unpack(a);
        return c.color != a && b && (c.color = a, c.rgb = b, c.hsl = c.RGBToHSL(c.rgb), c.updateDisplay()),
        this
    },
    c.setHSL = function(a) {
        return c.hsl = a,
        c.rgb = c.HSLToRGB(a),
        c.color = c.pack(c.rgb),
        c.updateDisplay(),
        this
    },
    c.widgetCoords = function(a) {
        var b,
        d,
        e = a.target || a.srcElement,
        f = c.wheel;
        if (typeof a.offsetX != "undefined") {
            var g = {
                x: a.offsetX,
                y: a.offsetY
            },
            h = e;
            while (h)
                h.mouseX = g.x,
            h.mouseY = g.y,
            g.x += h.offsetLeft,
            g.y += h.offsetTop,
            h = h.offsetParent;
            var h = f,
            i = {
                x: 0,
                y: 0
            };
            while (h) {
                if (typeof h.mouseX != "undefined") {
                    b = h.mouseX - i.x,
                    d = h.mouseY - i.y;
                    break
                }
                i.x += h.offsetLeft,
                i.y += h.offsetTop,
                h = h.offsetParent
            }
            h = e;
            while (h)
                h.mouseX = undefined,
            h.mouseY = undefined,
            h = h.offsetParent
        } else {
            var g = c.absolutePosition(f);
            b = (a.pageX || 0 * (a.clientX + $("html").get(0).scrollLeft)) - g.x,
            d = (a.pageY || 0 * (a.clientY + $("html").get(0).scrollTop)) - g.y
        }
        return {
            x: b - c.width / 2,
            y: d - c.width / 2
        }
    },
    c.mousedown = function(a) {
        document.dragging || ($(document).bind("mousemove", c.mousemove).bind("mouseup", c.mouseup), document.dragging = !0);
        var b = c.widgetCoords(a);
        return c.circleDrag = Math.max(Math.abs(b.x), Math.abs(b.y)) * 2 > c.square,
        c.mousemove(a),
        !1
    },
    c.mousemove = function(a) {
        var b = c.widgetCoords(a);
        if (c.circleDrag) {
            var d = Math.atan2(b.x, -b.y) / 6.28;
            d < 0 && (d += 1),
            c.setHSL([d, c.hsl[1], c.hsl[2]])
            } else {
            var e = Math.max(0, Math.min(1, -(b.x / c.square) + .5)),
            f = Math.max(0, Math.min(1, -(b.y / c.square) + .5));
            c.setHSL([c.hsl[0], e, f])
            }
        return ! 1
    },
    c.mouseup = function() {
        $(document).unbind("mousemove", c.mousemove),
        $(document).unbind("mouseup", c.mouseup),
        document.dragging = !1
    },
    c.updateDisplay = function() {
        var a = c.hsl[0] * 6.28;
        $(".h-marker", d).css({
            left: Math.round(Math.sin(a) * c.radius + c.width / 2) + "px",
            top: Math.round( - Math.cos(a) * c.radius + c.width / 2) + "px"
        }),
        $(".sl-marker", d).css({
            left: Math.round(c.square * (.5 - c.hsl[1]) + c.width / 2) + "px",
            top: Math.round(c.square * (.5 - c.hsl[2]) + c.width / 2) + "px"
        }),
        $(".color", d).css("backgroundColor", c.pack(c.HSLToRGB([c.hsl[0], 1, .5]))),
        typeof c.callback == "object" ? ($(c.callback).css({
            backgroundColor: c.color,
            color: c.hsl[2] > .5 ? "#000": "#fff"
        }), $(c.callback).each(function() {
            this.value && this.value != c.color && (this.value = c.color)
            })) : typeof c.callback == "function" && c.callback.call(c, c.color)
        },
    c.absolutePosition = function(a) {
        var b = {
            x: a.offsetLeft,
            y: a.offsetTop
        };
        if (a.offsetParent) {
            var d = c.absolutePosition(a.offsetParent);
            b.x += d.x,
            b.y += d.y
        }
        return b
    },
    c.pack = function(a) {
        var b = Math.round(a[0] * 255),
        c = Math.round(a[1] * 255),
        d = Math.round(a[2] * 255);
        return "#" + (b < 16 ? "0": "") + b.toString(16) + (c < 16 ? "0": "") + c.toString(16) + (d < 16 ? "0": "") + d.toString(16)
        },
    c.unpack = function(a) {
        if (a.length == 7)
            return [parseInt("0x" + a.substring(1, 3)) / 255, parseInt("0x" + a.substring(3, 5)) / 255, parseInt("0x" + a.substring(5, 7)) / 255];
        if (a.length == 4)
            return [parseInt("0x" + a.substring(1, 2)) / 15, parseInt("0x" + a.substring(2, 3)) / 15, parseInt("0x" + a.substring(3, 4)) / 15]
        },
    c.HSLToRGB = function(a) {
        var b,
        c,
        d,
        e,
        f,
        g = a[0],
        h = a[1],
        i = a[2];
        return c = i <= .5 ? i * (h + 1) : i + h - i * h,
        b = i * 2 - c,
        [this.hueToRGB(b, c, g + .33333), this.hueToRGB(b, c, g), this.hueToRGB(b, c, g - .33333)]
        },
    c.hueToRGB = function(a, b, c) {
        return c = c < 0 ? c + 1: c > 1 ? c - 1: c,
        c * 6 < 1 ? a + (b - a) * c * 6: c * 2 < 1 ? b: c * 3 < 2 ? a + (b - a) * (.66666 - c) * 6: a
    },
    c.RGBToHSL = function(a) {
        var b,
        c,
        d,
        e,
        f,
        g,
        h = a[0],
        i = a[1],
        j = a[2];
        return b = Math.min(h, Math.min(i, j)),
        c = Math.max(h, Math.max(i, j)),
        d = c - b,
        g = (b + c) / 2,
        f = 0,
        g > 0 && g < 1 && (f = d / (g < .5 ? 2 * g: 2 - 2 * g)),
        e = 0,
        d > 0 && (c == h && c != i && (e += (i - j) / d), c == i && c != j && (e += 2 + (j - h) / d), c == j && c != h && (e += 4 + (h - i) / d), e /= 6),
        [e, f, g]
        },
    $("*", d).mousedown(c.mousedown),
    c.setColor("#000000"),
    b && c.linkTo(b)
    },
function($) {
    function clickHandler(a) {
        var b = this.form;
        b.clk = this;
        if (this.type == "image")
            if (a.offsetX != undefined)
            b.clk_x = a.offsetX,
        b.clk_y = a.offsetY;
        else if (typeof $.fn.offset == "function") {
            var c = $(this).offset();
            b.clk_x = a.pageX - c.left,
            b.clk_y = a.pageY - c.top
        } else
            b.clk_x = a.pageX - this.offsetLeft,
        b.clk_y = a.pageY - this.offsetTop;
        setTimeout(function() {
            b.clk = b.clk_x = b.clk_y = null
        }, 10)
        }
    function submitHandler() {
        var a = this.formPluginId,
        b = $.fn.ajaxForm.optionHash[a];
        return $(this).ajaxSubmit(b),
        !1
    }
    $.fn.ajaxSubmit = function(options) {
        function fileUpload() {
            function cb() {
                if (cbInvoked++)
                    return;
                io.detachEvent ? io.detachEvent("onload", cb) : io.removeEventListener("load", cb, !1);
                var ok = !0;
                try {
                    if (timedOut)
                        throw "timeout";
                    var data,
                    doc;
                    doc = io.contentWindow ? io.contentWindow.document: io.contentDocument ? io.contentDocument: io.document,
                    xhr.responseText = doc.body ? doc.body.innerHTML: null,
                    xhr.responseXML = doc.XMLDocument ? doc.XMLDocument: doc;
                    if (opts.dataType == "json" || opts.dataType == "script") {
                        var ta = doc.getElementsByTagName("textarea")[0];
                        data = ta ? ta.value: xhr.responseText,
                        opts.dataType == "json" ? eval("data = " + data) : $.globalEval(data)
                        } else
                        opts.dataType == "xml" ? (data = xhr.responseXML, !data && xhr.responseText != null && (data = toXml(xhr.responseText))) : data = xhr.responseText
                } catch(e) {
                    ok = !1,
                    $.handleError(opts, xhr, "error", e)
                    }
                ok && (opts.success(data, "success"), g && $.event.trigger("ajaxSuccess", [xhr, opts])),
                g && $.event.trigger("ajaxComplete", [xhr, opts]),
                g && !--$.active && $.event.trigger("ajaxStop"),
                opts.complete && opts.complete(xhr, ok ? "success": "error"),
                setTimeout(function() {
                    $io.remove(),
                    xhr.responseXML = null
                }, 100)
                }
            function toXml(a, b) {
                return window.ActiveXObject ? (b = new ActiveXObject("Microsoft.XMLDOM"), b.async = "false", b.loadXML(a)) : b = (new DOMParser).parseFromString(a, "text/xml"),
                b && b.documentElement && b.documentElement.tagName != "parsererror" ? b: null
            }
            var form = $form[0],
            opts = $.extend({}, $.ajaxSettings, options),
            id = "jqFormIO" + $.fn.ajaxSubmit.counter++,
            $io = $('<iframe id="' + id + '" name="' + id + '" />'),
            io = $io[0],
            op8 = $.browser.opera && window.opera.version() < 9;
            if ($.browser.msie || op8)
                io.src = 'javascript:false;document.write("");';
            $io.css({
                position: "absolute",
                top: "-1000px",
                left: "-1000px"
            });
            var xhr = {
                responseText: null,
                responseXML: null,
                status: 0,
                statusText: "n/a",
                getAllResponseHeaders: function() {},
                getResponseHeader: function() {},
                setRequestHeader: function() {}
            },
            g = opts.global;
            g && !($.active++) && $.event.trigger("ajaxStart"),
            g && $.event.trigger("ajaxSend", [xhr, opts]);
            var cbInvoked = 0,
            timedOut = 0;
            setTimeout(function() {
                var a = form.encoding ? "encoding": "enctype",
                b = $form.attr("target"),
                c = $form.attr("action");
                $form.attr({
                    target: id,
                    method: "POST",
                    action: opts.url
                }),
                form[a] = "multipart/form-data",
                opts.timeout && setTimeout(function() {
                    timedOut = !0,
                    cb()
                    }, opts.timeout),
                $io.appendTo("body"),
                io.attachEvent ? io.attachEvent("onload", cb) : io.addEventListener("load", cb, !1),
                form.submit(),
                $form.attr({
                    action: c,
                    target: b
                })
                }, 10)
            }
        typeof options == "function" && (options = {
            success: options
        }),
        options = $.extend({
            url: this.attr("action") || window.location.toString(),
            type: this.attr("method") || "GET"
        }, options || {});
        var veto = {};
        $.event.trigger("form.pre.serialize", [this, options, veto]);
        if (veto.veto)
            return this;
        var a = this.formToArray(options.semantic);
        if (options.data)
            for (var n in options.data)
            a.push({
            name: n,
            value: options.data[n]
            });
        if (options.beforeSubmit && options.beforeSubmit(a, this, options) === !1)
            return this;
        $.event.trigger("form.submit.validate", [a, this, options, veto]);
        if (veto.veto)
            return this;
        var q = $.param(a);
        options.type.toUpperCase() == "GET" ? (options.url += (options.url.indexOf("?") >= 0 ? "&": "?") + q, options.data = null) : options.data = q;
        var $form = this,
        callbacks = [];
        options.resetForm && callbacks.push(function() {
            $form.resetForm()
            }),
        options.clearForm && callbacks.push(function() {
            $form.clearForm()
            });
        if (!options.dataType && options.target) {
            var oldSuccess = options.success || function() {};
            callbacks.push(function(a) {
                this.evalScripts ? $(options.target).attr("innerHTML", a).evalScripts().each(oldSuccess, arguments) : $(options.target).html(a).each(oldSuccess, arguments)
                })
            } else
            options.success && callbacks.push(options.success);
        options.success = function(a, b) {
            for (var c = 0, d = callbacks.length; c < d; c++)
                callbacks[c](a, b, $form)
            };
        var files = $("input:file", this).fieldValue(),
        found = !1;
        for (var j = 0; j < files.length; j++)
            files[j] && (found = !0);
        return options.iframe || found ? $.browser.safari && options.closeKeepAlive ? $.get(options.closeKeepAlive, fileUpload) : fileUpload() : $.ajax(options),
        $.event.trigger("form.submit.notify", [this, options]),
        this
    },
    $.fn.ajaxSubmit.counter = 0,
    $.fn.ajaxForm = function(a) {
        return this.ajaxFormUnbind().submit(submitHandler).each(function() {
            this.formPluginId = $.fn.ajaxForm.counter++,
            $.fn.ajaxForm.optionHash[this.formPluginId] = a,
            $(":submit,input:image", this).click(clickHandler)
            })
        },
    $.fn.ajaxForm.counter = 1,
    $.fn.ajaxForm.optionHash = {},
    $.fn.ajaxFormUnbind = function() {
        return this.unbind("submit", submitHandler),
        this.each(function() {
            $(":submit,input:image", this).unbind("click", clickHandler)
            })
        },
    $.fn.formToArray = function(a) {
        var b = [];
        if (this.length == 0)
            return b;
        var c = this[0],
        d = a ? c.getElementsByTagName("*") : c.elements;
        if (!d)
            return b;
        for (var e = 0, f = d.length; e < f; e++) {
            var g = d[e],
            h = g.name;
            if (!h)
                continue;
            if (a && c.clk && g.type == "image") { ! g.disabled && c.clk == g && b.push({
                    name: h + ".x",
                    value: c.clk_x
                }, {
                    name: h + ".y",
                    value: c.clk_y
                });
                continue
            }
            var i = $.fieldValue(g, !0);
            if (i && i.constructor == Array)
                for (var j = 0, k = i.length; j < k; j++)
                b.push({
                name: h,
                value: i[j]
                });
            else
                i !== null && typeof i != "undefined" && b.push({
                name: h,
                value: i
            })
            }
        if (!a && c.clk) {
            var l = c.getElementsByTagName("input");
            for (var e = 0, f = l.length; e < f; e++) {
                var m = l[e],
                h = m.name;
                h && !m.disabled && m.type == "image" && c.clk == m && b.push({
                    name: h + ".x",
                    value: c.clk_x
                }, {
                    name: h + ".y",
                    value: c.clk_y
                })
                }
        }
        return b
    },
    $.fn.formSerialize = function(a) {
        return $.param(this.formToArray(a))
        },
    $.fn.fieldSerialize = function(a) {
        var b = [];
        return this.each(function() {
            var c = this.name;
            if (!c)
                return;
            var d = $.fieldValue(this, a);
            if (d && d.constructor == Array)
                for (var e = 0, f = d.length; e < f; e++)
                b.push({
                name: c,
                value: d[e]
                });
            else
                d !== null && typeof d != "undefined" && b.push({
                name: this.name,
                value: d
            })
            }),
        $.param(b)
        },
    $.fn.fieldValue = function(a) {
        for (var b = [], c = 0, d = this.length; c < d; c++) {
            var e = this[c],
            f = $.fieldValue(e, a);
            if (f === null || typeof f == "undefined" || f.constructor == Array && !f.length)
                continue;
            f.constructor == Array ? $.merge(b, f) : b.push(f)
            }
        return b
    },
    $.fieldValue = function(a, b) {
        var c = a.name,
        d = a.type,
        e = a.tagName.toLowerCase();
        typeof b == "undefined" && (b = !0);
        if (b && (!c || a.disabled || d == "reset" || d == "button" || (d == "checkbox" || d == "radio") && !a.checked || (d == "submit" || d == "image") && a.form && a.form.clk != a || e == "select" && a.selectedIndex == -1))
            return null;
        if (e == "select") {
            var f = a.selectedIndex;
            if (f < 0)
                return null;
            var g = [],
            h = a.options,
            i = d == "select-one",
            j = i ? f + 1: h.length;
            for (var k = i ? f: 0; k < j; k++) {
                var l = h[k];
                if (l.selected) {
                    var m = $.browser.msie && !l.attributes.value.specified ? l.text: l.value;
                    if (i)
                        return m;
                    g.push(m)
                    }
            }
            return g
        }
        return a.value
    },
    $.fn.clearForm = function() {
        return this.each(function() {
            $("input,select,textarea", this).clearFields()
            })
        },
    $.fn.clearFields = $.fn.clearInputs = function() {
        return this.each(function() {
            var a = this.type,
            b = this.tagName.toLowerCase();
            a == "text" || a == "password" || b == "textarea" ? this.value = "": a == "checkbox" || a == "radio" ? this.checked = !1: b == "select" && (this.selectedIndex = -1)
            })
        },
    $.fn.resetForm = function() {
        return this.each(function() { (typeof this.reset == "function" || typeof this.reset == "object" && !this.reset.nodeType) && this.reset()
            })
        },
    $.fn.enable = function(a) {
        return a == undefined && (a = !0),
        this.each(function() {
            this.disabled = !a
        })
        },
    $.fn.select = function(a) {
        return a == undefined && (a = !0),
        this.each(function() {
            var b = this.type;
            if (b == "checkbox" || b == "radio")
                this.checked = a;
            else if (this.tagName.toLowerCase() == "option") {
                var c = $(this).parent("select");
                a && c[0] && c[0].type == "select-one" && c.find("option").select(!1),
                this.selected = a
            }
        })
        }
} (jQuery),
function(a) {
    a.fn.gfmPreview = function(b) {
        b = b || {};
        var c = a("<div>").attr("class", "gfm-preview").text("Preview goes here"),
        d = this;
        d.after(c);
        var e = !1;
        d.keyup(function() {
            e = !0
        }),
        setInterval(function() {
            if (e) {
                e = !1;
                var b = d.val();
                a.post("/preview", {
                    text: b
                }, function(a) {
                    c.html(a)
                    })
                }
        }, 2e3)
        }
} (jQuery),
function(a) {
    a.fn.gfmPreview = function(b) {
        var c = a.extend({}, a.fn.gfmPreview.defaults, b);
        return this.each(function() {
            var b = !1,
            d = a(this),
            e = a("<div>").attr("class", "gfm-preview").text("Preview goes here"),
            f = c.outputContainer || e;
            c.outputContainer == null && d.after(e);
            var g = !1;
            d.keyup(function() {
                g = !0,
                b || (c.onInit.call(this), b = !0)
                });
            var h = setInterval(function() {
                if (g) {
                    g = !1;
                    var b = d.val();
                    a.post("/preview", {
                        text: b
                    }, function(a) {
                        f.html(a)
                        })
                    }
            }, c.refresh)
            })
        },
    a.fn.gfmPreview.defaults = {
        outputContainer: null,
        refresh: 2e3,
        onInit: function() {}
    }
} (jQuery),
function(a) {
    a.fn.assigneeFilter = function(b) {
        function f(a) {
            c.find(".current").removeClass("current"),
            c.find(":checked").removeAttr("checked"),
            a.addClass("current"),
            a.find(":radio").attr("checked", "checked")
            }
        var c = this,
        d = c.find("li"),
        e = d.map(function() {
            return a(this).text().toLowerCase()
            });
        return c.find(".js-assignee-filter-submit").live("click", function(a) {
            b(a),
            a.preventDefault()
            }),
        c.find(".js-assignee-filter").keydown(function(a) {
            switch (a.which) {
            case 9:
            case 38:
            case 40:
                return ! 1;
            case 13:
                return b(a),
                !1
            }
        }).keyup(function(b) {
            c.find(".selected").removeClass("selected");
            var e = c.find(".current:visible"),
            g = null;
            switch (b.which) {
            case 9:
            case 16:
            case 17:
            case 18:
            case 91:
            case 93:
            case 13:
                return c.find(".current label").trigger("click"),
                !1;
            case 38:
            case 40:
                if (e.length == 0)
                    return f(c.find("li:visible:first")),
                !1;
                return g = b.which == 38 ? e.prevAll(":visible:first") : e.nextAll(":visible:first"),
                g.length && f(g),
                !1
            }
            var h = a.trim(a(this).val().toLowerCase()),
            i = [];
            if (!h)
                return c.find(".current").removeClass("current"),
            d.show();
            d.each(function() {
                var b = a(this).text().score(h);
                a(this).data("score", b),
                b > 0 ? a(this).show() : a(this).hide()
                }),
            d.sort(function(b, c) {
                var d = a(b).data("score"),
                e = a(c).data("score");
                return d > e ? -1: d < e ? 1: 0
            }),
            c.find("ul").append(d),
            f(c.find("li:visible:first"))
            }),
        c
    }
} (jQuery),
function(a) {
    a.fn.cardsSelect = function(b) {
        var c = a.extend({}, a.fn.cardsSelect.defaults, b);
        return this.each(function() {
            var b = a(this),
            c = b.next("dl.form").find("input[type=text]"),
            d = b.find(".card"),
            e = b.find("input[name='billing[type]']"),
            f = function(b) {
                d.each(function() {
                    var c = a(this);
                    c.attr("data-name") == b ? c.removeClass("disabled") : c.addClass("disabled"),
                    e.val(b)
                    })
                };
            c.bind("keyup blur", function() {
                var b = a(this).val();
                b.match(/^5[1-5]/) ? f("master") : b.match(/^4/) ? f("visa") : b.match(/^3(4|7)/) ? f("american_express") : b.match(/^6011/) ? f("discover") : b.match(/^(30[0-5]|36|38)/) ? f("diners_club") : b.match(/^(3|2131|1800)/) ? f("jcb") : (d.removeClass("disabled"), e.val(""))
                }).keyup()
            })
        },
    a.fn.cardsSelect.defaults = {}
} (jQuery),
function(a, b) {
    function c(b) {
        return ! a(b).parents().andSelf().filter(function() {
            return a.curCSS(this, "visibility") === "hidden" || a.expr.filters.hidden(this)
            }).length
    }
    a.ui = a.ui || {},
    a.ui.version || (a.extend(a.ui, {
        version: "1.8.10",
        keyCode: {
            ALT: 18,
            BACKSPACE: 8,
            CAPS_LOCK: 20,
            COMMA: 188,
            COMMAND: 91,
            COMMAND_LEFT: 91,
            COMMAND_RIGHT: 93,
            CONTROL: 17,
            DELETE: 46,
            DOWN: 40,
            END: 35,
            ENTER: 13,
            ESCAPE: 27,
            HOME: 36,
            INSERT: 45,
            LEFT: 37,
            MENU: 93,
            NUMPAD_ADD: 107,
            NUMPAD_DECIMAL: 110,
            NUMPAD_DIVIDE: 111,
            NUMPAD_ENTER: 108,
            NUMPAD_MULTIPLY: 106,
            NUMPAD_SUBTRACT: 109,
            PAGE_DOWN: 34,
            PAGE_UP: 33,
            PERIOD: 190,
            RIGHT: 39,
            SHIFT: 16,
            SPACE: 32,
            TAB: 9,
            UP: 38,
            WINDOWS: 91
        }
    }), a.fn.extend({
        _focus: a.fn.focus,
        focus: function(b, c) {
            return typeof b == "number" ? this.each(function() {
                var d = this;
                setTimeout(function() {
                    a(d).focus(),
                    c && c.call(d)
                    }, b)
                }) : this._focus.apply(this, arguments)
            },
        scrollParent: function() {
            var b;
            return b = a.browser.msie && /(static|relative)/.test(this.css("position")) || /absolute/.test(this.css("position")) ? this.parents().filter(function() {
                return / (relative | absolute | fixed) / .test(a.curCSS(this, "position", 1)) && /(auto|scroll)/.test(a.curCSS(this, "overflow", 1) + a.curCSS(this, "overflow-y", 1) + a.curCSS(this, "overflow-x", 1))
                }).eq(0) : this.parents().filter(function() {
                return / (auto | scroll) / .test(a.curCSS(this, "overflow", 1) + a.curCSS(this, "overflow-y", 1) + a.curCSS(this, "overflow-x", 1))
                }).eq(0),
            /fixed/.test(this.css("position")) || !b.length ? a(document) : b
        },
        zIndex: function(c) {
            if (c !== b)
                return this.css("zIndex", c);
            if (this.length) {
                c = a(this[0]);
                for (var d; c.length && c[0] !== document;) {
                    d = c.css("position");
                    if (d === "absolute" || d === "relative" || d === "fixed") {
                        d = parseInt(c.css("zIndex"), 10);
                        if (!isNaN(d) && d !== 0)
                            return d
                    }
                    c = c.parent()
                    }
            }
            return 0
        },
        disableSelection: function() {
            return this.bind((a.support.selectstart ? "selectstart": "mousedown") + ".ui-disableSelection", function(a) {
                a.preventDefault()
                })
            },
        enableSelection: function() {
            return this.unbind(".ui-disableSelection")
            }
    }), a.each(["Width", "Height"], function(c, d) {
        function e(b, c, d, e) {
            return a.each(f, function() {
                c -= parseFloat(a.curCSS(b, "padding" + this, !0)) || 0,
                d && (c -= parseFloat(a.curCSS(b, "border" + this + "Width", !0)) || 0),
                e && (c -= parseFloat(a.curCSS(b, "margin" + this, !0)) || 0)
                }),
            c
        }
        var f = d === "Width" ? ["Left", "Right"] : ["Top", "Bottom"],
        g = d.toLowerCase(),
        h = {
            innerWidth: a.fn.innerWidth,
            innerHeight: a.fn.innerHeight,
            outerWidth: a.fn.outerWidth,
            outerHeight: a.fn.outerHeight
        };
        a.fn["inner" + d] = function(c) {
            return c === b ? h["inner" + d].call(this) : this.each(function() {
                a(this).css(g, e(this, c) + "px")
                })
            },
        a.fn["outer" + d] = function(b, c) {
            return typeof b != "number" ? h["outer" + d].call(this, b) : this.each(function() {
                a(this).css(g, e(this, b, !0, c) + "px")
                })
            }
    }), a.extend(a.expr[":"], {
        data: function(b, c, d) {
            return !! a.data(b, d[3])
            },
        focusable: function(b) {
            var d = b.nodeName.toLowerCase(),
            e = a.attr(b, "tabindex");
            return "area" === d ? (d = b.parentNode, e = d.name, !b.href || !e || d.nodeName.toLowerCase() !== "map" ? !1: (b = a("img[usemap=#" + e + "]")[0], !!b && c(b))) : (/input|select|textarea|button|object/.test(d) ? !b.disabled: "a" == d ? b.href || !isNaN(e) : !isNaN(e)) && c(b)
            },
        tabbable: function(b) {
            var c = a.attr(b, "tabindex");
            return (isNaN(c) || c >= 0) && a(b).is(":focusable")
            }
    }), a(function() {
        var b = document.body,
        c = b.appendChild(c = document.createElement("div"));
        a.extend(c.style, {
            minHeight: "100px",
            height: "auto",
            padding: 0,
            borderWidth: 0
        }),
        a.support.minHeight = c.offsetHeight === 100,
        a.support.selectstart = "onselectstart" in c,
        b.removeChild(c).style.display = "none"
    }), a.extend(a.ui, {
        plugin: {
            add: function(b, c, d) {
                b = a.ui[b].prototype;
                for (var e in d)
                    b.plugins[e] = b.plugins[e] || [],
                b.plugins[e].push([c, d[e]])
                },
            call: function(a, b, c) {
                if ((b = a.plugins[b]) && a.element[0].parentNode)
                    for (var d = 0; d < b.length; d++)
                    a.options[b[d][0]] && b[d][1].apply(a.element, c)
                }
        },
        contains: function(a, b) {
            return document.compareDocumentPosition ? a.compareDocumentPosition(b) & 16: a !== b && a.contains(b)
            },
        hasScroll: function(b, c) {
            if (a(b).css("overflow") === "hidden")
                return ! 1;
            c = c && c === "left" ? "scrollLeft": "scrollTop";
            var d = !1;
            return b[c] > 0 ? !0: (b[c] = 1, d = b[c] > 0, b[c] = 0, d)
            },
        isOverAxis: function(a, b, c) {
            return a > b && a < b + c
        },
        isOver: function(b, c, d, e, f, g) {
            return a.ui.isOverAxis(b, d, f) && a.ui.isOverAxis(c, e, g)
            }
    }))
    } (jQuery),
function(a, b) {
    if (a.cleanData) {
        var c = a.cleanData;
        a.cleanData = function(b) {
            for (var d = 0, e; (e = b[d]) != null; d++)
                a(e).triggerHandler("remove");
            c(b)
            }
    } else {
        var d = a.fn.remove;
        a.fn.remove = function(b, c) {
            return this.each(function() {
                return c || (!b || a.filter(b, [this]).length) && a("*", this).add([this]).each(function() {
                    a(this).triggerHandler("remove")
                    }),
                d.call(a(this), b, c)
                })
            }
    }
    a.widget = function(b, c, d) {
        var e = b.split(".")[0],
        f;
        b = b.split(".")[1],
        f = e + "-" + b,
        d || (d = c, c = a.Widget),
        a.expr[":"][f] = function(c) {
            return !! a.data(c, b)
            },
        a[e] = a[e] || {},
        a[e][b] = function(a, b) {
            arguments.length && this._createWidget(a, b)
            },
        c = new c,
        c.options = a.extend(!0, {}, c.options),
        a[e][b].prototype = a.extend(!0, c, {
            namespace: e,
            widgetName: b,
            widgetEventPrefix: a[e][b].prototype.widgetEventPrefix || b,
            widgetBaseClass: f
        }, d),
        a.widget.bridge(b, a[e][b])
        },
    a.widget.bridge = function(c, d) {
        a.fn[c] = function(e) {
            var f = typeof e == "string",
            g = Array.prototype.slice.call(arguments, 1),
            h = this;
            return e = !f && g.length ? a.extend.apply(null, [!0, e].concat(g)) : e,
            f && e.charAt(0) === "_" ? h: (f ? this.each(function() {
                var d = a.data(this, c),
                f = d && a.isFunction(d[e]) ? d[e].apply(d, g) : d;
                if (f !== d && f !== b)
                    return h = f,
                !1
            }) : this.each(function() {
                var b = a.data(this, c);
                b ? b.option(e || {})._init() : a.data(this, c, new d(e, this))
                }), h)
            }
    },
    a.Widget = function(a, b) {
        arguments.length && this._createWidget(a, b)
        },
    a.Widget.prototype = {
        widgetName: "widget",
        widgetEventPrefix: "",
        options: {
            disabled: !1
        },
        _createWidget: function(b, c) {
            a.data(c, this.widgetName, this),
            this.element = a(c),
            this.options = a.extend(!0, {}, this.options, this._getCreateOptions(), b);
            var d = this;
            this.element.bind("remove." + this.widgetName, function() {
                d.destroy()
                }),
            this._create(),
            this._trigger("create"),
            this._init()
            },
        _getCreateOptions: function() {
            return a.metadata && a.metadata.get(this.element[0])[this.widgetName]
            },
        _create: function() {},
        _init: function() {},
        destroy: function() {
            this.element.unbind("." + this.widgetName).removeData(this.widgetName),
            this.widget().unbind("." + this.widgetName).removeAttr("aria-disabled").removeClass(this.widgetBaseClass + "-disabled ui-state-disabled")
            },
        widget: function() {
            return this.element
        },
        option: function(c, d) {
            var e = c;
            if (arguments.length === 0)
                return a.extend({}, this.options);
            if (typeof c == "string") {
                if (d === b)
                    return this.options[c];
                e = {},
                e[c] = d
            }
            return this._setOptions(e),
            this
        },
        _setOptions: function(b) {
            var c = this;
            return a.each(b, function(a, b) {
                c._setOption(a, b)
                }),
            this
        },
        _setOption: function(a, b) {
            return this.options[a] = b,
            a === "disabled" && this.widget()[b ? "addClass": "removeClass"](this.widgetBaseClass + "-disabled ui-state-disabled").attr("aria-disabled", b),
            this
        },
        enable: function() {
            return this._setOption("disabled", !1)
            },
        disable: function() {
            return this._setOption("disabled", !0)
            },
        _trigger: function(b, c, d) {
            var e = this.options[b];
            c = a.Event(c),
            c.type = (b === this.widgetEventPrefix ? b: this.widgetEventPrefix + b).toLowerCase(),
            d = d || {};
            if (c.originalEvent) {
                b = a.event.props.length;
                for (var f; b;)
                    f = a.event.props[--b],
                c[f] = c.originalEvent[f]
                }
            return this.element.trigger(c, d),
            !(a.isFunction(e) && e.call(this.element[0], c, d) === !1 || c.isDefaultPrevented())
            }
    }
} (jQuery),
function(a) {
    a.widget("ui.mouse", {
        options: {
            cancel: ":input,option",
            distance: 1,
            delay: 0
        },
        _mouseInit: function() {
            var b = this;
            this.element.bind("mousedown." + this.widgetName, function(a) {
                return b._mouseDown(a)
                }).bind("click." + this.widgetName, function(d) {
                if (!0 === a.data(d.target, b.widgetName + ".preventClickEvent"))
                    return a.removeData(d.target, b.widgetName + ".preventClickEvent"),
                d.stopImmediatePropagation(),
                !1
            }),
            this.started = !1
        },
        _mouseDestroy: function() {
            this.element.unbind("." + this.widgetName)
            },
        _mouseDown: function(b) {
            b.originalEvent = b.originalEvent || {};
            if (!b.originalEvent.mouseHandled) {
                this._mouseStarted && this._mouseUp(b),
                this._mouseDownEvent = b;
                var d = this,
                e = b.which == 1,
                f = typeof this.options.cancel == "string" ? a(b.target).parents().add(b.target).filter(this.options.cancel).length: !1;
                if (!e || f || !this._mouseCapture(b))
                    return ! 0;
                this.mouseDelayMet = !this.options.delay,
                this.mouseDelayMet || (this._mouseDelayTimer = setTimeout(function() {
                    d.mouseDelayMet = !0
                }, this.options.delay));
                if (this._mouseDistanceMet(b) && this._mouseDelayMet(b)) {
                    this._mouseStarted = this._mouseStart(b) !== !1;
                    if (!this._mouseStarted)
                        return b.preventDefault(),
                    !0
                }
                return this._mouseMoveDelegate = function(a) {
                    return d._mouseMove(a)
                    },
                this._mouseUpDelegate = function(a) {
                    return d._mouseUp(a)
                    },
                a(document).bind("mousemove." + this.widgetName, this._mouseMoveDelegate).bind("mouseup." + this.widgetName, this._mouseUpDelegate),
                b.preventDefault(),
                b.originalEvent.mouseHandled = !0
            }
        },
        _mouseMove: function(b) {
            return ! a.browser.msie || document.documentMode >= 9 || !!b.button ? this._mouseStarted ? (this._mouseDrag(b), b.preventDefault()) : (this._mouseDistanceMet(b) && this._mouseDelayMet(b) && ((this._mouseStarted = this._mouseStart(this._mouseDownEvent, b) !== !1) ? this._mouseDrag(b) : this._mouseUp(b)), !this._mouseStarted) : this._mouseUp(b)
            },
        _mouseUp: function(b) {
            return a(document).unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate),
            this._mouseStarted && (this._mouseStarted = !1, b.target == this._mouseDownEvent.target && a.data(b.target, this.widgetName + ".preventClickEvent", !0), this._mouseStop(b)),
            !1
        },
        _mouseDistanceMet: function(a) {
            return Math.max(Math.abs(this._mouseDownEvent.pageX - a.pageX), Math.abs(this._mouseDownEvent.pageY - a.pageY)) >= this.options.distance
        },
        _mouseDelayMet: function() {
            return this.mouseDelayMet
        },
        _mouseStart: function() {},
        _mouseDrag: function() {},
        _mouseStop: function() {},
        _mouseCapture: function() {
            return ! 0
        }
    })
    } (jQuery),
function(a) {
    a.ui = a.ui || {};
    var b = /left|center|right/,
    c = /top|center|bottom/,
    d = a.fn.position,
    e = a.fn.offset;
    a.fn.position = function(e) {
        if (!e || !e.of)
            return d.apply(this, arguments);
        e = a.extend({}, e);
        var f = a(e.of),
        g = f[0],
        h = (e.collision || "flip").split(" "),
        i = e.offset ? e.offset.split(" ") : [0, 0],
        j,
        k,
        l;
        return g.nodeType === 9 ? (j = f.width(), k = f.height(), l = {
            top: 0,
            left: 0
        }) : g.setTimeout ? (j = f.width(), k = f.height(), l = {
            top: f.scrollTop(),
            left: f.scrollLeft()
            }) : g.preventDefault ? (e.at = "left top", j = k = 0, l = {
            top: e.of.pageY,
            left: e.of.pageX
        }) : (j = f.outerWidth(), k = f.outerHeight(), l = f.offset()),
        a.each(["my", "at"], function() {
            var a = (e[this] || "").split(" ");
            a.length === 1 && (a = b.test(a[0]) ? a.concat(["center"]) : c.test(a[0]) ? ["center"].concat(a) : ["center", "center"]),
            a[0] = b.test(a[0]) ? a[0] : "center",
            a[1] = c.test(a[1]) ? a[1] : "center",
            e[this] = a
        }),
        h.length === 1 && (h[1] = h[0]),
        i[0] = parseInt(i[0], 10) || 0,
        i.length === 1 && (i[1] = i[0]),
        i[1] = parseInt(i[1], 10) || 0,
        e.at[0] === "right" ? l.left += j: e.at[0] === "center" && (l.left += j / 2),
        e.at[1] === "bottom" ? l.top += k: e.at[1] === "center" && (l.top += k / 2),
        l.left += i[0],
        l.top += i[1],
        this.each(function() {
            var b = a(this),
            c = b.outerWidth(),
            d = b.outerHeight(),
            f = parseInt(a.curCSS(this, "marginLeft", !0)) || 0,
            g = parseInt(a.curCSS(this, "marginTop", !0)) || 0,
            m = c + f + (parseInt(a.curCSS(this, "marginRight", !0)) || 0),
            n = d + g + (parseInt(a.curCSS(this, "marginBottom", !0)) || 0),
            o = a.extend({}, l),
            p;
            e.my[0] === "right" ? o.left -= c: e.my[0] === "center" && (o.left -= c / 2),
            e.my[1] === "bottom" ? o.top -= d: e.my[1] === "center" && (o.top -= d / 2),
            o.left = Math.round(o.left),
            o.top = Math.round(o.top),
            p = {
                left: o.left - f,
                top: o.top - g
            },
            a.each(["left", "top"], function(b, f) {
                a.ui.position[h[b]] && a.ui.position[h[b]][f](o, {
                    targetWidth: j,
                    targetHeight: k,
                    elemWidth: c,
                    elemHeight: d,
                    collisionPosition: p,
                    collisionWidth: m,
                    collisionHeight: n,
                    offset: i,
                    my: e.my,
                    at: e.at
                })
                }),
            a.fn.bgiframe && b.bgiframe(),
            b.offset(a.extend(o, {
                using: e.using
            }))
            })
        },
    a.ui.position = {
        fit: {
            left: function(b, c) {
                var d = a(window);
                d = c.collisionPosition.left + c.collisionWidth - d.width() - d.scrollLeft(),
                b.left = d > 0 ? b.left - d: Math.max(b.left - c.collisionPosition.left, b.left)
                },
            top: function(b, c) {
                var d = a(window);
                d = c.collisionPosition.top + c.collisionHeight - d.height() - d.scrollTop(),
                b.top = d > 0 ? b.top - d: Math.max(b.top - c.collisionPosition.top, b.top)
                }
        },
        flip: {
            left: function(b, c) {
                if (c.at[0] !== "center") {
                    var d = a(window);
                    d = c.collisionPosition.left + c.collisionWidth - d.width() - d.scrollLeft();
                    var e = c.my[0] === "left" ? -c.elemWidth: c.my[0] === "right" ? c.elemWidth: 0,
                    f = c.at[0] === "left" ? c.targetWidth: -c.targetWidth,
                    g = -2 * c.offset[0];
                    b.left += c.collisionPosition.left < 0 ? e + f + g: d > 0 ? e + f + g: 0
                }
            },
            top: function(b, c) {
                if (c.at[1] !== "center") {
                    var d = a(window);
                    d = c.collisionPosition.top + c.collisionHeight - d.height() - d.scrollTop();
                    var e = c.my[1] === "top" ? -c.elemHeight: c.my[1] === "bottom" ? c.elemHeight: 0,
                    f = c.at[1] === "top" ? c.targetHeight: -c.targetHeight,
                    g = -2 * c.offset[1];
                    b.top += c.collisionPosition.top < 0 ? e + f + g: d > 0 ? e + f + g: 0
                }
            }
        }
    },
    a.offset.setOffset || (a.offset.setOffset = function(b, c) { / static / .test(a.curCSS(b, "position")) && (b.style.position = "relative");
        var d = a(b),
        e = d.offset(),
        f = parseInt(a.curCSS(b, "top", !0), 10) || 0,
        g = parseInt(a.curCSS(b, "left", !0), 10) || 0;
        e = {
            top: c.top - e.top + f,
            left: c.left - e.left + g
        },
        "using" in c ? c.using.call(b, e) : d.css(e)
        }, a.fn.offset = function(b) {
        var c = this[0];
        return ! c || !c.ownerDocument ? null: b ? this.each(function() {
            a.offset.setOffset(this, b)
            }) : e.call(this)
        })
    } (jQuery),
function(a) {
    a.widget("ui.draggable", a.ui.mouse, {
        widgetEventPrefix: "drag",
        options: {
            addClasses: !0,
            appendTo: "parent",
            axis: !1,
            connectToSortable: !1,
            containment: !1,
            cursor: "auto",
            cursorAt: !1,
            grid: !1,
            handle: !1,
            helper: "original",
            iframeFix: !1,
            opacity: !1,
            refreshPositions: !1,
            revert: !1,
            revertDuration: 500,
            scope: "default",
            scroll: !0,
            scrollSensitivity: 20,
            scrollSpeed: 20,
            snap: !1,
            snapMode: "both",
            snapTolerance: 20,
            stack: !1,
            zIndex: !1
        },
        _create: function() {
            this.options.helper == "original" && !/^(?:r|a|f)/.test(this.element.css("position")) && (this.element[0].style.position = "relative"),
            this.options.addClasses && this.element.addClass("ui-draggable"),
            this.options.disabled && this.element.addClass("ui-draggable-disabled"),
            this._mouseInit()
            },
        destroy: function() {
            if (this.element.data("draggable"))
                return this.element.removeData("draggable").unbind(".draggable").removeClass("ui-draggable ui-draggable-dragging ui-draggable-disabled"),
            this._mouseDestroy(),
            this
        },
        _mouseCapture: function(b) {
            var c = this.options;
            return this.helper || c.disabled || a(b.target).is(".ui-resizable-handle") ? !1: (this.handle = this._getHandle(b), this.handle ? !0: !1)
            },
        _mouseStart: function(b) {
            var c = this.options;
            return this.helper = this._createHelper(b),
            this._cacheHelperProportions(),
            a.ui.ddmanager && (a.ui.ddmanager.current = this),
            this._cacheMargins(),
            this.cssPosition = this.helper.css("position"),
            this.scrollParent = this.helper.scrollParent(),
            this.offset = this.positionAbs = this.element.offset(),
            this.offset = {
                top: this.offset.top - this.margins.top,
                left: this.offset.left - this.margins.left
            },
            a.extend(this.offset, {
                click: {
                    left: b.pageX - this.offset.left,
                    top: b.pageY - this.offset.top
                },
                parent: this._getParentOffset(),
                relative: this._getRelativeOffset()
                }),
            this.originalPosition = this.position = this._generatePosition(b),
            this.originalPageX = b.pageX,
            this.originalPageY = b.pageY,
            c.cursorAt && this._adjustOffsetFromHelper(c.cursorAt),
            c.containment && this._setContainment(),
            this._trigger("start", b) === !1 ? (this._clear(), !1) : (this._cacheHelperProportions(), a.ui.ddmanager && !c.dropBehaviour && a.ui.ddmanager.prepareOffsets(this, b), this.helper.addClass("ui-draggable-dragging"), this._mouseDrag(b, !0), !0)
            },
        _mouseDrag: function(b, c) {
            this.position = this._generatePosition(b),
            this.positionAbs = this._convertPositionTo("absolute");
            if (!c) {
                c = this._uiHash();
                if (this._trigger("drag", b, c) === !1)
                    return this._mouseUp({}),
                !1;
                this.position = c.position
            }
            if (!this.options.axis || this.options.axis != "y")
                this.helper[0].style.left = this.position.left + "px";
            if (!this.options.axis || this.options.axis != "x")
                this.helper[0].style.top = this.position.top + "px";
            return a.ui.ddmanager && a.ui.ddmanager.drag(this, b),
            !1
        },
        _mouseStop: function(b) {
            var c = !1;
            a.ui.ddmanager && !this.options.dropBehaviour && (c = a.ui.ddmanager.drop(this, b)),
            this.dropped && (c = this.dropped, this.dropped = !1);
            if ((!this.element[0] || !this.element[0].parentNode) && this.options.helper == "original")
                return ! 1;
            if (this.options.revert == "invalid" && !c || this.options.revert == "valid" && c || this.options.revert === !0 || a.isFunction(this.options.revert) && this.options.revert.call(this.element, c)) {
                var e = this;
                a(this.helper).animate(this.originalPosition, parseInt(this.options.revertDuration, 10), function() {
                    e._trigger("stop", b) !== !1 && e._clear()
                    })
                } else
                this._trigger("stop", b) !== !1 && this._clear();
            return ! 1
        },
        cancel: function() {
            return this.helper.is(".ui-draggable-dragging") ? this._mouseUp({}) : this._clear(),
            this
        },
        _getHandle: function(b) {
            var c = !this.options.handle || !a(this.options.handle, this.element).length ? !0: !1;
            return a(this.options.handle, this.element).find("*").andSelf().each(function() {
                this == b.target && (c = !0)
                }),
            c
        },
        _createHelper: function(b) {
            var c = this.options;
            return b = a.isFunction(c.helper) ? a(c.helper.apply(this.element[0], [b])) : c.helper == "clone" ? this.element.clone() : this.element,
            b.parents("body").length || b.appendTo(c.appendTo == "parent" ? this.element[0].parentNode: c.appendTo),
            b[0] != this.element[0] && !/(fixed|absolute)/.test(b.css("position")) && b.css("position", "absolute"),
            b
        },
        _adjustOffsetFromHelper: function(b) {
            typeof b == "string" && (b = b.split(" ")),
            a.isArray(b) && (b = {
                left: +b[0],
                top: +b[1] || 0
            }),
            "left" in b && (this.offset.click.left = b.left + this.margins.left),
            "right" in b && (this.offset.click.left = this.helperProportions.width - b.right + this.margins.left),
            "top" in b && (this.offset.click.top = b.top + this.margins.top),
            "bottom" in b && (this.offset.click.top = this.helperProportions.height - b.bottom + this.margins.top)
            },
        _getParentOffset: function() {
            this.offsetParent = this.helper.offsetParent();
            var b = this.offsetParent.offset();
            this.cssPosition == "absolute" && this.scrollParent[0] != document && a.ui.contains(this.scrollParent[0], this.offsetParent[0]) && (b.left += this.scrollParent.scrollLeft(), b.top += this.scrollParent.scrollTop());
            if (this.offsetParent[0] == document.body || this.offsetParent[0].tagName && this.offsetParent[0].tagName.toLowerCase() == "html" && a.browser.msie)
                b = {
                top: 0,
                left: 0
            };
            return {
                top: b.top + (parseInt(this.offsetParent.css("borderTopWidth"), 10) || 0),
                left: b.left + (parseInt(this.offsetParent.css("borderLeftWidth"), 10) || 0)
                }
        },
        _getRelativeOffset: function() {
            if (this.cssPosition == "relative") {
                var a = this.element.position();
                return {
                    top: a.top - (parseInt(this.helper.css("top"), 10) || 0) + this.scrollParent.scrollTop(),
                    left: a.left - (parseInt(this.helper.css("left"), 10) || 0) + this.scrollParent.scrollLeft()
                    }
            }
            return {
                top: 0,
                left: 0
            }
        },
        _cacheMargins: function() {
            this.margins = {
                left: parseInt(this.element.css("marginLeft"), 10) || 0,
                top: parseInt(this.element.css("marginTop"), 10) || 0
            }
        },
        _cacheHelperProportions: function() {
            this.helperProportions = {
                width: this.helper.outerWidth(),
                height: this.helper.outerHeight()
                }
        },
        _setContainment: function() {
            var b = this.options;
            b.containment == "parent" && (b.containment = this.helper[0].parentNode);
            if (b.containment == "document" || b.containment == "window")
                this.containment = [(b.containment == "document" ? 0: a(window).scrollLeft()) - this.offset.relative.left - this.offset.parent.left, (b.containment == "document" ? 0: a(window).scrollTop()) - this.offset.relative.top - this.offset.parent.top, (b.containment == "document" ? 0: a(window).scrollLeft()) + a(b.containment == "document" ? document: window).width() - this.helperProportions.width - this.margins.left, (b.containment == "document" ? 0: a(window).scrollTop()) + (a(b.containment == "document" ? document: window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top];
            if (!/^(document|window|parent)$/.test(b.containment) && b.containment.constructor != Array) {
                var c = a(b.containment)[0];
                if (c) {
                    b = a(b.containment).offset();
                    var e = a(c).css("overflow") != "hidden";
                    this.containment = [b.left + (parseInt(a(c).css("borderLeftWidth"), 10) || 0) + (parseInt(a(c).css("paddingLeft"), 10) || 0) - this.margins.left, b.top + (parseInt(a(c).css("borderTopWidth"), 10) || 0) + (parseInt(a(c).css("paddingTop"), 10) || 0) - this.margins.top, b.left + (e ? Math.max(c.scrollWidth, c.offsetWidth) : c.offsetWidth) - (parseInt(a(c).css("borderLeftWidth"), 10) || 0) - (parseInt(a(c).css("paddingRight"), 10) || 0) - this.helperProportions.width - this.margins.left, b.top + (e ? Math.max(c.scrollHeight, c.offsetHeight) : c.offsetHeight) - (parseInt(a(c).css("borderTopWidth"), 10) || 0) - (parseInt(a(c).css("paddingBottom"), 10) || 0) - this.helperProportions.height - this.margins.top]
                    }
            } else
                b.containment.constructor == Array && (this.containment = b.containment)
            },
        _convertPositionTo: function(b, c) {
            c || (c = this.position),
            b = b == "absolute" ? 1: -1;
            var e = this.cssPosition != "absolute" || this.scrollParent[0] != document && !!a.ui.contains(this.scrollParent[0], this.offsetParent[0]) ? this.scrollParent: this.offsetParent,
            f = /(html|body)/i.test(e[0].tagName);
            return {
                top: c.top + this.offset.relative.top * b + this.offset.parent.top * b - (a.browser.safari && a.browser.version < 526 && this.cssPosition == "fixed" ? 0: (this.cssPosition == "fixed" ? -this.scrollParent.scrollTop() : f ? 0: e.scrollTop()) * b),
                left: c.left + this.offset.relative.left * b + this.offset.parent.left * b - (a.browser.safari && a.browser.version < 526 && this.cssPosition == "fixed" ? 0: (this.cssPosition == "fixed" ? -this.scrollParent.scrollLeft() : f ? 0: e.scrollLeft()) * b)
                }
        },
        _generatePosition: function(b) {
            var c = this.options,
            e = this.cssPosition != "absolute" || this.scrollParent[0] != document && !!a.ui.contains(this.scrollParent[0], this.offsetParent[0]) ? this.scrollParent: this.offsetParent,
            f = /(html|body)/i.test(e[0].tagName),
            g = b.pageX,
            h = b.pageY;
            return this.originalPosition && (this.containment && (b.pageX - this.offset.click.left < this.containment[0] && (g = this.containment[0] + this.offset.click.left), b.pageY - this.offset.click.top < this.containment[1] && (h = this.containment[1] + this.offset.click.top), b.pageX - this.offset.click.left > this.containment[2] && (g = this.containment[2] + this.offset.click.left), b.pageY - this.offset.click.top > this.containment[3] && (h = this.containment[3] + this.offset.click.top)), c.grid && (h = this.originalPageY + Math.round((h - this.originalPageY) / c.grid[1]) * c.grid[1], h = this.containment ? h - this.offset.click.top < this.containment[1] || h - this.offset.click.top > this.containment[3] ? h - this.offset.click.top < this.containment[1] ? h + c.grid[1] : h - c.grid[1] : h: h, g = this.originalPageX + Math.round((g - this.originalPageX) / c.grid[0]) * c.grid[0], g = this.containment ? g - this.offset.click.left < this.containment[0] || g - this.offset.click.left > this.containment[2] ? g - this.offset.click.left < this.containment[0] ? g + c.grid[0] : g - c.grid[0] : g: g)),
            {
                top: h - this.offset.click.top - this.offset.relative.top - this.offset.parent.top + (a.browser.safari && a.browser.version < 526 && this.cssPosition == "fixed" ? 0: this.cssPosition == "fixed" ? -this.scrollParent.scrollTop() : f ? 0: e.scrollTop()),
                left: g - this.offset.click.left - this.offset.relative.left - this.offset.parent.left + (a.browser.safari && a.browser.version < 526 && this.cssPosition == "fixed" ? 0: this.cssPosition == "fixed" ? -this.scrollParent.scrollLeft() : f ? 0: e.scrollLeft())
                }
        },
        _clear: function() {
            this.helper.removeClass("ui-draggable-dragging"),
            this.helper[0] != this.element[0] && !this.cancelHelperRemoval && this.helper.remove(),
            this.helper = null,
            this.cancelHelperRemoval = !1
        },
        _trigger: function(b, c, e) {
            return e = e || this._uiHash(),
            a.ui.plugin.call(this, b, [c, e]),
            b == "drag" && (this.positionAbs = this._convertPositionTo("absolute")),
            a.Widget.prototype._trigger.call(this, b, c, e)
            },
        plugins: {},
        _uiHash: function() {
            return {
                helper: this.helper,
                position: this.position,
                originalPosition: this.originalPosition,
                offset: this.positionAbs
            }
        }
    }),
    a.extend(a.ui.draggable, {
        version: "1.8.10"
    }),
    a.ui.plugin.add("draggable", "connectToSortable", {
        start: function(b, c) {
            var e = a(this).data("draggable"),
            f = e.options,
            g = a.extend({}, c, {
                item: e.element
            });
            e.sortables = [],
            a(f.connectToSortable).each(function() {
                var c = a.data(this, "sortable");
                c && !c.options.disabled && (e.sortables.push({
                    instance: c,
                    shouldRevert: c.options.revert
                }), c._refreshItems(), c._trigger("activate", b, g))
                })
            },
        stop: function(b, c) {
            var e = a(this).data("draggable"),
            f = a.extend({}, c, {
                item: e.element
            });
            a.each(e.sortables, function() {
                this.instance.isOver ? (this.instance.isOver = 0, e.cancelHelperRemoval = !0, this.instance.cancelHelperRemoval = !1, this.shouldRevert && (this.instance.options.revert = !0), this.instance._mouseStop(b), this.instance.options.helper = this.instance.options._helper, e.options.helper == "original" && this.instance.currentItem.css({
                    top: "auto",
                    left: "auto"
                })) : (this.instance.cancelHelperRemoval = !1, this.instance._trigger("deactivate", b, f))
                })
            },
        drag: function(b, c) {
            var e = a(this).data("draggable"),
            f = this;
            a.each(e.sortables, function() {
                this.instance.positionAbs = e.positionAbs,
                this.instance.helperProportions = e.helperProportions,
                this.instance.offset.click = e.offset.click,
                this.instance._intersectsWith(this.instance.containerCache) ? (this.instance.isOver || (this.instance.isOver = 1, this.instance.currentItem = a(f).clone().appendTo(this.instance.element).data("sortable-item", !0), this.instance.options._helper = this.instance.options.helper, this.instance.options.helper = function() {
                    return c.helper[0]
                    }, b.target = this.instance.currentItem[0], this.instance._mouseCapture(b, !0), this.instance._mouseStart(b, !0, !0), this.instance.offset.click.top = e.offset.click.top, this.instance.offset.click.left = e.offset.click.left, this.instance.offset.parent.left -= e.offset.parent.left - this.instance.offset.parent.left, this.instance.offset.parent.top -= e.offset.parent.top - this.instance.offset.parent.top, e._trigger("toSortable", b), e.dropped = this.instance.element, e.currentItem = e.element, this.instance.fromOutside = e), this.instance.currentItem && this.instance._mouseDrag(b)) : this.instance.isOver && (this.instance.isOver = 0, this.instance.cancelHelperRemoval = !0, this.instance.options.revert = !1, this.instance._trigger("out", b, this.instance._uiHash(this.instance)), this.instance._mouseStop(b, !0), this.instance.options.helper = this.instance.options._helper, this.instance.currentItem.remove(), this.instance.placeholder && this.instance.placeholder.remove(), e._trigger("fromSortable", b), e.dropped = !1)
                })
            }
    }),
    a.ui.plugin.add("draggable", "cursor", {
        start: function() {
            var b = a("body"),
            c = a(this).data("draggable").options;
            b.css("cursor") && (c._cursor = b.css("cursor")),
            b.css("cursor", c.cursor)
            },
        stop: function() {
            var b = a(this).data("draggable").options;
            b._cursor && a("body").css("cursor", b._cursor)
            }
    }),
    a.ui.plugin.add("draggable", "iframeFix", {
        start: function() {
            var b = a(this).data("draggable").options;
            a(b.iframeFix === !0 ? "iframe": b.iframeFix).each(function() {
                a('<div class="ui-draggable-iframeFix" style="background: #fff;"></div>').css({
                    width: this.offsetWidth + "px",
                    height: this.offsetHeight + "px",
                    position: "absolute",
                    opacity: "0.001",
                    zIndex: 1e3
                }).css(a(this).offset()).appendTo("body")
                })
            },
        stop: function() {
            a("div.ui-draggable-iframeFix").each(function() {
                this.parentNode.removeChild(this)
                })
            }
    }),
    a.ui.plugin.add("draggable", "opacity", {
        start: function(b, c) {
            b = a(c.helper),
            c = a(this).data("draggable").options,
            b.css("opacity") && (c._opacity = b.css("opacity")),
            b.css("opacity", c.opacity)
            },
        stop: function(b, c) {
            b = a(this).data("draggable").options,
            b._opacity && a(c.helper).css("opacity", b._opacity)
            }
    }),
    a.ui.plugin.add("draggable", "scroll", {
        start: function() {
            var b = a(this).data("draggable");
            b.scrollParent[0] != document && b.scrollParent[0].tagName != "HTML" && (b.overflowOffset = b.scrollParent.offset())
            },
        drag: function(b) {
            var c = a(this).data("draggable"),
            e = c.options,
            f = !1;
            if (c.scrollParent[0] != document && c.scrollParent[0].tagName != "HTML") {
                if (!e.axis || e.axis != "x")
                    c.overflowOffset.top + c.scrollParent[0].offsetHeight - b.pageY < e.scrollSensitivity ? c.scrollParent[0].scrollTop = f = c.scrollParent[0].scrollTop + e.scrollSpeed: b.pageY - c.overflowOffset.top < e.scrollSensitivity && (c.scrollParent[0].scrollTop = f = c.scrollParent[0].scrollTop - e.scrollSpeed);
                if (!e.axis || e.axis != "y")
                    c.overflowOffset.left + c.scrollParent[0].offsetWidth - b.pageX < e.scrollSensitivity ? c.scrollParent[0].scrollLeft = f = c.scrollParent[0].scrollLeft + e.scrollSpeed: b.pageX - c.overflowOffset.left < e.scrollSensitivity && (c.scrollParent[0].scrollLeft = f = c.scrollParent[0].scrollLeft - e.scrollSpeed)
                } else {
                if (!e.axis || e.axis != "x")
                    b.pageY - a(document).scrollTop() < e.scrollSensitivity ? f = a(document).scrollTop(a(document).scrollTop() - e.scrollSpeed) : a(window).height() - (b.pageY - a(document).scrollTop()) < e.scrollSensitivity && (f = a(document).scrollTop(a(document).scrollTop() + e.scrollSpeed));
                if (!e.axis || e.axis != "y")
                    b.pageX - a(document).scrollLeft() < e.scrollSensitivity ? f = a(document).scrollLeft(a(document).scrollLeft() - e.scrollSpeed) : a(window).width() - (b.pageX - a(document).scrollLeft()) < e.scrollSensitivity && (f = a(document).scrollLeft(a(document).scrollLeft() + e.scrollSpeed))
                }
            f !== !1 && a.ui.ddmanager && !e.dropBehaviour && a.ui.ddmanager.prepareOffsets(c, b)
            }
    }),
    a.ui.plugin.add("draggable", "snap", {
        start: function() {
            var b = a(this).data("draggable"),
            c = b.options;
            b.snapElements = [],
            a(c.snap.constructor != String ? c.snap.items || ":data(draggable)": c.snap).each(function() {
                var c = a(this),
                e = c.offset();
                this != b.element[0] && b.snapElements.push({
                    item: this,
                    width: c.outerWidth(),
                    height: c.outerHeight(),
                    top: e.top,
                    left: e.left
                })
                })
            },
        drag: function(b, c) {
            for (var e = a(this).data("draggable"), f = e.options, g = f.snapTolerance, h = c.offset.left, i = h + e.helperProportions.width, j = c.offset.top, k = j + e.helperProportions.height, l = e.snapElements.length - 1; l >= 0; l--) {
                var m = e.snapElements[l].left,
                n = m + e.snapElements[l].width,
                o = e.snapElements[l].top,
                p = o + e.snapElements[l].height;
                if (m - g < h && h < n + g && o - g < j && j < p + g || m - g < h && h < n + g && o - g < k && k < p + g || m - g < i && i < n + g && o - g < j && j < p + g || m - g < i && i < n + g && o - g < k && k < p + g) {
                    if (f.snapMode != "inner") {
                        var q = Math.abs(o - k) <= g,
                        r = Math.abs(p - j) <= g,
                        s = Math.abs(m - i) <= g,
                        t = Math.abs(n - h) <= g;
                        q && (c.position.top = e._convertPositionTo("relative", {
                            top: o - e.helperProportions.height,
                            left: 0
                        }).top - e.margins.top),
                        r && (c.position.top = e._convertPositionTo("relative", {
                            top: p,
                            left: 0
                        }).top - e.margins.top),
                        s && (c.position.left = e._convertPositionTo("relative", {
                            top: 0,
                            left: m - e.helperProportions.width
                        }).left - e.margins.left),
                        t && (c.position.left = e._convertPositionTo("relative", {
                            top: 0,
                            left: n
                        }).left - e.margins.left)
                        }
                    var u = q || r || s || t;
                    f.snapMode != "outer" && (q = Math.abs(o - j) <= g, r = Math.abs(p - k) <= g, s = Math.abs(m - h) <= g, t = Math.abs(n - i) <= g, q && (c.position.top = e._convertPositionTo("relative", {
                        top: o,
                        left: 0
                    }).top - e.margins.top), r && (c.position.top = e._convertPositionTo("relative", {
                        top: p - e.helperProportions.height,
                        left: 0
                    }).top - e.margins.top), s && (c.position.left = e._convertPositionTo("relative", {
                        top: 0,
                        left: m
                    }).left - e.margins.left), t && (c.position.left = e._convertPositionTo("relative", {
                        top: 0,
                        left: n - e.helperProportions.width
                    }).left - e.margins.left)),
                    !e.snapElements[l].snapping && (q || r || s || t || u) && e.options.snap.snap && e.options.snap.snap.call(e.element, b, a.extend(e._uiHash(), {
                        snapItem: e.snapElements[l].item
                    })),
                    e.snapElements[l].snapping = q || r || s || t || u
                } else
                    e.snapElements[l].snapping && e.options.snap.release && e.options.snap.release.call(e.element, b, a.extend(e._uiHash(), {
                    snapItem: e.snapElements[l].item
                })),
                e.snapElements[l].snapping = !1
            }
        }
    }),
    a.ui.plugin.add("draggable", "stack", {
        start: function() {
            var b = a(this).data("draggable").options;
            b = a.makeArray(a(b.stack)).sort(function(b, c) {
                return (parseInt(a(b).css("zIndex"), 10) || 0) - (parseInt(a(c).css("zIndex"), 10) || 0)
                });
            if (b.length) {
                var c = parseInt(b[0].style.zIndex) || 0;
                a(b).each(function(a) {
                    this.style.zIndex = c + a
                }),
                this[0].style.zIndex = c + b.length
            }
        }
    }),
    a.ui.plugin.add("draggable", "zIndex", {
        start: function(b, c) {
            b = a(c.helper),
            c = a(this).data("draggable").options,
            b.css("zIndex") && (c._zIndex = b.css("zIndex")),
            b.css("zIndex", c.zIndex)
            },
        stop: function(b, c) {
            b = a(this).data("draggable").options,
            b._zIndex && a(c.helper).css("zIndex", b._zIndex)
            }
    })
    } (jQuery),
function(a) {
    a.widget("ui.droppable", {
        widgetEventPrefix: "drop",
        options: {
            accept: "*",
            activeClass: !1,
            addClasses: !0,
            greedy: !1,
            hoverClass: !1,
            scope: "default",
            tolerance: "intersect"
        },
        _create: function() {
            var b = this.options,
            c = b.accept;
            this.isover = 0,
            this.isout = 1,
            this.accept = a.isFunction(c) ? c: function(a) {
                return a.is(c)
                },
            this.proportions = {
                width: this.element[0].offsetWidth,
                height: this.element[0].offsetHeight
            },
            a.ui.ddmanager.droppables[b.scope] = a.ui.ddmanager.droppables[b.scope] || [],
            a.ui.ddmanager.droppables[b.scope].push(this),
            b.addClasses && this.element.addClass("ui-droppable")
            },
        destroy: function() {
            for (var b = a.ui.ddmanager.droppables[this.options.scope], c = 0; c < b.length; c++)
                b[c] == this && b.splice(c, 1);
            return this.element.removeClass("ui-droppable ui-droppable-disabled").removeData("droppable").unbind(".droppable"),
            this
        },
        _setOption: function(b, c) {
            b == "accept" && (this.accept = a.isFunction(c) ? c: function(a) {
                return a.is(c)
                }),
            a.Widget.prototype._setOption.apply(this, arguments)
            },
        _activate: function(b) {
            var c = a.ui.ddmanager.current;
            this.options.activeClass && this.element.addClass(this.options.activeClass),
            c && this._trigger("activate", b, this.ui(c))
            },
        _deactivate: function(b) {
            var c = a.ui.ddmanager.current;
            this.options.activeClass && this.element.removeClass(this.options.activeClass),
            c && this._trigger("deactivate", b, this.ui(c))
            },
        _over: function(b) {
            var c = a.ui.ddmanager.current; !! c && (c.currentItem || c.element)[0] != this.element[0] && this.accept.call(this.element[0], c.currentItem || c.element) && (this.options.hoverClass && this.element.addClass(this.options.hoverClass), this._trigger("over", b, this.ui(c)))
            },
        _out: function(b) {
            var c = a.ui.ddmanager.current; !! c && (c.currentItem || c.element)[0] != this.element[0] && this.accept.call(this.element[0], c.currentItem || c.element) && (this.options.hoverClass && this.element.removeClass(this.options.hoverClass), this._trigger("out", b, this.ui(c)))
            },
        _drop: function(b, c) {
            var e = c || a.ui.ddmanager.current;
            if (!e || (e.currentItem || e.element)[0] == this.element[0])
                return ! 1;
            var f = !1;
            return this.element.find(":data(droppable)").not(".ui-draggable-dragging").each(function() {
                var b = a.data(this, "droppable");
                if (b.options.greedy && !b.options.disabled && b.options.scope == e.options.scope && b.accept.call(b.element[0], e.currentItem || e.element) && a.ui.intersect(e, a.extend(b, {
                    offset: b.element.offset()
                    }), b.options.tolerance))
                    return f = !0,
                !1
            }),
            f ? !1: this.accept.call(this.element[0], e.currentItem || e.element) ? (this.options.activeClass && this.element.removeClass(this.options.activeClass), this.options.hoverClass && this.element.removeClass(this.options.hoverClass), this._trigger("drop", b, this.ui(e)), this.element) : !1
        },
        ui: function(a) {
            return {
                draggable: a.currentItem || a.element,
                helper: a.helper,
                position: a.position,
                offset: a.positionAbs
            }
        }
    }),
    a.extend(a.ui.droppable, {
        version: "1.8.10"
    }),
    a.ui.intersect = function(b, c, e) {
        if (!c.offset)
            return ! 1;
        var f = (b.positionAbs || b.position.absolute).left,
        g = f + b.helperProportions.width,
        h = (b.positionAbs || b.position.absolute).top,
        i = h + b.helperProportions.height,
        j = c.offset.left,
        k = j + c.proportions.width,
        l = c.offset.top,
        m = l + c.proportions.height;
        switch (e) {
        case "fit":
            return j <= f && g <= k && l <= h && i <= m;
        case "intersect":
            return j < f + b.helperProportions.width / 2 && g - b.helperProportions.width / 2 < k && l < h + b.helperProportions.height / 2 && i - b.helperProportions.height / 2 < m;
        case "pointer":
            return a.ui.isOver((b.positionAbs || b.position.absolute).top + (b.clickOffset || b.offset.click).top, (b.positionAbs || b.position.absolute).left + (b.clickOffset || b.offset.click).left, l, j, c.proportions.height, c.proportions.width);
        case "touch":
            return (h >= l && h <= m || i >= l && i <= m || h < l && i > m) && (f >= j && f <= k || g >= j && g <= k || f < j && g > k);
        default:
            return ! 1
        }
    },
    a.ui.ddmanager = {
        current: null,
        droppables: {
            "default": []
            },
        prepareOffsets: function(b, c) {
            var e = a.ui.ddmanager.droppables[b.options.scope] || [],
            f = c ? c.type: null,
            g = (b.currentItem || b.element).find(":data(droppable)").andSelf(),
            h = 0;
            a: for (; h < e.length; h++)
                if (! (e[h].options.disabled || b && !e[h].accept.call(e[h].element[0], b.currentItem || b.element))) {
                for (var i = 0; i < g.length; i++)
                    if (g[i] == e[h].element[0]) {
                    e[h].proportions.height = 0;
                    continue a
                }
                e[h].visible = e[h].element.css("display") != "none",
                e[h].visible && (e[h].offset = e[h].element.offset(), e[h].proportions = {
                    width: e[h].element[0].offsetWidth,
                    height: e[h].element[0].offsetHeight
                }, f == "mousedown" && e[h]._activate.call(e[h], c))
                }
        },
        drop: function(b, c) {
            var e = !1;
            return a.each(a.ui.ddmanager.droppables[b.options.scope] || [], function() {
                this.options && (!this.options.disabled && this.visible && a.ui.intersect(b, this, this.options.tolerance) && (e = e || this._drop.call(this, c)), !this.options.disabled && this.visible && this.accept.call(this.element[0], b.currentItem || b.element) && (this.isout = 1, this.isover = 0, this._deactivate.call(this, c)))
                }),
            e
        },
        drag: function(b, c) {
            b.options.refreshPositions && a.ui.ddmanager.prepareOffsets(b, c),
            a.each(a.ui.ddmanager.droppables[b.options.scope] || [], function() {
                if (! (this.options.disabled || this.greedyChild || !this.visible)) {
                    var e = a.ui.intersect(b, this, this.options.tolerance);
                    if (e = !e && this.isover == 1 ? "isout": e && this.isover == 0 ? "isover": null) {
                        var f;
                        if (this.options.greedy) {
                            var g = this.element.parents(":data(droppable):eq(0)");
                            g.length && (f = a.data(g[0], "droppable"), f.greedyChild = e == "isover" ? 1: 0)
                            }
                        f && e == "isover" && (f.isover = 0, f.isout = 1, f._out.call(f, c)),
                        this[e] = 1,
                        this[e == "isout" ? "isover": "isout"] = 0,
                        this[e == "isover" ? "_over": "_out"].call(this, c),
                        f && e == "isout" && (f.isout = 0, f.isover = 1, f._over.call(f, c))
                        }
                }
            })
            }
    }
} (jQuery),
function(a) {
    a.fn.editableComment = function() {
        a(this).delegate(".comment .edit-button", "click", function(b) {
            var c = a(this).closest(".comment");
            return c.addClass("editing"),
            !1
        }),
        a(this).delegate(".comment .delete-button", "click", function(b) {
            var c = a(this).closest(".comment"),
            d = a(this).closest(".js-comment-container");
            return d.length || (d = c),
            confirm("Are you sure you want to delete this?") && (c.addClass("loading"), c.find("button").attr("disabled", !0), c.find(".minibutton").addClass("disabled"), a.ajax({
                type: "DELETE",
                url: c.find(".form-content form").attr("action"),
                context: d,
                complete: function() {
                    c.removeClass("loading"),
                    c.find("button").removeAttr("disabled"),
                    c.find(".minibutton").removeClass("disabled")
                    },
                success: function() {
                    c.removeClass("error"),
                    d.fadeOut(function() {
                        c.removeClass("editing"),
                        d.pageUpdate()
                        })
                    },
                error: function() {
                    c.addClass("error")
                    }
            })),
            !1
        }),
        a(this).delegate(".comment .cancel", "click", function() {
            return a(this).closest(".comment").removeClass("editing"),
            !1
        }),
        a(this).delegate(".comment .form-content form", "submit", function() {
            var b = a(this).closest(".comment"),
            c = a(this).closest(".js-comment-container");
            return c.length || (c = b),
            b.addClass("loading"),
            b.find("button").attr("disabled", !0),
            b.find(".minibutton").addClass("disabled"),
            a.ajax({
                type: "PUT",
                url: b.find(".form-content form").attr("action"),
                dataType: "json",
                data: a(this).serialize(),
                context: c,
                complete: function() {
                    b.removeClass("loading"),
                    b.find("button").removeAttr("disabled"),
                    b.find(".minibutton").removeClass("disabled")
                    },
                success: function(a) {
                    b.removeClass("error"),
                    a.title && b.find(".content-title").html(a.title),
                    b.find(".formatted-content .content-body").html(a.body),
                    b.removeClass("editing"),
                    c.pageUpdate()
                    },
                error: function() {
                    b.addClass("error")
                    }
            }),
            !1
        })
        }
} (jQuery),
function(a) {
    a.fn.enticeToAction = function(b) {
        var c = a.extend({}, a.fn.enticeToAction.defaults, b);
        return this.each(function() {
            var b = a(this);
            b.addClass("entice"),
            b.attr("title", c.title);
            switch (c.direction) {
            case "downwards":
                var d = "n";
            case "upwards":
                var d = "s";
            case "rightwards":
                var d = "w";
            case "leftwards":
                var d = "e"
            }
            b.tipsy({
                gravity: d
            }),
            this.onclick = function() {
                return ! 1
            },
            this.href = "javascript:;"
        })
        },
    a.fn.enticeToAction.defaults = {
        title: "You must be logged in to use this feature",
        direction: "downwards"
    }
} (jQuery),
function(a) {
    a.fn.errorify = function(b, c) {
        var d = a.extend({}, a.fn.errorify.defaults, c);
        return this.each(function() {
            var c = a(this);
            c.addClass("errored"),
            c.find("p.note").hide(),
            c.find("dd.error").remove();
            var d = a("<dd>").addClass("error").text(b);
            c.append(d)
            })
        },
    a.fn.errorify.defaults = {},
    a.fn.unErrorify = function(b) {
        var c = a.extend({}, a.fn.unErrorify.defaults, b);
        return this.each(function() {
            var b = a(this);
            b.removeClass("errored"),
            b.find("p.note").show(),
            b.find("dd.error").remove()
            })
        },
    a.fn.unErrorify.defaults = {}
} (jQuery),
function(a) {
    a.fn.previewableCommentForm = function(b) {
        var c = a.extend({}, a.fn.previewableCommentForm.defaults, b);
        return this.each(function() {
            var b = a(this);
            if (b.hasClass("previewable-comment-form-attached"))
                return;
            b.addClass("previewable-comment-form-attached");
            var d = b.find("textarea"),
            e = b.find(".content-body"),
            f = b.prev(".comment-form-error"),
            g = b.find(".form-actions button"),
            h = d.val(),
            i = b.attr("data-repository"),
            j = !1,
            k = null,
            l = a.merge(b.find(".preview-dirty"), d);
            l.blur(function() {
                h != d.val() && (j = !0, h = d.val()),
                m()
                });
            var m = function() {
                if (!j)
                    return;
                if (a.trim(h) == "") {
                    e.html("<p>Nothing to preview</p>");
                    return
                }
                e.html("<p>Loading preview&hellip;</p>"),
                k && k.abort();
                var b = a.extend({
                    text: h,
                    repository: i
                }, c.previewOptions);
                k = a.post(c.previewUrl, b, function(a) {
                    e.html(a),
                    c.onSuccess.call(e)
                    })
                };
            a.trim(h) == "" && e.html("<p>Nothing to preview</p>"),
            f.length > 0 && b.closest("form").submit(function() {
                f.hide();
                if (a.trim(d.val()) == "")
                    return f.show(),
                !1;
                g.attr("disabled", "disabled")
                })
            })
        },
    a.fn.previewableCommentForm.defaults = {
        previewUrl: "/preview",
        previewOptions: {},
        onSuccess: function() {}
    }
} (jQuery),
function(a) {
    a.fn.redirector = function(b) {
        var c = a.extend({}, a.fn.redirector.defaults, b);
        if (this.length == 0)
            return;
        a.smartPoller(c.time, function(b) {
            a.getJSON(c.url, function(a) {
                a ? b() : window.location = c.to
            })
            })
        },
    a.fn.redirector.defaults = {
        time: 100,
        url: null,
        to: "/"
    }
} (jQuery),
function(a) {
    a.fn.repoList = function(b) {
        var c = a.extend({}, a.fn.repoList.defaults, b);
        return this.each(function() {
            var b = a(this),
            d = b.find(".repo_list"),
            e = b.find(".show-more"),
            f = b.find(".filter_input").val(""),
            g = f.val(),
            h = e.length == 0 ? !0: !1,
            i = null,
            j = !1;
            e.click(function() {
                if (j)
                    return ! 1;
                var b = e.spin();
                return j = !0,
                a(c.selector).load(c.ajaxUrl, function() {
                    h = !0,
                    b.parents(".repos").find(".filter_selected").click(),
                    b.stopSpin()
                    }),
                b.hide(),
                !1
            });
            var k = function() {
                var a = d.children("li");
                i ? (a.hide(), d.find("li." + i).show()) : a.show(),
                f.val() != "" && a.filter(":not(:Contains('" + f.val() + "'))").hide()
                };
            b.find(".repo_filter").click(function() {
                var c = a(this);
                return b.find(".repo_filterer a").removeClass("filter_selected"),
                c.addClass("filter_selected"),
                i = c.attr("rel"),
                h ? k() : e.click(),
                !1
            });
            var l = "placeholder" in document.createElement("input"),
            m = function() {
                l || (f.val() == "" ? f.addClass("placeholder") : f.removeClass("placeholder"))
                };
            f.bind("keyup blur click", function() {
                if (this.value == g)
                    return;
                g = this.value,
                h ? k() : e.click(),
                m()
                }),
            m()
            })
        },
    a.fn.repoList.defaults = {
        selector: "#repo_listing",
        ajaxUrl: "/dashboard/ajax_your_repos"
    }
} (jQuery),
$.fn.selectableList = function(a, b) {
    return $(this).each(function() {
        var c = $(this),
        d = $.extend({
            toggleClassName: "selected",
            wrapperSelector: "a",
            mutuallyExclusive: !1,
            itemParentSelector: "li",
            enableShiftSelect: !1,
            ignoreLinks: !1
        }, b);
        return c.delegate(a + " " + d.itemParentSelector + " " + d.wrapperSelector, "click", function(b) {
            if (b.which > 1 || b.metaKey || d.ignoreLinks && $(b.target).closest("a").length)
                return ! 0;
            var e = $(this),
            f = e.find(":checkbox, :radio"),
            g = c.find(a + " ." + d.toggleClassName),
            h = c.find(a + " *[data-last]"); ! e.is(":checkbox, :radio") && b.target != f[0] && (f.attr("checked") && !f.is(":radio") ? f.attr("checked", !1) : f.attr("checked", !0)),
            d.mutuallyExclusive && g.removeClass(d.toggleClassName),
            e.toggleClass(d.toggleClassName),
            f.change();
            if (d.enableShiftSelect && b.shiftKey && g.length > 0 && h.length > 0) {
                var i = h.offset().top,
                j = e.offset().top,
                k = "#" + e.attr("id"),
                l = $,
                m = $,
                n = $;
                i > j ? l = h.prevUntil(k) : i < j && (l = h.nextUntil(k)),
                m = l.find(":checkbox"),
                n = l.find(":checked"),
                n.length == m.length ? (l.removeClass(d.toggleClassName), m.attr("checked", !1)) : (l.addClass(d.toggleClassName), m.attr("checked", !0))
                }
            h.removeAttr("data-last"),
            e.attr("data-last", !0)
            }),
        c.delegate(a + " li :checkbox," + a + " li :radio", "change", function(b) {
            var e = $(this),
            f = e.closest(d.wrapperSelector);
            d.mutuallyExclusive && c.find(a + " ." + d.toggleClassName).removeClass(d.toggleClassName),
            $(this).attr("checked") ? f.addClass(d.toggleClassName) : f.removeClass(d.toggleClassName)
            }),
        c.find(a)
        })
    },
$.fn.sortableHeader = function(a, b) {
    return $(this).each(function() {
        var c = $(this),
        d = $.extend({
            itemSelector: "li",
            ascendingClass: "asc",
            descendingClass: "desc"
        }, b);
        c.delegate(a + " " + d.itemSelector, "click", function(a) {
            a.preventDefault();
            var b = $(this);
            b.hasClass(d.ascendingClass) ? (b.removeClass(d.ascendingClass), b.addClass(d.descendingClass)) : b.hasClass(d.descendingClass) ? (b.removeClass(d.descendingClass), b.addClass(d.ascendingClass)) : (b.parent().find("." + d.ascendingClass + ", ." + d.descendingClass).removeClass(d.ascendingClass + " " + d.descendingClass), b.addClass(d.descendingClass))
            })
        })
    },
function(a) {
    a.fn.hardTabs = function(b) {
        var c = a.extend({}, a.fn.hardTabs.defaults, b);
        a(this).hasClass("js-large-data-tabs") && (c.optimizeLargeContents = !0);
        var d = function(b) {
            return c.optimizeLargeContents ? b[0] == null ? a() : (b.is(":visible") && !b[0].style.width && b.css({
                width: b.width() + "px"
            }), b.css({
                position: "absolute",
                left: "-9999px"
            })) : b.hide()
            },
        e = function(b) {
            return c.optimizeLargeContents ? b[0] == null ? a() : (b.is(":visible") || b.show(), b.css({
                position: "",
                left: ""
            })) : b.show()
            };
        return this.each(function() {
            var b = a(this),
            c = a(),
            f = a();
            b.find("a.selected").length == 0 && a(b.find("a")[0]).addClass("selected"),
            b.find("a").each(function() {
                var g = a(this),
                h = a.fn.hardTabs.findLastPathSegment(g.attr("href")),
                i = g.attr("data-container-id") ? g.attr("data-container-id") : h,
                j = a("#" + i);
                d(j);
                var k = function(h) {
                    return h.which == 2 || h.metaKey ? !0: (j = a("#" + i), j.length == 0 ? !0: (d(f), c.removeClass("selected"), f = e(j), c = g.addClass("selected"), "replaceState" in window.history && h != "stop-url-change" && window.history.replaceState(null, document.title, g.attr("href")), b.trigger("tabChanged", {
                        link: g
                    }), !1))
                    };
                g.click(k),
                a('.js-secondary-hard-link[href="' + g.attr("href") + '"]').click(k),
                g.hasClass("selected") && k("stop-url-change")
                })
            })
        },
    a.fn.hardTabs.defaults = {
        optimizeLargeContents: !1
    },
    a.fn.hardTabs.findLastPathSegment = function(a) {
        a == null && (a = document.location.pathname),
        a = a.replace(/\?.+|#.+/, "");
        var b = a.match(/[^\/]+\/?$/);
        return b.length == 0 && alert("Invalid tab link!"),
        b[0].replace("/", "")
        }
} (jQuery),
function() {
    var a;
    Modernizr.hashchange || (a = window.location.hash, setInterval(function() {
        if (window.location.hash !== a)
            return a = window.location.hash,
        $(window).trigger("hashchange")
        }, 50))
    }.call(this),
function() {
    var a,
    b,
    c,
    d,
    e,
    f,
    g;
    b = {
        8: "backspace",
        9: "tab",
        13: "enter",
        16: "shift",
        17: "ctrl",
        18: "alt",
        19: "pause",
        20: "capslock",
        27: "esc",
        32: "space",
        33: "pageup",
        34: "pagedown",
        35: "end",
        36: "home",
        37: "left",
        38: "up",
        39: "right",
        40: "down",
        45: "insert",
        46: "del",
        48: "0",
        49: "1",
        50: "2",
        51: "3",
        52: "4",
        53: "5",
        54: "6",
        55: "7",
        56: "8",
        57: "9",
        65: "a",
        66: "b",
        67: "c",
        68: "d",
        69: "e",
        70: "f",
        71: "g",
        72: "h",
        73: "i",
        74: "j",
        75: "k",
        76: "l",
        77: "m",
        78: "n",
        79: "o",
        80: "p",
        81: "q",
        82: "r",
        83: "s",
        84: "t",
        85: "u",
        86: "v",
        87: "w",
        88: "x",
        89: "y",
        90: "z",
        91: "meta",
        93: "meta",
        96: "0",
        97: "1",
        98: "2",
        99: "3",
        100: "4",
        101: "5",
        102: "6",
        103: "7",
        104: "8",
        105: "9",
        106: "*",
        107: "+",
        109: "-",
        110: ".",
        111: "/",
        112: "f1",
        113: "f2",
        114: "f3",
        115: "f4",
        116: "f5",
        117: "f6",
        118: "f7",
        119: "f8",
        120: "f9",
        121: "f10",
        122: "f11",
        123: "f12",
        144: "numlock",
        145: "scroll",
        186: ";",
        187: "=",
        188: ",",
        189: "-",
        190: ".",
        191: "/",
        192: "`",
        219: "[",
        220: "\\",
        221: "]",
        222: "'"
    },
    d = {
        48: ")",
        49: "!",
        50: "@",
        51: "#",
        52: "$",
        53: "%",
        54: "^",
        55: "&",
        56: "*",
        57: "(",
        65: "A",
        66: "B",
        67: "C",
        68: "D",
        69: "E",
        70: "F",
        71: "G",
        72: "H",
        73: "I",
        74: "J",
        75: "K",
        76: "L",
        77: "M",
        78: "N",
        79: "O",
        80: "P",
        81: "Q",
        82: "R",
        83: "S",
        84: "T",
        85: "U",
        86: "V",
        87: "W",
        88: "X",
        89: "Y",
        90: "Z",
        186: ":",
        187: "+",
        188: "<",
        189: "_",
        190: ">",
        191: "?",
        192: "~",
        219: "{",
        220: "|",
        221: "}",
        222: '"'
    },
    a = function(a) {
        var c,
        e,
        f;
        return c = b[a.which],
        e = "",
        a.ctrlKey && c !== "ctrl" && (e += "ctrl+"),
        a.altKey && c !== "alt" && (e += "alt+"),
        a.metaKey && !a.ctrlKey && c !== "meta" && (e += "meta+"),
        a.shiftKey ? (f = d[a.which]) ? "" + e + f: c === "shift" ? "" + e + "shift": c ? "" + e + "shift+" + c: null: c ? "" + e + c: null
    },
    g = ["keydown", "keyup"];
    for (e = 0, f = g.length; e < f; e++)
        c = g[e],
    $.event.special[c] = {
        add: function(b) {
            var c;
            return c = b.handler,
            b.handler = function(b) {
                return b.hotkey == null && (b.hotkey = a(b)),
                c.apply(this, arguments)
                }
        }
    }
}.call(this),
function() {
    var a;
    a = {},
    $(document).bind("keydown", function(b) {
        var c;
        if ($(b.target).is(":input"))
            return;
        if (c = a[b.hotkey])
            return c.apply(this, arguments)
        }),
    $.hotkeys = function(a) {
        var b,
        c;
        for (b in a)
            c = a[b],
        $.hotkey(b, c);
        return this
    },
    $.hotkey = function(b, c) {
        return a[b] = c,
        this
    }
}.call(this),
function($) {
    $.fn.editable = function(a, b) {
        var c = {
            target: a,
            name: "value",
            id: "id",
            type: "text",
            width: "auto",
            height: "auto",
            event: "click",
            onblur: "cancel",
            loadtype: "GET",
            loadtext: "Loading...",
            placeholder: "Click to edit",
            submittype: "post",
            loaddata: {},
            submitdata: {}
        };
        b && $.extend(c, b);
        var d = $.editable.types[c.type].plugin || function() {},
        e = $.editable.types[c.type].submit || function() {},
        f = $.editable.types[c.type].buttons || $.editable.types.defaults.buttons,
        g = $.editable.types[c.type].content || $.editable.types.defaults.content,
        h = $.editable.types[c.type].element || $.editable.types.defaults.element,
        i = c.callback || function() {};
        return $.isFunction($(this)[c.event]) || ($.fn[c.event] = function(a) {
            return a ? this.bind(c.event, a) : this.trigger(c.event)
            }),
        $(this).attr("title", c.tooltip),
        c.autowidth = "auto" == c.width,
        c.autoheight = "auto" == c.height,
        this.each(function() {
            $.trim($(this).html()) || $(this).html(c.placeholder),
            $(this)[c.event](function(a) {
                function o() {
                    $(b).html(b.revert),
                    b.editing = !1,
                    $.trim($(b).html()) || $(b).html(c.placeholder)
                    }
                var b = this;
                if (b.editing)
                    return;
                $(b).css("visibility", "hidden"),
                c.width != "none" && (c.width = c.autowidth ? $(b).width() : c.width),
                c.height != "none" && (c.height = c.autoheight ? $(b).height() : c.height),
                $(this).css("visibility", ""),
                $(this).html().toLowerCase().replace(/;/, "") == c.placeholder.toLowerCase().replace(/;/, "") && $(this).html(""),
                b.editing = !0,
                b.revert = $(b).html(),
                $(b).html("");
                var j = $("<form/>");
                c.cssclass && ("inherit" == c.cssclass ? j.attr("class", $(b).attr("class")) : j.attr("class", c.cssclass)),
                c.style && ("inherit" == c.style ? (j.attr("style", $(b).attr("style")), j.css("display", $(b).css("display"))) : j.attr("style", c.style));
                var k = h.apply(j, [c, b]),
                l;
                if (c.loadurl) {
                    var m = setTimeout(function() {
                        k.disabled = !0,
                        g.apply(j, [c.loadtext, c, b])
                        }, 100),
                    n = {};
                    n[c.id] = b.id,
                    $.isFunction(c.loaddata) ? $.extend(n, c.loaddata.apply(b, [b.revert, c])) : $.extend(n, c.loaddata),
                    $.ajax({
                        type: c.loadtype,
                        url: c.loadurl,
                        data: n,
                        async: !1,
                        success: function(a) {
                            window.clearTimeout(m),
                            l = a,
                            k.disabled = !1
                        }
                    })
                    } else
                    c.data ? (l = c.data, $.isFunction(c.data) && (l = c.data.apply(b, [b.revert, c]))) : l = b.revert;
                g.apply(j, [l, c, b]),
                k.attr("name", c.name),
                f.apply(j, [c, b]),
                d.apply(j, [c, b]),
                $(b).append(j),
                $(":input:visible:enabled:first", j).focus(),
                c.select && k.select(),
                k.keydown(function(a) {
                    a.keyCode == 27 && (k.blur(), a.preventDefault(), o())
                    });
                var m;
                "cancel" == c.onblur ? k.blur(function(a) {
                    m = setTimeout(o, 500)
                    }) : "submit" == c.onblur ? k.blur(function(a) {
                    j.submit()
                    }) : $.isFunction(c.onblur) ? k.blur(function(a) {
                    c.onblur.apply(b, [k.val(), c])
                    }) : k.blur(function(a) {}),
                j.submit(function(a) {
                    m && clearTimeout(m),
                    a.preventDefault(),
                    e.apply(j, [c, b]);
                    if ($.isFunction(c.target)) {
                        var d = c.target.apply(b, [k.val(), c]);
                        $(b).html(d),
                        b.editing = !1,
                        i.apply(b, [b.innerHTML, c]),
                        $.trim($(b).html()) || $(b).html(c.placeholder)
                        } else {
                        var f = {};
                        f[c.name] = k.val(),
                        f[c.id] = b.id,
                        $.isFunction(c.submitdata) ? $.extend(f, c.submitdata.apply(b, [b.revert, c])) : $.extend(f, c.submitdata),
                        $(b).html(c.indicator),
                        $.ajax({
                            type: c.submittype,
                            url: c.target,
                            data: f,
                            success: function(a) {
                                $(b).html(a),
                                b.editing = !1,
                                i.apply(b, [b.innerHTML, c]),
                                $.trim($(b).html()) || $(b).html(c.placeholder)
                                }
                        })
                        }
                    return ! 1
                }),
                $(b).bind("reset", o)
                })
            })
        },
    $.editable = {
        types: {
            defaults: {
                element: function(a, b) {
                    var c = $('<input type="hidden">');
                    return $(this).append(c),
                    c
                },
                content: function(a, b, c) {
                    $(":input:first", this).val(a)
                    },
                buttons: function(a, b) {
                    if (a.submit) {
                        var c = $('<input type="submit">');
                        c.val(a.submit),
                        $(this).append(c)
                        }
                    if (a.cancel) {
                        var d = $('<input type="button">');
                        d.val(a.cancel),
                        $(this).append(d),
                        $(d).click(function() {
                            $(b).html(b.revert),
                            b.editing = !1
                        })
                        }
                }
            },
            text: {
                element: function(a, b) {
                    var c = $("<input>");
                    return a.width != "none" && c.width(a.width),
                    a.height != "none" && c.height(a.height),
                    c.attr("autocomplete", "off"),
                    $(this).append(c),
                    c
                }
            },
            textarea: {
                element: function(a, b) {
                    var c = $("<textarea>");
                    return a.rows ? c.attr("rows", a.rows) : c.height(a.height),
                    a.cols ? c.attr("cols", a.cols) : c.width(a.width),
                    $(this).append(c),
                    c
                }
            },
            select: {
                element: function(a, b) {
                    var c = $("<select>");
                    return $(this).append(c),
                    c
                },
                content: function(string, settings, original) {
                    if (String == string.constructor) {
                        eval("var json = " + string);
                        for (var key in json) {
                            if (!json.hasOwnProperty(key))
                                continue;
                            if ("selected" == key)
                                continue;
                            var option = $("<option>").val(key).append(json[key]);
                            $("select", this).append(option)
                            }
                    }
                    $("select", this).children().each(function() {
                        $(this).val() == json["selected"] && $(this).attr("selected", "selected")
                        })
                    }
            }
        },
        addInputType: function(a, b) {
            $.editable.types[a] = b
        }
    }
} (jQuery),
function(a) {
    a(".js-oneclick").live("click", function(b) {
        b.preventDefault();
        var c = a(this),
        d = c.attr("data-afterclick") || "Loading??;return c.attr("disabled ")?!0:(c.attr("disabled ","disabled "),setTimeout(function(){c.find("span ").length>0?c.find("span ").text(d):c.text(d)},50),a(this).parents("form ").submit(),!0)})}(jQuery),function(a){function b(a,b){var c=a.find("a ");if(c.length>1){var d=c.filter(".selected "),e=c.get().indexOf(d.get(0));return e+=b,e>=c.length?e=0:e<0&&(e=c.length-1),d.removeClass("selected "),c.eq(e).addClass("selected "),!0}}a.fn.quicksearch=function(c){var d=a.extend({url:null,delay:150,spinner:null,insertSpinner:null,loading:a(".quicksearch - loading ")},c);d.insertSpinner&&!d.spinner&&(d.spinner=a('<img src="'+GitHub.Ajax.spinner+'" alt="" class="spinner " />'));var e=function(a){return d.results.html(a).show()};return d.results.delegate("a ","mouseover ",function(b){var c=a(this);c.hasClass("selected ")||(d.results.find("a.selected ").removeClass("selected "),c.addClass("selected "))}),this.each(function(){function f(){d.insertSpinner&&(d.spinner.parent().length||d.insertSpinner.call(c,d.spinner),d.spinner.show()),c.trigger("quicksearch.loading "),d.loading&&e(d.loading.html())}function g(){d.insertSpinner&&d.spinner.hide(),c.trigger("quicksearch.loaded ")}var c=a(this);c.autocompleteField({url:d.url||c.attr("data - url "),dataType:d.dataType,delay:d.delay,useCache:!0,minLength:2}).bind("keyup ",function(a){a.which!=13&&c.val().length>=2&&d.results.is(": empty ")&&f()}).bind("autocomplete: beforesend ",function(a,b){f()}).bind("autocomplete: finish ",function(a,b){e(b||{}),g()}).bind("autocomplete: clear ",function(a){d.results.html("").hide(),g()}).bind("focus ",function(a){c.val()&&c.trigger("keyup ")}).bind("blur ",function(a){setTimeout(function(){c.trigger("autocomplete: clear ")},150)}).bind("keydown ",function(c){switch(c.hotkey){case"up ":if(b(d.results,-1))return!1;break;case"down ":if(b(d.results,1))return!1;break;case"esc ":return a(this).blur(),!1;case"enter ":var e,f=d.results.find("a.selected ");if(f.length)return a(this).blur(),f.hasClass("initial ")?f.closest("form ").submit():window.location=f.attr("href "),!1;a(this).trigger("autocomplete: clear ")}})})}}(jQuery),function(a){a.put=function(a,b,c,d){var e=null;return jQuery.isFunction(b)&&(c=b,b={}),jQuery.isPlainObject(c)&&(e=c.error,c=c.success),jQuery.ajax({type:"PUT ",url:a,data:b,success:c,error:e,dataType:d})},a.del=function(a,b,c,d){var e=null;return jQuery.isFunction(b)&&(c=b,b={}),jQuery.isPlainObject(c)&&(e=c.error,c=c.success),jQuery.ajax({type:"DELETE ",url:a,data:b,success
:c,error:e,dataType:d})}}(jQuery),function(a){a.smartPoller=function(b,c){a.isFunction(b)&&(c=b,b=1e3),function d(){setTimeout(function(){c.call(this,d)},b),b*=1.1}()}}(jQuery),jQuery.fn.tabs=function(){var a=function(a){return/#([a-z][\w.:-]*)$/i.exec(a)[1]},b=window.location.hash.substr(1);return this.each(function(){var c=null,d=null;$(this).find("li a ").each(function(){var b=$("#"+a(this.href));if(b==[])return;b.hide(),$(this).click(function(){var a=$(this),e=function(){d&&d.hide(),c&&c.removeClass("selected "),c=a.addClass("selected "),d=b.show().trigger("tabChanged ",{link:c})};return a.attr("ajax ")?(a.addClass("loading "),$.ajax({url:a.attr("ajax "),success:function(c){b.html(c),a.removeClass("loading "),a[0].removeAttribute("ajax "),e()},failure:function(a){alert("An error occured,
        please reload the page ")}})):e(),!1}),$(this).hasClass("selected ")&&$(this).click()}),$(this).find("li a[href = '#"+b+"']").click(),d==null&&$($(this).find("li a ")[0]).click()})},function(a){var b=function(){var a=typeof document.selection!="undefined "&&typeof document.selection.createRange!="undefined ";return{getSelectionRange:function(b){var c,d,e,f,g,h;b.focus();if(typeof b.selectionStart!="undefined ")c=b.selectionStart,d=b.selectionEnd;else{if(!a)throw"Unable to get selection range.";e=document.selection.createRange(),f=e.text.length;if(e.parentElement()!==b)throw"Unable to get selection range.";b.type==="textarea "?(g=e.duplicate(),g.moveToElementText(b),g.setEndPoint("EndToEnd ",e),c=g.text.length-f):(h=b.createTextRange(),h.setEndPoint("EndToStart ",e),c=h.text.length),d=c+f}return{start:c,end:d}},getSelectionStart:function(a){return this.getSelectionRange(a).start},getSelectionEnd:function(a){return this.getSelectionRange(a).end},setSelectionRange:function(b,c,d){var e,f;b.focus(),typeof d=="undefined "&&(d=c);if(typeof b.selectionStart!="undefined ")b.setSelectionRange(c,d);else{if(!a)throw"Unable to set selection range.";e=b.value,f=b.createTextRange(),d-=c+e.slice(c+1,d).split("\n ").length-1,c-=e.slice(0,c).split("\n ").length-1,f.move("character ",c),f.moveEnd("character ",d),f.select()}},getSelectedText:function(a){var b=this.getSelectionRange(a);return a.value.substring(b.start,b.end)},insertText:function(a,b,c,d,e){d=d||c;var f=b.length,g=c+f,h=a.value.substring(0,c),i=a.value.substr(d);a.value=h+b+i,e===!0?this.setSelectionRange(a,c,g):this.setSelectionRange(a,g)},replaceSelectedText:function(a,b,c){var d=this.getSelectionRange(a);this.insertText(a,b,d.start,d.end,c)},wrapSelectedText:function(a,b,c,d){var e=b+this.getSelectedText(a)+c;this.replaceSelectedText(a,e,d)}}}();window.Selection=b,a.fn.extend({getSelectionRange:function(){return b.getSelectionRange(this[0])},getSelectionStart:function(){return b.getSelectionStart(this[0])},getSelectionEnd:function(){return b.getSelectionEnd(this[0])},getSelectedText:function(){return b.getSelectedText(this[0])},setSelectionRange:function(a,c){return this.each(function(){b.setSelectionRange(this,a,c)})},insertText:function(a,c,d,e){return this.each(function(){b.insertText(this,a,c,d,e)})},replaceSelectedText:function(a,c){return this.each(function(){b.replaceSelectedText(this,a,c)})},wrapSelectedText:function(a,c,d){return this.each(function(){b.wrapSelectedText(this,a,c,d)})}})}(jQuery),function(a){a.fn.tipsy=function(b){b=a.extend({fade:!1,gravity:"n ",title:"title ",fallback:""},b||{});var c=null;a(this).hover(function(){a.data(this,"cancel.tipsy ",!0);var c=a.data(this,"active.tipsy ");c||(c=a('<div class="tipsy "><div class="tipsy - inner "/></div>'),c.css({position:"absolute ",zIndex:1e5}),a.data(this,"active.tipsy ",c)),(a(this).attr("title ")||!a(this).attr("original - title "))&&a(this).attr("original - title ",a(this).attr("title ")||"").removeAttr("title ");var d;typeof b.title=="string "?d=a(this).attr(b.title=="title "?"original - title ":b.title):typeof b.title=="function "&&(d=b.title.call(this)),c.find(".tipsy - inner ").html(d||b.fallback);var e=a.extend({},a(this).offset(),{width:this.offsetWidth,height:this.offsetHeight});c.get(0).className="tipsy ",c.remove().css({top:0,left:0,visibility:"hidden ",display:"block "}).appendTo(document.body);var f=c[0].offsetWidth,g=c[0].offsetHeight,h=typeof b.gravity=="function "?b.gravity.call(this):b.gravity;switch(h.charAt(0)){case"n ":c.css({top:e.top+e.height,left:e.left+e.width/2-f/2}).addClass("tipsy - north ");break;case"s ":c.css({top:e.top-g,left:e.left+e.width/2-f/2}).addClass("tipsy - south ");break;case"e ":c.css({top:e.top+e.height/2-g/2,left:e.left-f}).addClass("tipsy - east ");break;case"w ":c.css({top:e.top+e.height/2-g/2,left:e.left+e.width}).addClass("tipsy - west ")}b.fade?c.css({opacity:0,display:"block ",visibility:"visible "}).animate({opacity:.8}):c.css({visibility:"visible "})},function(){a.data(this,"cancel.tipsy ",!1);var c=this;setTimeout(function(){if(a.data(this,"cancel.tipsy "))return;var d=a.data(c,"active.tipsy ");d&&(b.fade?d.stop().fadeOut(function(){a(this).remove()}):d.remove())},100)}),a(this).bind("tipsy.reload ",function(){a(this).attr("title ")&&a(this).attr("original - title ",a(this).attr("title ")||"").removeAttr("title ");var c;typeof b.title=="string "?c=a(this).attr(b.title=="title "?"original - title ":b.title):typeof b.title=="function "&&(c=b.title.call(this));var d=a.data(this,"active.tipsy ");d.find(".tipsy - inner ").text(c||b.fallback);var e=a.extend({},a(this).offset(),{width:this.offsetWidth,height:this.offsetHeight}),f=d[0].offsetWidth,g=d[0].offsetHeight,h=typeof b.gravity=="function "?b.gravity.call(this):b.gravity;switch(h.charAt(0)){case"n ":d.css({top:e.top+e.height,left:e.left+e.width/2-f/2});break;case"s ":d.css({top:e.top-g,left:e.left+e.width/2-f/2});break;case"e ":d.css({top:e.top+e.height/2-g/2,left:e.left-f});break;case"w ":d.css({top:e.top+e.height/2-g/2,left:e.left+e.width})}})},a.fn.tipsy.autoNS=function(){return a(this).offset().top>a(document).scrollTop()+a(window).height()/2?"s ":"n "}}(jQuery),function(a){function e(a){return"tagName "in a?a:a.parentNode}try{window.document.createEvent("TouchEvent ")}catch(b){return!1}var c={},d;a(document).ready(function(){a(document.body).bind("touchstart ",function(a){var b=Date.now(),f=b-(c.last||b);c.target=e(a.originalEvent.touches[0].target),d&&clearTimeout(d),c.x1=a.originalEvent.touches[0].pageX,f>0&&f<=250&&(c.isDoubleTap=!0),c.last=b}).bind("touchmove ",function(a){c.x2=a.originalEvent.touches[0].pageX}).bind("touchend ",function(b){c.isDoubleTap?(a(c.target).trigger("doubleTap "),c={}):c.x2>0?(Math.abs(c.x1-c.x2)>30&&a(c.target).trigger("swipe ")&&a(c.target).trigger("swipe "+(c.x1-c.x2>0?"Left ":"Right ")),c.x1=c.x2=c.last=0):"last "in c&&(d=setTimeout(function(){d=null,a(c.target).trigger("tap "),c={}},250))}).bind("touchcancel ",function(){c={}})}),["swipe ","swipeLeft ","swipeRight ","doubleTap ","tap "].forEach(function(b){a.fn[b]=function(a){return this.bind(b,a)}})}(jQuery),jQuery.fn.truncate=function(a,b){function e(a){d&&a.style.removeAttribute("filter ")}b=jQuery.extend({chars:/\s/,trail:["...",""]},b);var c={},d=$.browser.msie;return this.each(function(){var d=jQuery(this),f=d.html().replace(/\r\n/gim,""),g=f,h=/<\/?[^<>]*\/?>/gim,i,j={},k=$(" * ").index(this);while((i=h.exec(g))!=null)j[i.index]=i[0];g=jQuery.trim(g.split(h).join(""));if(g.length>a){var l;while(a<g.length){l=g.charAt(a);if(l.match(b.chars)){g=g.substring(0,a);break}a--}if(f.search(h)!=-1){var m=0;for(eachEl in j)g=[g.substring(0,eachEl),j[eachEl],g.substring(eachEl,g.length)].join(""),eachEl<g.length&&(m=g.length);d.html([g.substring(0,m),g.substring(m,g.length).replace(/<(\w+)[^>]*>.*<\/\1>/gim,"").replace(/<(br|hr|img|input)[^<>]*\/?>/gim,"")].join(""))}else d.html(g);c[k]=f,d.html([" < div class = 'truncate_less' > ",d.html(),b.trail[0]," < /div>"].join("")).find(".truncate_show",this).click(function(){return d.find(".truncate_more").length==0&&d.append(["<div class='truncate_more' style='display: none;'>",c[k],b.trail[1],"</div > "].join("")).find(".truncate_hide ").click(function(){return d.find(".truncate_more ").css("background ","#fff ").fadeOut("normal ",function(){d.find(".truncate_less ").css("background ","#fff ").fadeIn("normal ",function(){e(this),$(this).css("background ","none ")}),e(this)}),!1}),d.find(".truncate_less ").fadeOut("normal ",function(){d.find(".truncate_more ").fadeIn("normal ",function(){e(this)}),e(this)}),jQuery(".truncate_show ",d).click(function(){return d.find(".truncate_less ").css("background ","#fff ").fadeOut("normal ",function(){d.find(".truncate_more ").css("background ","#fff ").fadeIn("normal ",function(){e(this),$(this).css("background ","none ")}),e(this)}),!1}),!1})}})},function(a){function o(){return window.DeviceMotionEvent!=undefined}function p(b){if((new Date).getTime()<d+c)return;if(o()){var e=b.accelerationIncludingGravity,f=e.x,g=e.y;l.xArray.length>=5&&l.xArray.shift(),l.yArray.length>=5&&l.yArray.shift(),l.xArray.push(f),l.yArray.push(g),l.xMotion=Math.round((n(l.xArray)-m(l.xArray))*1e3)/1e3,l.yMotion=Math.round((n(l.yArray)-m(l.yArray))*1e3)/1e3,(l.xMotion>1.5||l.yMotion>1.5)&&i!=10&&(i=10),l.xMotion>j||l.yMotion>j?k++:k=0,k>=5?(h=!0,a(document).unbind("mousemove.plax "),a(window).bind("devicemotion ",q(b))):(h=!1,a(window).unbind("devicemotion "),a(document).bind("mousemove.plax ",function(a){q(a)}))}}function q(a){if((new Date).getTime()<d+c)return;d=(new Date).getTime();var b=a.pageX,j=a.pageY;if(h==1){var k=window.orientation?(window.orientation+180)%360/90:2,l=a.accelerationIncludingGravity,m=k%2==0?-l.x:l.y,n=k%2==0?l.y:l.x;b=k>=2?m:-m,j=k>=2?n:-n,b=(b+i)/2,j=(j+i)/2,b<0?b=0:b>i&&(b=i),j<0?j=0:j>i&&(j=i)}var o=b/(h==1?i:f),p=j/(h==1?i:g),q,k;for(k=e.length;k--;)q=e[k],q.invert!=1?q.obj.css("left ",q.startX+q.xRange*o).css("top ",q.startY+q.yRange*p):q.obj.css("left ",q.startX-q.xRange*o).css("top ",q.startY-q.yRange*p)}var b=25,c=1/b*1e3,d=(new Date).getTime(),e=[],f=a(window).width(),g=a(window).height(),h=!1,i=1,j=.05,k=0,l={xArray:[0,0,0,0,0],yArray:[0,0,0,0,0],xMotion:0,yMotion:0};a(window).resize(function(){f=a(window).width(),g=a(window).height()}),a.fn.plaxify=function(b){return this.each(function(){var c={xRange:0,yRange:0,invert:!1};for(var d in b)c[d]==0&&(c[d]=b[d]);c.obj=a(this),c.startX=this.offsetLeft,c.startY=this.offsetTop,c.invert==0?(c.startX-=Math.floor(c.xRange/2),c.startY-=Math.floor(c.yRange/2)):(c.startX+=Math.floor(c.xRange/2),c.startY+=Math.floor(c.yRange/2)),e.push(c)})};var m=function(a){return Math.min.apply({},a)},n=function(a){return Math.max.apply({},a)};a.plax={enable:function(){a(document).bind("mousemove.plax ",function(a){q(a)}),o()&&(window.ondevicemotion=function(a){p(a)})},disable:function(){a(document).unbind("mousemove.plax "),window.ondevicemotion=undefined}},typeof ender!="undefined "&&a.ender(a.fn,!0)}(function(){return typeof jQuery!="undefined "?jQuery:ender}()),String.prototype.score=function(a,b){var c=0,d=a.length,e=this,f=e.length,g,h,i=1,j;if(e==a)return 1;for(var k=0,l,m,n,o,p,q;k<d;++k){n=a[k],o=e.indexOf(n.toLowerCase()),p=e.indexOf(n.toUpperCase()),q=Math.min(o,p),m=q>-1?q:Math.max(o,p);if(m===-1){if(b){i+=1-b;break}return 0}l=.1,e[m]===n&&(l+=.1),m===0&&(l+=.6,k===0&&(g=1)),e.charAt(m-1)===""&&(l+=.8),e=e.substring(m+1,f),c+=l}return h=c/d,j=(h*(d/f)+h)/2,j/=i,g&&j+.15<1&&(j+=.15),j},window.GitHub||(window.GitHub={});if(typeof console=="undefined "||typeof console.log=="undefined ")window.console={log:function(){}};window.GitHub.debug=!1,window.debug=function(){},navigator.userAgent.match("Propane ")||top!=window&&(top.location.replace(document.location),alert("For security reasons,
        framing is not allowed.")),GitHub.gravatar=function(a,b){b=b||35;var c=location.protocol=="https: "?"https: 
        //secure.gravatar.com":"http://gravatar.com",d=location.protocol=="https:"?"https":"http";return'<img src="'+c+"/avatar/"+a+"?s=140&d="+d+'%3A%2F%2Fgithub.com%2Fimages%2Fgravatars%2Fgravatar-140.png" width="'+b+'" height="'+b+'" />'},String.prototype.capitalize=function(){return this.replace(/\w+/g,function(a){return a.charAt(0).toUpperCase()+a.substr(1).toLowerCase()})},jQuery.expr[":"].Contains=function(a,b,c){return(a.textContent||a.innerText||"").toLowerCase().indexOf(c[3].toLowerCase())>=0},$.fn.scrollTo=function(a,b){var c,d;typeof a=="number"||!a?(b=a,c=this,d="html,body"):(c=a,d=this);var e=$(c).offset().top-30;return $(d).animate({scrollTop:e},b||1e3),this},$.fn.spin=function(){return this.after('<img src="'+GitHub.Ajax.spinner+'" id="spinner"/>')},$.fn.stopSpin=function(){return $("#spinner").remove(),this},$.fn.contextLoader=function(a){var b='<div class="context-loader">Sending Request&hellip;</div>';return this.after($(b).css("top",a))},GitHub.Ajax={spinner:"https://a248.e.akamai.net/assets.github.com/images/spinners/octocat-spinner-16px.gif",error:"https://a248.e.akamai.net/assets.github.com/images/modules/ajax/error.png"},$(function(){function c(){$("#facebox .shortcuts:visible").length?$.facebox.close():($(document).one("reveal.facebox",function(){$(".js-see-all-keyboard-shortcuts").click(function(){return $(this).remove(),$("#facebox :hidden").show(),!1})}),$.facebox({div:"#keyboard_shortcuts_pane"},"shortcuts"))}function d(){$("#facebox .cheatsheet:visible").length?$.facebox.close():$.facebox({div:"#markdown-help"},"cheatsheet")}var a=new Image;a.src=GitHub.Ajax.spinner,$(".previewable-comment-form").previewableCommentForm(),$(".cards_select").cardsSelect(),$(document).bind("reveal.facebox",function(){$(".cards_select").cardsSelect()}),$(".flash .close").click(function(){$(this).closest(".flash").fadeOut(300)}),$(".toggle_link").click(function(){return $($(this).attr("href")).toggle(),!1}),$(".hide_div").click(function(){return $(this).parents("div:first").fadeOut(),!1});var b=$("#login_field");b.val()?b.length&&$("#password").focus():b.focus(),$("#confirm-password").focus(),$("#versions_select").change(function(){location.href=this.value}),$.pageUpdate(function(){$(this).find("a[rel*=facebox]").facebox()}),$(this).find("a[rel*=facebox]").facebox(),$(".pjax a").pjax(".site:first .container"),$(".js-date-input").date_input(),$.fn.truncate&&$(".truncate").bind("truncate",function(){$(this).truncate(50,{chars:/.*/})}).trigger("truncate"),$.hotkeys({s:function(){return e.focus(),!1},m:function(){d()}}),$(document).on("keypress",function(a){if($(a.target).is(":input"))return;if(a.which===63)return c(),!1}),$(".gfm-help").click(function(a){a.preventDefault(),d()});var e=$(".topsearch input[name=q]");$("button, .minibutton").live("mousedown",function(){$(this).addClass("mousedown")}).live("mouseup mouseleave",function(){$(this).removeClass("mousedown")}),$("ul.inline-tabs").tabs(),$(".js-hard-tabs").hardTabs(),BaconPlayer.sm2="/javascripts/soundmanager/sm2.js",$("button.classy, a.button.classy").mousedown(function(){$(this).addClass("mousedown")}).bind("mouseup mouseleave",function(){$(this).removeClass("mousedown")}),$(document).editableComment()}),$.pageUpdate(function(){$(this).find(".js-placeholder-field label.placeholder").fancyplace(),$(this).find(".js-entice").each(function(){$(this).enticeToAction({title:$(this).attr("data-entice")})}),$(this).find(".tooltipped").each(function(){var a=$(this),b=a.hasClass("downwards")?"n":"s";b=a.hasClass("rightwards")?"w":b,b=a.hasClass("leftwards")?"e":b,a.tipsy({gravity:b})})}),$.extend($.facebox.settings,{loadingImage:"https://a248.e.akamai.net/assets.github.com/images/spinners/octocat-spinner-32.gif",closeImage:"https://a248.e.akamai.net/assets.github.com/images/modules/facebox/closelabel.png"}),function(){$(function(){var a;return $(document).on("click",".section-head",function(b){var c;return c=$(b.currentTarget).next(".section-nav"),a.expand(c)}),a={collapse:function(a){return a.slideUp(200),a.addClass("collapsed")},expand:function(b){var c,d,e,f;d=$(".section-nav");for(e=0,f=d.length;e<f;e++)c=d[e],a.collapse($(c));return b.slideDown(200),b.removeClass("collapsed")}}})}.call(this),function(){$(document).on("ajaxError","[data-remote]",function(a,b,c,d){if(a.isDefaultPrevented())return;return debug("AJAX Error",d),$(document.documentElement).addClass("ajax-error")}),$(document).on("ajaxBeforeSend","[data-remote]",function(a,b,c){return $(document.documentElement).removeClass("ajax-error")}),$(document).on("click",".ajax-error-dismiss",function(){return $(document.documentElement).removeClass("ajax-error"),!1})}.call(this),function(){var a,b,c,d;window._gaq==null&&(window._gaq=[]),_gaq.push(["_setAccount","UA-3769691-2"]),_gaq.push(["_setDomainName","none"]),_gaq.push(["_trackPageview"]),_gaq.push(["_trackPageLoadTime"]),document.title==="404 - GitHub"&&(d=document.location.pathname+document.location.search,a=document.referrer,_gaq.push(["_trackPageview","/404.html?page="+d+"&from="+a])),b=document.createElement("script"),b.type="text/javascript",b.async=!0,c=document.location.protocol==="https:"?"https://ssl":"http://www",b.src=""+c+".google-analytics.com/ga.js",document.getElementsByTagName("head")[0].appendChild(b),window._gauges==null&&(window._gauges=[]),window.location.pathname.match(/\/blog/)===null&&$(function(){var a,b;return a=document.createElement("script"),a.type="text/javascript",a.async=!0,a.id="gauges-tracker",a.setAttribute("data-site-id","4f5634b5613f5d0429000010"),a.src="https://secure.gaug.es/track.js",b=document.getElementsByTagName("script")[0],b.parentNode.insertBefore(a,b)})}.call(this),function(){var a,b,c;c=function(a){var b;while(a!==document.body){b=$(a).css("overflow-y");if(b==="auto"||b==="scroll")break;a=$(a).offsetParent()[0]}return a},b=function(a,b){var c,d;d=0,c=a.offsetHeight;while(!!a&&a!==b)d+=a.offsetTop||0,a=a.offsetParent;return{top:d,bottom:b.scrollHeight-(d+c)}},a=function(a,c){var d,e,f;return e=b(a,c),f=e.top-c.scrollTop,d=c.offsetHeight-(f+a.offsetHeight),{top:f,bottom:d}},$.fn.scrollContainer=function(){return $(c(this[0]))},$.fn.relativeOffset=function(b){return a(this[0],b)},$.fn.relativeScroll=function(a){return b(this[0],a)}}.call(this),function(){var a,b=function(a,b){return function(){return a.apply(b,arguments)}};a=function(){function a(){this.onFocus=b(this.onFocus,this),this.onDeactivate=b(this.onDeactivate,this),this.onActivate=b(this.onActivate,this),this.onClick=b(this.onClick,this),this.onItemMouseOver=b(this.onItemMouseOver,this),this.onContainerKeyDown=b(this.onContainerKeyDown,this),this.onItemKeyDown=b(this.onItemKeyDown,this),this.onKeyDown=b(this.onKeyDown,this),this.onContainerMouseOver=b(this.onContainerMouseOver,this),this.onPageUpdate=b(this.onPageUpdate,this),$(window).on("pageUpdate",this.onPageUpdate),$(document).on("keydown",this.onKeyDown),$(document).on("click","#js-active-navigation-container .js-navigation-target",this.onClick),$(document).on("navigation:activate",".js-navigation-container",this.onActivate),$(document).on("navigation:deactivate",".js-navigation-container",this.onDeactivate),$(document).on("navigation:focus",".js-navigation-container",this.onFocus),$(document).on("navigation:keydown","#js-active-navigation-container .js-navigation-item",this.onItemKeyDown),$(document).on("navigation:keydown","#js-active-navigation-container",this.onContainerKeyDown),$(document).on("navigation:mouseover","#js-active-navigation-container .js-navigation-item",this.onItemMouseOver)}return a.prototype.ctrlBindings=navigator.userAgent.match(/Macintosh/),a.prototype.onPageUpdate=function(a){return $(a.target).find(".js-navigation-container").off("mouseover.navigation").on("mouseover.navigation",this.onContainerMouseOver)},a.prototype.onContainerMouseOver=function(a){$(a.target).trigger("navigation:mouseover")},a.prototype.onKeyDown=function(a){var b,c,d;if(!(b=this.getActiveContainer()))return;if($(a.target).is(":input")&&!$(a.target).is(".js-navigation-enable"))return;return c=$.Event("navigation:keydown"),d=$(b).find(".js-navigation-item.navigation-focus")[0]||b,c.hotkey=a.hotkey,$(d).trigger(c,a),c.result},a.prototype.onItemKeyDown=function(a,b){var c;c=a.currentTarget;if($(b.target).is(":input")){if(this.ctrlBindings)switch(a.hotkey){case"ctrl+n":return this.cursorDown(c);case"ctrl+p":return this.cursorUp(c)}switch(a.hotkey){case"up":return this.cursorUp(c);case"down":return this.cursorDown(c);case"enter":return this.open(c)}}else{if(this.ctrlBindings)switch(a.hotkey){case"ctrl+n":return this.cursorDown(c);case"ctrl+p":return this.cursorUp(c);case"alt+v":return this.pageUp(c);case"ctrl+v":return this.pageDown(c)}switch(a.hotkey){case"up":return this.cursorUp(c);case"down":return this.cursorDown(c);case"j":return this.cursorDown(c);case"k":return this.cursorUp(c);case"o":return this.open(c);case"enter":return this.open(c)}}},a.prototype.onContainerKeyDown=function(a,b){var c;c=this.getItems()[0];if($(b.target).is(":input")){if(this.ctrlBindings)switch(a.hotkey){case"ctrl+n":return this.focusItem(c)}switch(a.hotkey){case"down":return this.focusItem(c)}}else{if(this.ctrlBindings)switch(a.hotkey){case"ctrl+n":return this.focusItem(c);case"ctrl+v":return this.focusItem(c)}switch(a.hotkey){case"down":return this.focusItem(c);case"j":return this.focusItem(c)}}},a.prototype.open=function(a){var b;return(b=$(a).find(".js-navigation-open").attr("href"))?window.location=b:$(a).trigger("navigation:open"),!1},a.prototype.onItemMouseOver=function(a){this.focusItem(a.currentTarget)},a.prototype.onClick=function(a){if(a.altKey||a.ctrlKey||a.metaKey)return;if($(a.target).is("a[href]"))return;return this.open(a.currentTarget)},a.prototype.onActivate=function(a){this.activate(a.currentTarget)},a.prototype.onDeactivate=function(a){this.deactivate(a.currentTarget)},a.prototype.onFocus=function(a){var b,c,d;b=a.currentTarget,c=this.getItems()[0],d=$(a.target).closest(".js-navigation-item")[0]||c,this.activate(b),this.focusItem(d),d&&this.scrollPageTo($(d).scrollContainer()[0],d)},a.prototype.activate=function(a){var b;b=this.getActiveContainer();if(a!==b)return b&&(b.id=null),a.id="js-active-navigation-container"},a.prototype.deactivate=function(a){return a.id=null},a.prototype.cursorUp=function(a){var b,c,d,e;d=this.getItems(),c=$.inArray(a,d);if(e=d[c-1])this.focusItem(e),b=$(e).scrollContainer()[0],this.getScrollStyle()==="page"?this.scrollPageTo(b,e):this.scrollItemTo(b,e);return!1},a.prototype.cursorDown=function(a){var b,c,d,e;d=this.getItems(),c=$.inArray(a,d);if(e=d[c+1])this.focusItem(e),b=$(e).scrollContainer()[0],this.getScrollStyle()==="page"?this.scrollPageTo(b,e):this.scrollItemTo(b,e);return!1},a.prototype.pageUp=function(a){var b,c,d,e;d=this.getItems(),c=$.inArray(a,d),b=$(a).scrollContainer()[0];while((e=d[c-1])&&$(e).relativeOffset(b).top>=0)c--;if(e)return this.focusItem(e),this.scrollPageTo(b,e)},a.prototype.pageDown=function(a){var b,c,d,e;d=this.getItems(),c=$.inArray(a,d),b=$(a).scrollContainer()[0];while((e=d[c+1])&&$(e).relativeOffset(b).bottom>=0)c++;return e&&(this.focusItem(e),this.scrollPageTo(b,e)),!1},a.prototype.focusItem=function(a){return $("#js-active-navigation-container .js-navigation-item.navigation-focus").removeClass("navigation-focus"),$(a).addClass("navigation-focus"),!1},a.prototype.scrollPageTo=function(a,b){var c,d,e;d=$(b).relativeScroll(a),c=$(b).relativeOffset(a);if(c.bottom<=0)return $(a).animate({scrollTop:d.top-30},200);if(c.top<=0)return e=a.scrollHeight-(d.bottom+a.offsetHeight),$(a).animate({scrollTop:e+30},200)},a.prototype.scrollItemTo=function(a,b){var c,d,e;d=$(b).relativeScroll(a),c=$(b).relativeOffset(a);if(c.bottom<=0)return e=a.scrollHeight-(d.bottom+a.offsetHeight),$(a).scrollTop(e);if(c.top<=0)return $(a).scrollTop(d.top)},a.prototype.getScrollStyle=function(){var a;return(a=$("#js-active-navigation-container").attr("data-navigation-scroll"))!=null?a:"item"},a.prototype.getItems=function(){return $("#js-active-navigation-container .js-navigation-item:visible")},a.prototype.getActiveContainer=function(){return document.getElementById("js-active-navigation-container")},a}(),new a}.call(this),function(){var a;$(document).on("focusin","input, textarea",function(a){var b,c,d;return b=$(a.currentTarget),b.data("previousValue",b.val()),d=function(){var a,c;c=b.val(),a=b.data("previousValue"),a!==c&&(b.data("previousValue",c),b.trigger("textchange",[c,a]))},c=function(){return b.off("keyup",d),b.off("blur",c)},b.on("keyup",d),b.on("blur",c)}),a=function(a,b){var c,d;c=$(a),d=c.val(),d!==b&&(c.data("previousValue",b),setTimeout(function(){return c.trigger("textchange",[b,d])},0))},$.valHooks.input={set:a},$.valHooks.textarea={set:a}}.call(this),function(){var a,b=function(a,b){return function(){return a.apply(b,arguments)}};a=function(){function a(){this.onNavigationOpen=b(this.onNavigationOpen,this),this.onNavigationKeyDown=b(this.onNavigationKeyDown,this),this.onClick=b(this.onClick,this),this.onResultsChange=b(this.onResultsChange,this),this.onInputChange=b(this.onInputChange,this),this.onResultsMouseDown=b(this.onResultsMouseDown,this),this.onInputBlur=b(this.onInputBlur,this),this.onInputFocus=b(this.onInputFocus,this),$(document).on("focusin","input[data-autocomplete]",this.onInputFocus),$(document).on("textchange","input[data-autocomplete]",this.onInputChange),this.focusedInput=this.focusedResults=null,this.mouseDown=!1}return a.prototype.bindEvents=function(a,b){return $(a).on("blur",this.onInputBlur),$(b).on("mousedown",this.onResultsMouseDown),$(b).on("autocomplete:change",this.onResultsChange),$(b).on("click","[data-autocomplete-value]",this.onClick),$(b).on("navigation:open","[data-autocomplete-value]",this.onNavigationOpen),$(b).on("navigation:keydown","[data-autocomplete-value]",this.onNavigationKeyDown)},a.prototype.unbindEvents=function(a,b){return $(a).off("blur",this.onInputBlur),$(b).off("mousedown",this.onResultsMouseDown),$(b).off("autocomplete:change",this.onResultsChange),$(b).off("click","[data-autocomplete-value]",this.onClick),$(b).off("navigation:open","[data-autocomplete-value]",this.onNavigationOpen),$(b).off("navigation:keydown","[data-autocomplete-value]",this.onNavigationKeyDown)},a.prototype.onInputFocus=function(a){var b,c;b=a.currentTarget,c=document.getElementById($(b).attr("data-autocomplete")),this.focusedInput=b,this.focusedResults=c,this.bindEvents(b,c),$(b).trigger("autocomplete:focus"),$(b).trigger("autocomplete:search",[$(b).val()])},a.prototype.onInputBlur=function(a){var b,c;b=a.currentTarget,c=this.focusedResults,this.mouseDown||(this.hideResults(),this.inputValue=null,this.focusedInput=this.focusedResults=null,this.unbindEvents(b,c),$(b).trigger("autocomplete:blur"))},a.prototype.onResultsMouseDown=function(a){var b,c=this;this.mouseDown=!0,b=function(){return c.mouseDown=!1,$(document).off("mouseup",b)},$(document).on("mouseup",b)},a.prototype.onInputChange=function(a,b){var c;c=a.currentTarget,this.inputValue!==b&&($(c).removeAttr("data-autocompleted"),$(c).trigger("autocomplete:autocompleted:changed")),$(c).trigger("autocomplete:change",[b]),$(c).trigger("autocomplete:search",[b])},a.prototype.onResultsChange=function(a){var b,c;c=$(this.focusedInput).val(),b=$(this.focusedResults).find("[data-autocomplete-value]"),b.length===0?this.hideResults():this.inputValue!==c&&(this.inputValue=c,this.showResults(),$(this.focusedInput).is("[data-autocomplete-autofocus]")&&$(this.focusedResults).find("ul").trigger("navigation:focus"))},a.prototype.onClick=function(a){return this.onNavigationOpen(a),!1},a.prototype.onNavigationKeyDown=function(a){switch(a.hotkey){case"tab":return this.onNavigationOpen(a),!1;case"esc":return this.hideResults(),!1}},a.prototype.onNavigationOpen=function(a){var b,c;b=a.currentTarget,c=$(b).attr("data-autocomplete-value"),this.inputValue=c,$(this.focusedInput).val(c),$(this.focusedInput).attr("data-autocompleted",c),$(this.focusedInput).trigger("autocomplete:autocompleted:changed",[c]),$(this.focusedInput).trigger("autocomplete:result",[c]),$(b).removeClass("active"),this.hideResults()},a.prototype.showResults=function(a,b){var c,d,e,f,g;a==null&&(a=this.focusedInput),b==null&&(b=this.focusedResults);if($(b).is(":visible"))return;return g=$(a).offset(),e=g.top,d=g.left,c=e+$(a).innerHeight(),f=$(a).innerWidth(),$(b).css({display:"block",position:"absolute",width:f+2}),$(b).offset({top:c+5,left:d+1}),$(a).addClass("js-navigation-enable"),$(b).find("ul").trigger("navigation:activate"),$(b).show()},a.prototype.hideResults=function(a,b){a==null&&(a=this.focusedInput),b==null&&(b=this.focusedResults);if(!$(b).is(":visible"))return;return $(a).removeClass("js-navigation-enable"),$(b).find("ul").trigger("navigation:deactivate"),$(b).hide()},a}(),new a}.call(this),function(){GitHub.ClippableBehavior=function(){function a(a){var b=this;this.element=$(a);if(!this.detectFlashSupport())return;this.initializeBridge(),this.element.on("mouseover",function(){return b.handleHover()})}return a.prototype.handleHover=function(){return this.htmlBridge.text(this.element.attr("data-clipboard-text")),this.flashBridge.attr("title",this.element.attr("data-copy-hint")),this.flashBridge.attr("data-copy-hint",this.element.attr("data-copy-hint")),this.flashBridge.attr("data-copied-hint",this.element.attr("data-copied-hint")),this.flashBridge.css({top:this.element.offset().top+"px",left:this.element.offset().left+"px"})},a.prototype.initializeBridge=function(){var a;this.htmlBridge=$("#global-clippy-instance"),this.htmlBridge.length===0&&(this.htmlBridge=$("<div></div>").attr("id","global-clippy-instance").hide(),$(document.body).append(this.htmlBridge)),this.flashBridge=$("#global-clippy-flash-bug");if(this.flashBridge.length===0)return a='<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" id="global-clippy-object-tag" width="100%" height="100%">\n  <param name="movie" value="/flash/clippy.swf"/>\n  <param name="FlashVars" value="id=global-clippy-instance">\n  <param name="allowScriptAccess" value="always" />\n  <param name="scale" value="exactfit">\n\n  <embed src="/flash/clippy.swf"\n    width="100%" height="100%"\n    name="global-clippy-object-tag"\n    FlashVars="id=global-clippy-instance"\n    allowScriptAccess="always"\n    scale="exactfit">\n  </embed>\n\n</object>',this.flashBridge=$("<div>"+a+"</div>").attr("id","global-clippy-flash-bug"),this.flashBridge.css({position:"absolute",left:"-9999px",top:"-9999px","z-index":"9998",width:"14px",height:"14px"}),this.flashBridge.attr("title","copy to clipboard"),this.flashBridge.attr("data-copied-title","copied!"),this.flashBridge.tipsy(),this.flashBridge.on("mouseover",function(){var a;return a=$(this),a.attr("title",a.attr("data-copy-hint")),$(this).trigger("tipsy.reload")}),this.flashBridge.on("mouseout",function(){return $(this).css({left:"-9999px",top:"-9999px"})}),this.flashBridge.on("clippable:copied",function(){return GitHub.ClippableBehavior.handleCopied()}),$(document.body).append(this.flashBridge)},a.prototype.detectFlashSupport=function(){var a;a=!1;try{new ActiveXObject("ShockwaveFlash.ShockwaveFlash")&&(a=!0)}catch(b){navigator.mimeTypes["application/x-shockwave-flash"]!==void 0&&(a=!0)}return a||this.element.hide(),a},a}(),GitHub.ClippableBehavior.handleCopied=function(){var a;return a=$("#global-clippy-flash-bug"),a.attr("title",a.attr("data-copied-hint")),a.trigger("tipsy.reload")},window.clippyCopiedCallback=function(){return $("#global-clippy-flash-bug").trigger("clippable:copied")},$.pageUpdate(function(){return $(this).find(".js-clippy").each(function(){return new GitHub.ClippableBehavior(this)})})}.call(this),function(){var a=function(a,b){return function(){return a.apply(b,arguments)}};GitHub.DetailsBehavior=function(){function b(){this.onToggle=a(this.onToggle,this),this.onClick=a(this.onClick,this),$(document).on("click",".js-details-container .js-details-target",this.onClick),$(document).on("toggle.details",".js-details-container",this.onToggle)}return b.prototype.onClick=function(a){return $(a.target).trigger("toggle.details"),!1},b.prototype.onToggle=function(a){return this.toggle(a.currentTarget)},b.prototype.toggle=function(a){return $(a).toggleClass("open")},b}(),new GitHub.DetailsBehavior}.call(this),function(){var a,b=function(a,b){return function(){return a.apply(b,arguments)}};a=function(){function a(){this.onToggle=b(this.onToggle,this),this.onError=b(this.onError,this),this.onSuccess=b(this.onSuccess,this),this.onComplete=b(this.onComplete,this),this.onBeforeSend=b(this.onBeforeSend,this),this.onClick=b(this.onClick,this),$(document).on("click",".js-toggler-container .js-toggler-target",this.onClick),$(document).on("ajaxBeforeSend",".js-toggler-container",this.onBeforeSend),$(document).on("ajaxComplete",".js-toggler-container",this.onComplete),$(document).on("ajaxSuccess",".js-toggler-container",this.onSuccess),$(document).on("ajaxError",".js-toggler-container",this.onError),$(document).on("toggler:toggle",".js-toggler-container",this.onToggle)}return a.prototype.onClick=function(a){return $(a.target).trigger("toggler:toggle"),!1},a.prototype.onBeforeSend=function(a){var b;return b=a.currentTarget,$(b).
        removeClass("success error"),
        $(b).addClass("loading")
        }, a.prototype.onComplete = function(a) {
        return $(a.currentTarget).removeClass("loading")
        }, a.prototype.onSuccess = function(a) {
        return $(a.currentTarget).addClass("success")
        }, a.prototype.onError = function(a) {
        return $(a.currentTarget).addClass("error")
        }, a.prototype.onToggle = function(a) {
        var b;
        return b = a.currentTarget,
        $(b).toggleClass("on")
        }, a
} (),
new a
}.call(this),
GitHub.Blob || (GitHub.Blob = {}),
GitHub.Blob.highlightLines = function(a) {
    var b,
    c;
    $(".line").css("background-color", "transparent"),
    a ? (b = $(this).attr("rel"), a.shiftKey && (b = window.location.hash.replace(/-\d+/, "") + "-" + b.replace(/\D/g, "")), window.location.hash = b) : b = window.location.hash;
    if (c = b.match(/#?(?:L|l|-)(\d+)/g)) {
        c = $.map(c, function(a) {
            return parseInt(a.replace(/\D/g, ""))
            });
        if (c.length == 1)
            return $("#LC" + c[0]).css("background-color", "#ffc");
        for (var d = c[0]; d <= c[1]; d++)
            $("#LC" + d).css("background-color", "#ffc");
        $("#LC" + c[0]).scrollTo(1)
        }
    return ! 1
},
GitHub.Blob.scrollToHilightedLine = function() {
    var a,
    b = window.location.hash;
    if (a = b.match(/^#?(?:L|-)(\d+)$/g))
        a = $.map(a, function(a) {
        return parseInt(a.replace(/\D/g, ""))
        }),
    $("#L" + a[0]).scrollTo(1)
    },
GitHub.Blob.show = function() {
    $(".file-edit-link").hide(),
    $(".frame-center .file-edit-link").show(),
    $.hotkeys({
        e: function() {
            var a = $(".file-edit-link:visible");
            a.hasClass("js-edit-link-disabled") || (window.location = a.attr("href"))
            },
        l: function() {
            return $(document).one("reveal.facebox", function() {
                var a = $("#facebox").find(":text");
                a.focus(),
                $("#facebox form").submit(function() {
                    return window.location = "#L" + parseInt(a.val()),
                    GitHub.Blob.highlightLines(),
                    a.blur(),
                    $(document).trigger("close.facebox"),
                    !1
                })
                }),
            $.facebox({
                div: "#jump-to-line"
            }),
            !1
        }
    });
    var a = $(".repo-tree").attr("data-ref");
    if (!$(document.body).hasClass("logged_in") || !a) {
        $(".file-edit-link").enticeToAction({
            title: "You must be logged in and on a branch to make or propose changes",
            direction: "leftwards"
        }),
        $(".file-edit-link").addClass("js-edit-link-disabled");
        return
    }
    if ($(document.body).hasClass("logged_in") && a) {
        var b = $(".file-edit-link:visible"),
        c = b[0];
        if (c && !$(".btn-pull-request")[0]) {
            var d = $(".file-edit-link > span");
            d.text("Fork and edit this file"),
            b.attr("title", "Clicking this button will automatically fork this project so you can edit the file"),
            b.tipsy({
                gravity: "e"
            })
            }
    }
},
$(function() {
    $(".file-history-tease").length && $("#slider").prevAll(".last-commit, .commit.commit-tease").hide(),
    $(".page-blob").length > 0 && (GitHub.Blob.scrollToHilightedLine(), GitHub.Blob.highlightLines(), GitHub.Blob.show()),
    $(".line_numbers span[rel]").live("mousedown", GitHub.Blob.highlightLines),
    $(".file").delegate(".linkable-line-number", "click", function(a) {
        return document.location.hash = this.id,
        !1
    })
    }),
$(function() {
    var a = 2,
    b = 7,
    c = 30,
    d = 1e4;
    $(".diverge-widget").each(function() {
        var d = $(this),
        e = new Date(d.attr("last-updated")),
        f = (new Date - e) / 1e3 / 3600 / 24;
        f <= a ? d.addClass("hot") : f <= b ? d.addClass("fresh") : f <= c ? d.addClass("stale") : d.addClass("old")
        })
    }),
$(function() {
    $.hotkeys({
        y: function() {
            var a = $("link[rel='permalink']").attr("href"),
            b = $("title");
            a && (a += location.hash, Modernizr.history ? window.history.pushState({}, b, a) : window.location.href = a)
            }
    })
    }),
$(function() {
    $(".email-hidden-toggle a").on("click", function(a) {
        a.preventDefault(),
        a.stopPropagation(),
        $(this).parent().siblings(".email-hidden-reply").toggle()
        })
    }),
$(function() {
    if (!$(".js-new-comment-form")[0])
        return;
    $(document).delegate(".js-add-a-comment", "click", function() {
        var a = $(this).attr("href");
        $(a).find("*[tabindex=1]").focus()
        }),
    $(document).delegate(".js-new-comment-form .action-bar a", "ajaxSend", function() {
        $(this).addClass("disabled")
        }),
    $(document).delegate(".js-new-comment-form", "ajaxBeforeSend", function(a) {
        if ($(a.target).is("form") && $.trim($(this).find('textarea[name="comment[body]"]').val()) == "")
            return ! 1
    }),
    $(document).delegate(".js-new-comment-form", "ajaxSend", function(a) {
        $(a.target).is("form") && $(this).find(".form-actions button").attr("disabled", "true")
        }),
    $(document).delegate(".js-new-comment-form", "ajaxComplete", function(a) {
        $(this).find(".form-actions button").attr("disabled", !1)
        }),
    $(document).delegate(".js-new-comment-form", "ajaxSuccess", function(a, b, c, d) {
        d.discussionStats && $(".discussion-stats").html(d.discussionStats),
        d.discussionLabels && $(".discussion-labels").html(d.discussionLabels),
        d.discussion && $(".discussion-timeline > .new-comments").append(d.discussion),
        d.formActionBar && $(".js-new-comment-form .action-bar").html(d.formActionBar),
        d.formActions && $(".js-new-comment-form .form-actions").html(d.formActions),
        $("#discussion_bucket, #show_issue").pageUpdate(),
        $(a.target).is("form") && ($(this).find("textarea").val("").blur(), $(this).find("a[action=write]").click())
        }),
    $(document).delegate(".js-new-comment-form", "ajaxError", function() {
        $(this).find(".comment-form-error").show().html("There was an error posting your comment")
        })
    }),
GitHub.G_vmlCanvasManager,
GitHub.Commit = {
    dumpEmptyClass: function() {
        $(this).removeClass("empty")
        },
    addEmptyClass: function() { ! $(this).data("clicked") && $(this).text() == "0" && $(this).addClass("empty")
        },
    highlightLine: function() {
        $(this).parent().css("background", "#ffc")
        },
    unhighlightLine: function() {
        $(this).data("clicked") || $(this).parent().css("background", "")
        },
    jumpToHashFile: function() {
        if (!window.location.hash)
            return;
        var a,
        b,
        c = window.location.hash.substr(1);
        if (/^diff-\d+$/.test(c))
            return;
        if (c.match(/^r\d+$/) && (b = $("#files #" + c)).length > 0) {
            console.log("jumping to review comment", b),
            $(b).addClass("selected"),
            $("html,body").animate({
                scrollTop: b.offset().top - 200
            }, 1);
            return
        } (a = c.match(/(.+)-P(\d+)$/) || c.match(/(.+)/)) && (b = GitHub.Commit.files[a[1]]) && (a[2] ? (b = $(b).closest(".file").find('tr[data-position="' + a[2] + '"] pre'), b.length > 0 && (b.scrollTo(1), setTimeout(function() {
            GitHub.Commit.highlightLine.call(b)
            }, 50))) : $(b).closest(".file").scrollTo(1))
        }
},
$(function() {
    function c(a) {
        a.find(".inline-comment-form").show().find("textarea").focus(),
        a.find(".show-inline-comment-form a").hide()
        }
    var a = {};
    $("#files.diff-view > .file > .meta").each(function() {
        a[$(this).attr("data-path")] = this
    }),
    GitHub.Commit.files = a;
    var b = function(a) {
        a.find("ul.inline-tabs").tabs(),
        a.find(".show-inline-comment-form a").click(function() {
            return a.find(".inline-comment-form").show().find("textarea").focus(),
            $(this).hide(),
            !1
        }),
        a.delegate(".close-form", "click", function() {
            return a.find(".inline-comment-form").hide(),
            a.find(".commit-comment", ".review-comment").length > 0 ? a.find(".show-inline-comment-form a").show() : (console.log(a), a.remove()),
            !1
        }),
        $.pageUpdate(function() {
            a.find(".comment-holder").children(":visible")[0] || a.remove()
            });
        var b = a.find(".previewable-comment-form").previewableCommentForm().closest("form");
        b.submit(function() {
            return b.find(".ajaxindicator").show(),
            b.find("button").attr("disabled", "disabled"),
            b.ajaxSubmit({
                complete: function() {
                    b.find(".ajaxindicator").hide(),
                    b.find("button").attr("disabled", !1)
                    },
                success: function(a) {
                    var c = b.closest(".clipper"),
                    d = c.find(".comment-holder");
                    d.length == 0 && (d = c.prepend($('<div class="inset comment-holder"></div>')).find(".comment-holder")),
                    a = $(a),
                    d.append(a),
                    a.pageUpdate(),
                    b.find("textarea").val(""),
                    c.find(".inline-comment-form").hide(),
                    c.find(".show-inline-comment-form a").show();
                    var e = c.closest(".inline-comments").find(".comment-count .counter");
                    e.text(parseInt(e.text().replace(",", "")) + 1),
                    $(c.closest(".file-box, .file")).trigger("commentChange", a)
                    },
                error: function() {
                    b.find(".comment-form-error").show().html("There was an error posting your comment")
                    }
            }),
            !1
        })
        };
    $(".inline-review-comment tr.inline-comments").each(function() {
        b($(this))
        }),
    $("#diff-comment-data > table").each(function() {
        var c = $(this).attr("data-path"),
        d = $(this).attr("data-position"),
        e = $(a[c]).closest(".file"),
        f = e.find('.data table tr[data-position="' + d + '"]');
        f.after($(this).find("tr").detach()),
        b(f.next("tr.inline-comments")),
        e.find(".show-inline-comments-toggle").closest("li").show()
        }),
    $("#diff-comment-data > div").each(function() {
        var b = $(this).attr("data-path");
        $(a[b]).closest(".file").find(".file-comments-place-holder").replaceWith($(this).detach())
        }),
    $(window).bind("hashchange", GitHub.Commit.jumpToHashFile),
    setTimeout(GitHub.Commit.jumpToHashFile, 50),
    $('.inline-comment-form div[id^="write_bucket_"]').live("tabChanged", function() {
        var a = $(this);
        setTimeout(function() {
            a.find("textarea").focus()
            }, 13)
        });
    var d = !1;
    $(".add-bubble").live("click", function() {
        if (d)
            return;
        var a = $(this).closest("tr"),
        e = a.next("tr.inline-comments");
        if (e.length > 0) {
            c(e);
            return
        }
        $(".error").remove(),
        d = !0,
        $.ajax({
            url: $(this).attr("remote"),
            complete: function() {
                d = !1
            },
            success: function(d) {
                a.after(d),
                e = a.next("tr.inline-comments"),
                b(e),
                c(e)
                },
            error: function() {
                a.after('<tr class="error"><td colspan=3><p><img src="' + GitHub.Ajax.error + '"> Something went wrong! Please try again.</p></td></tr>')
                }
        })
        }),
    $("#files .show-inline-comments-toggle").change(function() {
        this.checked ? $(this).closest(".file").find("tr.inline-comments").show() : $(this).closest(".file").find("tr.inline-comments").hide()
        }).change(),
    $("#inline_comments_toggle input").change(function() {
        this.checked ? $("#comments").removeClass("only-commit-comments") : $("#comments").addClass("only-commit-comments")
        }).change(),
    $(".js-show-suppressed-diff").click(function() {
        return $(this).parent().next().show(),
        $(this).parent().hide(),
        !1
    }),
    $(".js-commit-link, .js-tree-link, .js-parent-link").each(function() {
        var a = $(this).attr("href");
        $.hotkey($(this).attr("data-key"), function() {
            window.location = a
        })
        })
    }),
$(function() {
    if ($("#files .image").length) {
        var a = $("#files .file:has(.onion-skin)"),
        b = [];
        $.each(a, function(c, d) {
            function C() {
                z++,
                F();
                if (z >= y) {
                    var a = e.find(".progress");
                    a.is(":visible") ? a.fadeOut(250, function() {
                        E()
                        }) : (a.hide(), E())
                    }
            }
            function D(a) {
                var b = v.find(".active"),
                c = v.find(".active").first().index(),
                d = w.eq(c),
                f = v.children().eq(a);
                if (f.hasClass("active") == 0 && f.hasClass("disabled") == 0) {
                    b.removeClass("active"),
                    f.addClass("active");
                    if (f.is(":visible")) {
                        var g = f.position(),
                        h = f.outerWidth(),
                        i = String(g.left + h / 2) + "px 0px";
                        v.css("background-image", "url(/images/modules/commit/menu_arrow.gif)"),
                        v.css("background-position", i)
                        }
                    z >= 2 && (animHeight = parseInt(w.eq(a).css("height")) + 127, e.animate({
                        height: animHeight
                    }, 250, "easeOutQuart"), d.animate({
                        opacity: "hide"
                    }, 250, "easeOutQuart", function() {
                        w.eq(a).fadeIn(250)
                        }))
                    }
            }
            function E() {
                var a = 858,
                d = Math.max(A.width, B.width),
                j = Math.max(A.height, B.height),
                k = 0;
                A.marginHoriz = Math.floor((d - A.width) / 2),
                A.marginVert = Math.floor((j - A.height) / 2),
                B.marginHoriz = Math.floor((d - B.width) / 2),
                B.marginVert = Math.floor((j - B.height) / 2),
                $.each($.getUrlVars(), function(a, c) {
                    c == e.attr("id") && (diffNum = parseInt(c.replace(/\D*/g, "")), x = $.getUrlVar(c)[0], k = $.getUrlVar(c)[1] / 100, b[diffNum].view = $.getUrlVar(c)[0], b[diffNum].pct = $.getUrlVar(c)[1], b[diffNum].changed = !0)
                    });
                var w = 1;
                d > (a - 30) / 2 && (w = (a - 30) / 2 / d),
                l.attr({
                    width: A.width * w,
                    height: A.height * w
                }),
                m.attr({
                    width: B.width * w,
                    height: B.height * w
                }),
                f.find(".deleted-frame").css({
                    margin: A.marginVert * w + "px " + A.marginHoriz * w + "px",
                    width: A.width * w + 2,
                    height: A.height * w + 2
                }),
                f.find(".added-frame").css({
                    margin: B.marginVert * w + "px " + B.marginHoriz * w + "px",
                    width: B.width * w + 2,
                    height: B.height * w + 2
                }),
                f.find(".aWMeta").eq(0).text(B.width + "px"),
                f.find(".aHMeta").eq(0).text(B.height + "px"),
                f.find(".dWMeta").eq(0).text(A.width + "px"),
                f.find(".dHMeta").eq(0).text(A.height + "px"),
                B.width != A.width && (f.find(".aWMeta").eq(0).addClass("a-green"), f.find(".dWMeta").eq(0).addClass("d-red")),
                B.height != A.height && (f.find(".aHMeta").eq(0).addClass("a-green"), f.find(".dHMeta").eq(0).addClass("d-red"));
                var y = 1,
                z;
                d > a - 12 && (y = (a - 12) / d),
                z = 0,
                z = d * y + 3,
                n.attr({
                    width: A.width * y,
                    height: A.height * y
                }),
                o.attr({
                    width: B.width * y,
                    height: B.height * y
                }),
                g.find(".deleted-frame").css({
                    margin: A.marginVert * y + "px " + A.marginHoriz * y + "px",
                    width: A.width * y + 2,
                    height: A.height * y + 2
                }),
                g.find(".added-frame").css({
                    margin: B.marginVert * y + "px " + B.marginHoriz * y + "px",
                    width: B.width * y + 2,
                    height: B.height * y + 2
                }),
                g.find(".swipe-shell").css({
                    width: d * y + 3 + "px",
                    height: j * y + 4 + "px"
                }),
                g.find(".swipe-frame").css({
                    width: d * y + 18 + "px",
                    height: j * y + 30 + "px"
                }),
                g.find(".swipe-bar").css("left", k * z + "px"),
                e.find(".swipe .swipe-shell").css("width", z - z * k),
                g.find(".swipe-bar").draggable({
                    axis: "x",
                    containment: "parent",
                    drag: function(a, d) {
                        var f = Math.round(d.position.left / (parseInt(e.find(".swipe-frame").css("width")) - 15) * 1e4) / 1e4;
                        e.find(".swipe .swipe-shell").css("width", z - z * f),
                        b[c].pct = f * 100,
                        b[c].changed = !0
                    },
                    stop: function(a, b) {
                        G()
                        }
                });
                var C = 1;
                d > a - 12 && (C = (a - 12) / d),
                p.attr({
                    width: A.width * C,
                    height: A.height * C
                }),
                q.attr({
                    width: B.width * C,
                    height: B.height * C
                }),
                h.find(".deleted-frame").css({
                    margin: A.marginVert * C + "px " + A.marginHoriz * C + "px",
                    width: A.width * C + 2,
                    height: A.height * C + 2
                }),
                h.find(".added-frame").css({
                    margin: B.marginVert * C + "px " + B.marginHoriz * C + "px",
                    width: B.width * C + 2,
                    height: B.height * C + 2
                }),
                h.find(".onion-skin-frame").css({
                    width: d * C + 4 + "px",
                    height: j * C + 30 + "px"
                }),
                e.find(".dragger").css("left", 262 - k * 262 + "px"),
                e.find(".onion-skin .added-frame").css("opacity", k),
                e.find(".onion-skin .added-frame img").css("opacity", k),
                e.find(".dragger").draggable({
                    axis: "x",
                    containment: "parent",
                    drag: function(a, d) {
                        var f = Math.round(d.position.left / 262 * 100) / 100;
                        e.find(".onion-skin .added-frame").css("opacity", f),
                        e.find(".onion-skin .added-frame img").css("opacity", f),
                        b[c].pct = f * 100,
                        b[c].changed = !0
                    },
                    stop: function(a, b) {
                        G()
                        }
                });
                var E = 1;
                d > a - 4 && (E = (a - 4) / d),
                Modernizr.canvas && (r.attr({
                    width: d * E,
                    height: j * E
                }), s.attr({
                    width: d * E,
                    height: j * E
                }), i.find(".added-frame").css({
                    width: d * E + 2,
                    height: j * E + 2
                }), i.find(".deleted-frame").css({
                    width: d * E + 2,
                    height: j * E + 2
                }), t.drawImage(A, A.marginHoriz * E, A.marginVert * E, A.width * E, A.height * E), u.drawImage(B, B.marginHoriz * E, B.marginVert * E, B.width * E, B.height * E), u.blendOnto(t, "difference")),
                f.css("height", j * w + 30),
                g.css("height", j * y + 30),
                h.css("height", j * y + 30),
                i.css("height", j * y + 30),
                v.children().removeClass("disabled"),
                D(x)
                }
            function F() {
                var a = z / y * 100 + "%";
                e.find(".progress-bar").animate({
                    width: a
                }, 250, "easeOutQuart")
                }
            function G() {
                var a = "?";
                $.each(b, function(b, c) {
                    c["changed"] == 1 && (b != 0 && (a += "&"), a += "diff-" + b + "=" + c.view + "-" + Math.round(c.pct))
                    }),
                Modernizr.history && window.history.replaceState({}, "", a)
                }
            var e = a.eq(c),
            f = e.find(".two-up").eq(0),
            g = e.find(".swipe").eq(0),
            h = e.find(".onion-skin").eq(0),
            i = e.find(".difference").eq(0),
            j = e.find(".deleted"),
            k = e.find(".added"),
            l = j.eq(0),
            m = k.eq(0),
            n = j.eq(1),
            o = k.eq(1),
            p = j.eq(2),
            q = k.eq(2),
            r = e.find("canvas.deleted").eq(0),
            s = e.find("canvas.added").eq(0),
            t,
            u,
            v = e.find("ul.menu"),
            w = e.find(".view"),
            x = 0,
            y = e.find(".asset").length,
            z = 0,
            A = new Image,
            B = new Image;
            b.push({
                name: e.attr("id"),
                view: 0,
                pct: 0,
                changed: !1
            }),
            Modernizr.canvas ? (t = r[0].getContext("2d"), u = s[0].getContext("2d")) : v.children().eq(3).addClass("hidden"),
            e.find(".two-up").hide(),
            e.find(".two-up p").removeClass("hidden"),
            e.find(".progress").removeClass("hidden"),
            e.find(".view-modes").removeClass("hidden"),
            A.src = e.find(".deleted").first().attr("src"),
            B.src = e.find(".added").first().attr("src"),
            l.attr("src", A.src).load(function() {
                C()
                }),
            m.attr("src", B.src).load(function() {
                C()
                }),
            n.attr("src", A.src).load(function() {
                C()
                }),
            o.attr("src", B.src).load(function() {
                C()
                }),
            p.attr("src", A.src).load(function() {
                C()
                }),
            q.attr("src", B.src).load(function() {
                C()
                }),
            v.children("li").click(function() {
                D($(this).index()),
                b[c].view = $(this).index(),
                b[c].changed = !0,
                G()
                }),
            $.extend({
                getUrlVars: function() {
                    var a = [],
                    b,
                    c = window.location.href.slice(window.location.href.indexOf("?") + 1).split("&");
                    for (var d = 0; d < c.length; d++)
                        b = c[d].split("="),
                    b[1] && (b[1] = b[1].split("-")),
                    a.push(b[0]),
                    a[b[0]] = b[1];
                    return a
                },
                getUrlVar: function(a) {
                    return $.getUrlVars()[a]
                    }
            })
            })
        }
}),
function() {
    $(document).on("navigation:open", ".page-commits .commit-group-item", function() {
        return window.location = $(this).find("a").attr("href"),
        !1
    }),
    $(document).on("navigation:keydown", ".page-commits .commit-group-item", function(a) {
        if (a.hotkey === "c")
            return window.location = $(this).find("a").attr("href"),
        !1
    })
    }.call(this),
$(function() {
    $("#imma_student").click(function() {
        return $("#student_contact").slideToggle(),
        !1
    }),
    $("#imma_teacher").click(function() {
        return $("#teacher_contact").slideToggle(),
        !1
    }),
    $("#imma_school_admin").click(function() {
        return $("#school_admin_contact").slideToggle(),
        !1
    })
    }),
$(function() {
    $("#your_repos").repoList({
        selector: "#repo_listing",
        ajaxUrl: "/dashboard/ajax_your_repos"
    }),
    $("#watched_repos").repoList({
        selector: "#watched_repo_listing",
        ajaxUrl: "/dashboard/ajax_watched_repos"
    });
    if ($("#org_your_repos").length > 0) {
        var a = location.pathname;
        a[a.length - 1] == "/" && (a = a.slice(0, a.length - 1)),
        $("#org_your_repos").repoList({
            selector: "#repo_listing",
            ajaxUrl: a + "/ajax_your_repos"
        })
        }
    $(".reveal_commits, .hide_commits").live("click", function() {
        var a = $(this).parents(".details");
        return a.find(".reveal, .hide_commits, .commits").toggle(),
        !1
    }),
    $(".octofication .hide a").click(function() {
        return $.put(this.href, null, function() {
            $(".octofication").fadeOut()
            }),
        !1
    }),
    $(".dashboard-notice .dismiss").click(function() {
        var a = $(this).closest(".dashboard-notice");
        return $.del(this.href, null, function() {
            a.fadeOut()
            }),
        !1
    }),
    $(".js-dismiss-bootcamp").click(function() {
        var a = $(this).closest(".bootcamp");
        return $.post(this.href, null, function() {
            a.fadeOut()
            }),
        !1
    })
    }),
Date._isoRegexp = /(\d{4,})(?:-(\d{1,2})(?:-(\d{1,2})(?:[T ](\d{1,2}):(\d{1,2})(?::(\d{1,2})(?:\.(\d+))?)?(?:(Z)|([+-])(\d{1,2})(?::(\d{1,2}))?)?)?)?)?/,
Date.parseISO8601 = function(a) {
    a += "";
    if (typeof a != "string" || a.length === 0)
        return null;
    var b = a.match(Date._isoRegexp);
    if (typeof b == "undefined" || b === null)
        return null;
    var c,
    d,
    e,
    f,
    g,
    h,
    i;
    c = parseInt(b[1], 10);
    if (typeof b[2] == "undefined" || b[2] === "")
        return new Date(c);
    d = parseInt(b[2], 10) - 1,
    e = parseInt(b[3], 10);
    if (typeof b[4] == "undefined" || b[4] === "")
        return new Date(c, d, e);
    f = parseInt(b[4], 10),
    g = parseInt(b[5], 10),
    h = typeof b[6] != "undefined" && b[6] !== "" ? parseInt(b[6], 10) : 0,
    typeof b[7] != "undefined" && b[7] !== "" ? i = Math.round(1e3 * parseFloat("0." + b[7])) : i = 0;
    if (typeof b[8] != "undefined" && b[8] !== "" || typeof b[9] != "undefined" && b[9] !== "") {
        var j;
        return typeof b[9] != "undefined" && b[9] !== "" ? (j = parseInt(b[10], 10) * 36e5, typeof b[11] != "undefined" && b[11] !== "" && (j += parseInt(b[11], 10) * 6e4), b[9] == "-" && (j = -j)) : j = 0,
        new Date(Date.UTC(c, d, e, f, g, h, i) - j)
        }
    return new Date(c, d, e, f, g, h, i)
    },
$(function() {
    if ($(".repohead").length == 0)
        return;
    var a = $("#repo_details"),
    b = GitHub.hasAdminAccess,
    c = GitHub.watchingRepo,
    d = GitHub.hasForked,
    e = $("#repository_description"),
    f = $("#repository_homepage"),
    g = $("#repo_details_loader");
    if ($(".js-edit-details").length) {
        var h = $(".repo-desc-homepage"),
        i = $(".edit-repo-desc-homepage"),
        j = i.find(".error");
        $(".repo-desc-homepage").delegate(".js-edit-details", "click", function(a) {
            a.preventDefault(),
            h.hide(),
            i.show(),
            i.find(".description-field").focus()
            }),
        i.find(".cancel a").click(function(a) {
            a.preventDefault(),
            h.show(),
            i.hide()
            }),
        $("#js-update-repo-meta-form").submit(function(a) {
            a.preventDefault();
            var b = $(this);
            j.hide(),
            g.show(),
            i.css({
                opacity: .5
            }),
            $.ajax({
                url: b.attr("action"),
                type: "put",
                data: b.serialize(),
                success: function(a) {
                    i.hide(),
                    h.html(a).show(),
                    g.hide(),
                    i.css({
                        opacity: 1
                    })
                    },
                error: function() {
                    j.show(),
                    g.hide(),
                    i.css({
                        opacity: 1
                    })
                    }
            })
            })
        }
    b && ($(".editable-only").show(), $(".for-owner").show()),
    $("#repo_details").length && $(".pagehead ul.tabs").addClass("with-details-box")
    }),
$(function() {
    $(".url-box").each(function() {
        var a = $(this),
        b = a.find("ul.clone-urls a"),
        c = a.find(".url-field"),
        d = a.find(".url-description span.bold"),
        e = a.find(".js-clippy");
        b.click(function() {
            var b = $(this);
            return c.val(b.attr("href")),
            e.attr("data-clipboard-text", b.attr("href")),
            d.text(b.attr("data-permissions")),
            a.find("ul.clone-urls li.selected").removeClass("selected"),
            b.parent("li").addClass("selected"),
            !1
        }),
        $(b[0]).click(),
        c.mouseup(function() {
            this.select()
            })
        })
    }),
GitHub.Uploader = {
    hasFlash: !1,
    hasFileAPI: !1,
    fallbackEnabled: !0,
    fallbackFileSaved: !1,
    uploadForm: null,
    defaultRow: null,
    files: {},
    init: function() {
        this.uploadForm = $("#upload_form"),
        this.defaultRow = this.uploadForm.find("tr.default"),
        this.uploadForm.submit(GitHub.Uploader.uploadFormSubmitted),
        GitHub.Uploader.Flash.init(),
        GitHub.Uploader.File.init()
        },
    disableFallback: function() {
        if (!this.fallbackEnabled)
            return;
        this.defaultRow.addClass("fallback-disabled"),
        this.defaultRow.find("input[type=text]").attr("disabled", "disabled"),
        this.defaultRow.find("button").attr("disabled", "disabled"),
        this.fallbackEnabled = !1
    },
    uploadFormSubmitted: function() {
        var a = GitHub.Uploader;
        if (a.fallbackEnabled) {
            if (a.fallbackFileSaved)
                return ! 0;
            var b = a.uploadForm.find(".html-file-field").val();
            b = b.replace("C:\\fakepath\\", "");
            if (b == "")
                return ! 1;
            var c = "application/octet-stream";
            typeof FileList != "undefined" && (c = a.uploadForm.find("input[type=file]")[0].files[0].type);
            var d = new GitHub.UploadFile({
                name: b,
                size: 1,
                type: c,
                row: a.defaultRow
            });
            return a.saveFile(d),
            !1
        }
        return ! 1
    },
    addFileRow: function(a) {
        var b = this.uploadForm.find("tr.template"),
        c = b.clone().css("display", "").addClass("filechosen").removeClass("template");
        a.row = c,
        this.files[a.id] = a,
        a.row.find(".js-waiting").hide(),
        a.row.find(".js-filename").text(a.name.substr(0, 12)).attr("title", a.escapedName).tipsy(),
        a.row.find(".js-filesize").text(Math.round(a.size / 1048576 * 10) / 10 + "MB"),
        a.row.find(".js-start-upload").click(function() {
            return a.row.hasClass("error") ? !1: (GitHub.Uploader.saveFile(a), !1)
            }),
        this.defaultRow.before(c)
        },
    showUploadStarted: function(a) {
        a.row.find(".js-label").text("Uploading??%")
        },
    showProgress: function(a, b) {
        a.row.find(".description label").text("Upload in progress??" + b + "%")
        },
    showSuccess: function(a) {
        a.row.addClass("succeeded"),
        a.row.find(".js-label").text("Upload complete!"),
        a.row.find("button").remove(),
        $.get(document.location.href, function(a) {
            $(".nodownloads").fadeOut(),
            $("#uploaded_downloads").hide().html(a).fadeIn()
            })
        },
    saveFile: function(a) {
        a.row.addClass("uploading"),
        a.row.find(".js-label").text("Preparing upload"),
        a.row.find(".js-description").attr("disabled", "disabled"),
        a.row.find("button").attr("disabled", "disabled").find("span").text("Uploading??),this.uploadForm.find(".js - not - waiting ").hide(),this.uploadForm.find(".js - waiting ").show();var b=this.uploadForm.attr("prepare_action ");$.ajax({type:"POST ",url:b,data:{file_size:a.size,file_name:a.name,content_type:a.type,description:a.row.find(".js - description ").val(),redirect:this.fallbackEnabled},datatype:"json ",success:function(b){GitHub.Uploader.fileSaveSucceeded(a,b)},error:function(b,c,d){b.status==422?GitHub.Uploader.fileSaveFailed(a,b.responseText):GitHub.Uploader.fileSaveFailed(a)},complete:function(a,b){GitHub.Uploader.uploadForm.find(".js - not - waiting ").show(),GitHub.Uploader.uploadForm.find(".js - waiting ").hide()}})},fileSaveSucceeded:function(a,b){a.params.key=b.path,a.params.acl=b.acl,a.params.Filename=a.name,a.params.policy=b.policy,a.params.AWSAccessKeyId=b.accesskeyid,a.params.signature=b.signature,a.params["Content - Type "]=b.mime_type,a.uploader=="flash "&&(a.params.success_action_status="201 ",GitHub.Uploader.Flash.upload(a)),this.fallbackEnabled&&(a.params.redirect=b.redirect,this.fallbackFileSaved=!0,$("#s3_redirect ").val(a.params.redirect),$("#s3_key ").val(a.params.key),$("#s3_acl ").val(a.params.acl),$("#s3_filename ").val(a.params.Filename),$("#s3_policy ").val(a.params.policy),$("#s3_accesskeyid ").val(a.params.AWSAccessKeyId),$("#s3_signature ").val(a.params.signature),$("#s3_mime_type ").val(a.params["Content - Type "]),this.uploadForm.submit())},fileSaveFailed:function(a,b){b==null&&(b="Something went wrong that shouldn 't have. Please try again or contact support if the problem persists."),a.row.addClass("error"),a.row.find(".js-label").text(b),a.row.find("button").attr("disabled","").addClass("danger").find("span").text("Remove"),a.row.find("button").click(function(b){return a.row.remove(),!1})}},GitHub.UploadFile=function(a){this.id=a.id,this.name=a.name,this.escapedName=$("<div>").text(a.name).html(),this.row=a.row,this.size=a.size,this.type=a.type,this.uploader=a.uploader,this.params={}},GitHub.Uploader.Flash={swfupload:null,init:function(){if(typeof SWFUpload=="undefined")return!1;this.swfupload=new SWFUpload({upload_url:GitHub.Uploader.uploadForm.attr("action"),file_post_name:"file",flash_url:"/flash/swfupload.swf",button_cursor:SWFUpload.CURSOR.HAND,button_window_mode:SWFUpload.WINDOW_MODE.TRANSPARENT,button_placeholder_id:"flash_choose_file_btn",swfupload_loaded_handler:this.flashLoaded,file_queued_handler:this.fileQueued,upload_start_handler:this.uploadStarted,upload_progress_handler:this.uploadProgress,upload_error_handler:this.uploadFailure,upload_success_handler:this.uploadSuccess})},upload:function(a){this.swfupload.setPostParams(a.params),this.swfupload.startUpload(a.id)},flashLoaded:function(){GitHub.Uploader.hasFlash=!0,GitHub.Uploader.disableFallback(),GitHub.Uploader.uploadForm.addClass("swfupload-ready")},fileQueued:function(a){var b=new GitHub.UploadFile({id:a.id,name:a.name,size:a.size,type:a.type,uploader:"flash"});GitHub.Uploader.addFileRow(b)},uploadStarted:function(a){var b=GitHub.Uploader.files[a.id];GitHub.Uploader.showUploadStarted(b)},uploadProgress:function(a,b,c){var d=GitHub.Uploader.files[a.id],e=Math.round(b/c*100);GitHub.Uploader.showProgress(d,e)},uploadSuccess:function(a,b,c){var d=GitHub.Uploader.files[a.id];GitHub.Uploader.showSuccess(d)},uploadFailure:function(a,b,c){var d=GitHub.Uploader.files[a.id];GitHub.Uploader.fileSaveFailed(d,null)}},GitHub.Uploader.File={init:function(){if(typeof DataTransfer=="undefined")return!1;if(!("files"in DataTransfer.prototype))return!1;if(!Modernizr.draganddrop)return!1;GitHub.Uploader.hasFileAPI=!0}},$(function(){GitHub.Uploader.init(),$(".page-downloads .manage-button").live("click",function(){return $("#manual_downloads").toggleClass("managing"),!1})}),$(function(){$(".site .nspr .btn-pull-request").click(function(){return GitHub.metric("Hit Pull Request Button",{"Pull Request Type":"New School",Action:GitHub.currentAction,"Ref Type":GitHub.revType}),!0}),$(".test_hook").click(function(){var a=$(this),b=a.prev(".test_hook_message");b.text("Sending payload...");var c=a.attr("href");return $.post(c,{name:a.attr("rel")||""},function(){b.text("Payload deployed")}),!1}),$(".add_postreceive_url").click(function(){var a=$(this).prev("dl.form").clone();return console.log(a),a.find("input").val(""),$(this).before(a),!1}),$(".remove_postreceive_url").live("click",function(){return $(this).closest(".fields").find("dl.form").length<2?(alert("You cannot remove the last post-receive URL"),!1):($(this).closest("dl.form").remove(),!1)}),$(".unlock_branch").click(function(){var a=location.pathname.split("/"),b="/"+a[1]+"/"+a[2]+"/unlock_branch/"+a[4],c=$(this).parents(".notification");$(this).spin().remove();var d=this;return $.post(b,function(){c.hide()}),!1});if($("#edit_repo").length>0){var a=$("#change_default_branch"),b=a.find("select"),c=b.val();b.change(function(){a.removeClass("success").removeClass("error").addClass("loading"),$.put(a.closest("form").attr("action"),{field:"repository_master_branch",value:b.val()},{success:function(){a.removeClass("loading").addClass("success"),c=b.val()},error:function(){b.val(c),a.removeClass("loading").addClass("error")}})}),$(".addon.feature").each(function(){var a=$(this);a.find(":checkbox").change(function(){var b=this;a.removeClass("success").removeClass("error").addClass("loading"),$.put(a.closest("form").attr("action"),{field:b.name,value:b.checked?1:0},{success:function(){a.removeClass("loading").addClass("success")},error:function(){b.checked=!b.checked,a.removeClass("loading").addClass("error")}})})}),$("#pages_toggle :checkbox").change(function(){$.facebox({div:"#pages_box"}),this.checked=!this.checked}),$("#autoresponse_toggle :checkbox").change(function(){if(!this.checked){var a=$(this).closest(".addon");a.removeClass("success").removeClass("error").addClass("loading"),$.put(window.location.pathname.replace("edit","update_pull_request_auto_response"),{success:function(){a.removeClass("loading").addClass("success"),a.find(".editlink").remove()}});return}$.facebox({div:"#auto_response_editor"}),this.checked=!this.checked});var d=$("#push_pull_collabs input[data-autocomplete]"),e=$("#push_pull_collabs button[type=submit]"),f=null;d.on("autocomplete:search",function(){f&&f.abort();var a=$(this).val();if(a===""){$("#add-user-autocomplete ul").empty(),$("#add-user-autocomplete").trigger("autocomplete:change");return}f=$.ajax({type:"GET",data:{q:a,limit:10},url:"/autocomplete/users",dataType:"html",success:function(a){f=null,$("#add-user-autocomplete ul").html(a),$("#add-user-autocomplete").trigger("autocomplete:change")}})}),d.on("autocomplete:autocompleted:changed",function(){d.attr("data-autocompleted")?e.removeAttr("disabled"):e.attr("disabled","disabled")}),$("#push_pull_collabs form").submit(function(){var a=$(this).find(":text"),b=a.val();debug("Trying to add %s...",b);if(!b||!a.attr("data-autocompleted"))return!1;var c=function(a){a!=null?$("#push_pull_collabs .error").text(a).show():$("#push_pull_collabs .error").hide()};return c(),$.ajax({url:this.action,data:{member:b},type:"POST",dataType:"json",success:function(b){a.val(""),b.error?c(b.error):$("#push_pull_collabs ul.usernames").append(b.html)},error:function(){c("An unidentfied error occurred, try again?")}}),!1}),$("#push_pull_collabs .remove-user").live("click",function(){return $.del(this.href),$(this).closest("li").remove(),!1}),$("#teams form").submit(function(){var a=$(this).find("select"),b=a.val(),c=function(a){a!=null?$("#push_pull_collabs .error").text(a).show():$("#push_pull_collabs .error").hide()};return b==""?(c("You must select a team"),!1):(c(),$.ajax({url:this.action,data:{team:b},type:"POST",dataType:"json",success:function(b){a.val(""),b.error?c(b.error):$("#teams ul.teams").append(b.html)},error:function(){c("An unidentfied error occurred, try again?")}}),!1)}),$("#teams .remove-team").live("click",function(){return $.del(this.href),$(this).closest("li").remove(),!1}),$(".site").is(".vis-public")?$(".private-only").hide():$(".public-only").hide(),$("#custom_tabs .remove-tab").live("click",function(){return $.del(this.href),$(this).closest("li").remove(),!1});var g=$("#toggle_visibility");g.find("input[type=radio]").change(function(a){if($(this).attr("value")=="public")return a.preventDefault(),$("input[value=private]").attr("checked","checked"),$.facebox({div:"#gopublic_confirm"}),$("#facebox .gopublic_button").click(function(){var a=$("#toggle_visibility input[value=public]");a.attr("checked","checked"),h(a),$.facebox.close()}),$("#facebox .footer").hide(),!1;if($(this).attr("value")=="private"){if(!confirm("Are you POSITIVE you want to make this public repository private?  All public watchers will be removed."))return $("input[value=public]").attr("checked","checked"),!1;h($(this))}});var h=function(a){var b=$("#toggle_visibility");b.removeClass("success").removeClass("error").addClass("loading"),$.ajax({type:"POST",url:b.closest("form").attr("action"),success:function(){$(".repohead").is(".vis-public")?($(".site").removeClass("vis-public").addClass("vis-private"),$(".private-only").show(),$(".public-only").hide()):($(".repohead").removeClass("vis-private").addClass("vis-public"),$(".private-only").hide(),$(".public-only").show()),b.removeClass("loading").addClass("success")},error:function(){a.checked=!1,b.removeClass("loading").addClass("error")}})};$("#copy_permissions ul li a").click(function(){return $(this).parents("form").submit(),!1}),$("#delete_repo").click(function(){var a="Are you sure you want to delete this repository?  There is no going back.";return confirm(a)}),$("#reveal_delete_repo_info").click(function(){return $(this).toggle(),$("#delete_repo_info").toggle(),!1}),$(document).bind("reveal.facebox",function(){$("#facebox .renaming_to_field").val($("#rename_field").val()),$("#facebox .transfer_to_field").val($("#transfer_field").val())})}}),function(){var a,b,c;a=jQuery,a.fn.selectionEndPosition=function(){return b(this[0])},c=["height","width","padding-top","padding-right","padding-bottom","padding-left","lineHeight","textDecoration","letterSpacing","font-family","font-size","font-style","font-variant","font-weight"],b=function(b){var d,e,f,g,h,i,j;b==null&&(b=document.activeElement);if(!a(b).is("textarea"))return;if(b.selectionEnd==null)return;h={position:"absolute",overflow:"auto","white-space":"pre-wrap",top:0,left:-9999};for(i=0,j=c.length;i<j;i++)f=c[i],h[f]=a(b).css(f);return d=document.createElement("div"),a(d).css(h),a(b).after(d),d.textContent=b.value.substring(0,b.selectionEnd),d.scrollTop=d.scrollHeight,e=document.createElement("span"),e.innerHTML="&nbsp;",d.appendChild(e),g=a(e).position(),a(d).remove(),g}}.call(this),function(){$(function(){var a;a=$(".js-enterprise-notice-dismiss");if(!a[0])return;return a.click(function(){return $.ajax({type:"POST",url:a.attr("href"),dataType:"json",success:function(b){return a.closest("div").fadeOut()},error:function(a){return alert("Failed to dismiss license expiration notice. Sorry!")}}),!1})})}.call(this),function(){var a;a=function(a,b){var c;c=$(a).data("previousValue"),c!==b&&($(a).trigger("textchange",[b,c]),$(a).data("previousValue",b))},$(document).on("focusin","input",function(
b){var c,d,e;return c=b.currentTarget,e=function(b){a(c,c.value)},d=function(){return $(c).off("keyup",e),$(c).off("blur",d)},$(c).on("keyup",e),$(c).on("blur",d)}),$.valHooks.input={set:function(b,c){setTimeout(function(){return a(b,c)},0)}}}.call(this),function(a){typeof define=="function"&&define.amd?define(["jquery"],a):a(jQuery)}(function(a){function f(){a(this).closest(".expandingText").find("div").text(this.value+" ")}a.expandingTextarea=a.extend({autoInitialize:!0,initialSelector:"textarea.expanding"},a.expandingTextarea||{});var b=["lineHeight","textDecoration","letterSpacing","fontSize","fontFamily","fontStyle","fontWeight","textTransform","textAlign","direction","wordSpacing","fontSizeAdjust","wordWrap","borderLeftWidth","borderRightWidth","borderTopWidth","borderBottomWidth","paddingLeft","paddingRight","paddingTop","paddingBottom","marginLeft","marginRight","marginTop","marginBottom","boxSizing","webkitBoxSizing","mozBoxSizing","msBoxSizing"],c={position:"absolute",height:"100%",resize:"none"},d={visibility:"hidden",border:"0 solid",whiteSpace:"pre-wrap"},e={position:"relative"};a.fn.expandingTextarea=function(g){return g==="resize"?this.trigger("input.expanding"):g==="destroy"?(this.filter(".expanding-init").each(function(){var b=a(this).removeClass("expanding-init"),c=b.closest(".expandingText");c.before(b).remove(),b.attr("style",b.data("expanding-styles")||"").removeData("expanding-styles")}),this):(this.filter("textarea").not(".expanding-init").each(function(){var g=a(this).addClass("expanding-init");g.wrap("<div class='expandingText '></div>"),g.after("<pre class='textareaClone '><div></div></pre>");var h=g.parent().css(e),i=h.find("pre").css(d);g.data("expanding-styles",g.attr("style")),g.css(c),a.each(b,function(a,b){var c=g.css(b);i.css(b)!==c&&i.css(b,c)}),g.bind("input.expanding propertychange.expanding",f),f.apply(this)}),this)},a(function(){a.expandingTextarea.autoInitialize&&a(a.expandingTextarea.initialSelector).expandingTextarea()})}),$(function(){if(!$.support.pjax)return;$(".trending-repositories .times a").live("click",function(a){$(".trending-repositories .ranked-repositories").fadeTo(200,.5),$(".trending-repositories .trending-heading").contextLoader(28),a.preventDefault()}).pjax(".trending-repositories",{data:{trending:!0},timeout:null,error:function(a,b){$(".trending-repositories .context-loader").remove(),$(".trending-repositories .ranked-repositories").fadeTo(0,1),$(".trending-repositories ol").empty().append("<li>Something went wrong: "+b+"</li>")}})}),$(function(){var a=$(".community .bigcount"),b=function(){var b=a.width()+parseInt(a.css("padding-left"))+parseInt(a.css("padding-right"));a.css("margin-left","-"+b/2+"px"),a.fadeIn()};a.length>0&&setTimeout(b,500);var c=$(".js-slidy-highlight");if(c.length>0){var d=c.find("li.highlight"),e=d.width()/2;e+=-1;var f=function(a){var b=a.closest("li"),c=b.position(),d=c.left+b.width()/2-e;return d+=parseInt(b.css("margin-left")),d};c.bind("tabChanged",function(a,b){var c=f(b.link);d.animate({left:c},300)});var g=f(c.find(".selected"));d.css({left:g})}}),GitHub.FileEditForkPoller=function(a,b){var c=$(b||document).find(".check-for-fork");if(c.length==0)return;var d=$(b||document).find("#submit-file");d.attr("disabled","disabled"),c.show();var e=c.data("check-url");$.smartPoller(a||2e3,function(a){$.ajax({url:e,error:function(b,d,e){b.status==404?a():c.html(' < img src = "/images/modules/ajax/error.png" > Something went wrong.Please fork the project, then edit this file.')},success:function(a,b,e){c.hide(),d.removeAttr("disabled")}})})},$(function(){GitHub.FileEditForkPoller()}),$(function(){function b(){var a=$("#forkqueue .untested").length,c=$("#head-sha").text();if(a>0){var d=$("#forkqueue .untested:first"),e=d.attr("name");$(".icons",d).html(' < img src = "/images/spinners/octocat-spinner-16px.gif"alt = "Processing" / >'),$.get("forkqueue/applies/"+c+"/"+e,function(a){d.removeClass("untested"),a=="NOPE"?(d.addClass("unclean"),$(".icons",d).html("")):a=="YUP"?(d.addClass("clean"),$(".icons",d).html("")):$(".icons",d).html("err"),b()})}}function d(){var a=$("table#queue tr.not-applied").length,b=$("#head-sha").text();if(a>0){var c=$("#total-commits").text();$("#current-commit").text(c-a+1);var e=$("table#queue tr.not-applied:first"),f=e.attr("name");$(".date",e).html("applying"),$(".icons",e).html(' < img src = "/images/spinners/octocat-spinner-16px.gif"alt = "Processing" / >'),$.post("patch/"+b+"/"+f,function(a){e.removeClass("not-applied"),a=="NOPE"?(e.addClass("unclean_failure"),$(".date",e).html("failed"),$(".icons",e).html(' < span class = "mini-icon exclamation" > </span>')):($("#head-sha").text(a),e.addClass("clean"),$(".date",e).html("applied"),$(".apply-status",e).attr("value","1"),$(".icons",e).html('<span class="mini-icon commit-comment"></span > ')),d()})}else $("#new-head-sha").attr("value",b),$("#finalize").show()}var a=$("#forkqueue #head-sha").text();$("#forkqueue .untested:first").each(function(){b()}),$(".action-choice").change(function(a){var b=$(this).attr("value");if(b=="ignore"){var c=$(this).parents("form"),d=c.find("tr:not(:first)"),e=c.find("input:checked");e.each(function(a,b){var c=$(b).attr("ref");$(b).parents("tr").children(".icons").html("ignoring..."),$.post("forkqueue/ignore/"+c,{})});var f=d.length==e.length?c:e.parents("tr");f.fadeOut("normal",function(){$(this).remove()})}else if(b=="apply"){var c=$(this).parents("form");c.submit()}$(this).children(".default").attr("selected",1)});var c=[];$("#forkqueue input[type=checkbox]").click(function(a){var b=$(this).attr("class").match(/^r-(\d+)-(\d+)$/),d=parseInt(b[1]),e=parseInt(b[2]);if(a.shiftKey&&c.length>0){var f=c[c.length-1],g=f.match(/^r-(\d+)-(\d+)$/),h=parseInt(g[1]),i=parseInt(g[2]);if(d==h){var j=$(this).attr("checked")==1,k=[e,i].sort(),l=k[0],m=k[1];for(var n=l;n<m;n++)j==1?$("#forkqueue input.r-"+d+"-"+n).attr("checked","true"):$("#forkqueue input.r-"+d+"-"+n).removeAttr("checked")}}c.push($(this).attr("class"))}),$("#forkqueue a.select_all").click(function(){$(this).removeClass("select_all");var a=$(this).attr("class");return $(this).addClass("select_all"),$("#forkqueue tr."+a+" input[type=checkbox]").attr("checked","true"),c=[],!1}),$("#forkqueue a.select_none").click(function(){$(this).removeClass("select_none");var a=$(this).attr("class");return $(this).addClass("select_none"),$("#forkqueue tr."+a+" input[type=checkbox]").removeAttr("checked"),c=[],!1}),$("table#queue tr.not-applied:first").each(function(){d()}),$("#change-branch").click(function(){return $("#int-info").hide(),$("#int-change").show(),!1}),$("#change-branch-nevermind").click(function(){return $("#int-change").hide(),$("#int-info").show(),!1}),$(".js-fq-new-version").each(function(){var a=$("#fq-repo").text();console.log("repo:",a);var b=$(this).hasClass("reload");$.smartPoller(function(c){$.getJSON("/cache/network_current/"+a,function(a){a&&a.current?(b&&window.location.reload(!0),$(".js-fq-polling").hide(),$(".js-fq-new-version").show()):c()})})})}),$(function(){if($(".business .logos").length>0){var a=[["Shopify","shopify.png","http://shopify.com/"],["CustomInk","customink.png","http://customink.com/"],["Pivotal Labs","pivotallabs.png","http://pivotallabs.com/"],["FiveRuns","fiveruns.png","http://fiveruns.com/"],["PeepCode","peepcode.png","http://peepcode.com/"],["Frogmetrics","frogmetrics.png","http://frogmetrics.com/"],["Upstream","upstream.png","http://upstream-berlin.com/"],["Terralien","terralien.png","http://terralien.com/"],["Planet Argon","planetargon.png","http://planetargon.com/"],["Tightrope Media Systems","tightropemediasystems.png","http://trms.com/"],["Rubaidh","rubaidh.png","http://rubaidh.com/"],["Iterative Design","iterativedesigns.png","http://iterativedesigns.com/"],["GiraffeSoft","giraffesoft.png","http://giraffesoft.com/"],["Evil Martians","evilmartians.png","http://evilmartians.com/"],["Crimson Jet","crimsonjet.png","http://crimsonjet.com/"],["Alonetone","alonetone.png","http://alonetone.com/"],["EntryWay","entryway.png","http://entryway.net/"],["Fingertips","fingertips.png","http://fngtps.com/"],["Run Code Run","runcoderun.png","http://runcoderun.com/"],["Be a Magpie","beamagpie.png","http://be-a-magpie.com/"],["Rocket Rentals","rocketrentals.png","http://rocket-rentals.de/"],["Connected Flow","connectedflow.png","http://connectedflow.com/"],["Dwellicious","dwellicious.png","http://dwellicious.com/"],["Assay Depot","assaydepot.png","http://www.assaydepot.com/"],["Centro","centro.png","http://www.centro.net/"],["Debuggable Ltd.","debuggable.png","http://debuggable.com/"],["Blogage.de","blogage.png","http://blogage.de/"],["ThoughtBot","thoughtbot.png","http://www.thoughtbot.com/"],["Viget Labs","vigetlabs.png","http://www.viget.com/"],["RateMyArea","ratemyarea.png","http://www.ratemyarea.com/"],["Abloom","abloom.png","http://abloom.at/"],["LinkingPaths","linkingpaths.png","http://www.linkingpaths.com/"],["MIKAMAI","mikamai.png","http://mikamai.com/"],["BEKK","bekk.png","http://www.bekk.no/"],["Reductive Labs","reductivelabs.png","http://www.reductivelabs.com/"],["Sexbyfood","sexbyfood.png","http://www.sexbyfood.com/"],["Factorial, LLC","yfactorial.png","http://yfactorial.com/"],["SnapMyLife","snapmylife.png","http://www.snapmylife.com/"],["Scrumy","scrumy.png","http://scrumy.com/"],["TinyMassive","tinymassive.png","http://www.tinymassive.com/"],["SOCIALTEXT","socialtext.png","http://www.socialtext.com/"],["All-Seeing Interactive","allseeinginteractive.png","http://allseeing-i.com/"],["Howcast","howcast.png","http://www.howcast.com/"],["Relevance Inc","relevance.png","http://thinkrelevance.com/"],["Nitobi Software Inc","nitobi.png","http://www.nitobi.com/"],["99designs","99designs.png","http://99designs.com/"],["EdgeCase, LLC","edgecase.png","http://edgecase.com"],["Plinky","plinky.png","http://www.plinky.com/"],["One Design Company","onedesigncompany.png","http://onedesigncompany.com/"],["CollectiveIdea","collectiveidea.png","http://collectiveidea.com/"],["Stateful Labs","statefullabs.png","http://stateful.net/"],["High Groove Studios","highgroove.png","http://highgroove.com/"],["Exceptional","exceptional.png","http://www.getexceptional.com/"],["DealBase","dealbase.png","http://www.dealbase.com/"],["Silver Needle","silverneedle.png","http://silverneedlesoft.com/"],["No Kahuna","nokahuna.png","http://nokahuna.com/"],["Double Encore","doubleencore.png","http://www.doubleencore.com/"],["Yahoo","yahoo.gif","http://yahoo.com/"],["EMI Group Limited","emi.png","http://emi.com/"],["TechCrunch","techcrunch.png","http://techcrunch.com/"],["WePlay","weplay.png","http://weplay.com/"]],b=function(){var b=$(".business .logos table");$.each(a,function(a,c){b.append(' < tr > <td > <a href = "'+c[2]+'"rel = "nofollow" > <img src = "http://assets'+a%4+".github.com / images / modules / home / customers / "+c[1]+'"alt = "'+c[0]+'" / ></a></td > </tr>')});var c=parseInt($(".business .slide").css("top")),d=$(".business .logos td").length-4,e=0,f=function(){e+=1;var a=parseInt($(".business .slide").css("top"));Math.abs(a+d*75)<25?($(".business .slide").css("top",0),e=0):$(".business .slide").animate({top:"-"+e*75+"px"},1500)};setInterval(f,3e3)};setTimeout(b,1e3)}}),$(function(){var a={success:function(){$.smartPoller(3e3,function(a){$.getJSON($("#new_import").attr("action")+"/grab_authors ",{},function(b){if(b==0)return a();b.length==0?($("#new_import input[type = submit]").attr("disabled ","").val("Import SVN Authors ").show(),alert("No authors were returned, please try a different URL ")):($.each(b,function(a,b){var c=$('<tr><td><input type="text " readonly="readonly " value="'+b+'" name="svn_authors[]" /></td><td><input type="text " class="git_author " name="git_authors[]"/></td></tr>');c.appendTo("#authors - list ")}),$("#import - submit ").show()),$("#wait ").slideUp(),$("#import_repo ").show(),$("#author_entry ").slideDown()})})},beforeSubmit:function(a,b){var c=$("#svn_url ").val();if(!c.match(/^https?:\/\//)&&!c.match(/^svn:\/\//))return alert("Please enter a valid subversion url "),!1;b.find("input[type = submit]").hide(),$("#authors ").slideDown()}};$("#new_import ").ajaxForm(a),$("#import - submit ").click(function(){$(this).attr("disabled ","disabled ");var a=!1,b=$("#authors - list input.git_author[value = ]").size(),c=$("#authors - list input.git_author ").size()-b;b>0&&c>0&&(alert("You must either fill in all author names or none."),a=!0),$("#authors - list input.git_author ").each(function(){var b=$(this).val();!a&&b!=""&&!/^[^<]+<[^>]+>$/.test(b)&&(alert("'"+b+"'is not a valid git author.Authors must match the format 'User Name <user@domain>'"),a=!0)});if(a)return $("#import - submit ").attr("disabled ",""),!1;$("form#new_repository ").submit()})}),$(function(){$(".cancel - compose ").click(function(){return window.location=" / inbox ",!1}),$("#inbox.del a ").click(function(){var a=$(this),b=a.parents(".item "),c=b.attr("data - type ")=="message "?"inbox ":"notification ",d=".js - "+c+" - count ";return a.find("img ").attr("src ",GitHub.Ajax.spinner),$.ajax({type:"DELETE ",url:a.attr("rel "),error:function(){a.find("img ").attr("src ",GitHub.Ajax.error)},success:function(){if(b.is(".unread ")){var a=parseInt($(d+": first ").text());a>0&&$(d).text(a-=1),a==0&&$(d).each(function(){var a=$(this);a.is(".new ")?a.removeClass("new "):a.parent().is(".new ")&&a.parent().removeClass("new ")})}b.remove()}}),!1}),$("#reveal_deleted ").click(function(){return $(this).parent().hide(),$(".hidden_message ").show(),!1})}),$(function(){Modernizr.canvas&&$("#impact_graph ").length>0&&GitHub.ImpactGraph.drawImpactGraph()}),GitHub.ImpactGraph={colors:null,data:null,chunkVerticalSpace:2,initColors:function(a){seedColors=[[222,0,0],[255,141,0],[255,227,0],[38,198,0],[0,224,226],[0,33,226],[218,0,226]],this.colors=new Array;var b=0;for(var c in a){var d=seedColors[b%7];b>6&&(d=[this.randColorValue(d[0]),this.randColorValue(d[1]),this.randColorValue(d[2])]),this.colors.push(d),b+=1}},drawImpactGraph:function(){var a={},b=$("#impact_graph ").attr("rel "),c=this;$.smartPoller(function(d){$.getJSON(" / "+b+" / graphs / impact_data ",function(b){if(b&&b.authors){c.initColors(b.authors);var e=c.createCanvas(b);b=c.padChunks(b),c.data=b,$.each(b.buckets,function(b,d){c.drawBucket(a,d,b)}),c.drawAll(e,b,a),c.authorHint()}else d()})})},createCanvas:function(a){var b=a.buckets.length*50*2-50,c=0,d,e;for(d=0;d<a.buckets.length;d++){var f=a.buckets[d],g=0;for(e=0;e<f.i.length;e++){var h=f.i[e];g+=this.normalizeImpact(h[1])+this.chunkVerticalSpace}g>c&&(c=g)}$("#impact_graph div ").remove();var i=$("#impact_graph ");i.height(c+50).css("border ","1px solid#aaa "),$("#caption ").show(),i.append('<canvas width="'+b+'" height="'+(c+30)+'"></canvas>');var j=$("#impact_graph canvas ")[0];return j.getContext("2d ")},padChunks:function(a){for(var b in a.authors){var c=this.findFirst(b,a),d=this.findLast(b,a);for(var e=c+1;e<d;e++)this.bucketHasAuthor(a.buckets[e],b)||a.buckets[e].i.push([b,0])}return a},bucketHasAuthor:function(a,b){for(var c=0;c<a.i.length;c++)if(a.i[c][0]==parseInt(b))return!0;return!1},findFirst:function(a,b){for(var c=0;c<b.buckets.length;c++)if(this.bucketHasAuthor(b.buckets[c],a))return c},findLast:function(a,b){for(var c=b.buckets.length-1;c>=0;c--)if(this.bucketHasAuthor(b.buckets[c],a))return c},colorFor:function(a){var b=this.colors[a];return"rgb("+b[0]+", "+b[1]+", "+b[2]+")"},randColorValue:function(a){var b=Math.round(Math.random()*100)-50,c=a+b;return c>255&&(c=255),c<0&&(c=0),c},drawBucket:function(a,b,c){var d=0,e=this;$.each(b.i,function(b,f){var g=f[0],h=e.normalizeImpact(f[1]);a[g]||(a[g]=new Array),a[g].push([c*100,d,50,h,f[1]]),d=d+h+e.chunkVerticalSpace})},normalizeImpact:function(a){return a<=9?a+1:a<=5e3?Math.round(10+a/50):Math.round(100+Math.log(a)*10)},drawAll:function(a,b,c){this.drawStreams(a,c,null),this.drawDates(b)},drawStreams:function(a,b,c){a.clearRect(0,0,1e4,500),$(".activator ").remove();for(var d in b)d!=c&&this.drawStream(d,b,a,!0);c!=null&&this.drawStream(c,b,a,!1)},drawStream:function(a,b,c,d){c.fillStyle=this.colorFor(a),chunks=b[a];for(var e=0;e<chunks.length;e++){var f=chunks[e];c.fillRect(f[0],f[1],f[2],f[3]),d&&this.placeActivator(a,b,c,f[0],f[1],f[2],f[3],f[4]),e!=0&&(c.beginPath(),c.moveTo(previousChunk[0]+50,previousChunk[1]),c.bezierCurveTo(previousChunk[0]+75,previousChunk[1],f[0]-25,f[1],f[0],f[1]),c.lineTo(f[0],f[1]+f[3]),c.bezierCurveTo(f[0]-25,f[1]+f[3],previousChunk[0]+75,previousChunk[1]+previousChunk[3],previousChunk[0]+50,previousChunk[1]+previousChunk[3]),c.fill()),previousChunk=f}},drawStats:function(a,b){chunks=b[a];for(var c=0;c<chunks.length;c++){var d=chunks[c],e=d[4];e>10&&this.drawStat(e,d[0],d[1]+d[3]/2)}},drawStat:function(a,b,c){var d="";d+="position: absolute;
        ",d+="left: "+b+"px;
        ",d+="top: "+c+"px;
        ",d+="width: 50px;
        ",d+="text - align: center;
        ",d+="color: #fff;
        ",d+="font - size: 9px;
        ",d+="z - index: 0;
        ",$("#impact_graph ").append('<p class="stat " style="'+d+'">'+a+" < /p>")},drawDate:function(a,b,c){c+=3;var d="";d+="position: absolute;",d+="left: "+b+"px;",d+="top: "+c+"px;",d+="width: 50px;",d+="text-align: center;",d+="color: #888;",d+="font-size: 9px;",$("#impact_graph").append('<p style="'+d+'">'+a+"</p > ")},placeActivator:function(a,b,c,d,e,f,g,h){e+=5;var i="";i+="position: absolute;
        ",i+="left: "+d+"px;
        ",i+="top: "+e+"px;
        ",i+="width: "+f+"px;
        ",i+="height: "+g+"px;
        ",i+="z - index: 100;
        ",i+="cursor: pointer;
        ";var j="a "+d+" - "+e;$("#impact_graph ").append('<div class="activator " id="'+j+'" style="'+i+'">&nbsp;</div>');var k=this;$("#"+j).mouseover(function(b){$(b.target).css("background - color ","black ").css("opacity ","0.08 "),k.drawAuthor(a)}).mouseout(function(a){$(a.target).css("background - color ","transparent "),k.clearAuthor(),k.authorHint()}).mousedown(function(){$(".stat ").remove(),k.clearAuthor(),k.drawStreams(c,b,a),k.drawStats(a,b),k.drawSelectedAuthor(a),k.authorHint()})},drawDates:function(a){var b=this;$.each(a.buckets,function(a,c){var d=0;$.each(c.i,function(a,c){d+=b.normalizeImpact(c[1])+1});var e=["JAN ","FEB ","MAR ","APR ","MAY ","JUN ","JUL ","AUG ","SEP ","OCT ","NOV ","DEC "],f=new Date;f.setTime(c.d*1e3);var g=""+f.getDate()+""+e[f.getMonth()]+""+f.getFullYear();b.drawDate(g,a*100,d+7)})},authorText:function(a,b,c){var d=null;c<25?d="selected_author_text ":d="author_text ";var e="";e+="position: absolute;
        ",e+="left: "+b+"px;
        ",e+="top: "+c+"px;
        ",e+="width: 920px;
        ",e+="color: #444;
        ",e+="font - size: 18px;
        ",$("#impact_legend ").append('<p id="'+d+'" style="'+e+'">'+a+" < /p>")},authorHint:function(){this.authorText('<span style="color: #aaa;">mouse over the graph for more details</span > ',0,30)},drawAuthor:function(a){this.clearAuthor();var b=$("#impact_legend canvas")[0].getContext("2d");b.fillStyle=this.colorFor(a),b.strokeStyle="#888888",b.fillRect(0,30,20,20),b.strokeRect(.5,30.5,19,19);var c=this.data.authors[a].n;this.authorText(c+' < span style = "color: #aaa;" > (click
        for more info) < /span>',25,30)},drawSelectedAuthor:function(a){this.clearSelectedAuthor();var b=$("#impact_legend canvas")[0].getContext("2d");b.fillStyle=this.colorFor(a),b.strokeStyle="#000000",b.fillRect(0,0,20,20),b.strokeRect(.5,.5,19,19);var c=this.data.authors[a],d=c.n,e=c.c,f=c.a,g=c.d;this.authorText(d+" ("+e+" commits, "+f+" additions, "+g+" deletions)",25,0)},clearAuthor:function(){var a=$("#impact_legend canvas")[0].getContext("2d");a.clearRect(0,30,920,20),$("#author_text").remove()},clearSelectedAuthor:function(){var a=$("#impact_legend canvas")[0].getContext("2d");a.clearRect(0,0,920,20),$("#selected_author_text").remove()}},GitHub.BaseBrowser={pagingLimit:99,showingClosed:!1,showingOpen:!0,showingRead:!0,activeSort:["created","desc"],currentPage:1,initialized:!1,errored:!1,lastUrl:null,lastPage:1,listings:$(),openListings:$(),closedListings:$(),unreadListings:$(),filteredListings:$(),listingsElement:null,noneShownElement:null,errorElement:null,loaderElement:null,titleElement:null,footerElement:null,sortElements:null,pagingElement:null,init:function(a){var b=this;this.wrapper=$(a);if(this.initialized)return alert("Only one IssueBrowser per page can exist");if(this.wrapper.length==0)return!1;this.listingsElement=this.wrapper.find(".listings"),this.noneShownElement=this.wrapper.find(".none"),this.errorElement=this.wrapper.find(".error"),this.loaderElement=this.wrapper.find(".context-loader"),this.titleElement=this.wrapper.find("h2"),this.footerElement=this.wrapper.find(".footerbar-text"),this.pagingElement=this.wrapper.find(".paging");var c=this.wrapper.find("ul.filters li");c.each(function(){var a=$(this);switch(a.attr("data-filter")){case"open":b.showingOpen&&a.addClass("selected"),a.click(function(){a.toggleClass("selected"),b.showOpen(a.hasClass("selected"))});break;case"closed":b.showingClosed&&a.addClass("selected"),a.click(function(){a.toggleClass("selected"),b.showClosed(a.hasClass("selected"))});break;case"read":b.showingRead&&a.addClass("selected"),a.click(function(){a.toggleClass("selected"),b.showRead(a.hasClass("selected"))})}}),this.sortElements=this.wrapper.find("ul.sorts li");var d=null;this.sortElements.each(function(){var a=$(this);a.attr("data-sort")==b.activeSort[0]&&(d=a.addClass(b.activeSort[1])),a.click(function(){var a=$(this);d&&d.attr("data-sort")!=a.attr("data-sort")&&d.removeClass("asc").removeClass("desc"),a.hasClass("desc")?(b.sortBy(a.attr("data-sort"),"asc"),a.removeClass("desc").addClass("asc")):(b.sortBy(a.attr("data-sort"),"desc"),a.removeClass("asc").addClass("desc")),d=a})}),this.pagingElement.find(".button-pager").click(function(){return b.showMore(),!1}),this.initNavigation(),this.initialized=!0;var e=this.listingsElement.find(".preloaded-content");e.length>0&&(this.selectedLink=$(this.wrapper.find('a[href="'+e.attr("data-url")+'"]').get(0)),this.selectedLink.addClass("selected"),this.lastUrl=this.selectedLink.attr("href"),this.render(this.listingsElement.innerHTML))},initNavigation:function(){var a=this;this.selectedLink=null,this.wrapper.find("ul.bignav a, ul.smallnav a").click(function(b){var c=$(this);return b.which==2||b.metaKey?!0:(Modernizr.history&&!c.hasClass("js-stateless")&&window.history.replaceState(null,document.title,c.attr("href")),a.selectedLink&&c.attr("href")==a.selectedLink.attr("href")&&!a.errored?!1:(a.remoteUpdate(c.attr("href")),a.selectedLink&&a.selectedLink.removeClass("selected"),a.selectedLink=$(this).addClass("selected"),!1))});var b=this.wrapper.find(".filterbox input"),c=this.wrapper.find("ul.smallnav"),d=c.find("li"),e=function(){d.show(),b.val()!=""&&d.filter(":not(:Contains('"+b.val()+"'))").hide()},f=b.val();b.bind("keyup blur click",function(){if(this.value==f)return;f=this.value,e()})},getPulls:function(a,b){var c=this;b==undefined&&(b={}),a!=this.lastUrl&&(this.currentPage=1),this.startLoading(),$.ajax({url:a,data:b,success:function(d){c.errored=!1,c.cancelLoading(),c.errorElement.hide(),c.lastPage==b["page"]||b["page"]==1||b["page"]==undefined?c.render(d):c.render(d,!0),c.lastUrl=a,b.page&&(c.lastPage=b.page)},error:function(){c.errored=!0,c.showError()}})},startLoading:function(){this.listingsElement.fadeTo(200,.5),this.noneShownElement.is(":visible")&&this.noneShownElement.fadeTo(200,.5),this.loaderElement.show()},cancelLoading:function(){this.listingsElement.fadeTo(200,1),this.noneShownElement.is(":visible")&&this.noneShownElement.fadeTo(200,1),this.loaderElement.hide()},showError:function(){this.cancelLoading(),this.listings&&this.listings.hide(),this.noneShownElement.hide(),this.errorElement.show()},render:function(a,b){b==undefined&&(b=!1),b?this.listingsElement.append(a):this.listingsElement.html(a),this.listings=this.listingsElement.find(".listing"),this.listingsElement.pageUpdate(),this.currentPage==1&&this.listings.length>=this.pagingLimit&&(this.pagingElement.show(),$(this.listings[this.listings.length-1]).remove(),this.listings=this.listingsElement.find(".listing"));if(b){this.pagingElement.hide();var c=$("<div>").append(a).find(".listing");c>this.pagingLimit&&(this.pagingElement.show(),$(this.listings[this.listings.length-1]).remove(),this.listings=this.listingsElement.find(".listing"))}this.closedListings=this.listings.filter("[data-state=closed]"),this.openListings=this.listings.filter("[data-state=open]"),this.readListings=this.listings.filter("[data-read=1]"),this.setCounts(this.openListings.length,this.closedListings.length),this.update()},plural:function(a){return a==1?"request":"requests"},setCounts:function(a,b){var c=a+" open "+this.plural(a),d=a+" open "+this.plural(a)+" and "+b+" closed "+this.plural(b);this.titleElement.text(c),this.footerElement.text(d)},showOpen:function(a){this.currentPage=1,a?this.showingOpen=!0:this.showingOpen=!1,this.remoteUpdate()},showRead:function(a){a?this.showingRead=!0:this.showingRead=!1,this.update()},showClosed:function(a){this.currentPage=1,a?this.showingClosed=!0:this.showingClosed=!1,this.remoteUpdate()},showMore:function(){return this.currentPage++,this.remoteUpdate(),!0},sortBy:function(a,b){return this.activeSort=[a,b],this.currentPage=1,this.remoteUpdate()},update:function(){if(this.listings==null)return;this.listings.show(),this.showingClosed||this.closedListings.hide(),this.showingOpen||this.openListings.hide(),this.showingRead||this.readListings.hide(),this.filteredListings.hide();var a=this.listings.filter(":visible").length;a==0?this.noneShownElement.show():this.noneShownElement.hide()},remoteUpdate:function(a){a||(a=this.lastUrl);var b={sort:this.activeSort[0],direction:this.activeSort[1],page:this.currentPage,exclude:["none"]};if(!this.showingClosed||!this.showingOpen)this.showingOpen||b.exclude.push("open"),this.showingClosed||b.exclude.push("closed"),b.exclude=b.exclude.join(",");this.getPulls(a,b)}},GitHub.PullRequestBrowser={},jQuery.extend(!0,GitHub.PullRequestBrowser,GitHub.BaseBrowser),$(function(){$("#js-issue-list").length>0&&GitHub.PullRequestBrowser.init("#js-issue-list")}),$(function(){var a=$("#issues_next");if(a.length==0)return;var b=function(a,b){$.pjax({container:a,timeout:null,url:b})};$(".js-editable-labels-container .js-manage-labels").live("click",function(){var a=$(this),b=a.closest(".js-editable-labels-container"),c=b.find(".js-editable-labels-show"),d=b.find(".js-editable-labels-edit");return c.is(":visible")?(c.hide(),d.show(),a.addClass("selected"),$(document).bind("keydown.manage-labels",function(b){b.keyCode==27&&a.click()})):(d.hide(),c.show(),a.removeClass("selected"),$(document).unbind("keydown.manage-labels")),!1}),$(".js-custom-color-field a").live("click",function(){var a=$(this).closest(".js-custom-color-field");return a.find(".field").show(),!1}),$(".js-custom-color-field input[type=text]").live("keyup",function(){var a=$(this).closest(".js-custom-color-field"),b=$(this).val();b.length==6&&(a.find(".field").find("input[type=radio]").val(b).attr("checked","checked"),a.find("a").html("Custom color: <strong>#"+b+"</strong > "))}),$(".js - new - label - form.js - label - field ").live("focus ",function(){$(this).closest(".js - new - label - form ").find(".js - color - chooser - fade - in").fadeIn(300)});var c=function(){var a=(new RegExp("page = ([^ & #] + )")).exec(window.location.search);return a?parseInt(a[1]):1},d=a.find("#issues_list ");if(d.length>0){var e=d.attr("data - params ");e&&!location.search&&Modernizr.history&&window.history.replaceState(null,document.title,location.pathname+" ? "+e),d.pageUpdate(function(){var a=d.find(".js - filterable - milestones ").milestoneSelector();a.unbind(".milestoneSelector "),a.bind("beforeAssignment.milestoneSelector ",function(){var a=[];d.find(".issues: checked ").each(function(b,c){a.push($(c).val())}),$(this).attr("data - issue - numbers ",a.join(", "))}),$(this).menu("deactivate "),a.bind("afterAssignment.milestoneSelector ",function(){b(d.selector,f({preservePage:!0}))})}),d.pageUpdate(),d.bind("start.pjax ",function(a){d.find(".context - loader ").show(),d.find(".issues ").fadeTo(200,.5)}).bind("end.pjax ",function(a){d.find(".issues ").fadeTo(200,1),d.find(".context - loader ").hide()});var f=function(a){a||(a={});var b={labels:[],sort:"",direction:"",state:"",page:a.preservePage?c():1},e=d.find(".milestone - context ").attr("data - selected - milestone ");e!=""&&e!=null&&(b.milestone=e),d.find(".sidebar ul.labels ").find(".selected ").each(function(a,c){b.labels.push($(c).attr("data - label "))}),b.labels=b.labels.join(", "),b.labels==""&&delete b.labels;var f=d.find(".main.filterbar ul.sorts ").find(".asc, .desc ");b.sort=f.attr("data - sort "),b.direction=f.attr("class "),b.state=d.find(".main.filterbar ul.filters ").find(".selected ").attr("data - filter ");var g=d.find("ul.bignav ").find(".selected ").attr("href ");return g+" ? "+$.param(b)},g=[".sidebar ul.bignav a ",".sidebar ul.labels a ",".main.filterbar ul.filters li a ",".main.filterbar ul.sorts li a ",".milestone - context.pane - selector.milestone "];d.find(g.join(", ")).pjax(d.selector,{timeout:null,url:f}),d.delegate(".pagination a, #clear - active - filters ","click ",function(a){a.preventDefault(),b(d.selector,$(this).attr("href "))}),d.selectableList(".sidebar ul.bignav ",{mutuallyExclusive:!0}),d.selectableList(".sidebar ul.labels "),d.selectableList(".main.filterbar ul.filters ",{wrapperSelector:"",mutuallyExclusive:!0}),d.selectableList(".js - selectable - issues ",{wrapperSelector:"",itemParentSelector:".issue ",enableShiftSelect:!0,ignoreLinks:!0}),d.sortableHeader(".main.filterbar ul.sorts "),d.delegate(".milestone - context.pane - selector.milestone ","click ",function(a){var b=$(this);b.closest(".milestone - context ").attr("data - selected - milestone ",b.attr("data - milestone ")),b.menu("deactivate ")}),d.delegate(".issues table ","click ",function(a){var b=$(a.target);if(a.which>1||a.metaKey||b.closest("a ").length)return!0;var c=$(this),e=c.find(".issue.selected "),f=d.find(".issues.actions.buttons ");e.length>0?(f.addClass("activated "),f.removeClass("deactivated ")):(f.removeClass("activated "),f.addClass("deactivated "))}),d.find(": checked ").removeAttr("checked "),$(document).on("navigation: keydown ",".issues.issue ",function(a){a.hotkey=="x "&&$(this).click()});var h=function(a){var c={issues:[]};d.find(".issues: checked ").each(function(a,b){c.issues.push($(b).val())}),$.ajax({url:a||d.find(".issues.btn - close ").attr("data - url "),method:"put ",data:$.param(c),success:function(a,c,e){b(d.selector,f({preservePage:!0}))}})},i=function(){window.location=a.find(".btn - new - issue ").attr("href ")},j=function(a){a.preventDefault(),$("#new_label_form.namefield ").focus()};$.hotkeys({e:h,c:i,l:j});var k="#issues_list.label - context ";d.delegate(".label - context button.update - labels ","click ",function(a){var c=$(this),e={labels:[],issues:[]};d.find(".label - context ul.labels: checked ").each(function(a,b){e.labels.push($(b).val())}),d.find(".issues: checked ").each(function(a,b){e.issues.push($(b).val())}),$(this).menu("deactivate "),$.ajax({url:d.find(".label - context ul.labels ").attr("data - url "),method:"put ",data:e,complete:function(a,c){b(d.selector,f({preservePage:!0}))}})}),d.selectableList(".label - context ul.labels "),d.delegate(".issues.btn - close, .issues.btn - reopen ","click ",function(a){h($(this).attr("data - url "))}),d.delegate(".issues.btn - label ","click ",function(b){var c=d.find(".issues: checked ").closest(".issue ").find(".label ");a.find(k+".label a.selected ").removeClass("selected "),a.find(k+": checked ").attr("checked ",!1),c.each(function(b,c){var d=$(c).attr("data - name ");a.find(k+".label[data - name = '"+d+"']
            a ").addClass("selected "),a.find(k+".label[data - name = '"+d+"'] : checkbox ").attr("checked ",!0)})});var l=function(a){var c=$(a.target).closest(".assignee - assignment - context ").find(": checked "),e={issues:[],assignee:c.val()};d.find(".issues: checked ").each(function(a,b){e.issues.push($(b).val())}),$(this).menu("deactivate "),$.ajax({url:c.attr("data - url "),method:"put ",data:$.param(e),success:function(a,c,e){b(d.selector,f({preservePage:!0}))}})};d.delegate(".issues.btn - assignee ","click ",function(a){var b=$(".assignee - assignment - context ");b.data("applied ")!=1&&(b.data("applied ",!0),b.assigneeFilter(l))}),d.delegate(".assignee - assignment - context: radio ","change ",l),d.selectableList("ul.color - chooser ",{wrapperSelector:"li.color ",mutuallyExclusive:!0}),d.delegate("ul.color - chooser li.color ","click ",function(a){var b=$(this).find("input[type = radio]").val(),c=$("#custom_label_text ");c.text(c.attr("data - orig "))}),d.delegate(g.join(", "),"click ",function(a){Modernizr.history||(a.preventDefault(),window.location=f())})}var m=a.find("#milestone_list ");if(m.length>0){m.bind("start.pjax ",function(a){m.find(".context - loader ").show(),m.find(".milestones ").fadeTo(200,.5)}).bind("end.pjax ",function(a){m.find(".milestones ").fadeTo(200,1),m.find(".context - loader ").hide()});var g=[".sidebar ul.bignav a ",".main.filterbar ul.filters li ",".main.filterbar ul.sorts li "];m.delegate(g.join(", "),"click ",function(a){if(a.which==1&&!a.metaKey){a.preventDefault();var c=$(this).attr("href ")||$(this).attr("data - href ");b(m.selector,c)}}),m.selectableList(".sidebar ul.bignav "
,{mutuallyExclusive:!0}),m.selectableList(".main.filterbar ul.filters ",{wrapperSelector:"",mutuallyExclusive:!0}),m.sortableHeader(".main.filterbar ul.sorts ")}}),function(a){a.fn.milestoneSelector=function(b){var c=a.extend({},a.fn.milestoneSelector.defaults,b);return this.each(function(){var b=a(this),d=b.closest(".context - pane "),e=b.find(".selector - item "),f=b.find(".milestone - item "),g=f.filter(".open - milestone "),h=f.filter(".closed - milestone "),i=e.filter(".
        for - selected "),j=b.find(".new - milestone - item "),k=b.find(".no - results "),l=b.find(".milestone - filter "),m=a(".js - milestone - infobar - item - wrapper ");if(b.find("form ").length==0){c.newMode=!0;var n=a("input[name = 'issue[milestone_id]']"),o=a("input[name = 'new_milestone_title']")}var p="open ",q=null;b.find(".tabs a ").click(function(){return b.find(".tabs a.selected ").removeClass("selected "),a(this).addClass("selected "),p=a(this).attr("data - filter "),v(),!1}),l.keydown(function(a){switch(a.which){case 38:case 40:case 13:return!1}}),l.keyup(function(b){var c=e.filter(".current: visible ");switch(b.which){case 38:return r(c.prevAll(".selector - item: visible: first ")),!1;case 40:return c.length?r(c.nextAll(".selector - item: visible: first ")):r(a(e.filter(": visible: first "))),!1;case 13:return s(c),!1}q=a(this).val(),v()}),e.click(function(){s(this)}),d.bind("deactivated.contextPane ",function(){z(),l.val(""),l.trigger("keyup ")});var r=function(a){if(a.length==0)return;e.filter(".current ").removeClass("current "),a.addClass("current ")},s=function(e){e=a(e);if(e.length==0)return;if(e.hasClass("new - milestone - item "))return t(e);var g=e.find("input[type = radio]");if(g[0].checked)return;g[0].checked=!0,b.trigger("beforeAssignment.milestoneSelector "),c.newMode?(n.val(g[0].value),f.removeClass("selected "),e.addClass("selected "),d.menu("deactivate "),b.trigger("afterAssignment.milestoneSelector ")):u({url:g[0].form.action,params:{milestone:g[0].value,issues:b.attr("data - issue - numbers ").split(", ")}})},t=function(a){b.trigger("beforeAssignment.milestoneSelector "),c.newMode?(n.val("new "),o.val(l.val()),f.removeClass("selected "),a.addClass("selected "),d.menu("deactivate "),b.trigger("afterAssignment.milestoneSelector ")):u({url:a.closest("form ").attr("action "),params:{new_milestone:l.val(),issues:b.attr("data - issue - numbers ").split(", ")}})},u=function(c){w(),a.ajax({type:"PUT ",url:c.url,data:c.params,success:function(a){x(),m.html(a.infobar_body).pageUpdate(),d.menu("deactivate "),b.html(a.context_pane_body).milestoneSelector().pageUpdate(),b.trigger("afterAssignment.milestoneSelector ")},error:function(){x(),y()}})},v=function(){var b=null;p=="open "?(i.show(),h.hide(),b=g):(i.hide(),g.hide(),b=h),q!=""&&q!=null?(b.each(function(){var b=a(this),c=b.find(".milestone - title ").text().toLowerCase();c.score(q)>0?b.show():b.hasClass("selected ")||b.hide()}),j.find(".milestone - title ").text(q),j.show(),k.hide(),i.hide()):(b.each(function(){a(this).show()}),b.length==0?k.show():k.hide(),j.hide())};v();var w=function(){d.find(".context - body ").append('<div class="loader ">Loading??/div>')},x=function(){d.find("context - .body.loader ").remove()},y=function(a){a==null&&(a="Sorry, an error occured "),d.find(".context - body ").append('<div class="error - message ">'+a+" < /div>")},z=function(){d.find(".context-body .error-message").remove()}})},a.fn.milestoneSelector.defaults={}}(jQuery),$(function(){var a=$("#issues_next #js-new-issue-form");if(a.length==0)return;a.selectableList("ul.labels");var b=function(b){var c=a.find("input.title");c.val().length>0?(c.addClass("valid"),$(".js-title-missing-error").hide()):(c.removeClass("valid"),$(".js-title-missing-error").show())};a.bind("submit",function(a){b();if($(".js-title-missing-error").is(":visible"))return!1}),a.find("input.title").keyup(b).change(b);var c=a.find(".infobar .milestone .text"),d=a.find(".js-filterable-milestones").milestoneSelector();d.bind("afterAssignment.milestoneSelector",function(){d.menu("deactivate");var a=d.find(".selected");a.hasClass("clear")?c.html("No milestone"):a.hasClass("new-milestone-item")?c.html("Milestone: <strong>"+a.find("p").text()):c.html("Milestone: <strong>"+a.find("h4").text())}),a.on("menu:activated",function(){$(this).find(".context-pane:visible :text").focus()});var e=a.find(".js-assignee-context"),f=a.find(".infobar .assignee .text");e.assigneeFilter(function(){e.find(".current").click()}),e.find(".selector-item").click(function(){var a=$(this).find("input[type=radio]");a.val()==""?f.html("No one is assigned"):(f.html("Assignee: <strong>"+$(this).find("h4").html()),f.find("small").remove())}),a.find(".js-pane-radio-selector").each(function(){var a=$(this),b=a.closest(".context-pane");a.find("label").click(function(){var b=$(this);a.find(".selected").removeClass("selected"),b.addClass("selected"),a.menu("deactivate")})})}),$(function(){var a=$("#issues_next #issues_search");if(a.length==0)return;var b=$("#js-issues-quicksearch").val();a.find("input[type=radio], select").change(function(a){var c=$(this).closest("form");c.find("#search_q").val(b),c.submit()})}),$(function(){var a=$("#issues_next #show_issue");if(a.length==0)return;var b=function(a){window.location=$("#to_isssues_list").attr("href")},c=function(){$("#issues_next .btn-close-issue").click()},d=function(){window.location=$("#issues_next .btn-new-issue").attr("href")};$.hotkeys({u:b,c:d}),a.on("menu:activated",function(){$(this).find(".context-pane:visible :text").focus()}),a.find(".assignee-context").assigneeFilter(function(){a.find(".assignee-context").closest("form").submit()}),a.find(".js-filterable-milestones").milestoneSelector(),$(a).on("keyup",".js-label-filter",function(b){var c=a.find(".js-filterable-labels li"),d=$(this).val();d!=""&&d!=null?c.each(function(){var a=$(this),b=a.text().toLowerCase();b.score(d)>0?a.show():a.hide()}):c.show()}),$(a).on("keydown",".js-label-filter",function(a){if(a.hotkey==="enter")return!1}),$(a).on("change",".js-autosubmitting-labels input[type=checkbox]",function(){var a=$(this).closest("form");$.post(a.attr("action"),a.serialize(),function(a){$(".discussion-labels > .labels").html(a.labels)},"json")}),a.selectableList(".js-selectable-labels"),$(a).on("change",".js-pane-selector-autosubmit input[type=radio]",function(){$(this).closest("form").submit()}),$(a).on("click",".js-assignee-context .selector-item",function(a){radio=$(a.currentTarget).find("input[type=radio]"),radio.attr("checked","checked"),radio.trigger("change")})}),function(){$(function(){var a,b,c,d,e=this;b=$("#issues-dashboard");if(b.length>0)return d=b.attr("data-url"),d&&!location.search&&Modernizr.history&&window.history.replaceState(null,document.title,d),a=$("#issues-dashboard .list"),c=[""+a.selector+" .nav.big a",""+a.selector+" .nav.small a","#clear-active-filters",""+a.selector+" .filterbar .filters a",""+a.selector+" .filterbar .sorts a"].join(", "),$(c).pjax(a.selector,{timeout:null}),a.bind("start.pjax",function(){return $(e).find(".context-loader").show(),$(e).find(".listings").fadeTo(200,.5)}).bind("end.pjax",function(){return $(e).find(".listings").fadeTo(200,1),$(e).find(".context-loader").hide()})})}.call(this),function(){var a=location.pathname+location.hash,b=a.match(/#issue\ / (\d + )(\ / comment\ / (\d + )) ? /);if(b){var c=b[1],d=b[3];c&&(d?window.location=a.replace(/\ / ?#issue\ / \d + \ / comment\ / \d + /,"/"+c+"#issuecomment - "+d):window.location=a.replace(/\/?#issue\/\d+/," / "+c))}}(),jQuery(function(a){var b=a("#issues_next ");if(b.length==0)return;var c=function(b){b.preventDefault(),a("#js - issues - quicksearch ").focus()};a.hotkeys({" / ":c});var d=a("#js - issues - quicksearch ");if(d.length>0){var e=b.find(".btn - new - issue "),f=d.offset();b.find(".search.autocomplete - results ").css({left:d.position().left,width:e.offset().left-f.left+e.outerWidth(!0)}),d.quicksearch({results:b.find(".search.autocomplete - results "),insertSpinner:function(a){d.closest("form ").prepend(a)}}).bind("focus ",function(b){a(this).closest(".fieldwrap ").addClass("focused ")}).bind("blur ",function(b){a(this).closest(".fieldwrap ").removeClass("focused ")}).css({outline:"none "})}}),$(function(){var a=$(".github - jobs - promotion ");if(a.get(0)==null)return;a.css({visibility:"hidden "}),window.jobsWidgetCallback=function(b){var c=Math.floor(Math.random()*b.jobs.length),d=b.jobs[c];a.find(".job - link ").attr("href ",d.url),a.find(".job - company ").text(d.company),a.find(".job - position ").text(d.position),a.find(".job - location ").text(d.location),a.css({visibility:"visible "})},$.getScript(a.attr("url "))}),$(function(){$(document).on("click ",".js - show - new - ssh - key - form ",function(){return $(".js - new - ssh - key - box ").toggle().find(": text ").focus(),!1}),$(".edit_key_action ").live("click ",function(){var a=$(this).attr("href ");return $.facebox(function(){$.get(a,function(a){$.facebox(a),$("#facebox.footer ").hide()})}),!1}),$(document).on("click ","#cancel_add_key ",function(){return $(".js - show - new - ssh - key - form ").toggle(),$(".js - new - ssh - key - box ").toggle().find("textarea ").val(""),$("#new_key ").find(": text ").val(""),$("#new_key.error_box ").remove(),!1}),$(".cancel_edit_key ").live("click ",function(){return $.facebox.close(),$("#new_key.error_box ").remove(),!1}),$("body ").delegate("form.key_editing ","submit ",function(a){var b=this;return $(b).find(".error_box ").remove(),$(b).find(": submit ").attr("disabled ",!0).spin(),$(b).ajaxSubmit(function(a){a.substring(0,3)==" < li "?($(b).attr("id ").substring(0,4)=="edit "?($("#"+$(b).attr("id ").substring(5)).replaceWith(a),$.facebox.close()):($("ul.public_keys ").append(a),$(".js - show - new - ssh - key - form ").toggle(),$(".js - new - ssh - key - box ").toggle()),$(b).find("textarea ").val(""),$(b).find(": text ").val("")):$(b).append(a),$(b).find(": submit ").attr("disabled ",!1).stopSpin()}),!1}),$(".delete_key ").live("click ",function(){if(confirm("Are you sure you want to delete this key ? ")){$.ajax({type:"POST ",data:{_method:"delete "},url:$(this).attr("href ")});var a=$(this).parents("ul ");$(this).parent().remove()}return!1})}),function(){$(function(){return $(".site - logo ").on("contextmenu ",function(){return $.facebox({div:"#logo - popup "},"logo - popup clearfix "),!1})})}.call(this),GitHub=GitHub||{},GitHub.metric=function(a,b){if(!window.mpq)return GitHub.metric=$.noop;b?mpq.push([b.type||"track ",a,b]):mpq.push(["track ",a])},GitHub.trackClick=function(a,b,c){if(!window.mpq)return GitHub.trackClick=$.noop;$(a).click(function(){return c=$.isFunction(c)?c.call(this):c,GitHub.metric(b,c),!0})},$(function(){var a=GitHub.trackClick;a("#entice - signup - button ","Entice banner clicked "),a("#coupon - redeem - link ","Clicked Dec 2010 Sale Notice "),a(".watch - button ","Watched Repo ",{repo:GitHub.nameWithRepo}),a(".unwatch - button ","Unwatched Repo ",{repo:GitHub.nameWithRepo}),a(".btn - follow ","Followed User ",function(){return{user:$(this).attr("data - user ")}}),a(".btn - unfollow ","Unfollowed User ",function(){return{user:$(this).attr("data - user ")}})}),DateInput.prototype.resetDate=function(){$(".date_selector.selected ").removeClass("selected "),this.changeInput("")},$(function(){$("input.js - date - input ").each(function(){var a=new DateInput(this);a.hide=$.noop,a.show(),$(this).hide(),$(".date_selector ").addClass("no_shadow ")}),$("label.js - date - input a ").click(function(a){var b=$("input.js - date - input ").data("datePicker ");b.resetDate()})}),function(){$(document).pageUpdate(function(){return $(this).find(".js - obfuscate - email ").each(function(){var a,b,c,d;if(d=$(this).attr("data - email "))return a=decodeURIComponent(d),c=$(this).text().replace(/{email}/,a),b=$(this).attr("href ").replace(/{email}/,a),$(this).text(c),$(this).attr("href ",b)})})}.call(this),$(function(){var a=$("#organization - transforming ");a.redirector({url:a.data("url "),to:" / login "}),$("#members_bucket.remove - user ").click(function(){var a,b=$(this),c=b.parents("li: first ").find(".login ").text(),d="Are you POSITIVE you want to remove "+c+"from "+"your organization ? ";return confirm(d)?(b.spin().remove(),a=$("#spinner ").addClass("remove "),$.del(b.attr("href "),function(){a.parent().remove()}),!1):!1})}),$(function(){$(".js - coupon - click - onload ").click(),$(document).on("click ",".js - add - cc ",function(a){return $(document).one("reveal.facebox ",function(){$("#facebox.js - thanks, #facebox.rule: first ").hide()}),$.facebox({div:this.href}),!1}),$(document).on("click ",".js - close - facebox ",function(){$(document).trigger("close.facebox ")});var a=$("table.upgrades ");$(document).on("mousedown ",".js - plan - change ",function(a){var b=$(this).closest("tr ").attr("data - name ");$(".js - new - plan - name - val ").val(b),$(".js - new - plan - name ").text(b),b=="free "?$(".js - new - plan - card - on - file ").hide():$(".js - new - plan - card - on - file ").show()}),$(".selected.choose_plan ").click(),$(".js - show - credit - card - form ")[0]&&($.facebox({div:"#credit_card_form "}),$(document).unbind("close.facebox ").bind("close.facebox ",function(){window.location=" / account / billing "})),$(document).on("submit ",".js - coupon - form ",function(){return $(this).find("button ").attr("disabled ",!0).after(' <img src=" / images / spinners / octocat - spinner - 16px.gif ">'),$.ajax({url:this.action,type:this.method,data:{code:$(this).find(": text ").val()},error:function(a){$("#facebox.content ").html(a.responseText)},success:function(a){$("#facebox.content ").html(a),$(document).unbind("close.facebox ").bind("close.facebox ",function(){var a=window.location.pathname;window.location=/organizations/.test(a)?a:" / account / billing "})}}),!1})}),$(function(){if(!$("body ").hasClass("page - compare "))return!1;var a=function(a){return a.charAt(0).toUpperCase()+a.slice(1)},b=$("#compare ").data("base "),c=$("#compare ").data("head "),d=null;$(".compare - range.commit - ref.to ").click(function(){return d="end ",$.facebox({div:"#compare_chooser "}),!1}),$(".compare - range.commit - ref.from ").click(function(){return d="start ",$.facebox({div:"#compare_chooser "}),!1});var e=function(){var e=$("#facebox.ref - autocompleter "),f=$("#facebox button.choose - end "),g=$("#facebox button.refresh ");e.val(d=="start "?b:c),$("#facebox.mode - upper ").text(a(d)),$("#facebox.mode - lower ").text(d),d=="start "?f.show():f.hide()},f=function(){var a=$("#facebox.ref - autocompleter ");if(a.length==0)return;var f=$("#facebox.commit - preview - holder "),g=$("#facebox button.refresh "),h=$(".compare - range ").attr("url - base ");e(),g.click(function(){return d=="start "?b=a.val():c=a.val(),$(document).trigger("close.facebox "),document.location=h+b+"..."+c,!1}),a.click(function(){return this.focus(),this.select(),!1});var i=!1,j=null,k=function(){i&&j.abort(),i=!0,j=$.get(f.attr("url_base ")+a.val(),null,function(a){a.length>0&&(f.html(a),f.find("a ").attr("target ","_blank "),f.pageUpdate()),i=!1})};k();var l=a.val(),m=null,n=function(){if(l!=a.val()||m==a.val()){l=a.val();return}k(),m=a.val()};a.keyup(function(){l=this.value,setTimeout(n,1e3)}),a.click()};$(document).bind("reveal.facebox ",f),b==c&&$(".compare - range.commit - ref.from ").click();var g=window.location.hash.substr(1);(/^diff-/.test(g)||/^L\d+/.test(g))&&$("li a[href = '#files_bucket']").click()}),function(){$(function(){var a;if($(".js - leaving - form ")[0])return a=function(){var a;return a=new WufooForm,a.initialize({userName:"github ",formHash:"q7x4a9 ",autoResize:!0,height:"504 ",ssl:!0}),$(".js - leaving - form ").html(a.generateFrameMarkup())},function(){var b,c;return b=document.location.protocol==="https: "?"https: 
        //secure.":"http://",c=document.createElement("script"),c.type="text/javascript",c.src=""+b+"wufoo.com/scripts/embed/form.js",c.onload=a,$("head")[0].appendChild(c)}()})}.call(this),$(function(){function c(){var a=b.find("input.title");a.val().length>0?(a.addClass("valid"),b.find(".js-title-missing-error").hide()):(a.removeClass("valid"),b.find(".js-title-missing-error").show())}if(!$("body").hasClass("page-newpullrequest"))return!1;$(".pull-form a[action=preview]").click(function(){var a=$(".pull-form .content-body"),b=$(".pull-form").attr("data-preview-url"),c=$(this).closest("form");a.html("<p>Loading preview ...</p>"),$.post(b,c.serialize(),function(b){a.html(b)})});var a=$(".btn-change");a.data("expand-text",a.text()),a.data("collapse-text",a.attr("data-collapse-text")),a.data("state","collapsed"),$(".editor-expander").click(function(){return a.data("state")=="collapsed"?(a.find("span").text(a.data("collapse-text")),a.data("state","expanded"),$(".range-editor").slideDown("fast"),$(".pull-form-main .form-actions button").hide(),$(".pull-tabs, .tab-content").css({opacity:.45})):(a.find("span").text(a.data("expand-text")),a.data("state","collapsed"),$(".range-editor").slideUp("fast"),$(".pull-form-main .form-actions button").show(),$(".pull-tabs, .tab-content").css({opacity:1})),!1});var b=$(".new-pull-request form");b.submit(function(){if(!b.attr("data-update")){c();if($(".js-title-missing-error").is(":visible"))return!1;GitHub.metric("Sent Pull Request",{"Pull Request Type":"New School",Action:GitHub.currentAction,"Ref Type":GitHub.revType})}}),$("button#update_commit_range").click(function(){b.attr("data-update","yes"),b.attr("action",$(this).data("url")),b.submit()}),$(".range-editor").find("input, select").keypress(function(a){a.keyCode==13&&a.preventDefault()}),$(".js-refchooser").each(function(){$(this).refChooser({change:function(){$(this).attr("data-ref-valid",!1),$("button#update_commit_range").attr("disabled",!0)},found:function(){$(this).attr("data-ref-valid",!0),$(".js-refchooser[data-ref-valid=false]").length==0&&$("button#update_commit_range").removeAttr("disabled")}});var a=$(this).find(".js-ref"),b=$(this).find("select");a.focus(function(){window.setTimeout(function(){a[0].selectionStart=0,a[0].selectionEnd=a.val().length},1)})})}),function(a){a.fn.refChooser=function(b){var c=a.extend({},a.fn.refChooser.defaults,b);return this.each(function(){function n(){var b=i.find("ul").empty();a.ajax({url:"/"+e.val()+"/branches",dataType:"json",success:function(c){b.append(a.map(c,function(b){return a("<li>",{"class":"autocomplete-result js-navigation-item","data-autocomplete-value":b,text:b})[0]}))}})}function o(){var b=a(f).val(),c=a(i).find("ul");c.find("li").each(function(){a(this).attr("data-autocomplete-value").search(b)===0?a(this).show():a(this).hide()}),c.trigger("autocomplete:change")}var b=this,d=a(this),e=d.find(".js-source"),f=d.find(".js-ref"),g=d.find(".js-commit-preview"),h=d.attr("data-preview-url-base"),i=d.find(".autocomplete-results"),j={repo:d.attr("data-error-repo")},k=!1,l=null,m=function(){if(e.val()==""){g.html('<p class="error">'+j.repo+"</p>"),c.missing.call(d);return}var i=h+e.val().split("/")[0]+":"+f.val();k&&l.abort(),k=!0,l=a.get(i,null,function(a){a.length>0&&(g.html(a),g.pageUpdate(),g.find(".error").length==0?c.found.call(b):c.missing.call(b)),k=!1})};f.on("autocomplete:search",function(){c.change.call(b),o(),m()});var p=e.val();e.change(function(){if(this.value==p)return;c.change.call(b),p=this.value,m(),n()})})},a.fn.refChooser.defaults={found:function(){},change:function(){},missing:function(){}}}(jQuery),$(function(){if(!$("body").hasClass("page-profile"))return!1;var a=$("ul.repositories>li"),b=$(".repo-filter input").val(""),c=b.val(),d=null,e=function(){a.show(),b.val()!=""&&a.filter(":not(:Contains('"+b.val()+"'))").hide()};b.bind("keyup blur click",function(){if(this.value==c)return;c=this.value,e()}),$("ul.repositories>li.simple").each(function(){var a=$(this),b=a.find("p.description").html();$.trim(b)!=""&&a.find("h3").attr("title",b).tipsy({gravity:"w"})});var f=$("ul#placeholder-members li").remove();f.length>0&&$("ul.org-members").prepend(f)}),$(function(){if(!$("body").hasClass("page-pullrequest"))return!1;var a=$(".discussion-timeline");a.on("menu:activated",function(){$(this).find(".context-pane:visible :text").focus()}),a.find(".assignee-context").assigneeFilter(function(){a.find(".assignee-context form").submit()}),a.on("click",".js-assignee-context .selector-item",function(a){radio=$(a.currentTarget).find("input[type=radio]"),radio.attr("checked","checked"),radio.trigger("change")}),a.find(".js-filterable-milestones").milestoneSelector(),$(".btn-close-pull-request, .js-close-and-comment").on("click",function(a){$(".merge-pr").hide(200)});var b=$(".js-pane-selector-autosubmit");b.delegate("input[type=radio]","change",function(){var a=$(this);a.closest("form").submit()}),$(".file, .file-box").live("commentChange",function(a){$(a.target).closest("#discussion_bucket").length>0?$("#files_bucket").remove():$("#discussion_bucket").remove()}),$("#reply-to-pr").click(function(){$("#comment_body").focus()}),$("#pull_closed_warning a").click(function(){return $("#pull_closed_warning").hide(),$("#pull_comment_form").show(),!1});var c=$(".js-toggle-merging");if(c.length>0){var d=$(".js-shown-merging"),e=$(".js-shown-notmerging");c.click(function(){return d.is(":visible")?(d.hide(),e.show()):(d.show(),e.hide()),!1})}var f=$("#js-mergeable-unknown");f.length>0&&f.is(":visible")&&$.smartPoller(function(a){$.ajax({url:f.data("status-url"),dataType:"json",success:function(b){b===!0?(f.hide(),$("#js-mergeable-clean").show()):b===!1?(f.hide(),$("#js-mergeable-dirty").show()):a()},error:function(){f.hide(),$("#js-mergeable-error").show()}})})}),$(function(){$(".ajax_paginate a").live("click",function(){var a=$(this).parent(".ajax_paginate");return a.hasClass("loading")?!1:(a.addClass("loading"),$.ajax({url:$(this).attr("href"),complete:function(){a.removeClass("loading")},success:function(b){a.replaceWith(b),a.parent().pageUpdate()}}),!1)})}),function(){var a=function(a,b){return function(){return a.apply(b,arguments)}};if(!Modernizr.canvas)return;GitHub.ParticipationGraph=function(){function b(b){this.el=b,this.onSuccess=a(this.onSuccess,this),this.canvas=this.el.getContext("2d"),this.refresh()}return b.prototype.barWidth=7,b.prototype.barMaxHeight=20,b.prototype.getUrl=function(){return $(this.el).data("source")},b.prototype.setData=function(a){var b,c;this.data=a;if(((b=this.data)!=null?b.all:void 0)==null||((c=this.data)!=null?c.owner:void 0)==null)this.data=null;this.scale=this.getScale(this.data)},b.prototype.getScale=function(a){var b,c,d,e,f;if(a==null)return;b=a.all[0],f=a.all;for(d=0,e=f.length;d<e;d++)c=f[d],c>b&&(b=c);return b>=this.barMaxHeight?(this.barMaxHeight-.1)/b:1},b.prototype.refresh=function(){$.ajax({url:this.getUrl(),dataType:"json",success:this.onSuccess})},b.prototype.onSuccess=function(a){this.setData(a),this.draw()},b.prototype.draw=function(){if(this.data==null)return;this.drawCommits(this.data.all,"#cacaca"),this.drawCommits(this.data.owner,"#336699")},b.prototype.drawCommits=function(a,b){var c,d,e,f,g,h,i,j,k;d=this.el.getContext("2d"),f=0;for(j=0,k=a.length;j<k;j++)c=a[j],g=this.barWidth,e=c*this.scale,h=f*(this.barWidth+1),i=this.barMaxHeight-e,this.canvas.fillStyle=b,this.canvas.fillRect(h,i,g,e),f++},b}(),$(document).pageUpdate(function(){return $(this).find(".participation-graph").each(function(){if($(this).is(":hidden"))return $(this).removeClass("disabled"),new GitHub.ParticipationGraph($(this).find("canvas")[0])})})}.call(this),$(function(){var a=$("table.upgrades"),b=a.find("tr.current"),c=$("#plan"),d=$("#credit_card_fields"),e=function(b){newPlan=b,a.find("tr.selected").removeClass("selected"),b.addClass("selected"),a.addClass("selected"),c.val(newPlan.attr("data-name")),newPlan.attr("data-cost")==0?d.hide():d.show()};$(document).on("click",".choose_plan",function(a){return e($(this).closest("tr")),!1}),$(".selected .choose_plan").click()}),function(){$(function(){var a,b,c,d;b=$(".js-plaxify");if(b.length>0){for(c=0,d=b.length;c<d;c++)a=b[c],$(a).plaxify({xRange:$(a).data("xrange")||0,yRange:$(a).data("yrange")||0,invert:$(a).data("invert")||!1});return $.plax.enable()}})}.call(this),function(){$(function(){var a,b,c;return a=$("#global-search-field"),b=$("#my-repos-autocomplete"),c=null,a.on("autocomplete:search",function(a,d){c&&c.abort();if(d===""){b.find("ul").empty(),b.trigger("autocomplete:change");return}return c=$.ajax({type:"GET",data:{q:d,limit:10},url:"/autocomplete/repos/mine",dataType:"html",success:function(a){return c=null,b.find("ul").html(a),b.trigger("autocomplete:change")}})}),a.on("autocomplete:result",function(a,b){return window.location="/"+b})})}.call(this),function(){$(function(){return $(".js-settings-next").length===0?!1:($(".js-settings-pjax li a").pjax({timeout:!1,container:"#page-settings"}),$(".js-pjax-settings a, a.js-pjax-settings").pjax({timeout:!1,container:"#page-settings"}),$("#page-settings").on("pjax:start",function(){return $(".pjax-loading").css("display","block")}).on("pjax:end",function(){return $(".pjax-loading").css("display","none")}),$("#page-settings").on("click",".js-add-email",function(a){return $(this).toggle(),$("#add-email-form").fadeIn(200).find(":text").focus(),!1}),$("#page-settings").on("click",".js-add-email-cancel",function(a){return $(".js-add-email").toggle(),$("#add-email-form").hide().find(":text").val(""),!1}),$(document).on("click",".js-notification-global-toggle",function(a){var b,c,d;return d=$(this).attr("data-url"),b=this.checked,c={},c[this.name]=b?"1":"0",$.ajax({url:$(this).attr("data-url"),type:"PUT",data:c,success:function(){return b?$(this).parent("p").removeClass("ignored"):$(this).parent("p").addClass("ignored")}})}),$(document).on("change","table.notifications input[type=checkbox]",function(a){return $.ajax({url:$(this).parents("table").attr("data-toggle-url"),type:"PUT",data:{enable:this.checked?"true":"false",notification_action:this.value}})}),$(document).on("click","button.dummy",function(a){return $(this).prev(".success").show().fadeOut(500),!1}),$(document).on("ajaxSend",".js-remove-item",function(a){return $(this).spin().hide()}),$(document).on("ajaxComplete",".js-remove-item",function(a){return $(this).parents("li").stopSpin().remove()}),$(document).on("ajaxSend",".js-remove-key",function(a){return $(this).addClass("disabled").find("span").text("Deleting??)}),$(document).on("ajaxError",".js-remove-key",function(a){return $(this).removeClass("disabled").find("span").text("Error. Try again.")}),$(document).on("ajaxSuccess",".js-remove-key",function(a){$(this).parents("li").remove();if($(".js-ssh-keys-box li").length===0)return $(".js-no-ssh-keys").show()}),$(document).on("click",".js-leave-collaborated-repo",function(a){var b,c,d,e;return c=$(a.currentTarget),d=c.parent("div").parent("div").attr("data-repo"),console.log(d),e=$('ul.repositories li[data-repo="'+d+'"]'),b=c.parents("div.full-button"),b.addClass("no-bg"),b.html('<img src="'+GitHub.Ajax.spinner+'"/>'),$.ajax({url:"/account/leave_repo/"+d,type:"POST",success:function(){return $.facebox.close(),e.fadeOut()},error:function(){return b.html('<img src="/images/modules/ajax/error.png">')}}),!1}))}),$.pageUpdate(function(){return $(this).find("dl.autosave").each(function(){return $(this).autosaveField()})})}.call(this),$(function(){$(".plan").dblclick(function(){var a=$(this).find("a.classy");a.length>0&&(document.location=a.attr("href"))}),$("#signup_form").submit(function(){$("#signup_button").attr("disabled",!0).find("span").text("Creating your GitHub account...")}),$("dl.form.autocheck").each(function(){var a=$(this);a.find("input").blur(function(){var b=$(this);if(!$.trim(b.val()))return;if(!b.attr("check-url"))return;b.css("background-image",'url("/images/spinners/octocat-spinner-16px.gif")'),$.ajax({type:"POST",url:b.attr("check-url"),data:{value:b.val()},success:function(){b.next().is(".note")&&b.next().find("strong").text(b.val()),a.unErrorify(),b.css("background-image",'url("/images/modules/ajax/success.png")')},error:function(c){a.errorify(c.responseText),b.css("background-image",'url("/images/modules/ajax/error.png")')}})})})}),function(){$(function(){var a,b;if(b=$(".js-current-repository").attr("href"))return a={path:"/",expires:1},$.cookie("spy_repo",b.substr(1),a),$.cookie("spy_repo_at",new Date,a)})}.call(this),function(){$(document).on("click",".js-approve-ssh-key",function(a){var b;return b=$(this),b.addClass("disabled").find("span").text("Approving??),$.ajax({url:b.attr("href"),type:"POST",success:function(){return b.parents("li").addClass("approved")},error:function(){return b.removeClass("disabled").find("span").text("Error. Try Again")}}),!1}),$(document).on("click",".js-reject-ssh-key",function(a){var b;return b=$(this),b.addClass("disabled").find("span").text("Rejecting??),$.ajax({url:b.attr("href"),type:"DELETE",success:function(){return b.parents("li").addClass("rejected")},error:function(){return b.removeClass("disabled").find("span").text("Error. Try Again")}}),!1})}.call(this),function(){var a;GitHub.Stats=function(){function a(a){this.namespace=a,this.stats=[],this.flushTimer=null}return a.prototype.increment=function(a,b){return b==null&&(b=1),this.namespace&&(a=""+this.namespace+"."+a),this.stats.push({metric:a,type:"increment",count:b}),this.queueFlush()},a.prototype.timing=function(a,b){if(b<0)return;return this.namespace&&(a=""+this.namespace+"."+a),this.stats.push({metric:a,type:"timing",ms:b}),this.queueFlush()},a.prototype.gauge=function(a,b){return this.namespace&&(a=""+this.namespace+"."+a),this.stats.push({metric:a,type:"gauge",value:b}),this.queueFlush()},a.prototype.queueFlush=function(){var a=this;return this.flushTimer&&clearTimeout(this.flushTimer),this.flushTimer=setTimeout(function(){return a.flush()},2e3)},a.prototype.flush=function(){var a,b;a=$(document.body);if(this.stats.length&&a.hasClass("env-production")&&!a.hasClass("enterprise"))return b=this.stats,this.stats=[],$.ajax({url:"/_stats",type:"POST",data:JSON.stringify(b),contentType:"application/json; charset=utf-8",dataType:"json"})},a}(),a=GitHub.stats=new GitHub.Stats("github.browser"),typeof window!="undefined"&&window!==null&&(window.$stats=a);if(typeof $=="undefined"||$===null)return;window.performance||$(window).bind("unload",function(){window.name=JSON.stringify((new Date).getTime())}),$(function(){var b,c;if(window.performance)return b=window.performance.timing,b.navigationStart&&a.timing("performance.navigation",(new Date).getTime()-b.navigationStart),b.secureConnectionStart&&b.connectStart&&a.timing("performance.ssl",b.secureConnectionStart-b.connectStart),b.connectEnd&&b.connectStart&&(b.secureConnectionStart?a.timing("performance.tcp",b.connectEnd-b.secureConnectionStart):a.timing("performance.tcp",b.connectEnd-b.connectStart)),b.domainLookupStart!==b.domainLookupEnd&&a.timing("performance.dns",b.domainLookupEnd-b.domainLookupStart),b.requestStart&&b.responseStart&&b.responseEnd&&(a.timing("performance.request",b.responseStart-b.requestStart),a.timing("performance.response",b.responseEnd-b.responseStart)),$(window).bind("load",function(){b.domContentLoadedEventEnd&&b.domLoading&&a.timing("performance.DOMContentLoaded",b.domContentLoadedEventEnd-b.domLoading),b.domComplete&&b.domLoading&&a.timing("performance.load",b.domComplete-b.domLoading);if(b.domInteractive&&b.domLoading)return a.timing("performance.interactive",b.domInteractive-b.domLoading)});if(window.name&&window.name.match(/^\d+$/)){try{c=JSON.parse(window.name),a.timing("pageload",(new Date).getTime()-c)}catch(d){}return window.name=""}})}.call(this),function(){$(function(){var a;if($(".js-styleguide-ace")[0])return a=new GitHub.CodeEditor(".js-styleguide-ace"),$(".js-styleguide-themes").change(function(){return a.setTheme($(this).find(":selected").val())})})}.call(this),function(){var a,b=function(a,b){return function(){return a.apply(b,arguments)}};a=function(){function a(){this.onNavigationOpen=b(this.onNavigationOpen,this),this.onNavigationKeyDown=b(this.onNavigationKeyDown,this),this.onFocusOut=b(this.onFocusOut,this),this.onFocusIn=b(this.onFocusIn,this),this.onKeyUp=b(this.onKeyUp,this),$(document).on("keyup","textarea[data-suggester-list]",this.onKeyUp),$(document).on("focusin","textarea[data-suggester-list]",this.onFocusIn),$(document).on("focusout","textarea[data-suggester-list]",this.onFocusOut),$(document).on("navigation:keydown",".suggester [data-user]",this.onNavigationKeyDown),$(document).on("navigation:open",".suggester [data-user]",this.onNavigationOpen),this.focusedTextarea=null,this.focusedSuggester=null}return a.prototype.onKeyUp=function(a){var b,c,d;d=this.focusedTextarea,c=this.focusedSuggester;if(!this.focusedTextarea||!this.focusedSuggester)return;b=this.searchQuery(d);if(b!=null){if(b===this.query)return;return this.query=b,this.activate(d,c),this.search(c,this.query),!1}this.query=null,this.deactivate()},a.prototype.onFocusIn=function(a){return this.focusTimeout&&clearTimeout(this.focusTimeout),this.focusedTextarea=a.currentTarget,this.focusedSuggester=document.getElementById($(a.currentTarget).attr("data-suggester-list"))},a.prototype.onFocusOut=function(a){var b=this;return this.focusTimeout=setTimeout(function(){return b.deactivate(),b.focusedTextarea=b.focusedSuggester=null,b.focusTimeout=null},200)},a.prototype.onNavigationKeyDown=function(a){switch(a.hotkey){case"tab":return this.onNavigationOpen
        (a), !1;
    case "esc":
        return this.deactivate(), !1
    }
},
a.prototype.onNavigationOpen = function(a) {
    var b,
    c,
    d,
    e;
    return e = $(a.target).attr("data-user"),
    d = this.focusedTextarea,
    c = d.value.substring(0, d.selectionEnd),
    b = d.value.substring(d.selectionEnd),
    c = c.replace(/@(\w*)$/, "@" + e + " "),
    d.value = c + b,
    this.deactivate(),
    d.focus(),
    d.selectionStart = c.length,
    d.selectionEnd = c.length,
    !1
},
a.prototype.activate = function(a, b) {
    if ($(b).is(".active"))
        return;
    if (!$(b).find("[data-user]")[0])
        return;
    return $(b).addClass("active"),
    $(b).css($(a).selectionEndPosition()),
    $(a).addClass("js-navigation-enable"),
    $(b).trigger("navigation:focus")
    },
a.prototype.deactivate = function(a, b) {
    a == null && (a = this.focusedTextarea),
    b == null && (b = this.focusedSuggester);
    if (!$(b).is(".active"))
        return;
    return $(b).removeClass("active"),
    $(a).removeClass("js-navigation-enable"),
    $(b).trigger("navigation:deactivate")
    },
a.prototype.searchQuery = function(a) {
    var b,
    c;
    c = a.value.substring(0, a.selectionEnd),
    b = c.match(/(^|\s)@(\w*)$/);
    if (b)
        return b[2]
    },
a.prototype.search = function(a, b) {
    var c,
    d;
    return d = $(a).find("ul"),
    c = d.children("li"),
    c.sort(function(a, c) {
        var d,
        e;
        return d = a.textContent.score(b),
        e = c.textContent.score(b),
        d > e ? -1: d < e ? 1: 0
    }),
    d.append(c),
    c.hide().slice(0, 5).show(),
    $(a).trigger("navigation:focus")
    },
a
} (),
new a
}.call(this),
GitHub.Team = function(a) {
    this.url = window.location.pathname,
    this.orgUrl = this.url.split(/\/(teams|invite)/)[0],
    a && (this.url = this.orgUrl + "/teams/" + a)
    },
GitHub.Team.prototype = {
    name: function() {
        return $("#team-name").val()
        },
    newRecord: function() {
        return ! /\/invite/.test(location.pathname) && !/\d/.test(location.pathname)
        },
    repos: function() {
        return $.makeArray($(".repositories li:visible a span").map(function() {
            return $(this).text()
            }))
        },
    addRepo: function(a, b) {
        debug("Adding repo %s", a);
        if (!a || $.inArray(a, this.repos()) > -1)
            return ! 1;
        this.addRepoAjax(a);
        var c = $(".repositories").find("li:first").clone(),
        d = c.find("input[type=hidden]");
        return c.find("a").attr("href", "/" + a).text(a),
        c.find(".remove-repository").attr("data-repo", a),
        b === "private" ? c.addClass("private") : c.addClass("public"),
        d.length > 0 && d.val(a).attr("disabled", !1),
        $(".repositories").append(c.show()),
        !0
    },
    addRepoAjax: function(a) {
        if (this.newRecord())
            return;
        debug("Ajaxily adding %s", a),
        $.post(this.url + "/repo/" + a)
        },
    removeRepo: function(a) {
        debug("Removing %s", a);
        if (!a || $.inArray(a, this.repos()) == -1)
            return ! 1;
        var b = $(".repositories li:visible a").filter(function() {
            return $(this).find("span").text() == a
        }),
        c = function() {
            b.parents("li:first").remove()
            },
        d = function() {
            b.parent().find(".remove-repository").show().removeClass("remove").html('<img class="dingus" src="/images/modules/ajax/error.png">').end().find(".spinner").hide()
            };
        return this.newRecord() ? c() : (b.parent().find(".remove-repository").after('<img class="dingus spinner" src="/images/spinners/octocat-spinner-16px.gif"/>').hide(), this.removeRepoAjax(a, c, d)),
        !0
    },
    removeRepoAjax: function(a, b, c) {
        if (this.newRecord())
            return;
        debug("Ajaxily removing %s", a),
        $.del(this.url + "/repo/" + a, {}, {
            success: b,
            error: c
        })
        },
    users: function() {
        return $.makeArray($(".usernames li:visible").map(function() {
            return $(this).find("a:first").text()
            }))
        },
    addUser: function(a) {
        debug("Adding %s", a);
        if (!a || $.inArray(a, this.users()) > -1)
            return ! 1;
        this.addUserAjax(a);
        var b = $(".usernames").find("li:first").clone(),
        c = b.find("input[type=hidden]");
        return b.find("img").attr("src", "/" + a + ".png"),
        b.find("a").attr("href", "/" + a).text(a),
        c.length > 0 && c.val(a).attr("disabled", !1),
        $(".usernames").append(b.show()),
        !0
    },
    removeUser: function(a) {
        debug("Removing %s", a);
        if (!a || $.inArray(a, this.users()) == -1)
            return ! 1;
        var b = $(".usernames li:visible a:contains(" + a + ")"),
        c = function() {
            b.parents("li:first").remove()
            };
        return this.newRecord() ? c() : (b.parent().find(".remove-user").spin().remove(), $("#spinner").addClass("remove"), this.removeUserAjax(a, c)),
        !0
    },
    addUserAjax: function(a) {
        if (this.newRecord())
            return;
        debug("Ajaxily adding %s", a),
        $.post(this.url + "/member/" + a)
        },
    removeUserAjax: function(a, b) {
        if (this.newRecord())
            return;
        debug("Ajaxily removing %s", a),
        $.del(this.url + "/member/" + a, b)
        }
},
$(function() {
    if (!$(".js-team")[0])
        return;
    var a = new GitHub.Team($(".js-team").data("team")),
    b = $(".add-username-form input"),
    c = $(".add-repository-form input"),
    d = $(".add-username-form button"),
    e = $(".add-repository-form button"),
    f = null;
    b.on("autocomplete:search", function(a) {
        f && f.abort();
        var b = $(this).val();
        if (b === "") {
            $("#add-user-autocomplete ul").empty(),
            $("#add-user-autocomplete").trigger("autocomplete:change");
            return
        }
        f = $.ajax({
            type: "GET",
            data: {
                q: b,
                limit: 10
            },
            url: "/autocomplete/users",
            dataType: "html",
            success: function(a) {
                f = null,
                $("#add-user-autocomplete ul").html(a),
                $("#add-user-autocomplete").trigger("autocomplete:change")
                }
        })
        }),
    b.on("autocomplete:autocompleted:changed", function(a) {
        b.attr("data-autocompleted") ? d.removeAttr("disabled") : d.attr("disabled", "disabled")
        }),
    c.on("autocomplete:search", function() {
        f && f.abort();
        var b = $(this).val();
        if (b === "") {
            $("#add-repo-autocomplete ul").empty(),
            $("#add-repo-autocomplete").trigger("autocomplete:change");
            return
        }
        f = $.ajax({
            type: "GET",
            data: {
                q: b,
                limit: 10
            },
            url: a.orgUrl + "/autocomplete/repos",
            dataType: "html",
            success: function(a) {
                f = null,
                $("#add-repo-autocomplete ul").html(a),
                $("#add-repo-autocomplete").trigger("autocomplete:change")
                }
        })
        }),
    c.on("autocomplete:autocompleted:changed", function(a) {
        c.attr("data-autocompleted") ? e.removeAttr("disabled") : e.attr("disabled", "disabled")
        }),
    $(".remove-repository").live("click", function() {
        return a.removeRepo($(this).attr("data-repo")),
        !1
    }),
    $(".remove-user").live("click", function() {
        return a.removeUser($(this).prev().text()),
        !1
    }),
    $(".add-username-form button").click(function() {
        var b = $(this).parent(),
        c = b.find(":text"),
        d = c.val();
        return debug("Trying to add %s...", d),
        !d || !c.attr("data-autocompleted") ? !1: (c.val(""), a.addUser(d), !1)
        }),
    $(".js-team").on("submit", function(a) {
        var b = $(document.activeElement);
        if (b.is(".add-username-form input"))
            return b.closest(".add-username-form").find("button").click(),
        !1
    });
    var g;
    $("#add-repo-autocomplete").on("navigation:open", "[data-autocomplete-value]", function() {
        g = $(this).attr("data-visibility")
        }),
    $(".add-repository-form button").click(function() {
        var b = $(this).parent(),
        c = b.find(":text"),
        d = c.val();
        return debug("Trying to add %s...", d),
        !d || !c.attr("data-autocompleted") ? !1: (c.val(""), a.addRepo(d, g), !1)
        }),
    $(".js-team").on("submit", function(a) {
        var b = $(document.activeElement);
        if (b.is(".add-repository-form input"))
            return b.closest(".add-repository-form").find("button").click(),
        !1
    })
    }),
$(function() {
    $(".remove-team").click(function() {
        if (!confirm("Are you POSITIVE you want to remove this team?"))
            return ! 1;
        var a = $(this).parents("li.team");
        return $.del(this.href, function() {
            a.remove()
            }),
        $(this).spin().remove(),
        !1
    })
    }),
GitHub.Thunderhorse = function(a) {
    if (!window.ace || !window.sharejs)
        return;
    location.hash || (location.hash = GitHub.Thunderhorse.generateSessionID());
    var b = {
        host: "thunderhorse.herokuapp.com",
        secure: !0
    },
    c = location.pathname + location.hash;
    sharejs.open(c, "text", b, function(b, c) {
        b.created && b.submitOp({
            i: a.code(),
            p: 0
        }),
        b.attach_ace(a.ace),
        a.ace.focus(),
        a.ace.renderer.scrollToRow(0),
        a.ace.moveCursorTo(0, 0),
        GitHub.Thunderhorse.showHorse()
        })
    },
GitHub.Thunderhorse.generateSessionID = function() {
    return Math.ceil(Math.random() * Math.pow(36, 5)).toString(36)
    },
GitHub.Thunderhorse.showHorse = function() {
    $("body").append('<img class="thunder-horse" src="https://img.skitch.com/20110810-njy5tnyabug5fn5j6sdcs9urk.png">'),
    $(".thunder-horse").css({
        position: "fixed",
        bottom: 10,
        left: 10
    })
    },
$(function() {
    function d(a, b) {
        arguments.length < 2 && (b = location.href);
        if (arguments.length > 0 && a != "") {
            if (a == "#")
                var c = new RegExp("[#]([^$]*)");
            else if (a == "?")
                var c = new RegExp("[?]([^#$]*)");
            else
                var c = new RegExp("[?&]" + a + "=([^&#]*)");
            var d = c.exec(b);
            return d == null ? "": d[1]
            }
        b = b.split("?");
        var d = {};
        return b.length > 1 && (b = b[1].split("#"), b.length > 1 && (d.hash = b[1]), $.each(b[0].split("&"), function(a, b) {
            b = b.split("="),
            d[b[0]] = b[1]
            })),
        d
    }
    var a = $.cookie("tracker"),
    b = null;
    a == null && (b = document.referrer ? document.referrer: "direct");
    var c = d();
    c.utm_campaign && $.trim(c.utm_campaign) != "" && (b = c.utm_campaign),
    c.referral_code && $.trim(c.referral_code) != "" && (b = c.referral_code),
    b != null && $.cookie("tracker", b, {
        expires: 7,
        path: "/"
    })
    }),
function(a) {
    a.fn.commitishSelector = function(b) {
        var c = a.extend({}, a.fn.commitishSelector.defaults, b);
        return this.each(function() {
            var b = a(this),
            c = b.closest(".js-menu-container"),
            d = b.closest(".context-pane"),
            e = b.find(".selector-item"),
            f = b.find(".branch-commitish"),
            g = b.find(".tag-commitish"),
            h = b.find(".no-results"),
            i = b.find(".commitish-filter"),
            j = "branches",
            k = null;
            b.find(".tabs a").click(function() {
                return b.find(".tabs a.selected").removeClass("selected"),
                a(this).addClass("selected"),
                j = a(this).attr("data-filter"),
                n(),
                !1
            }),
            i.keydown(function(a) {
                switch (a.which) {
                case 38:
                case 40:
                case 13:
                    return ! 1
                }
            }),
            i.keyup(function(b) {
                var c = e.filter(".current:visible");
                switch (b.which) {
                case 38:
                    return l(c.prevAll(".selector-item:visible:first")),
                    !1;
                case 40:
                    return c.length ? l(c.nextAll(".selector-item:visible:first")) : l(a(e.filter(":visible:first"))),
                    !1;
                case 13:
                    var d = c;
                    if (d.length == 0) {
                        var f = e.filter(":visible");
                        f.length == 1 && (d = a(f[0]))
                        }
                    return m(d),
                    !1
                }
                k = a(this).val(),
                n()
                }),
            c.bind("menu:deactivated", function() {
                r(),
                i.val(""),
                i.trigger("keyup")
                }),
            c.bind("menu:activated", function() {
                setTimeout(function() {
                    i.focus()
                    }, 100)
                });
            var l = function(a) {
                if (a.length == 0)
                    return;
                e.filter(".current").removeClass("current"),
                a.addClass("current")
                },
            m = function(a) {
                if (a.length == 0)
                    return;
                document.location = a.find("a").attr("href")
                },
            n = function() {
                var b = null;
                j == "branches" ? (g.hide(), b = f) : (f.hide(), b = g);
                if (k != "" && k != null) {
                    var c = !0;
                    b.each(function() {
                        var b = a(this),
                        d = b.find("h4").text().toLowerCase();
                        d.score(k) > 0 ? (b.show(), c = !1) : b.hasClass("selected") || b.hide()
                        }),
                    c ? h.show() : h.hide()
                    } else
                    b.each(function() {
                    a(this).show()
                    }),
                b.length == 0 ? h.show() : h.hide()
                };
            n();
            var o = function() {
                d.find(".body").append('<div class="loader">Loading??/div>')
                },
            p = function() {
                d.find(".body .loader").remove()
                },
            q = function(a) {
                a == null && (a = "Sorry, an error occured"),
                d.find(".body").append('<div class="error-message">' + a + "</div>")
                },
            r = function() {
                d.find(".body .error-message").remove()
                }
        })
        },
    a.fn.commitishSelector.defaults = {}
} (jQuery),
$.pageUpdate(function() {
    var a = $(".repo-tree");
    if (!a[0])
        return;
    var b = a.attr("data-master-branch"),
    c = a.attr("data-ref");
    $(this).find("a.js-rewrite-sha").each(function() {
        var a = $(this).attr("href");
        if (!c) {
            $(this).attr("rel", "nofollow");
            return
        }
        var d = a.replace(/[0-9a-f]{40}/, c),
        e = new RegExp("/tree/" + b + "$");
        d = d.replace(e, ""),
        d != a && $(this).attr("href", d)
        }),
    $("#slider").on("slid", function() {
        $(".recently-touched-branches-wrapper").hide()
        })
    }),
GitHub.CachedCommitDataPoller = function(a, b) {
    var c = $(b || document).find(".js-loading-commit-data");
    if (c.length == 0)
        return;
    var d = $("#slider .frame-center"),
    e = d.data("path").replace(/\/$/, "");
    $.smartPoller(a || 2e3, function(a) {
        $.ajax({
            url: d.data("cached-commit-url"),
            dataType: "json",
            error: function(b) {
                b.status == 201 ? a() : c.html('<img src="/images/modules/ajax/error.png"> Something went wrong.')
                },
            success: function(a, c, e) {
                debug("success: %s", this.url);
                var f = d.data("cached-commit-url").replace(/\/cache\/.+/, "/commit/");
                for (var g in a) {
                    if ($("#" + g).length == 0)
                        continue;
                    var h = $("#" + g).parents("tr:first");
                    h.find(".age").html('<time class="js-relative-date" datetime="' + moment(a[g].date).format("YYYY-MM-DDTHH:mm:ssZ") + '">' + a[g].date + "</time>");
                    var i;
                    a[g].login ? i = '<a href="/' + a[g].login + '">' + a[g].login + "</a>": i = a[g].author,
                    h.find(".message").html('<a href="' + f + a[g].commit + '" class="message">' + a[g].message + "</a>" + " [" + i + "]")
                    }
                $(b || document.body).pageUpdate()
                }
        })
        })
    },
$.pageUpdate(function() {
    $("#slider .frame-center #readme").length > 0 ? $("#read_more").show() : $("#read_more").hide()
    }),
$(function() {
    $(".subnav-bar").delegate(".js-commitish-button", "click", function(a) {
        a.preventDefault()
        }),
    $.hotkey("w", function() {
        $(".js-commitish-button").click()
        }),
    $(".js-filterable-commitishes").commitishSelector(),
    $(".pagehead .subnav-bar")[0] && $(".pagehead .subnav-bar a[data-name]").live("mousedown", function() {
        if (GitHub.actionName != "show")
            return;
        var a = $(this).attr("data-name");
        console.log("REF", a);
        var b = "/" + GitHub.nameWithOwner + "/" + GitHub.controllerName + "/" + a;
        GitHub.currentPath != "" && (b += "/" + GitHub.currentPath),
        b != $(this).attr("href") && $(this).attr("href", b)
        }),
    GitHub.CachedCommitDataPoller(),
    $("#colorpicker")[0] && $("#colorpicker").farbtastic("#color")
    }),
GitHub.TreeFinder = function() {
    if ($("#slider").length == 0)
        return;
    var a = this;
    $.hotkeys({
        t: function() {
            return a.show(),
            !1
        }
    })
    },
GitHub.TreeFinder.prototype = {
    fileList: null,
    recentFiles: [],
    currentFinder: null,
    currentInput: null,
    currentQuery: null,
    show: function() {
        if (this.currentFinder)
            return;
        var a = this,
        b;
        a.currentFinder = $(".tree-finder").clone().show(),
        a.currentInput = a.currentFinder.find("input"),
        a.currentQuery = null,
        slider.slideForwardToLoading(),
        b = a.currentFinder.find(".breadcrumb").detach().addClass("js-tree-finder-breadcrumb"),
        $("#slider .breadcrumb:visible").hide().after(b),
        $("#slider").bind("slid", function() {
            $("#slider .frame-center").is(":not(.tree-finder)") && a.hide()
            }),
        a.attachBehaviors()
        },
    hide: function() {
        if (!this.currentFinder)
            return;
        var a = this;
        a.currentInput.blur(),
        a.currentFinder.remove(),
        $(".js-tree-finder-breadcrumb").remove(),
        a.currentFinder = a.currentInput = null,
        $("#slider").unbind("slid")
        },
    attachBehaviors: function() {
        var a = this,
        b = null,
        c = null;
        a.loadFileList(),
        $(".js-dismiss-tree-list-help").live("click", function() {
            return $.post(this.getAttribute("href")),
            $(this).closest(".octotip").fadeOut(function() {
                $(".tree-finder .octotip").remove()
                }),
            a.currentInput.focus(),
            !1
        }),
        a.currentFinder.find(".js-results-list").delegate("a", "click", function() {
            var b = $(this).text(),
            c = $.inArray(b, a.recentFiles);
            c > -1 && a.recentFiles.splice(c, 1),
            a.recentFiles.unshift(b),
            a.currentInput.blur(),
            $(document).unbind("keydown.treeFinder");
            if (slider.enabled)
                return ! 0;
            document.location = $(this).attr("href")
            }),
        $("tr td.icon", a.currentFinder).live("click", function() {
            $(this).parents("tr:first").find("td a").click()
            }),
        $(document).bind("keydown.treeFinder", function(a) {
            if (a.keyCode == 27)
                return ! slider.sliding && $("#slider .frame-center").is(".tree-finder") && (slider.slideBackTo(location.pathname), $(document).unbind("keydown.treeFinder")),
            !1
        }),
        a.currentFinder.on("navigation:open", "tr", function() {
            $(this).find("a").click()
            }),
        a.currentInput.focus().keyup(function() {
            b && clearTimeout(b),
            b = setTimeout(function() {
                b = null
            }, 250)
            }).keydown(function() {
            c && clearTimeout(c),
            c = setTimeout(function() {
                c = null,
                a.updateResults()
                }, 100)
            })
        },
    loadFileList: function() {
        var a = this,
        b = function() {
            a.loadedFileList()
            };
        a.fileList ? b() : $.ajax({
            url: $("#slider .frame-center").data("tree-list-url"),
            error: function(c) {
                a.currentFinder && (a.fileList = [], a.currentFinder.find(".js-no-results th").text("Something went wrong"), b())
                },
            success: function(c, d, e) {
                c ? a.fileList = $.trim(c).split("\n") : a.fileList = [],
                b()
                }
        })
        },
    loadedFileList: function() {
        var a = this;
        if (!a.currentFinder)
            return;
        $("#slider .frame-center").replaceWith(a.currentFinder),
        a.updateResults()
        },
    updateResults: function() {
        var a = this;
        if (a.currentFinder && a.fileList) {
            var b = a.currentInput.val(),
            c = [],
            d = a.currentFinder.find(".js-results-list"),
            e = "",
            f = 0;
            if (this.currentQuery == b)
                return;
            this.currentQuery = b,
            b ? c = a.findMatchingFiles(b) : a.recentFiles.length ? (c = a.recentFiles.slice(1, 6), c.length < 20 && (c = c.concat(a.fileList.slice(0, 20 - c.length)))) : c = a.fileList;
            if (c.length <= 0)
                d[0].innerHTML = "",
            a.currentFinder.find(".js-no-results").show(),
            a.currentFinder.find(".js-header").hide();
            else {
                a.currentFinder.find(".js-no-results").hide(),
                a.currentFinder.find(".js-header").show(),
                c = c.slice(0, 50);
                var g,
                h = this.regexpForQuery(b),
                i = function(a, b) {
                    return b % 2 == 1 ? "<b>" + a + "</b>": a
                };
                for (f = 0; f < c.length; f++) {
                    g = (c[f].match(h) || []).slice(1).map(i).join("");
                    var j = $("#slider .frame-center").data("blob-url-prefix") + "/" + c[f];
                    e += '<tr class="js-navigation-item"><td class="icon"><span class="mini-icon text-file"></span></td><td><a class="js-slide-to js-rewrite-sha" href="' + j + '">' + g + "</a></td></tr>"
                }
                d[0].innerHTML = e,
                $(d).pageUpdate(),
                $(d).trigger("navigation:focus")
                }
        }
    },
    findMatchingFiles: function(a) {
        if (!a)
            return [];
        var b = this,
        c = [],
        d = 0,
        e,
        f,
        g,
        h;
        a = a.toLowerCase(),
        e = this.regexpForQuery(a);
        for (d = 0; d < b.fileList.length; d++) {
            f = b.fileList[d],
            g = f.toLowerCase();
            if (f.match(/^vendor\/(cache|rails|gems)/))
                continue;
            if (f.match(/(dot_git|\.git\/)/))
                continue;
            g.match(e) && (h = g.score(a), h > 0 && (a.match("/") || (g.match("/") ? h += g.replace(/^.*\//, "").score(a) : h *= 2), c.push([h, f])))
            }
        return $.map(c.sort(function(a, b) {
            return b[0] - a[0]
            }), function(a) {
            return a[1]
            })
        },
    regexpForQuery: function(a) {
        var b = "+.*?[]{}()^$|\\".replace(/(.)/g, "\\$1"),
        c = new RegExp("\\(([" + b + "])\\)", "g");
        return new RegExp("(.*)" + a.toLowerCase().replace(/(.)/g, "($1)(.*?)").replace(c, "(\\$1)") + "$", "i")
        }
},
$(function() {
    window.treeFinder = new GitHub.TreeFinder
}),
GitHub.TreeSlider = function() {
    if (!Modernizr.history)
        return;
    if ($("#slider").length == 0)
        return;
    if (navigator.userAgent.match(/(iPod|iPhone|iPad)/))
        return;
    var a = this;
    a.enabled = !0,
    $("#slider a.js-slide-to, .breadcrumb a").live("click", function(b) {
        return a.clickHandler(b)
        }),
    $(window).bind("popstate", function(b) {
        a.popStateHandler(b.originalEvent)
        })
    },
GitHub.TreeSlider.prototype = {
    enabled: !1,
    sliding: !1,
    slideSpeed: 400,
    frameForPath: function(a) {
        return $(".frame").filter(function() {
            return $(this).attr("data-path") === a
        })
        },
    frameForURL: function(a) {
        return this.frameForPath(this.pathFromURL(a))
        },
    pathFromURL: function(a) {
        if (!a)
            return;
        var b = $(" .repo-tree").attr("data-ref"),
        c = new RegExp("/(tree|blob)/" + (b || "[^/]+") + "/"),
        d = a.split(c)[2] || "/";
        return d.slice(d.length - 1, d.length) != "/" && (d += "/"),
        unescape(d)
        },
    scrollToBreadcrumb: function() {
        this.visibleInBrowser(".breadcrumb:visible") || $(".breadcrumb:visible").scrollTo(50)
        },
    visibleInBrowser: function(a) {
        var b = $(window).scrollTop(),
        c = b + $(window).height(),
        d = $(a).offset().top,
        e = d + $(a).height();
        return e >= b && d <= c
    },
    clickHandler: function(a) {
        if (a.which == 2 || a.metaKey || a.ctrlKey)
            return ! 0;
        if (this.sliding)
            return ! 1;
        var b = a.currentTarget.href,
        c = this.pathFromURL(b);
        return window.history.pushState({
            path: c
        }, "", b),
        typeof _gaq != "undefined" && _gaq.push(["_trackPageview"]),
        this.slideTo(b),
        !1
    },
    popStateHandler: function(a) {
        this.slideTo(location.pathname)
        },
    doneSliding: function() {
        if (!this.sliding)
            return;
        this.sliding = !1,
        $("#slider .frame-center").nextAll(".frame").hide(),
        $("#slider .frame-center").prevAll(".frame").css("visibility", "hidden");
        var a = $(".frame-loading:visible");
        a.length ? a.removeClass("frame-loading") : $("#slider").trigger("slid")
        },
    slideTo: function(a) {
        var b = this.pathFromURL(a),
        c = this.frameForPath(b),
        d = $("#slider .frame-center").attr("data-path") || "";
        c.is(".frame-center") || (d == "/" || b.split("/").length > d.split("/").length ? this.slideForwardTo(a) : this.slideBackTo(a))
        },
    slideForwardTo: function(a) {
        debug("Sliding forward to %s", a);
        var b = this.frameForURL(a);
        if (b.length)
            this.slideForwardToFrame(b);
        else {
            var c = this.slideForwardToLoading();
            this.loadFrame(a, function(a) {
                c.replaceWith(a.find(".frame-center"))
                })
            }
    },
    slideForwardToFrame: function(a) {
        if (this.sliding)
            return;
        this.sliding = !0;
        var b = this;
        $("#slider .frame-center").after(a.css("marginLeft", 0)).addClass("frame").removeClass("frame-center").animate({
            marginLeft: "-1200px"
        }, this.slideSpeed, function() {
            b.doneSliding()
            }),
        this.makeCenterFrame(a),
        this.setFrameTitle(a),
        this.setFrameCanonicalURL(a)
        },
    slideForwardToLoading: function() {
        var a = $(".frame-loading").clone();
        return a.find("img").hide(),
        setTimeout(function() {
            a.find("img").show()
            }, 500),
        $(".frames").append(a),
        this.slideForwardToFrame(a),
        a
    },
    slideBackTo: function(a) {
        debug("Sliding back to %s", a);
        var b = this.frameForURL(a);
        if (b.length)
            this.slideBackToFrame(b);
        else {
            var c = this.slideBackToLoading(),
            d = this.pathFromURL(a);
            this.loadFrame(a, function(a) {
                c.replaceWith(a.find(".frame-center"))
                })
            }
    },
    slideBackToFrame: function(a) {
        if (this.sliding)
            return;
        this.sliding = !0,
        $("#slider .frame-center").before(a.css("marginLeft", "-1200px")).addClass("frame").removeClass("frame-center");
        var b = this;
        a.animate({
            marginLeft: "0"
        }, this.slideSpeed, function() {
            b.doneSliding()
            }),
        this.makeCenterFrame(a),
        this.setFrameTitle(a),
        this.setFrameCanonicalURL(a)
        },
    slideBackToLoading: function() {
        var a = $(".frame-loading").clone();
        return a.find("img").hide(),
        setTimeout(function() {
            a.find("img").show()
            }, 350),
        $(".frames").prepend(a.show()),
        slider.slideBackToFrame(a),
        a
    },
    makeCenterFrame: function(a) {
        a.css("visibility", "visible").show().addClass("frame-center"),
        this.scrollToBreadcrumb(),
        $(".file-history-tease:visible").hide();
        var b = $('.file-history-tease[data-path="' + a.attr("data-path") + '"]');
        b.length > 0 && b.show(),
        $(document.body).attr("data-blob-contribs-enabled") == "yes" && (a.attr("data-path") == "/" ? ($(".last-commit, .commit.commit-tease").show(), $("#repo_details").show(), $(".repo-head .tabs").addClass("with-details-box")) : ($(".last-commit, .commit.commit-tease").hide(), $("#repo_details").hide(), $(".repo-head .tabs").removeClass("with-details-box")));
        var c = $('.breadcrumb[data-path="' + a.attr("data-path") + '"]');
        c.length > 0 && ($(".breadcrumb:visible").hide(), c.show());
        var d = $('.announce[data-path="' + a.attr("data-path") + '"]');
        $(".announce").fadeOut(),
        d.length > 0 && d.fadeIn();
        var e = $(".js-ufo[data-path=" + a.attr("data-path") + "]");
        $(".js-ufo").fadeOut(),
        e.length > 0 && e.fadeIn()
        },
    setFrameTitle: function(a) {
        var b = a.attr("data-title");
        b && (document.title = b)
        },
    setFrameCanonicalURL: function(a) {
        var b = a.attr("data-permalink-url");
        b && $("link[rel=permalink]").attr("href", b)
        },
    loadFrame: function(a, b) {
        debug("Loading " + a + "?slide=1");
        var c = this;
        $.ajax({
            url: a + "?slide=1",
            cache: !1,
            success: function(d) {
                var e = $("<div>" + d + "</div>");
                b.call(this, e);
                var f = $("#slider");
                f.trigger("slid"),
                f.find(".breadcrumb").hide().last().after(e.find(".breadcrumb"));
                var g = e.find(".file-history-tease");
                f.prevAll(".file-history-tease").hide(),
                g.length && (f.prevAll(".last-commit, .commit.commit-tease").hide(), f.find(".breadcrumb:visible").after(g));
                var h = c.frameForURL(a);
                GitHub.CachedCommitDataPoller(50, h),
                GitHub.Blob.show(),
                c.setFrameTitle(h),
                c.setFrameCanonicalURL(h),
                f.pageUpdate()
                },
            error: function() {
                $("#slider .frame-center").html("<h3>Something went wrong.</h3>")
                },
            complete: function() {
                c.sliding = !1
            }
        })
        }
},
$(function() {
    window.slider = new GitHub.TreeSlider
}),
$.fn.ufo = function() {
    if (this.length) {
        var a = this.find("canvas").get(0),
        b = JSON.parse(this.find("div").text());
        GitHub.UFO.drawFont(a, b)
        }
    return this
},
GitHub.UFO = {
    drawFont: function(a, b) {
        var c = a.getContext("2d");
        for (var d = 0; d < b.length; d++) {
            c.save();
            var e = d % 9 * 100,
            f = Math.floor(d / 9) * 100;
            c.translate(e + 10, f + 80),
            c.scale(.1, -0.1);
            var g = new GitHub.UFO.Glif(c, b[d]);
            g.draw(),
            c.restore()
            }
    }
},
GitHub.UFO.Glif = function(a, b) {
    this.ctx = a,
    this.contours = b
},
GitHub.UFO.Glif.prototype = {
    draw: function() {
        this.ctx.beginPath();
        for (var a = 0; a < this.contours.length; a++)
            this.drawContour(this.contours[a]);
        this.ctx.fillStyle = "black",
        this.ctx.fill()
        },
    drawContour: function(a) {
        for (var b = 0; b < a.length; b++)
            b == 0 ? this.moveVertex(a[b]) : this.drawVertex(a[b]);
        this.drawVertex(a[0])
        },
    moveVertex: function(a) {
        this.ctx.moveTo(a[0], a[1])
        },
    drawVertex: function(a) {
        a.length == 2 ? this.ctx.lineTo(a[0], a[1]) : a.length == 4 ? this.ctx.quadraticCurveTo(a[2], a[3], a[0], a[1]) : a.length == 6 && this.ctx.bezierCurveTo(a[2], a[3], a[4], a[5], a[0], a[1])
        }
},
$(document).ready(function() {
    $(".glif_diff").each(function(el) {
        var sha = $(this).attr("rel"),
        ctx = this.getContext("2d"),
        data = eval("glif_" + sha),
        glif = new GitHub.UFO.Glif(ctx, data);
        ctx.translate(0, 240),
        ctx.scale(.333, -0.333),
        glif.draw()
        })
    }),
Modernizr.canvas && $.pageUpdate(function() {
    $(this).find(".js-ufo").ufo()
    }),
$(function() {
    $(".js-repo-filter").repoList(),
    $("#inline_visible_repos").click(function() {
        var a = $(this).spin(),
        b = window.location + "/ajax_public_repos";
        return $(".projects").load(b, function() {
            a.stopSpin(),
            $(".repositories").pageUpdate()
            }),
        a.hide(),
        !1
    }),
    $("#edit_user .info .rename").click(function() {
        return $("#edit_user .username").toggle(),
        $("#user_rename").toggle(),
        !1
    }),
    $("#user_rename > input[type=submit]").click(function() {
        if (!confirm(GitHub.rename_confirmation()))
            return ! 1
    }),
    $("#facebox .rename-warning button").live("click", function() {
        return $("#facebox .rename-warning, #facebox .rename-form").toggle(),
        !1
    }),
    $("#reveal_cancel_info").click(function() {
        return $(this).toggle(),
        $("#cancel_info").toggle(),
        !1
    }),
    $("#cancel_plan").submit(function() {
        var a = "Are you POSITIVE you want to delete this account? There is absolutely NO going back. All repositories, comments, wiki pages - everything will be gone. Please consider downgrading the account's plan.";
        return confirm(a)
        }),
    window.location.href.match(/account\/upgrade$/) && $("#change_plan_toggle").click()
    }),
$(function() {
    function b() {
        var c = $("#current-version").val();
        c && $.get("_current", function(d) {
            c == d ? setTimeout(b, 5e3) : a || ($("#gollum-error-message").text("Someone has edited the wiki since you started. Please reload this page and re-apply your changes."), $("#gollum-error-message").show(), $("#gollum-editor-submit").attr("disabled", "disabled"), $("#gollum-editor-submit").attr("value", "Cannot Save, Someone Else Has Edited"))
            })
        }
    $("#see-more-elsewhere").click(function() {
        return $(".seen-elsewhere").show(),
        $(this).remove(),
        !1
    });
    var a = !1;
    $("#gollum-editor-body").each(b),
    $("#gollum-editor-submit").click(function() {
        a = !0
    });
    var c = [];
    $("form#history input[type=submit]").attr("disabled", !0),
    $("form#history input[type=checkbox]").change(function() {
        var a = $(this).val(),
        b = $.inArray(a, c);
        if (b > -1)
            c.splice(b, 1);
        else {
            c.push(a);
            if (c.length > 2) {
                var d = c.shift();
                $("input[value=" + d + "]").attr("checked", !1)
                }
        }
        $("form#history tr.commit").removeClass("selected"),
        $("form#history input[type=submit]").attr("disabled", !0);
        if (c.length == 2) {
            $("form#history input[type=submit]").attr("disabled", !1);
            var e = !1;
            $("form#history tr.commit").each(function() {
                e && $(this).addClass("selected"),
                $(this).find("input:checked").length > 0 && (e = !e),
                e && $(this).addClass("selected")
                })
            }
    })
    });

