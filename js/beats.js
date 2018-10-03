(function() {
  window.Beats = window.Beats || {};

  Beats.init = function(options) {
    var boxEl = document.querySelector(options.el);
    boxEl.maxDeep = options.maxDeep || 6;
    boxEl.minDeep = options.minDeep || 3;
    boxEl.getNextUpDots = options.getNextUpDots || function() {
      var x = this.dotsAry.length,
          y = this.dotsAry[0].length;
      var targetX = getRandomInt(x*0.60, x*0.40),
          targetY = getRandomInt(y*0.60, y*0.40);
      var targetX = Math.floor(x*0.5);
          targetY = Math.floor(y*0.5);
      return [this.dotsAry[targetX][targetY]];
    };

    var dotSize = 25;
    var dotGutterX = dotSize*0.62,
        dotGutterY = dotSize*0.4,
        dotSpaceW = dotSize*1.62,
        dotSpaceH = dotSize*1.4;

    var x = Math.floor(boxEl.clientWidth / (dotSpaceW)),
        y = Math.floor(boxEl.clientHeight / (dotSpaceH)),
        linesOffset = dotSize*0.8;
    var elPaddingLeft = (boxEl.clientWidth - (x*dotSpaceW + linesOffset - dotGutterX)) / 2,
        elPaddingTop = (boxEl.clientHeight - (y*dotSpaceH - dotGutterY)) / 2;
    boxEl.dotsAry = [[]];

    for (var i=0; i<x; i++) {
      boxEl.dotsAry[i] = [];
      for (var j=0; j<y; j++) {
        var dot = document.createElement('div');
        dot.classList.add('dot');
        dot.style.left = (i * dotSpaceW + (j % 2) * linesOffset) + elPaddingLeft + "px";
        dot.style.top = (j * dotSpaceH) + elPaddingTop + "px";
        dot.style.opacity = 0.02;
        dot.cordX = i;
        dot.cordY = j;
        dot.upAt = null;
        boxEl.appendChild(dot);
        boxEl.dotsAry[i][j] = dot;
      }
    }

    beatsLoop(boxEl);
    //beatUp3(boxEl, boxEl.dotsAry[Math.floor(x*0.5)][Math.floor(y*0.5)]);
  };

  beatUp3 = function(boxEl, dot, deep) {
    deep = deep || 5;

    if ( level >= deep ) return;

    var relativeDots = {},
        levels = [[[dot.cordX, dot.cordY]]];
    for (var level=0; level<deep; level++) {
      levels[level] = levels[level] || [];
      var seeds = levels[level-1] || [];
      for (var i=0; i<seeds.length; i++) {
        var seed = boxEl.dotsAry[seeds[i][0]][seeds[i][1]],
            lookupDirectionX,
            relatives = [];
        if ( seed.cordY % 2 == 0 ) {
          lookupDirectionX = -1;
        } else {
          lookupDirectionX = 1;
        }
        relatives.push(
          [seed.cordX + lookupDirectionX, seed.cordY - 1],
          [seed.cordX, seed.cordY - 1],
          [seed.cordX + 1, seed.cordY],
          [seed.cordX - 1, seed.cordY],
          [seed.cordX + lookupDirectionX, seed.cordY + 1],
          [seed.cordX, seed.cordY + 1]
        );
        for (var j=0; j<relatives.length; j++) {
          var rx = relatives[j][0], ry = relatives[j][1],
              rkey = [rx,ry].join();
          if (rx < 0 || ry < 0) continue;
          if (rx >= boxEl.dotsAry.length || ry >= boxEl.dotsAry[0].length) continue;
          if (rkey in relativeDots) continue;
          levels[level].push(relatives[j]);
        }
      }
      for (var i=0; i<levels[level].length; i++) {
          var rx = levels[level][i][0], ry = levels[level][i][1],
              key = [rx,ry].join();
          relativeDots[key] = levels[level][i];
      }
    }

    // light up
    var spread = 10;
    for (var l=0; l<levels.length; l++) {
      var opacityUp = (function(t, b, c, d) {
        t = t / d;
        return 1 / (c*t*t*t*t + b);
      })(l+1, 0, 1, deep*0.45);
      opacityUp = Math.min( opacityUp, 1);
      //opacityUp = opacityUp * (deep / 8);

      for (var i=0; i<levels[l].length; i++) {
        var target = boxEl.dotsAry[levels[l][i][0]][levels[l][i][1]];
        target.classList.add('up');
        target.style.transition = 'all 0s';
        target.style.opacity = opacityUp;

        var dismissDelay = 100 * opacityUp + spread;
        if (target.downTimer) clearTimeout(target.downTimer);
        target.downTimer = setTimeout( beatDown.bind(null, target), dismissDelay );
        //console.log(opacityUp, l);
      }
    }
  }

  beatDown = function(dot) {
    dot.upAt = null;
    dot.downTimer = null;
    dot.classList.remove('up');
    var duration = 0.16 + dot.style.opacity*1;
    var duration = 0.26;
    dot.style.transition = 'all ' + duration + 's ease-in';
    dot.style.opacity = 0.02;
  }

  function getRandomInt(max, min) {
    min = Math.ceil(min) || 0;
    return Math.floor(Math.random() * Math.floor(max-min)) + min;
  }

  beatsLoop = function(boxEl) {
    var delay = Math.pow(getRandomInt(32, 1), 2) + 400;
    var deep = getRandomInt(boxEl.maxDeep, boxEl.minDeep);
    var next = boxEl.getNextUpDots();
    if (!Array.isArray(next)) next = [next];
    for ( var n=0; n<next.length; n++) {
      setTimeout(beatUp3.bind(null, boxEl, next[n], deep), delay);
    }
    setTimeout(beatsLoop.bind(null, boxEl), delay);
  }

}());
