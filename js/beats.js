(function(d) {
  var c = d.querySelector('.voicer_bg-beats');
  var dotSize = 25;
  var dotGutterX = dotSize*0.62,
      dotGutterY = dotSize*0.4,
      dotSpaceW = dotSize*1.62,
      dotSpaceH = dotSize*1.4;

  var x = Math.floor(c.clientWidth / dotSpaceW) + 1,
      y = Math.floor(c.clientHeight / dotSpaceH),
      linesOffset = dotSize*0.8;
  var dotsAry = [[]];

  for (var i=0; i<x; i++) {
    dotsAry[i] = [];
    for (var j=0; j<y; j++) {
      var dot = d.createElement('div');
      dot.classList.add('dot');
      dot.style.left = (i * dotSpaceW + (j % 2) * linesOffset) - (dotSize*0.4) + "px";
      dot.style.top = (j * dotSpaceH) + (dotSize*0.4) + "px";
      dot.style.opacity = 0.02;
      dot.cordX = i;
      dot.cordY = j;
      dot.upAt = null;
      c.appendChild(dot);
      dotsAry[i][j] = dot;
    }
  }

  var spread = 10,
      deep = 3;

  beatUp3 = function(dot, deep) {
    deep = deep || 5;

    if ( level >= deep ) return;

    var relativeDots = {},
        levels = [[[dot.cordX, dot.cordY]]];
    for (var level=0; level<deep; level++) {
      levels[level] = levels[level] || [];
      var seeds = levels[level-1] || [];
      for (var i=0; i<seeds.length; i++) {
        var seed = dotsAry[seeds[i][0]][seeds[i][1]],
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
          if (rx < 0) continue;
          if (rx > x) continue;
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
    spread = 10;
    for (var l=0; l<levels.length; l++) {
      var opacityUp = (function(t, b, c, d) {
        t = t / d;
        return 1 / (c*t*t*t*t + b);
      })(l+1, 0, 1, 1.8);
      opacityUp = Math.min( opacityUp, 1);

      for (var i=0; i<levels[l].length; i++) {
        var target = dotsAry[levels[l][i][0]][levels[l][i][1]];
        target.classList.add('up');
        target.style.transition = 'all 0s';
        target.style.opacity = opacityUp;

        var dismissDelay = 100 * opacityUp + spread;
        if (target.downTimer) clearTimeout(target.downTimer);
        target.downTimer = setTimeout( beatDown.bind(null, target), dismissDelay );
        console.log(opacityUp, l);
      }
    }
  }

  beatDown = function(dot) {
    dot.upAt = null;
    dot.downTimer = null;
    dot.classList.remove('up');
    dot.style.transition = 'all 0.26s ease-in';
    dot.style.opacity = 0.02;
  }

  function getRandomInt(max, min) {
    min = Math.ceil(min) || 0;
    return Math.floor(Math.random() * Math.floor(max-min)) + min;
  }

  beatsLoop = function() {
    var delay = Math.pow(getRandomInt(32, 1), 2) + 600;
    var targetX = getRandomInt(x*0.60, x*0.40),
        targetY = getRandomInt(y*0.60, y*0.40);
    var targetX = Math.floor(x*0.5);
        targetY = Math.floor(y*0.5);
    setTimeout(beatUp3.bind(null,dotsAry[targetX][targetY], getRandomInt(6, 3)), delay);
    setTimeout(beatsLoop, delay);
  }
  beatsLoop();
  //beatUp3(dotsAry[Math.floor(x*0.5)][Math.floor(y*0.5)]);


}(document));
