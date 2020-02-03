"use strict";

const CHRHEIGHT = 9; // キャラクターサイズ
const CHRWIDTH = 8; // キャラクターサイズ
const FONT	= "10px monospace"; // テキストタイプ・サイズ
const FONTSTYLE = "#ffffff"; // テキストカラー
const HEIGHT = 120; // キャンバス高さ
const WIDTH	= 128; // キャンバス幅
const INTERVAL = 33; // フレーム呼び出し感覚
const MAP_WIDTH = 32; // マップの高さ
const MAP_HEIGHT = 32; // マップの幅
const SCR_HEIGHT = 8; // 画面タイルサイズの高さ/2
const SCR_WIDTH = 8; // 画面タイルサイズの幅/2
const SCROLL = 1; // スクロール速度
const SMOOTH	= 0; // 補間位置
const START_HP = 20; // 初期HP 
const START_X = 15; // スタート地点
const START_Y = 17; // スタート地点
const TILECOLUMN = 4; // タイルの高さ（ドット）
const TILEROW = 4; // タイルの幅（ドット）
const TILESIZE = 8; // タイルのサイズ（ドット）
const WNDSTYLE = "rgba(0, 0, 0, 0.75)"; // ウィンドウのスタイル

const gKey = new Uint8Array (0x100);  // キー入力バッファ

let gAngle = 0; // プレイヤーの向き
let gEx = 0; // プレイヤーの経験値
let gHP = START_HP; // プレイヤーのHP
let gMHP = START_HP;
let gLv = 1; // プレイヤーのレベル
let gCursor = 0; // カーソル移動
let gEnemyHP; // 敵HP
let gEnemyType; // 敵種別
let	gFrame = 0;
let	gHeight;
let	gWidth;
let gMessage1 = null;
let gMessage2 = null;
let gMoveX = 0; // 移動量
let gMoveY = 0; // 移動量
let	gImgMap;
let gImgBoss;
let	gImgMonster;
let gImgPlayer;
let gItem = 0; // 所持アイテム
let gPhase = 0; // 敵出現フェーズ
let gOrder; // 行動順
let gPlayerX = START_X * TILESIZE + TILESIZE/2; // プレイヤーの座標x軸
let gPlayerY = START_Y * TILESIZE + TILESIZE/2; // プレイヤーの座標y軸


const gFileMap = "img/map.png";
const gFileMonster = "img/monster.png";
const gFileBoss = "img/boss.png";
const gFilePlayer = "img/player.png";

const gEncounter = [0, 0, 0, 1, 0, 0, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0]; // エンカウントの確率

const	gMap = [ // mapの定義
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 3, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 3, 3, 7, 7, 7, 7, 7, 7, 7, 7, 7, 6, 6, 3, 6, 3, 6, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 3, 3, 6, 6, 7, 7, 7, 2, 2, 2, 7, 7, 7, 7, 7, 7, 7, 6, 3, 0, 0, 0, 3, 3, 0, 6, 6, 6, 0, 0, 0,
    0, 0, 3, 3, 6, 6, 6, 7, 7, 2, 2, 2, 7, 7, 2, 2, 2, 7, 7, 6, 3, 3, 3, 6, 6, 3, 6,13, 6, 0, 0, 0,
    0, 3, 3,10,11, 3, 3, 6, 7, 7, 2, 2, 2, 2, 2, 2, 1, 1, 7, 6, 6, 6, 6, 6, 3, 0, 6, 6, 6, 0, 0, 0,
    0, 0, 3, 3, 3, 0, 3, 3, 3, 7, 7, 2, 2, 2, 2, 7, 7, 1, 1, 6, 6, 6, 6, 3, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 7, 7, 7, 7, 2, 7, 6, 3, 1, 3, 6, 6, 6, 3, 0, 0, 0, 3, 3, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 6, 6, 7, 2, 7, 6, 3, 1, 3, 3, 6, 6, 3, 0, 0, 0, 3, 3, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 6, 7, 7, 7, 6, 3, 1, 1, 3, 3, 6, 3, 3, 0, 0, 3, 3, 3, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 6, 6, 7, 7, 7, 6, 3, 1, 1, 3, 3, 6, 3, 3, 0, 3,12, 3, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 6, 6, 6, 7, 7, 6, 3, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 6, 6, 6, 6, 3, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 6, 6, 3, 3, 3, 3, 1, 1, 3, 3, 3, 1, 1, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 4, 5, 3, 3, 3, 6, 6, 6, 3, 3, 3, 1, 1, 1, 1, 1, 3, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 8, 9, 3, 3, 3, 6, 6, 6, 6, 3, 3, 3, 3, 3, 3, 1, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 6, 6, 6, 3, 3, 3, 3, 3, 3, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 6, 6, 6, 6, 3, 3, 3, 3, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 6, 6, 6, 6, 3, 3, 3, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 6, 6, 6, 3, 3, 3, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 6, 6, 6, 3, 6, 6, 6, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 6, 6, 3, 6, 6, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 6, 6, 3, 6, 6, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 6, 3, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 6, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,14, 6, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6, 6, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6, 7, 0, 0, 0, 0, 0, 0, 0, 0,
    7,15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7, 7, 7, 0, 0, 0, 0, 0,
    7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7, 7, 7, 7, 7,
   ];

const gMonsterName = ["スライム", "ウサギ", "ナイト", "ドラゴン", "魔王"];

function Action()
{
    gPhase++;
/* 
    ビット演算を行い、gPhase + gOrderと1の値が一致する値を返す
    例えば9の二進数は1001、15の二進数は1111
    この二つの値を 9&15した値は1001で9を返す
 */    
    if (((gPhase + gOrder) & 1) == 0) { // 敵の行動
        const d = GetDamage(gEnemyType + 2);
        SetMessage(gMonsterName[gEnemyType] + "の攻撃!",  d + "のダメージ!");
        gHP -= d; // HP減少
        if (gHP <= 0) {
            gPhase = 7;
        }
        return;
    } 

    if (gCursor == 0) { // プレイヤーの行動
        const d = GetDamage(gLv + 1);
        SetMessage("あなたの攻撃！" + d, "のダメージ！");
        gEnemyHP -= d;
        if (gEnemyHP <= 0) {
            gPhase = 5;
        }
        return;
    }

    if (Math.random() < 0.5) {
        gPhase = 6;
        SetMessage("あなたは逃げ出した");
        return;     
    }

    SetMessage("あなたは逃げ出した", "しかし回り込まれた");
}


// 経験値処理
function AddExp(val)
{
    gEx += val;
    while (gLv * (gLv + 1) * 2 <= gEx) {
        gLv++;
        gMHP += 4 + Math.floor(Math.random() * 3);
    } 
}

// 敵出現処理
function AppearEnemy(t)
{
    gPhase = 1;
    gEnemyHP = t * 3 + 5;
    gEnemyType = t;
    SetMessage("敵が現れた");
}

function CommandFight()
{
    gPhase = 2; // コマンド入力フェーズ
    gCursor = 0;
    SetMessage("　　　たたかう", "　　　逃げる");
}

// 戦闘画面処理
function DrawFight(g)
{
    g.fillStyle = "#000000"; // 背景
    g.fillRect(0, 0, WIDTH, HEIGHT);

    if (gPhase <= 5) {
        if (isBoss()) {
            g.drawImage(gImgBoss, WIDTH/2 - gImgBoss.width/2, HEIGHT/2 - gImgBoss.height/2);
        } else {
            let w = gImgMonster.width/4;
            let h = gImgMonster.height;

            g.drawImage(gImgMonster, gEnemyType * w, 0, w, h, Math.floor( WIDTH/2 - w/2 ), Math.floor( HEIGHT/2 - h/2 ), w, h);
        }
    }

    // ステータス表示
    g.fillStyle = WNDSTYLE;
    g.fillRect(2, 2, 44, 37);
    DrawStatus(g); 

    DrawMessage(g);
    

    if (gPhase == 2) { // 戦闘フェーズのコマンド選択時
        g.fillText("⇨", 6, 96 + 14 * gCursor); // カーソル描画
    }
}


// map描画処理  
function DrawField(g)
{
    let mx = Math.floor(gPlayerX / TILESIZE); // プレイヤータイル座標
    let my = Math.floor(gPlayerY / TILESIZE); // プレイヤータイル座標


	for( let dy = -SCR_HEIGHT; dy <= SCR_HEIGHT; dy++ ){
        let ty = my + dy; // タイル座標
        let py = (ty + MAP_HEIGHT) % MAP_HEIGHT; // ループ後タイル座標
		for( let dx = -SCR_WIDTH; dx <= SCR_WIDTH; dx++ ){
            let tx = mx + dx; // タイル座標
            let px = (tx + MAP_WIDTH) % MAP_WIDTH; // ループ後タイル座標
            
            DrawTile(g, 
                    // x * TILESIZE
                    tx * TILESIZE + WIDTH/2 - gPlayerX,
                    // y * TILESIZE
                    ty * TILESIZE + HEIGHT/2 - gPlayerY,
                    gMap[py * MAP_WIDTH + px]); // コンテキスト、x軸、y軸、種類
		}
    }

    
    g.drawImage(gImgPlayer,
                (gFrame >> 3 & 1) * CHRWIDTH, gAngle * CHRHEIGHT, CHRWIDTH, CHRHEIGHT, 
                WIDTH/2 - CHRWIDTH/2, HEIGHT/2 - CHRHEIGHT + TILESIZE/2, CHRWIDTH, CHRHEIGHT); // >>はビットシフト演算なので、3ビット右に、すなわち12で割っている

    // ステータス表示
    g.fillStyle = WNDSTYLE;
    g.fillRect(2, 2, 44, 37);
    DrawStatus(g); 

    DrawMessage(g);
    

}


function DrawMain()
{
	const g = TUG.GR.mG; // 2dでコンテキストを取得

    if (gPhase <= 1) {
        DrawField(g);
    } else {
        DrawFight(g);
    }

/*
    g.fillStyle = WNDSTYLE; //　メッセージ設定
    g.fillRect(20, 3, 105, 15); // 
    g.font = FONT;
    g.fillStyle = FONTSTYLE;
	g.fillText( "x=" + gPlayerX + "y=" + gPlayerY + "m=" + gMap[my * MAP_WIDTH + mx], 25, 15 );
 */
}

function DrawMessage(g)
{
    if (!gMessage1) {
        return;
    }
    g.fillStyle = WNDSTYLE; //　メッセージ設定
    g.fillRect(4, 84, 120, 30); // 

    g.font = FONT;
    g.fillStyle = FONTSTYLE;
    g.fillText(gMessage1, 6, 96); 
    if (gMessage2) {    
        g.fillText(gMessage2, 6, 110);   
    } 
}

function DrawStatus(g)
{
    g.font = FONT;
    g.fillStyle = FONTSTYLE;
    g.fillText("Lv", 4, 13); // Lv
    DrawTextR(g, gLv, 38, 13);
    g.fillText("HP", 4, 25); // HP
    DrawTextR(g, gHP, 38, 25);
    g.fillText("Ex", 4, 37); // Ex
    DrawTextR(g, gEx, 38, 37);

}

function DrawTextR(g, str, x, y)
{
    g.textAlign = "right";
    g.fillText(str, x, y);
    g.textAlign = "left";
}

function DrawTile(g, x, y, idx)
{
    const ix = (idx % TILECOLUMN) * TILESIZE;
    const iy = Math.floor(idx / TILECOLUMN) * TILESIZE;
    g.drawImage( gImgMap, ix, iy, TILESIZE, TILESIZE, x, y, TILESIZE, TILESIZE );
}

function  GetDamage(a)
{
    return (Math.floor(a * (1 + Math.random()))); // 攻撃力
}

function isBoss()
{
    return(gEnemyType == gMonsterName.length - 1);
}

function LoadImage()
{
    gImgMap = new Image();
    gImgMap.src = gFileMap; // imageを取得

    gImgMonster = new Image();
    gImgMonster.src = gFileMonster; // imageを取得

    gImgBoss = new Image();
    gImgBoss.src =  gFileBoss;

    gImgPlayer = new Image();
    gImgPlayer.src = gFilePlayer; // imageを取得
}

function SetMessage(v1,v2 = null)
{
    gMessage1 = v1;
    gMessage2 = v2;
}

// フィールド進行処理
function TickField()
{
    if (gPhase !== 0) {
        return;
    }
    if (gMoveX != 0 || gMoveY != 0 || gMessage1){} // 移動中の場合は何も動かさない
    else if (gKey[37]) { gAngle = 1; gMoveX = -TILESIZE; } //　左
    else if (gKey[38]) { gAngle = 3; gMoveY = -TILESIZE; } //　上
    else if (gKey[39]) { gAngle = 2; gMoveX = TILESIZE; } //　右
    else if (gKey[40]) { gAngle = 0; gMoveY = TILESIZE; } //　下

    let mx = Math.floor((gPlayerX + gMoveX) / TILESIZE); // 移動後のタイル座標
    let my = Math.floor((gPlayerY + gMoveY) / TILESIZE); // 移動後のタイル座標

    mx += MAP_WIDTH; // ループ処理
    mx %= MAP_WIDTH;
    my += MAP_HEIGHT;
    my %= MAP_HEIGHT;

    let m = gMap[my * MAP_WIDTH + mx]; // タイル番号を求める
    if (m < 3)
    { // 歩ける場所の限定
        gMoveX = 0;
        gMoveY = 0;
    }

    if (Math.abs(gMoveX) + Math.abs(gMoveY) == SCROLL) { // 移動が終わる直前
        if (m == 8 || m == 9)
        {
            gHP = gMHP;
            SetMessage("魔王を倒して！"); // 城のメッセージ
        } 

        if (m == 10 || m == 11)
        {
            gHP = gMHP;
            SetMessage("東の果てにも", "村があります！"); // の街メッセージ
        } 

        if (m == 12)
        {
            gHP = gMHP;
            SetMessage("カギは洞窟にあります！"); // 村のメッセージ
        } 

        if (m == 13)
        {
            gItem = 1; // カギ入手
            SetMessage("カギを手に入れた！"); // 洞窟のメッセージ
        } 

        if (m == 14)
        {
            if (gItem == 0) { // カギを持っていない場合
                gPlayerY-= TILESIZE;
                SetMessage("カギが必要です！");
            } else {
                SetMessage("扉が開いた"); // 扉のメッセージ
            }
        } 

        if (m == 15)
        {
            AppearEnemy(gMonsterName.length - 1);
            // SetMessage("魔王を倒し、", "平和が訪れた"); // 扉のメッセージ
        } 

        if (Math.random() * 8 < gEncounter[m]) // ランダムが1未満の少数をランダムで返す
        {
            let t = Math.abs(gPlayerX/TILESIZE - START_X) + Math.abs(gPlayerY/TILESIZE - START_Y);
            if (m == 6) { // 林
                t += 8;
            }

            if (m == 7) { // 山
                t += 16; // 敵レベルの上昇　1
            }
            t += Math.random() * 8; // 敵レベルの上昇 約0.5
            t = Math.floor(t/16);
            t = Math.min(t, gMonsterName.length - 2); // モンスターの数、魔王などが出現しない様にする
            AppearEnemy(t);
            gPhase = 1; // 敵出現フェーズ
        }
    }
    gPlayerX += Math.sign(gMoveX) * SCROLL; // Math.sign関数は値が正の数か負の数かで１か−１を返す
    gPlayerY += Math.sign(gMoveY) * SCROLL;
    gMoveX　-=Math.sign(gMoveX) * SCROLL;
    gMoveY　-=Math.sign(gMoveY) * SCROLL;

    // マップループ処理
    gPlayerX += (MAP_WIDTH * TILESIZE);
    gPlayerX %= (MAP_WIDTH * TILESIZE);
    gPlayerY += (MAP_HEIGHT * TILESIZE);
    gPlayerY %= (MAP_HEIGHT * TILESIZE);

}


function WmPaint()
{
	DrawMain();

	const ca = document.getElementById( "main" ); // mainを取得
	const g = ca.getContext( "2d" ); // 2dでコンテキストを取得
	g.drawImage( TUG.GR.mCanvas, 0, 0, TUG.GR.mCanvas.width, TUG.GR.mCanvas.height, 0, 0, gWidth, gHeight ); // imageをどのサイズで構築するか
}



function WmSize()
{
	const ca = document.getElementById( "main" ); // mainを取得
	ca.width = window.innerWidth;
	ca.height = window.innerHeight;

	const g = ca.getContext( "2d" ); // 2dでテキストを取得
	g.imageSmoothingEnabled = g.msImageSmoothingEnabled = SMOOTH;
	
	gWidth = ca.width;
	gHeight = ca.height;
	if( gWidth / WIDTH < gHeight / HEIGHT ){ // アスペクト比を全体のサイズと比較して求める
		gHeight = gWidth * HEIGHT / WIDTH;
	}else{
		gWidth = gHeight * WIDTH / HEIGHT;
	}
}



TUG.onTimer = function(d)
{
    if (!gMessage1) {
        //while (d--) {
            gFrame++;
            TickField(); // タイマーに入れるとヌルヌル動くよ
        //}  
    }
	WmPaint();
}

// キーダウン処理（キーを押下した時）
window.onkeydown = function (ev)
{
    let c = ev.keyCode; // キーボード入力の内容を察知

    if (gKey[c] != 0) { // すでに押下していたら（キーリピート）
        return;
    }
    gKey[c] = 1;
    if (gPhase == 1) { // 敵が現れた場合
        CommandFight();
        return;
    }
    if (gPhase == 2) { // コマンド選択
        if (c == 13 || c == 90){
            gOrder = Math.floor(Math.random() * 2);
            Action();
        } else {
            gCursor = 1 - gCursor;
        }
        
        return;
    }

    if (gPhase == 3) { // 戦闘行動処理
        Action();
        return;
    }

    if (gPhase == 4) { // コマンド処理
        CommandFight();
        return;
    }

    if (gPhase == 5) {
        gPhase = 6;
        AddExp(gEnemyType + 1); 
        SetMessage("敵をやっつけた！");
        return;
    }

    if (gPhase == 6) {
        if (isBoss() && gCursor == 0) {
            SetMessage("魔王を倒し、", "平和が訪れた"); 
            return;
        }
        gPhase = 0;
    }

    if (gPhase == 7) {
        SetMessage("あなたは死亡した...");
        gPhase = 8;
        return;
    }

    if (gPhase == 8) {
        SetMessage("Game over");
        return;
    }

    gMessage1 = null;

}

// キーアップ処理（キーを離した時）
window.onkeyup = function (ev)
{
    gKey[ev.keyCode] = 0; // キーボード入力の内容を察知
}


window.onload = function()
{
    LoadImage();

	WmSize();
	window.addEventListener( "resize", function(){ WmSize() } ); // ウィンドウの引き延ばしなどに対応できる様にリサイズ毎にWmSizeを呼ぶ
    TUG.init();
}
