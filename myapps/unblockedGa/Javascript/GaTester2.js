(function (w) {
    var lastTime = 0,
        vendors = ["webkit", /*'moz',*/ "o", "ms"];
    for (var i = 0; i < vendors.length && !w.requestAnimationFrame; ++i) {
        w.requestAnimationFrame = w[vendors[i] + "RequestAnimationFrame"];
        w.cancelAnimationFrame =
            w[vendors[i] + "CancelAnimationFrame"] ||
            w[vendors[i] + "CancelRequestAnimationFrame"];
    }

    if (!w.requestAnimationFrame)
        w.requestAnimationFrame = function (callback, element) {
            var currTime = +new Date(),
                timeToCall = Math.max(0, 16 - (currTime - lastTime)),
                id = w.setTimeout(function () {
                    callback(currTime + timeToCall);
                }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!w.cancelAnimationFrame)
        w.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
})(this);

var slotMachine = (function (undefined) {
    var tMax = 3000,
        height = 210,
        speeds = [],
        r = [],
        reels = [
            ['🍭', '❌', '⛄️', '🦄'],
            ['🍌', '💩', '👻', '😻'],
            ['💵', '🤡', '🦖', '🍎']
        ],
        $reels,
        $message,
        start;

    function init() {
        $reels = $(".slot").each(function (i, el) {
            el.innerHTML =
                "<div><p>" +
                reels[i].join("</p><p>") +
                "</p></div><div><p>" +
                reels[i].join("</p><p>") +
                "</p></div>";
        });

        $message = $(".message");

        $("#startButton").click(action);
    }

    function action() {
        if (start !== undefined) return;

        $message.html("Spinning...");

        spinWithDelay(0, 0);
    }

    function spinWithDelay(index, delay) {
        setTimeout(function () {
            speeds[index] = Math.random() + 0.5;
            r[index] = (((Math.random() * 3) | 0) * height) / 3;

            animate(index);
        }, delay);
    }

    function animate(index) {
        if (!start) start = performance.now();

        var t = performance.now() - start || 0;
        $reels[index].scrollTop =
            ((speeds[index] / tMax / 1) * (tMax - t) * (tMax - t) + r[index]) % height | 0;

        if (t < tMax) {
            requestAnimationFrame(function () {
                animate(index);
            });
        } else {
            start = undefined;

            if (index < 2) {
                spinWithDelay(index + 1, 500);
            } else {
                check();
            }
        }
    }

    function check() {
        $message.html(
            r[0] === r[1] && r[1] === r[2]
                ? "You won!" + reels[1][(r[0] / 70 + 1) % 3 | 0].split(" ")[0]
                : "Try again"
        );
    }

    return {
        init: init
    };
})();

$(document).ready(function () {
    slotMachine.init();
});





