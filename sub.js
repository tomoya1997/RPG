"use strict";


var TUG = TUG || {};
TUG.GR = {};

TUG.mCurrentFrame = 0;
TUG.mFPS = 60;

TUG.Height = 120;
TUG.Width = 128;


TUG.onTimer = function() {}

TUG.init = function()
{
    TUG.GR.mCanvas = document.createElement( "canvas" ); // canvasをonload時に構築
	TUG.GR.mCanvas.width = TUG.Width; // imageの幅
    TUG.GR.mCanvas.height = TUG.Height; // imageの高さ指定
    TUG.GR.mG = TUG.GR.mCanvas.getContext( "2d" ); // 2dでコンテキストを取得


    requestAnimationFrame(TUG.wmTimer);
}

TUG.wmTimer = function()
{
    if (!TUG.mCurrentStart) {
        TUG.mCurrentStart = performance.now();
    }

    let d = Math.floor((performance.now() - TUG.mCurrentStart) * TUG.mFPS / 1000);
    if (d > 0) {
        TUG.onTimer(d);    
        TUG.mCurrentFrame += d;
    }

    requestAnimationFrame(TUG.wmTimer);
}

