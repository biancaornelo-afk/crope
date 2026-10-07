let jogavel;
let chefe;

let ioios = [];
let bolhasInimigas = [];
let akumas = [];
let particulas = [];

let pontos = 0;

let faseAtual = 1;
let estadoJogo = "INTRO";

let tempoIntro = 0;
let jaViuIntro = false;

let xCenario = 0;
let velocidadeCenario = 3;

let tempoVitoria = 0;


// ======================================================
// SETUP
// ======================================================

function setup() {

  createCanvas(700, 400);

  textFont("Arial");

  reiniciarJogo();

}


// ======================================================
// DRAW
// ======================================================

function draw() {

  if (faseAtual === 1) {
    desenharCenarioParisPorDoSol();
  } else {
    desenharCenarioParisNoite();
  }


  // ====================================================
  // INTRO
  // ====================================================

  if (estadoJogo === "INTRO") {

    desenharCenaAkumatizacao();

  }


  // ====================================================
  // JOGANDO
  // ====================================================

  else if (estadoJogo === "JOGANDO") {

    let velAtual = velocidadeCenario;


    // --------------------------------------------------
    // MOVIMENTO
    // --------------------------------------------------

    if (
      keyIsDown(RIGHT_ARROW) ||
      keyIsDown(68)
    ) {

      velAtual = velocidadeCenario + 2;

      jogavel.x += 2;

      jogavel.andando = true;

      jogavel.lado = 1;

    }

    else if (
      keyIsDown(LEFT_ARROW) ||
      keyIsDown(65)
    ) {

      velAtual = velocidadeCenario - 1;

      jogavel.x -= 3;

      jogavel.andando = true;

      jogavel.lado = -1;

    }

    else {

      jogavel.andando = false;

    }


    xCenario -= velAtual;


    // --------------------------------------------------
    // AKUMAS
    // --------------------------------------------------

    if (frameCount % 100 === 0) {

      akumas.push(
        new AkumaOriginal()
      );

    }


    for (
      let i = akumas.length - 1;
      i >= 0;
      i--
    ) {

      akumas[i].atualizar(
        velAtual
      );

      akumas[i].desenhar();


      if (
        jogavel.coleta(
          akumas[i]
        )
      ) {

        akumas.splice(i, 1);

        pontos += 15;

        jogavel.dispararEmote(
          faseAtual === 1
            ? "🐞 Miraculous!"
            : "🐾 Cataclismo!"
        );

      }

      else if (
        akumas[i].x < -50
      ) {

        akumas.splice(i, 1);

      }

    }


    // --------------------------------------------------
    // CHEFE
    // --------------------------------------------------

    chefe.atualizar(
      velAtual,
      jogavel
    );

    chefe.desenhar();


    // --------------------------------------------------
    // BOLHAS
    // --------------------------------------------------

    for (
      let i = bolhasInimigas.length - 1;
      i >= 0;
      i--
    ) {

      bolhasInimigas[i].atualizar();

      bolhasInimigas[i].desenhar();


      if (
        bolhasInimigas[i].colide(
          jogavel
        )
      ) {

        // LADYBUG TOMA MAIS DANO
        jogavel.vida -= 18;

        jogavel.dispararEmote(
          "⚠️ AI! BOLHA!"
        );


        for (
          let p = 0;
          p < 8;
          p++
        ) {

          particulas.push(
            new Particula(
              jogavel.x,
              jogavel.y,
              color(
                100,
                200,
                255
              )
            )
          );

        }


        bolhasInimigas.splice(
          i,
          1
        );


        if (
          jogavel.vida <= 0
        ) {

          jogavel.vida = 0;

          estadoJogo = "GAMEOVER";

        }

      }

      else if (
        bolhasInimigas[i].x < -50
      ) {

        bolhasInimigas.splice(
          i,
          1
        );

      }

    }


    // --------------------------------------------------
    // ATAQUE LADY WIFI
    // --------------------------------------------------

    if (
      faseAtual === 1 &&
      chefe.checarAtaqueWifi &&
      chefe.checarAtaqueWifi(jogavel)
    ) {

      // DANO MAIOR
      jogavel.vida -= 0.65;


      if (
        frameCount % 8 === 0
      ) {

        jogavel.dispararEmote(
          "⚠️ DANO!"
        );

      }


      if (
        jogavel.vida <= 0
      ) {

        jogavel.vida = 0;

        estadoJogo = "GAMEOVER";

      }

    }


    // --------------------------------------------------
    // PROJÉTEIS
    // --------------------------------------------------

    for (
      let i = ioios.length - 1;
      i >= 0;
      i--
    ) {

      ioios[i].atualizar();

      ioios[i].desenhar();


      if (
        ioios[i].colideComInimigo(
          chefe
        )
      ) {

        chefe.vida -= 1;


        chefe.dispararEmote(
          faseAtual === 1
            ? "📶 SINAL FRACO!"
            : "🫧 AI, MINHA BOLHA!"
        );


        for (
          let p = 0;
          p < 4;
          p++
        ) {

          particulas.push(
            new Particula(
              chefe.x,
              chefe.y,
              color(
                255,
                50,
                50
              )
            )
          );

        }


        ioios.splice(
          i,
          1
        );


        if (
          chefe.vida <= 0
        ) {

          if (
            faseAtual === 1
          ) {

            iniciarFase2();

          }

          else {

            pontos += 200;

            estadoJogo = "VITORIA";

            tempoVitoria = 0;

          }

        }


        continue;

      }


      if (
        ioios[i] &&
        ioios[i].x > width + 50
      ) {

        ioios.splice(
          i,
          1
        );

      }

    }


    // --------------------------------------------------
    // COLISÃO DIRETA
    // --------------------------------------------------

    if (
      jogavel.colide(
        chefe
      )
    ) {

      if (
        frameCount % 8 === 0
      ) {

        // DANO MAIOR
        jogavel.vida -= 1.0;

        jogavel.dispararEmote(
          "⚠️ CUIDADO!"
        );

      }


      if (
        jogavel.vida <= 0
      ) {

        jogavel.vida = 0;

        estadoJogo = "GAMEOVER";

      }

    }


    // --------------------------------------------------
    // PARTÍCULAS
    // --------------------------------------------------

    for (
      let i = particulas.length - 1;
      i >= 0;
      i--
    ) {

      particulas[i].atualizar();

      particulas[i].desenhar();


      if (
        particulas[i].opacidade <= 0
      ) {

        particulas.splice(
          i,
          1
        );

      }

    }


    // --------------------------------------------------
    // JOGADOR
    // --------------------------------------------------

    jogavel.atualizar();

    jogavel.desenhar();


    desenharHUD();

  }


  // ====================================================
  // GAME OVER
  // ====================================================

  else if (
    estadoJogo === "GAMEOVER"
  ) {

    desenharTelaGameOver();

  }


  // ====================================================
  // VITÓRIA
  // ====================================================

  else if (
    estadoJogo === "VITORIA"
  ) {

    tempoVitoria++;

    desenharTelaVitoria();

  }

}


// ======================================================
// FASE 2
// ======================================================

function iniciarFase2() {

  faseAtual = 2;

  pontos += 100;


  let vidaAtual =
    jogavel.vida;


  jogavel =
    new JogadorCatNoir(
      120,
      260
    );


  jogavel.vida =
    vidaAtual;


  jogavel.dispararEmote(
    "🐾 CHEGUEI, MY LADY!"
  );


  chefe =
    new ChefeHomemBolha(
      520,
      260
    );


  chefe.dispararEmote(
    "🫧 HORA DAS BOLHAS!"
  );


  ioios = [];

  bolhasInimigas = [];

}


// ======================================================
// MOUSE
// ======================================================

function mousePressed() {

  if (
    estadoJogo === "JOGANDO"
  ) {

    if (
      mouseButton === LEFT
    ) {

      jogavel.atacar();

    }

  }

  else if (
    estadoJogo === "GAMEOVER"
  ) {

    reiniciarJogo();

  }

  else if (
    estadoJogo === "VITORIA"
  ) {

    reiniciarJogo();

  }

}


// ======================================================
// TECLADO
// ======================================================

function keyPressed() {

  if (
    estadoJogo === "INTRO"
  ) {

    if (
      keyCode === ENTER ||
      keyCode === 32
    ) {

      jaViuIntro = true;

      estadoJogo =
        "JOGANDO";

    }

    return;

  }


  if (
    estadoJogo === "JOGANDO"
  ) {

    if (
      keyCode === UP_ARROW ||
      keyCode === 32 ||
      key === "w" ||
      key === "W"
    ) {

      jogavel.pular();

    }


    if (
      key === "j" ||
      key === "J"
    ) {

      jogavel.atacar();

    }

  }


  else if (
    estadoJogo === "GAMEOVER" ||
    estadoJogo === "VITORIA"
  ) {

    reiniciarJogo();

  }

}


// ======================================================
// REINICIAR
// ======================================================

function reiniciarJogo() {

  pontos = 0;

  faseAtual = 1;

  akumas = [];

  particulas = [];

  ioios = [];

  bolhasInimigas = [];

  xCenario = 0;


  jogavel =
    new JogadorLadybug(
      120,
      260
    );


  chefe =
    new ChefeLadyWifi(
      520,
      260
    );


  if (
    jaViuIntro
  ) {

    estadoJogo =
      "JOGANDO";

  }

  else {

    estadoJogo =
      "INTRO";

    tempoIntro = 0;

  }

}


// ======================================================
// INTRODUÇÃO
// HAWK MOTH -> ALYA -> LADY WIFI
// ======================================================

function desenharCenaAkumatizacao() {

  tempoIntro++;


  push();

  fill(
    0,
    190
  );

  noStroke();

  rect(
    0,
    0,
    width,
    height
  );

  pop();


  // ====================================================
  // HAWK MOTH
  // ====================================================

  push();

  translate(
    150,
    260
  );


  desenharCorpoHawkMoth(
    1,
    tempoIntro * 0.03
  );


  if (
    tempoIntro < 80
  ) {

    desenharEmotePersonagem(
      "Hawk Moth",
      0,
      -65,
      color(
        255
      )
    );

    desenharEmotePersonagem(
      "Alya está sofrendo...",
      0,
      -82,
      color(
        255
      )
    );

  }

  else {

    desenharEmotePersonagem(
      "🦋 RECEBA MINHA AKUMA!",
      0,
      -65,
      color(
        255
      )
    );

  }

  pop();


  // ====================================================
  // ALYA
  // ====================================================

  push();

  translate(
    550,
    260
  );


  // ----------------------------------------------
  // ALYA NORMAL
  // ----------------------------------------------

  if (
    tempoIntro < 120
  ) {

    desenharCorpoAlya(
      -1,
      tempoIntro * 0.03
    );


    desenharEmotePersonagem(
      "Alya",
      0,
      -65,
      color(
        255
      )
    );


    desenharEmotePersonagem(
      "Eu quero poder!",
      0,
      -82,
      color(
        255
      )
    );

  }


  // ----------------------------------------------
  // TRANSFORMAÇÃO
  // ----------------------------------------------

  else if (
    tempoIntro < 210
  ) {

    if (
      frameCount % 8 < 4
    ) {

      desenharCorpoAlya(
        -1,
        tempoIntro * 0.08
      );

    }

    else {

      desenharCorpoWifi(
        -1,
        tempoIntro * 0.08
      );

    }


    noFill();

    stroke(
      255,
      80,
      220,
      200
    );

    strokeWeight(4);


    let tamanho =
      map(
        tempoIntro,
        120,
        210,
        20,
        100
      );


    circle(
      0,
      -10,
      tamanho
    );


    for (
      let i = 0;
      i < 10;
      i++
    ) {

      let angulo =
        random(TWO_PI);

      let distancia =
        random(
          20,
          60
        );


      let px =
        cos(angulo) *
        distancia;

      let py =
        sin(angulo) *
        distancia -
        10;


      noStroke();

      fill(
        255,
        random(
          50,
          180
        ),
        230,
        180
      );


      circle(
        px,
        py,
        random(
          2,
          7
        )
      );

    }


    desenharEmotePersonagem(
      "✨ ALYA ESTÁ SE TRANSFORMANDO!",
      0,
      -80,
      color(
        255
      )
    );

  }


  // ----------------------------------------------
  // LADY WIFI
  // ----------------------------------------------

  else {

    desenharCorpoWifi(
      -1,
      tempoIntro * 0.08
    );


    desenharEmotePersonagem(
      "📶 LADY WIFI!",
      0,
      -65,
      color(
        255,
        100,
        200
      )
    );


    desenharEmotePersonagem(
      "HORA DO SHOW!",
      0,
      -82,
      color(
        255,
        100,
        200
      )
    );

  }

  pop();


  // ====================================================
  // AKUMA
  // ====================================================

  if (
    tempoIntro >= 40 &&
    tempoIntro < 145
  ) {

    let akumaX =
      map(
        tempoIntro,
        40,
        145,
        180,
        520
      );


    let akumaY =
      235 +
      sin(
        tempoIntro * 0.15
      ) *
      25;


    push();

    translate(
      akumaX,
      akumaY
    );


    noStroke();

    fill(
      180,
      50,
      255,
      80
    );

    circle(
      0,
      0,
      42
    );


    desenharBorboletaAkuma(
      sin(
        millis() * 0.01
      )
    );


    pop();

  }


  if (
    tempoIntro >= 80 &&
    tempoIntro < 150
  ) {

    desenharEmotePersonagem(
      "🦋 A AKUMA ENCONTROU ALYA!",
      width / 2,
      40,
      color(
        255
      )
    );

  }


  // ----------------------------------------------
  // FINAL DA INTRO
  // ----------------------------------------------

  if (
    tempoIntro >= 240
  ) {

    jaViuIntro = true;

    estadoJogo =
      "JOGANDO";

  }

}


// ======================================================
// EMOTE DOS PERSONAGENS
// ======================================================

function desenharEmotePersonagem(
  txt,
  x,
  y,
  cor
) {

  push();

  fill(
    255,
    255,
    255,
    235
  );

  stroke(
    30
  );

  strokeWeight(2);


  textAlign(
    CENTER,
    CENTER
  );

  textSize(12);


  let largura =
    textWidth(txt) + 18;


  rect(
    x - largura / 2,
    y - 13,
    largura,
    26,
    10
  );


  fill(
    cor
  );

  noStroke();


  text(
    txt,
    x,
    y
  );


  pop();

}


// ======================================================
// HAWK MOTH
// ======================================================

function desenharCorpoHawkMoth(
  lado,
  passo = 0
) {

  push();

  scale(
    lado,
    1
  );


  let movimento =
    sin(passo) * 0.35;


  // -----------------------------
  // PERNAS
  // -----------------------------

  stroke(
    25,
    20,
    35
  );

  strokeWeight(6);

  strokeCap(ROUND);


  push();

  rotate(
    movimento
  );

  line(
    0,
    18,
    0,
    45
  );

  pop();


  // -----------------------------
  // CORPO MAIS MAGRO
  // -----------------------------

  fill(
    35,
    25,
    55
  );

  stroke(
    15,
    10,
    25
  );

  strokeWeight(2);


  ellipse(
    0,
    8,
    22,
    36
  );


  // -----------------------------
  // CASACO
  // -----------------------------

  fill(
    55,
    35,
    75
  );

  quad(
    -10,
    -5,
    10,
    -5,
    15,
    27,
    -15,
    27
  );


  // detalhes roxos
  stroke(
    130,
    70,
    180
  );

  strokeWeight(2);


  line(
    0,
    -4,
    0,
    25
  );


  // -----------------------------
  // BRAÇOS
  // -----------------------------

  stroke(
    30,
    20,
    40
  );

  strokeWeight(5);


  push();

  rotate(
    -0.65
  );

  line(
    0,
    2,
    17,
    -12
  );

  pop();


  push();

  rotate(
    0.65
  );

  line(
    0,
    2,
    -17,
    -12
  );

  pop();


  // mãos
  noStroke();

  fill(
    240,
    195,
    170
  );


  circle(
    17,
    -12,
    7
  );


  circle(
    -17,
    -12,
    7
  );


  // -----------------------------
  // CABEÇA
  // -----------------------------

  fill(
    240,
    195,
    170
  );

  circle(
    0,
    -16,
    20
  );


  // -----------------------------
  // CABELO
  // -----------------------------

  fill(
    35,
    20,
    45
  );

  arc(
    0,
    -19,
    22,
    19,
    PI,
    TWO_PI
  );


  // -----------------------------
  // MÁSCARA
  // -----------------------------

  fill(
    85,
    35,
    120
  );

  ellipse(
    0,
    -15,
    17,
    8
  );


  // olhos
  fill(
    190,
    230,
    255
  );

  circle(
    -4,
    -15,
    3
  );

  circle(
    4,
    -15,
    3
  );


  // -----------------------------
  // BORBOLETA
  // -----------------------------

  fill(
    180,
    50,
    255
  );

  ellipse(
    -5,
    5,
    8,
    6
  );

  ellipse(
    5,
    5,
    8,
    6
  );


  pop();

}


// ======================================================
// ALYA
// ======================================================

function desenharCorpoAlya(
  lado,
  passo = 0
) {

  push();

  scale(
    lado,
    1
  );


  let movimento =
    sin(passo) * 0.5;


  // pernas
  stroke(
    30
  );

  strokeWeight(6);

  strokeCap(ROUND);


  push();

  rotate(
    movimento
  );

  line(
    0,
    20,
    0,
    45
  );

  pop();


  // corpo
  fill(
    220,
    75,
    65
  );

  stroke(
    30
  );

  strokeWeight(2);


  ellipse(
    0,
    8,
    26,
    31
  );


  // braços
  strokeWeight(5);


  push();

  rotate(
    -0.4
  );

  line(
    0,
    5,
    15,
    18
  );

  pop();


  push();

  rotate(
    0.4
  );

  line(
    0,
    5,
    -15,
    18
  );

  pop();


  // cabeça
  noStroke();

  fill(
    240,
    190,
    160
  );

  circle(
    0,
    -13,
    18
  );


  // cabelo
  fill(
    80,
    40,
    25
  );

  arc(
    0,
    -17,
    21,
    19,
    PI,
    TWO_PI
  );


  // olhos
  fill(
    20
  );

  circle(
    -3,
    -12,
    2.5
  );

  circle(
    3,
    -12,
    2.5
  );


  // roupa
  fill(
    255,
    120,
    50
  );

  rect(
    -12,
    0,
    24,
    22,
    4
  );


  // celular
  fill(
    20
  );

  rect(
    8,
    7,
    7,
    12,
    2
  );


  fill(
    80,
    180,
    255
  );

  rect(
    9,
    8,
    5,
    8
  );


  pop();

}


// ======================================================
// LADY WIFI
// ======================================================

function desenharCorpoWifi(
  lado,
  passo = 0
) {

  push();

  scale(
    lado,
    1
  );


  let a1 =
    sin(passo) * 0.7;

  let a2 =
    -sin(passo) * 0.7;


  // pernas
  strokeWeight(6);

  strokeCap(ROUND);

  stroke(
    15,
    15,
    25
  );


  push();

  rotate(
    a2
  );

  line(
    0,
    20,
    0,
    45
  );

  pop();


  push();

  rotate(
    a1
  );

  line(
    0,
    20,
    0,
    45
  );

  pop();


  // corpo
  strokeWeight(12);

  line(
    0,
    5,
    0,
    22
  );


  // braços
  strokeWeight(5);


  push();

  rotate(
    -0.4
  );

  line(
    0,
    8,
    12,
    20
  );

  pop();


  noStroke();


  // detalhe
  fill(
    255,
    120,
    0
  );

  circle(
    0,
    12,
    6
  );


  // cabelo
  fill(
    200,
    50,
    150
  );

  circle(
    -8,
    -12,
    10
  );


  // rosto
  fill(
    240,
    200,
    180
  );

  circle(
    0,
    -10,
    16
  );


  // máscara
  fill(
    15
  );

  ellipse(
    0,
    -10,
    14,
    7
  );


  // olhos
  fill(
    255,
    120,
    0
  );

  circle(
    -2,
    -10,
    2
  );

  circle(
    2,
    -10,
    2
  );


  pop();

}


// ======================================================
// LADYBUG
// ======================================================

function desenharCorpoLadybug(
  lado,
  passo = 0
) {

  push();

  scale(
    lado,
    1
  );


  let a1 =
    sin(passo) * 0.7;

  let a2 =
    -sin(passo) * 0.7;


  // pernas
  strokeWeight(6);

  strokeCap(ROUND);

  stroke(
    220,
    20,
    40
  );


  push();

  rotate(
    a2
  );

  line(
    0,
    20,
    0,
    45
  );

  pop();


  push();

  rotate(
    a1
  );

  line(
    0,
    20,
    0,
    45
  );

  pop();


  // corpo
  strokeWeight(12);

  line(
    0,
    5,
    0,
    22
  );


  // braço
  strokeWeight(5);

  push();

  rotate(
    -0.4
  );

  line(
    0,
    8,
    12,
    20
  );

  pop();


  noStroke();


  // manchas
  fill(
    0
  );

  circle(
    0,
    12,
    5
  );

  circle(
    -3,
    18,
    3
  );

  circle(
    3,
    8,
    3
  );


  // cabelo
  fill(
    20,
    60,
    170
  );

  circle(
    -8,
    -12,
    10
  );


  // rosto
  fill(
    255,
    218,
    185
  );

  circle(
    0,
    -10,
    16
  );


  // máscara
  fill(
    220,
    20,
    40
  );

  ellipse(
    2,
    -10,
    14,
    7
  );


  // olhos
  fill(
    0
  );

  circle(
    0,
    -10,
    2
  );

  circle(
    4,
    -10,
    2
  );


  pop();

}


// ======================================================
// CAT NOIR
// ======================================================

function desenharCorpoCatNoir(
  lado,
  passo = 0
) {

  push();

  scale(
    lado,
    1
  );


  let a1 =
    sin(passo) * 0.7;

  let a2 =
    -sin(passo) * 0.7;


  strokeWeight(6);

  strokeCap(ROUND);

  stroke(
    20,
    20,
    25
  );


  push();

  rotate(
    a2
  );

  line(
    0,
    20,
    0,
    45
  );

  pop();


  push();

  rotate(
    a1
  );

  line(
    0,
    20,
    0,
    45
  );

  pop();


  strokeWeight(12);

  line(
    0,
    5,
    0,
    22
  );


  strokeWeight(5);


  push();

  rotate(
    -0.4
  );

  line(
    0,
    8,
    12,
    20
  );

  pop();


  // sino
  noStroke();

  fill(
    255,
    215,
    0
  );

  circle(
    0,
    6,
    6
  );


  // cabelo
  fill(
    240,
    210,
    50
  );

  circle(
    0,
    -14,
    18
  );


  // rosto
  fill(
    255,
    218,
    185
  );

  circle(
    0,
    -8,
    14
  );


  // máscara
  fill(
    20
  );

  ellipse(
    0,
    -9,
    13,
    6
  );


  // olhos
  fill(
    50,
    220,
    80
  );

  circle(
    -3,
    -9,
    3
  );

  circle(
    3,
    -9,
    3
  );


  // orelhas
  fill(
    20
  );

  triangle(
    -7,
    -18,
    -3,
    -25,
    -1,
    -17
  );

  triangle(
    1,
    -17,
    3,
    -25,
    7,
    -18
  );


  pop();

}


// ======================================================
// JOGADOR LADYBUG
// ======================================================

class JogadorLadybug {

  constructor(
    x,
    y
  ) {

    this.x = x;

    this.yChao = y;

    this.y = y;

    this.vy = 0;

    this.gravidade = 0.65;

    this.forcaPulo = -13;

    this.noChao = true;

    this.andando = false;

    this.lado = 1;

    this.passoAnimacao = 0;

    this.emoteTexto = "";

    this.emoteTempo = 0;

    this.vida = 100;

  }


  atualizar() {

    this.vy +=
      this.gravidade;

    this.y +=
      this.vy;


    if (
      this.y >=
      this.yChao
    ) {

      this.y =
        this.yChao;

      this.vy = 0;

      this.noChao = true;

    }


    if (
      this.andando
    ) {

      this.passoAnimacao +=
        0.25;

    }


    if (
      this.emoteTempo > 0
    ) {

      this.emoteTempo--;

    }


    this.x =
      constrain(
        this.x,
        30,
        width - 80
      );

  }


  pular() {

    if (
      this.noChao
    ) {

      this.vy =
        this.forcaPulo;

      this.noChao =
        false;

      this.dispararEmote(
        "☁️ SALTO!"
      );

    }

  }


  atacar() {

    ioios.push(
      new ProjetilAtaque(
        this.x + 15,
        this.y + 10,
        "IOIO"
      )
    );


    this.dispararEmote(
      "🐞 IOIÔ!"
    );

  }


  dispararEmote(
    txt
  ) {

    this.emoteTexto =
      txt;

    this.emoteTempo =
      45;

  }


  desenhar() {

    push();

    translate(
      this.x,
      this.y
    );


    if (
      this.emoteTempo > 0
    ) {

      desenharEmotePersonagem(
        this.emoteTexto,
        0,
        -45 -
        (45 - this.emoteTempo) *
        0.5,
        color(
          40,
          40,
          40
        )
      );

    }


    desenharCorpoLadybug(
      this.lado,
      this.passoAnimacao
    );


    pop();

  }


  coleta(
    akuma
  ) {

    return dist(
      this.x,
      this.y,
      akuma.x,
      akuma.y
    ) < 35;

  }


  colide(
    vilao
  ) {

    return dist(
      this.x,
      this.y + 10,
      vilao.x,
      vilao.y + 10
    ) < 30;

  }

}


// ======================================================
// CAT NOIR
// ======================================================

class JogadorCatNoir {

  constructor(
    x,
    y
  ) {

    this.x = x;

    this.yChao = y;

    this.y = y;

    this.vy = 0;

    this.gravidade = 0.65;

    this.forcaPulo = -13;

    this.noChao = true;

    this.andando = false;

    this.lado = 1;

    this.passoAnimacao = 0;

    this.emoteTexto = "";

    this.emoteTempo = 0;

    this.vida = 100;

  }


  atualizar() {

    this.vy +=
      this.gravidade;

    this.y +=
      this.vy;


    if (
      this.y >=
      this.yChao
    ) {

      this.y =
        this.yChao;

      this.vy = 0;

      this.noChao = true;

    }


    if (
      this.andando
    ) {

      this.passoAnimacao +=
        0.25;

    }


    if (
      this.emoteTempo > 0
    ) {

      this.emoteTempo--;

    }


    this.x =
      constrain(
        this.x,
        30,
        width - 80
      );

  }


  pular() {

    if (
      this.noChao
    ) {

      this.vy =
        this.forcaPulo;

      this.noChao =
        false;

      this.dispararEmote(
        "☁️ SALTO!"
      );

    }

  }


  atacar() {

    ioios.push(
      new ProjetilAtaque(
        this.x + 15,
        this.y + 10,
        "BASTAO"
      )
    );


    this.dispararEmote(
      "🐾 BASTÃO!"
    );

  }


  dispararEmote(
    txt
  ) {

    this.emoteTexto =
      txt;

    this.emoteTempo =
      45;

  }


  desenhar() {

    push();

    translate(
      this.x,
      this.y
    );


    if (
      this.emoteTempo > 0
    ) {

      desenharEmotePersonagem(
        this.emoteTexto,
        0,
        -45 -
        (45 - this.emoteTempo) *
        0.5,
        color(
          40
        )
      );

    }


    desenharCorpoCatNoir(
      this.lado,
      this.passoAnimacao
    );


    pop();

  }


  coleta(
    akuma
  ) {

    return dist(
      this.x,
      this.y,
      akuma.x,
      akuma.y
    ) < 35;

  }


  colide(
    vilao
  ) {

    return dist(
      this.x,
      this.y + 10,
      vilao.x,
      vilao.y + 10
    ) < 30;

  }

}


// ======================================================
// CHEFE LADY WIFI
// ======================================================

class ChefeLadyWifi {

  constructor(
    x,
    y
  ) {

    this.x = x;

    this.y = y;

    this.vidaMax = 20;

    this.vida =
      this.vidaMax;

    this.passoAnimacao = 0;

    this.emoteTexto = "";

    this.emoteTempo = 0;

    this.tempoAtaque = 0;

    this.wifiAtivo = false;

    this.wifiAlcance = 0;

    this.lado = -1;

  }


  dispararEmote(
    txt
  ) {

    this.emoteTexto =
      txt;

    this.emoteTempo =
      45;

  }


  atualizar(
    velCenario,
    jogador
  ) {

    let distancia =
      this.x -
      jogador.x;


    if (
      distancia < 180
    ) {

      this.x += 2.5;

    }

    else if (
      distancia > 300
    ) {

      this.x -= 1.5;

    }


    this.x =
      constrain(
        this.x,
        250,
        width - 50
      );


    this.passoAnimacao +=
      0.3;


    if (
      this.emoteTempo > 0
    ) {

      this.emoteTempo--;

    }


    this.tempoAtaque++;


    if (
      this.tempoAtaque % 90 === 0 &&
      !this.wifiAtivo
    ) {

      this.wifiAtivo =
        true;

      this.wifiAlcance =
        10;

      this.dispararEmote(
        "📶 PAUSE!"
      );

    }


    if (
      this.wifiAtivo
    ) {

      this.wifiAlcance +=
        16;


      if (
        this.wifiAlcance > 200
      ) {

        this.wifiAtivo =
          false;

        this.wifiAlcance =
          0;

      }

    }

  }


  desenhar() {

    push();

    translate(
      this.x,
      this.y
    );


    if (
      this.emoteTempo > 0
    ) {

      desenharEmotePersonagem(
        this.emoteTexto,
        0,
        -48 -
        (45 - this.emoteTempo) *
        0.5,
        color(
          150,
          0,
          120
        )
      );

    }


    // barra
    desenharBarraChefe(
      this.vida,
      this.vidaMax,
      color(
        255,
        0,
        150
      )
    );


    desenharCorpoWifi(
      this.lado,
      this.passoAnimacao
    );


    if (
      this.wifiAtivo
    ) {

      stroke(
        255,
        200,
        255
      );

      strokeWeight(2);

      let px =
        (
          10 +
          this.wifiAlcance
        ) *
        this.lado;


      noFill();


      arc(
        px,
        10,
        20,
        20,
        -QUARTER_PI,
        QUARTER_PI
      );


      arc(
        px,
        10,
        12,
        12,
        -QUARTER_PI,
        QUARTER_PI
      );


      fill(
        255,
        0,
        150
      );

      circle(
        px,
        10,
        4
      );

    }


    pop();

  }


  checarAtaqueWifi(
    jogador
  ) {

    if (
      !this.wifiAtivo
    ) {

      return false;

    }


    let ataqueX =
      this.x +
      (
        this.lado *
        (
          10 +
          this.wifiAlcance
        )
      );


    return dist(
      ataqueX,
      this.y + 10,
      jogador.x,
      jogador.y + 10
    ) < 35;

  }

}


// ======================================================
// HOMEM BOLHA
// ======================================================

class ChefeHomemBolha {

  constructor(
    x,
    y
  ) {

    this.x = x;

    this.y = y;

    this.vidaMax = 30;

    this.vida =
      this.vidaMax;

    this.passoAnimacao = 0;

    this.emoteTexto = "";

    this.emoteTempo = 0;

    this.tempoAtaque = 0;

    this.lado = -1;

  }


  dispararEmote(
    txt
  ) {

    this.emoteTexto =
      txt;

    this.emoteTempo =
      45;

  }


  atualizar(
    velCenario,
    jogador
  ) {

    let distancia =
      this.x -
      jogador.x;


    if (
      distancia < 200
    ) {

      this.x += 2;

    }

    else if (
      distancia > 320
    ) {

      this.x -= 1.5;

    }


    this.x =
      constrain(
        this.x,
        260,
        width - 50
      );


    this.passoAnimacao +=
      0.3;


    if (
      this.emoteTempo > 0
    ) {

      this.emoteTempo--;

    }


    this.tempoAtaque++;


    if (
      this.tempoAtaque % 70 === 0
    ) {

      bolhasInimigas.push(
        new BolhaAtaque(
          this.x - 20,
          this.y - 10
        )
      );


      this.dispararEmote(
        "🫧 TOMA BOLHA!"
      );

    }

  }


  desenhar() {

    push();

    translate(
      this.x,
      this.y
    );


    if (
      this.emoteTempo > 0
    ) {

      desenharEmotePersonagem(
        this.emoteTexto,
        0,
        -48 -
        (45 - this.emoteTempo) *
        0.5,
        color(
          0,
          100,
          200
        )
      );

    }


    desenharBarraChefe(
      this.vida,
      this.vidaMax,
      color(
        30,
        150,
        240
      )
    );


    desenharCorpoHomemBolha(
      this.lado,
      this.passoAnimacao
    );


    pop();

  }

}


// ======================================================
// BARRA DO CHEFE
// ======================================================

function desenharBarraChefe(
  vida,
  vidaMax,
  cor
) {

  fill(
    50
  );

  noStroke();

  rect(
    -20,
    -38,
    40,
    6,
    2
  );


  fill(
    cor
  );


  rect(
    -20,
    -38,
    map(
      vida,
      0,
      vidaMax,
      0,
      40
    ),
    6,
    2
  );

}


// ======================================================
// HOMEM BOLHA
// ======================================================

function desenharCorpoHomemBolha(
  lado,
  passo = 0
) {

  push();

  scale(
    lado,
    1
  );


  let a1 =
    sin(passo) * 0.7;

  let a2 =
    -sin(passo) * 0.7;


  // pernas
  strokeWeight(7);

  strokeCap(ROUND);

  stroke(
    10
  );


  push();

  rotate(
    a2
  );

  line(
    0,
    20,
    0,
    45
  );

  pop();


  push();

  rotate(
    a1
  );

  line(
    0,
    20,
    0,
    45
  );

  pop();


  // reservatório
  push();

  rotate(
    -0.3
  );

  fill(
    240,
    200,
    0
  );

  stroke(
    0
  );

  strokeWeight(1.5);


  rect(
    -22,
    -15,
    16,
    45,
    4
  );


  fill(
    200,
    30,
    30
  );

  rect(
    -22,
    -10,
    16,
    6
  );


  fill(
    20
  );

  rect(
    -22,
    -4,
    16,
    4
  );


  pop();


  // tronco
  fill(
    220,
    40,
    30
  );

  noStroke();

  ellipse(
    0,
    12,
    22,
    26
  );


  // articulações
  fill(
    30,
    130,
    240
  );

  circle(
    -8,
    18,
    10
  );


  fill(
    240,
    170,
    0
  );

  circle(
    8,
    18,
    10
  );


  // braço
  strokeWeight(5);

  stroke(
    10
  );


  push();

  rotate(
    -0.4
  );

  line(
    0,
    5,
    15,
    18
  );

  pop();


  // varinha
  push();

  stroke(
    30,
    150,
    240
  );

  strokeWeight(3);


  line(
    0,
    8,
    -18,
    -10
  );


  noFill();

  circle(
    -22,
    -14,
    12
  );


  fill(
    100,
    200,
    255,
    150
  );

  circle(
    -22,
    -14,
    10
  );


  pop();


  // cabeça
  fill(
    220,
    40,
    30
  );

  noStroke();

  circle(
    0,
    -12,
    22
  );


  // antena
  stroke(
    220,
    40,
    30
  );

  strokeWeight(4);

  line(
    0,
    -20,
    0,
    -28
  );


  fill(
    220,
    40,
    30
  );

  noStroke();

  circle(
    0,
    -30,
    8
  );


  // rosto
  fill(
    80,
    180,
    240
  );

  ellipse(
    0,
    -10,
    15,
    13
  );


  // olhos
  fill(
    10
  );

  ellipse(
    -3,
    -11,
    4,
    5
  );

  ellipse(
    3,
    -11,
    4,
    5
  );


  pop();

}


// ======================================================
// BOLHA
// ======================================================

class BolhaAtaque {

  constructor(
    x,
    y
  ) {

    this.x = x;

    this.y = y;

    this.vx =
      random(
        -6,
        -4
      );

    this.vy =
      random(
        -1.5,
        1.5
      );

    this.tamanho =
      random(
        22,
        32
      );

  }


  atualizar() {

    this.x +=
      this.vx;


    this.y +=
      this.vy +
      sin(
        frameCount * 0.1
      ) *
      0.8;

  }


  desenhar() {

    push();

    translate(
      this.x,
      this.y
    );


    fill(
      100,
      200,
      255,
      130
    );

    stroke(
      255
    );

    strokeWeight(2);


    circle(
      0,
      0,
      this.tamanho
    );


    fill(
      255,
      220
    );

    noStroke();


    circle(
      -this.tamanho * 0.2,
      -this.tamanho * 0.2,
      this.tamanho * 0.25
    );


    pop();

  }


  colide(
    jogador
  ) {

    return dist(
      this.x,
      this.y,
      jogador.x,
      jogador.y + 10
    ) <
      (
        this.tamanho / 2 +
        15
      );

  }

}


// ======================================================
// PROJÉTIL
// ======================================================

class ProjetilAtaque {

  constructor(
    x,
    y,
    tipo
  ) {

    this.x = x;

    this.y = y;

    this.tipo = tipo;

    this.velocidade = 9;

  }


  atualizar() {

    this.x +=
      this.velocidade;

  }


  desenhar() {

    push();

    translate(
      this.x,
      this.y
    );


    if (
      this.tipo === "IOIO"
    ) {

      fill(
        230,
        20,
        50
      );

      stroke(
        0
      );

      strokeWeight(1.5);

      circle(
        0,
        0,
        12
      );

    }

    else {

      fill(
        200
      );

      stroke(
        30
      );

      strokeWeight(2);

      rect(
        -12,
        -3,
        24,
        6,
        3
      );


      fill(
        50,
        220,
        80
      );

      noStroke();

      circle(
        0,
        0,
        3
      );

    }


    pop();

  }


  colideComInimigo(
    inimigo
  ) {

    return dist(
      this.x,
      this.y,
      inimigo.x,
      inimigo.y + 10
    ) < 25;

  }

}


// ======================================================
// AKUMA
// ======================================================

class AkumaOriginal {

  constructor() {

    this.x =
      width + 40;

    this.yBase =
      random(
        120,
        240
      );

    this.y =
      this.yBase;

    this.velocidade =
      random(
        2.0,
        3.5
      );

    this.offsetSeno =
      random(
        100
      );

  }


  atualizar(
    velCenario
  ) {

    this.x -=
      velCenario +
      this.velocidade;


    this.y =
      this.yBase +
      sin(
        millis() * 0.005 +
        this.offsetSeno
      ) *
      20;

  }


  desenhar() {

    push();

    translate(
      this.x,
      this.y
    );


    desenharBorboletaAkuma(
      sin(
        millis() * 0.015
      )
    );


    pop();

  }

}


// ======================================================
// BORBOLETA AKUMA
// ======================================================

function desenharBorboletaAkuma(
  fatorBateAsa
) {

  push();


  fill(
    180,
    50,
    255,
    90
  );

  noStroke();

  circle(
    0,
    0,
    30
  );


  let ab =
    map(
      fatorBateAsa,
      -1,
      1,
      4,
      18
    );


  fill(
    20,
    20,
    35
  );

  stroke(
    210,
    100,
    255
  );

  strokeWeight(1.5);


  ellipse(
    -ab / 2,
    -5,
    ab,
    16
  );

  ellipse(
    ab / 2,
    -5,
    ab,
    16
  );


  ellipse(
    -ab / 3,
    5,
    ab * 0.7,
    12
  );

  ellipse(
    ab / 3,
    5,
    ab * 0.7,
    12
  );


  fill(
    10
  );

  noStroke();

  ellipse(
    0,
    0,
    4,
    12
  );


  pop();

}


// ======================================================
// PARTÍCULA
// ======================================================

class Particula {

  constructor(
    x,
    y,
    cor = color(
      255,
      30,
      30
    )
  ) {

    this.x = x;

    this.y = y;

    this.vx =
      random(
        -3,
        3
      );

    this.vy =
      random(
        -3,
        3
      );

    this.opacidade =
      255;

    this.cor =
      cor;

  }


  atualizar() {

    this.x +=
      this.vx;

    this.y +=
      this.vy;

    this.opacidade -=
      15;

  }


  desenhar() {

    fill(
      red(this.cor),
      green(this.cor),
      blue(this.cor),
      this.opacidade
    );

    noStroke();

    circle(
      this.x,
      this.y,
      6
    );

  }

}


// ======================================================
// HUD
// ======================================================

function desenharHUD() {

  fill(
    0,
    170
  );

  noStroke();

  rect(
    15,
    15,
    250,
    60,
    10
  );


  // vida
  fill(
    255,
    30,
    30
  );


  rect(
    30,
    25,
    map(
      jogavel.vida,
      0,
      100,
      0,
      100
    ),
    10,
    5
  );


  noFill();

  stroke(
    255
  );

  strokeWeight(1);


  rect(
    30,
    25,
    100,
    10,
    5
  );


  noStroke();

  fill(
    255
  );

  textSize(14);

  textAlign(
    LEFT,
    CENTER
  );


  text(
    faseAtual === 1
      ? "🐞 Ladybug"
      : "🐾 Cat Noir",
    140,
    30
  );


  text(
    `✨ Pontos: ${pontos} | Fase: ${faseAtual}`,
    30,
    52
  );

}


// ======================================================
// TELA GAME OVER
// ======================================================

function desenharTelaGameOver() {

  fill(
    0,
    210
  );

  noStroke();

  rect(
    0,
    0,
    width,
    height
  );


  textAlign(
    CENTER,
    CENTER
  );


  fill(
    255,
    60,
    80
  );

  textSize(38);


  text(
    "OS VILÕES VENCERAM!",
    width / 2,
    height / 2 - 30
  );


  fill(
    255
  );

  textSize(18);


  text(
    `Pontos: ${pontos}`,
    width / 2,
    height / 2 + 15
  );


  text(
    "Clique ou pressione uma tecla para tentar novamente",
    width / 2,
    height / 2 + 55
  );

}


// ======================================================
// TELA DE VITÓRIA LADYBUG
// ======================================================

function desenharTelaVitoria() {

  // fundo vermelho
  for (
    let y = 0;
    y < height;
    y++
  ) {

    let inter =
      map(
        y,
        0,
        height,
        0,
        1
      );


    let cor =
      lerpColor(
        color(
          160,
          0,
          25
        ),
        color(
          255,
          40,
          70
        ),
        inter
      );


    stroke(
      cor
    );

    line(
      0,
      y,
      width,
      y
    );

  }


  // círculos pretos de joaninha
  noStroke();

  fill(
    0,
    35
  );


  circle(
    80,
    70,
    100
  );

  circle(
    620,
    90,
    130
  );

  circle(
    100,
    330,
    150
  );

  circle(
    620,
    340,
    110
  );


  // máscara central
  push();

  translate(
    width / 2,
    105
  );


  fill(
    20,
    20,
    30
  );

  ellipse(
    0,
    0,
    170,
    65
  );


  fill(
    255,
    40,
    55
  );

  ellipse(
    -42,
    0,
    58,
    35
  );

  ellipse(
    42,
    0,
    58,
    35
  );


  fill(
    0
  );

  circle(
    -50,
    0,
    10
  );

  circle(
    50,
    0,
    10
  );

  circle(
    0,
    -8,
    10
  );


  pop();


  // borboletas
  for (
    let i = 0;
    i < 8;
    i++
  ) {

    let bx =
      70 +
      i * 80;

    let by =
      190 +
      sin(
        frameCount * 0.03 +
        i
      ) *
      20;


    push();

    translate(
      bx,
      by
    );

    scale(
      0.6
    );

    desenharBorboletaAkuma(
      sin(
        frameCount * 0.1 +
        i
      )
    );

    pop();

  }


  // título
  fill(
    255
  );

  stroke(
    0
  );

  strokeWeight(5);

  textAlign(
    CENTER,
    CENTER
  );

  textSize(43);


  text(
    "VITÓRIA!",
    width / 2,
    225
  );


  // subtítulo
  fill(
    255,
    230,
    40
  );

  stroke(
    0
  );

  strokeWeight(3);

  textSize(23);


  text(
    "MIRACULOUS LADYBUG!",
    width / 2,
    265
  );


  // mensagem
  fill(
    255
  );

  noStroke();

  textSize(17);


  text(
    "Ladybug e Cat Noir salvaram Paris!",
    width / 2,
    305
  );


  text(
    `⭐ Pontuação final: ${pontos}`,
    width / 2,
    330
  );


  // botão
  fill(
    20,
    20,
    30
  );

  stroke(
    255,
    40,
    60
  );

  strokeWeight(3);


  rect(
    width / 2 - 130,
    350,
    260,
    35,
    12
  );


  fill(
    255
  );

  noStroke();

  textSize(14);


  text(
    "CLIQUE PARA JOGAR NOVAMENTE",
    width / 2,
    367
  );

}


// ======================================================
// CENÁRIO PÔR DO SOL
// ======================================================

function desenharCenarioParisPorDoSol() {

  for (
    let y = 0;
    y < 220;
    y++
  ) {

    let inter =
      map(
        y,
        0,
        220,
        0,
        1
      );


    let c =
      lerpColor(
        color(
          255,
          110,
          80
        ),
        color(
          255,
          200,
          120
        ),
        inter
      );


    stroke(
      c
    );

    line(
      0,
      y,
      width,
      y
    );

  }


  noStroke();

  fill(
    255,
    235,
    170,
    220
  );

  circle(
    350,
    180,
    120
  );


  desenharTorreEiffel(
    color(
      110,
      65,
      75
    )
  );


  desenharPredios(
    color(
      210,
      165,
      140
    ),
    color(
      195,
      150,
      125
    ),
    color(
      255,
      235,
      150
    )
  );

}


// ======================================================
// CENÁRIO NOITE
// ======================================================

function desenharCenarioParisNoite() {

  for (
    let y = 0;
    y < 220;
    y++
  ) {

    let inter =
      map(
        y,
        0,
        220,
        0,
        1
      );


    let c =
      lerpColor(
        color(
          10,
          15,
          35
        ),
        color(
          25,
          30,
          65
        ),
        inter
      );


    stroke(
      c
    );

    line(
      0,
      y,
      width,
      y
    );

  }


  noStroke();

  fill(
    255,
    255,
    200,
    180
  );


  randomSeed(42);


  for (
    let i = 0;
    i < 40;
    i++
  ) {

    let ex =
      random(
        width
      );

    let ey =
      random(
        180
      );


    circle(
      ex,
      ey,
      random(
        1,
        3
      )
    );

  }


  fill(
    240,
    240,
    255,
    230
  );

  circle(
    550,
    80,
    70
  );


  fill(
    220,
    220,
    240,
    120
  );

  circle(
    535,
    75,
    15
  );

  circle(
    560,
    90,
    20
  );


  desenharTorreEiffel(
    color(
      20,
      25,
      45
    )
  );


  desenharPredios(
    color(
      25,
      30,
      50
    ),
    color(
      20,
      25,
      40
    ),
    color(
      255,
      220,
      100
    )
  );

}


// ======================================================
// TORRE EIFFEL
// ======================================================

function desenharTorreEiffel(
  corTorre
) {

  let tx = 350;


  push();

  stroke(
    corTorre
  );

  strokeWeight(2);

  noFill();


  arc(
    tx,
    190,
    40,
    30,
    PI,
    TWO_PI
  );


  line(
    tx - 30,
    190,
    tx - 18,
    140
  );

  line(
    tx + 30,
    190,
    tx + 18,
    140
  );


  strokeWeight(3.5);

  line(
    tx - 22,
    140,
    tx + 22,
    140
  );


  strokeWeight(1.5);

  line(
    tx - 18,
    140,
    tx - 10,
    80
  );

  line(
    tx + 18,
    140,
    tx + 10,
    80
  );


  strokeWeight(3);

  line(
    tx - 12,
    80,
    tx + 12,
    80
  );


  strokeWeight(1.5);

  line(
    tx - 8,
    80,
    tx - 2,
    20
  );

  line(
    tx + 8,
    80,
    tx + 2,
    20
  );

  line(
    tx,
    20,
    tx,
    5
  );


  pop();

}


// ======================================================
// PRÉDIOS
// ======================================================

function desenharPredios(
  corP1,
  corP2,
  corJanela
) {

  push();


  let posCenario =
    xCenario % 400;


  for (
    let x = posCenario - 400;
    x < width + 400;
    x += 200
  ) {

    noStroke();


    fill(
      corP1
    );

    rect(
      x,
      175,
      90,
      135
    );


    fill(
      corJanela
    );


    for (
      let jx = x + 15;
      jx < x + 80;
      jx += 25
    ) {

      for (
        let jy = 190;
        jy < 290;
        jy += 30
      ) {

        rect(
          jx,
          jy,
          12,
          18,
          2
        );

      }

    }


    fill(
      corP2
    );

    rect(
      x + 95,
      185,
      95,
      125
    );


    fill(
      corJanela
    );


    for (
      let jx = x + 110;
      jx < x + 180;
      jx += 25
    ) {

      for (
        let jy = 200;
        jy < 290;
        jy += 28
      ) {

        rect(
          jx,
          jy,
          12,
          16,
          2
        );

      }

    }


    fill(
      40,
      35,
      50
    );


    quad(
      x - 2,
      175,
      x + 15,
      150,
      x + 75,
      150,
      x + 92,
      175
    );


    quad(
      x + 93,
      185,
      x + 105,
      165,
      x + 180,
      165,
      x + 192,
      185
    );

  }


  pop();


  fill(
    50,
    50,
    60
  );

  rect(
    0,
    310,
    width,
    90
  );


  fill(
    30,
    30,
    40
  );

  rect(
    0,
    310,
    width,
    12
  );

}
