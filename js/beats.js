(function(d) {
  var c = d.querySelector('.voicer_bg-beats');
  var dotSize = 25;

  var x = Math.floor(c.clientWidth / 40) + 1,
      y = Math.floor(c.clientHeight / 30),
      dotGutterX = dotSize*0.6,
      dotGutterY = dotSize*0.2,
      linesOffset = dotSize*0.8;
  var dotsAry = [[]];

  for (var i=0; i<x; i++) {
    dotsAry[i] = [];
    for (var j=0; j<y; j++) {
      var dot = d.createElement('div');
      dot.classList.add('dot');
      dot.style.left = (i * 40 + (j % 2) * 20) - 10 + "px";
      dot.style.top = (j * 30) + 10 + "px";
      dot.style.left = (i * (dotSize + dotGutterX) + (j % 2) * linesOffset) - (dotSize*0.4) + "px";
      dot.style.top = (j * (dotSize + dotGutterY)) + (dotSize*0.4) + "px";
      dot.style.opacity = 0.02;
      dot.cordX = i;
      dot.cordY = j;
      dot.upAt = null;
      c.appendChild(dot);
      dotsAry[i][j] = dot;
    }
  }

  var spread = 10;

  beatUp = function(dot, level, starter) {
    level = level || 1;
    //var opacityUp = 1 / Math.pow(level, 1.7);
    var opacityUp = (function(t, b, c, d) {
      t = t / d;
      return 1 / (c*t*t*t*t + b);
    })(level, 0, 1, 1.82);
    opacityUp = Math.min( opacityUp, 1);

    if ( dot.upAt !== null && dot.upAt >= starter.upAt ) return;
    if ( opacityUp <= 0.02 ) return;

    //console.log( opacityUp );

    dot.upAt = starter ? starter.upAt : Date.now();
    dot.classList.add('up');
    dot.style.opacity = opacityUp + 0.02;
    //var dismissDelay = 300 * (1 / Math.pow(level, 1.5));
    var dismissDelay = 30 * opacityUp + 30;
    if (dot.downTimer) clearTimeout(dot.downTimer);
    dot.downTimer = setTimeout( beatDown.bind(null, dot), dismissDelay );

    if ( level > 10 ) return;
    if ( dot.cordX <= 0 || dot.cordX >= (x-1) ) return;
    if ( dot.cordY <= 0 || dot.cordY >= (y-1) ) return;

    var v2Cords = [];
    if ( dot.cordY % 2 == 0 ) {
      v2Cords.push( [dot.cordX - 1, dot.cordY - 1] );
      v2Cords.push( [dot.cordX, dot.cordY - 1] );
      v2Cords.push( [dot.cordX - 1, dot.cordY + 1] );
      v2Cords.push( [dot.cordX, dot.cordY + 1] );
    }
    else {
      v2Cords.push( [dot.cordX + 1, dot.cordY - 1] );
      v2Cords.push( [dot.cordX, dot.cordY - 1] );
      v2Cords.push( [dot.cordX + 1, dot.cordY + 1] );
      v2Cords.push( [dot.cordX, dot.cordY + 1] );
    }
    v2Cords.push( [dot.cordX - 1, dot.cordY] );
    v2Cords.push( [dot.cordX + 1, dot.cordY] );

    for (var n=0; n<v2Cords.length; n++) {
      var dot2 = dotsAry[v2Cords[n][0]][v2Cords[n][1]];
      setTimeout( beatUp.bind(null, dot2, level+1, starter || dot), spread );
    }
  }

  beatDown = function(dot) {
    dot.upAt = null;
    dot.downTimer = null;
    dot.classList.remove('up');
    dot.style.opacity = 0.02;
  }

  function getRandomInt(max, min) {
    min = Math.ceil(min) || 0;
    return Math.floor(Math.random() * Math.floor(max-min)) + min;
  }

  beatsLoop = function() {
    var delay = Math.pow(getRandomInt(32, 1), 2) + 1000;
    var delay = 1600;
    var targetX = getRandomInt(x*0.60, x*0.40),
        targetY = getRandomInt(y*0.60, y*0.40);
    var targetX = Math.floor(x*0.5);
        targetY = Math.floor(y*0.5);
    setTimeout(beatUp.bind(null,dotsAry[targetX][targetY]), delay);
    setTimeout(beatsLoop, delay);
  }
  beatsLoop();


}(document));
