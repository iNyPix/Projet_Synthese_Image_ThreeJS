
const borneVue = 50;//amplitude de deplacement de la camera

let coef = 1;
let x = 18;
let y = 18;
let origine = new THREE.Vector3(0, 0, 0);
let H2 = new THREE.Vector3(0, 0, 0);
let ptLachee = new THREE.Vector3(-10.9725, 0, 0.125);

let P0 = new THREE.Vector3(-21.0335, 0, 0);
let P1 = new THREE.Vector3(-9.86, 0.76, 0);
let P2 = new THREE.Vector3(0, 1.29, 0);
let P3 = new THREE.Vector3(18, 0, 0);

let M0 = new THREE.Vector3(-21.0335, 0, 0);
let M1 = new THREE.Vector3(-21.0335, 0, 0);
let M2 = new THREE.Vector3(6, 4, 0);
let M3 = new THREE.Vector3(18, 0, 0);

var thetap = 0;
var thetap2 = 0;
var thetap3 = 0;
var pasThetaP3 = 0.25;
var angle = 0
const angleRotationPierre = Math.PI / 12;
var s = false;

let cbeBez;
let cbeBezT;
let cbeBezP;
let cbeBezP2;

let nbPts = 50;
let epaiB = 3;//epaisseur de la courbe de Bezier

var Scorefushia = 0;
var ScoreTurquoise = 0;



function init() {
  var stats = initStats();
  // creation de rendu et de la taille
  let rendu = new THREE.WebGLRenderer({ antialias: true });
  rendu.shadowMap.enabled = true;
  let scene = new THREE.Scene();
  let camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 0.1, 100);
  rendu.shadowMap.enabled = true;
  rendu.setClearColor(new THREE.Color(0xFFFFFF));
  rendu.setSize(window.innerWidth * .9, window.innerHeight * .9);
  cameraLumiere(scene, camera);
  lumiere(scene);


  var ambientLight = new THREE.AmbientLight(0x222222);
  scene.add(ambientLight);

  var pointLight = new THREE.PointLight(0x222222);
  camera.add(pointLight);
  scene.add(camera);


  var axes = new THREE.AxesHelper(1);
  scene.add(axes);


  var controls = new THREE.OrbitControls(camera, rendu.domElement); //contrôles à la souris
  //const controls = new THREE.OrbitControls( camera, renderer.domElement );
  controls.target.set(0, 0.5, 0);
  controls.update();
  controls.enablePan = false;
  controls.enableDamping = true;

  //********************************************************
  //
  //  D E B U T    P A R T I E     G E O M E T R I Q U E
  //
  //********************************************************

  const PlanSolGeometry = new THREE.PlaneGeometry(45.720, 4.750, 30, 30);
  const PlanSolMaterial = new THREE.MeshPhongMaterial({ color: '#F2EBEA' });
  let PlanSol = new THREE.Mesh(PlanSolGeometry, PlanSolMaterial);
  PlanSol.position.z = -0.0001;
  PlanSol.receiveShadow = true;
  PlanSol.castShadow = true;
  scene.add(PlanSol);

  let b = balais(0xFF0000);
  scene.add(b);
  b.position.set(0,0,0);
  
  let m = maison();
  scene.add(m);
  m.position.set(17.3735,0,0.1);


  //traçage des lignes du terrain
  var ligne1 = traceRectangle(0.20, 4.750, '#0A40E9', 19.2035);
  scene.add(ligne1);
  var ligne2 = traceRectangle(0.02, 4.750, '#000000', 17.3735);
  scene.add(ligne2);
  var ligne3 = traceRectangle(0.20, 4.750, '#0A40E9', -19.2035);
  scene.add(ligne3);
  var ligne4 = traceRectangle(0.02, 4.750, '#000000', -17.3735);
  scene.add(ligne4);
  var ligne5 = traceRectangle(0.20, 4.750, '#E92A0A', 10.9725);
  scene.add(ligne5);
  var ligne6 = traceRectangle(0.20, 4.750, '#E92A0A', -10.9725);
  scene.add(ligne6);
  var ligne7 = traceRectangle(21.0335 * 2, 0.02, '#000000', 0);
  scene.add(ligne7);

  // ajout des pierres
  var stone1 = stone("#c5c3c2","#FF00FF");
  scene.add(stone1);

  var stone2 = stone("#c5c3c2","#00FFFF");
  scene.add(stone2);


  //courbes de Bézier modélisant le déplaçement des pierres
  cbeBezP = new THREE.CubicBezierCurve(P0, P1, P2, P3);
  let pointsP = new Array(100);
  for (var i = 0; i < pointsP.length; i++) {
    pointsP[i] = cbeBezP.getPoint(i / pointsP.length);
  }


  cbeBezT = new TraceBezierQuadratique(M0, M1, M3, nbPts, "#0000FF", epaiB);
  cbeBez = new THREE.QuadraticBezierCurve3(M0, M2, M3);
  let pointsP1 = new Array(100); // Tableau de points courbe 1
  for (var i = 0; i < pointsP1.length; i++) {
    pointsP1[i] = cbeBez.getPoint(i / pointsP1.length);
  }
  
  let pointsP2 = new Array(100); // Tableau de points courbe 2
  for (var i = 0; i < pointsP2.length; i++) {
    pointsP2[i] = cbeBez.getPoint(i / pointsP2.length);
  }
  //********************************************************
  //
  // F I N      P A R T I E     G E O M E T R I Q U E
  //
  //********************************************************


  //********************************************************
  //
  // D E B U T     P A R T I E     A N I M A T I O N
  //
  //********************************************************

  function reAffichage() {
    setTimeout(function () {
      if (stone1) scene.remove(stone1);
      if (stone2) scene.remove(stone2);
      if (thetap < 200) {
        stone1.position.set(pointsP1[thetap].x, pointsP1[thetap].y, 0.125);
        thetap++
        if (stone1.position.x > -10.9725) {
          stone1.rotateY(angle * angleRotationPierre);
          angle++
        }
        scene.add(stone1);
        reAffichage();
      }
      else {
        if (choc(stone1, stone2) == false && s == false) {
          if (thetap2 < 200) {
            stone2.position.set(pointsP2[thetap2].x, pointsP2[thetap2].y, 0.125);
            thetap2++
            if (stone2.position.x > -10.9725) {
              stone2.rotateY(angle * angleRotationPierre);
              angle++
            }
            scene.add(stone2);
            scene.add(stone1);
            reAffichage();
          }
        }
        else {
          s = true;
          stone2.position.set(pointsP2[thetap2].x, pointsP2[thetap2].y, 0.125);
          scene.add(stone2);
          if (thetap3 < 3) {
            thetap3 += pasThetaP3;
            stone1.position.x += thetap3;
            stone1.rotateY(angle * angleRotationPierre);
            thetap3++
            angle++
            scene.add(stone1);
            reAffichage();
          }
        }
      }

    }, 200);// fin setTimeout(function ()
    // render avec requestAnimationFrame
    rendu.render(scene, camera);
  }// fin fonction reAffichage()


  document.getElementById("ScoreFushia").innerHTML = ScoreFushia;
  document.getElementById("ScoreTurquoise").innerHTML = ScoreTurquoise;

  //********************************************************
  //
  // F I N     P A R T I E     A N I M A T I O N
  //
  //********************************************************


  //********************************************************
  //
  //  D E B U T     M E N U     G U I
  //
  //********************************************************
  var gui = new dat.GUI();//interface graphique utilisateur
  // ajout du menu dans le GUI
  let menuGUI = new function () {
    this.cameraxPos = camera.position.x;
    this.camerayPos = camera.position.y;
    this.camerazPos = camera.position.z;
    this.cameraZoom = 1;
    //pb avec camera lockAt
    this.cameraxDir = 0;
    this.camerayDir = 0;
    this.camerazDir = 0;
    this.coefficient = 1;
    this.x = 1;
    this.y = 1;

    //pour actualiser dans la scene   
    this.actualisation = function () {
      posCamera();
      reAffichage();
    }; 
  }; 
  ajoutCameraGui(gui, menuGUI, camera);

  let menuAnim = gui.addFolder("Animation");
  menuAnim.open();
  let guiP1 = menuAnim.addFolder("Trajectoire Pierre Fushia");
  guiP1.add(menuGUI, "x", 10, 21).onChange(function () {
    M3.x = menuGUI.x;
    if (cbeBezT) scene.remove(cbeBezT);
    cbeBezT = new TraceBezierQuadratique(M0, H2, M3, nbPts, "#0000FF", epaiB);
    cbeBez = new THREE.QuadraticBezierCurve3(M0, H2, M3);
    scene.add(cbeBezT);
  });

  guiP1.add(menuGUI, "y", -4, 4).onChange(function () {
    M3.y = menuGUI.y;
    if (cbeBezT) scene.remove(cbeBezT);
    cbeBezT = new TraceBezierQuadratique(M0, H2, M3, nbPts, "#0000FF", epaiB);
    cbeBez = new THREE.QuadraticBezierCurve3(M0, H2, M3);
    scene.add(cbeBezT);
  });


  guiP1.add(menuGUI, "coefficient", -2, 1).onChange(function () {
    let xPos1 = pointsP1[thetap].x;
    let vMmM0 = new THREE.Vector3(0, 0, 0);
    let vTan1 = new THREE.Vector3(0, 0, 0);
    vMmM0.subVectors(M0, ptLachee);
    vTan1.addScaledVector(vMmM0, menuGUI.coefficient);
    H2.addVectors(vTan1, M2);
    if (cbeBezT) scene.remove(cbeBezT);
    cbeBezT = new TraceBezierQuadratique(M0, H2, M3, nbPts, "#0000FF", epaiB);
    cbeBez = new THREE.QuadraticBezierCurve3(M0, H2, M3);
    for (var i = 0; i < 200; i++) {
      pointsP1[i] = cbeBez.getPoint(i / 200);
    }
    thetap = adapt(xPos1, pointsP1);
    scene.add(cbeBezT);

  });

  let guiP2 = menuAnim.addFolder("Trajectoire Pierre Turquoise");
  guiP2.add(menuGUI, "x", 10, 21).onChange(function () {
    M3.x = menuGUI.x;
    if (cbeBezT) scene.remove(cbeBezT);
    cbeBezT = new TraceBezierQuadratique(M0, H2, M3, nbPts, "#0000FF", epaiB);
    cbeBez = new THREE.QuadraticBezierCurve3(M0, H2, M3);
    scene.add(cbeBezT);
  });

  guiP2.add(menuGUI, "y", -4, 4).onChange(function () {
    M3.y = menuGUI.y;
    if (cbeBezT) scene.remove(cbeBezT);
    cbeBezT = new TraceBezierQuadratique(M0, H2, M3, nbPts, "#0000FF", epaiB);
    cbeBez = new THREE.QuadraticBezierCurve3(M0, H2, M3);
    scene.add(cbeBezT);
  });

  guiP2.add(menuGUI, "coefficient", -2, 1).onChange(function () {
    let xPos2 = pointsP2[thetap2].x;
    let vMmM0 = new THREE.Vector3(0, 0, 0);
    let vTan1 = new THREE.Vector3(0, 0, 0);
    vMmM0.subVectors(M0, ptLachee);
    vTan1.addScaledVector(vMmM0, menuGUI.coefficient);
    H2.addVectors(vTan1, M2);
    if (cbeBezT) scene.remove(cbeBezT);
   

    cbeBezT = new TraceBezierQuadratique(M0, H2, M3, nbPts, "#0000FF", epaiB);
    cbeBez = new THREE.QuadraticBezierCurve3(M0, H2, M3);
    for (var i = 0; i < 200; i++) {
      pointsP2[i] = cbeBez.getPoint(i / 200);
    }
    thetap2 = adapt(xPos2, pointsP2);
    scene.add(cbeBezT);

  });

  gui.add(menuGUI, "actualisation");
  menuGUI.actualisation();
  //********************************************************
  //
  //  F I N     M E N U     G U I
  //
  //********************************************************
  renduAnim();

  // definition des fonctions idoines
  function posCamera() {
    camera.position.set(menuGUI.cameraxPos * testZero(menuGUI.cameraZoom), menuGUI.camerayPos * testZero(menuGUI.cameraZoom), menuGUI.camerazPos * testZero(menuGUI.cameraZoom));
    camera.lookAt(menuGUI.cameraxDir, menuGUI.camerayDir, menuGUI.camerazDir);
    actuaPosCameraHTML();
  }

  //affichage dans la page HTML
  function actuaPosCameraHTML() {
    document.forms["controle"].PosX.value = testZero(menuGUI.cameraxPos);
    document.forms["controle"].PosY.value = testZero(menuGUI.camerayPos);
    document.forms["controle"].PosZ.value = testZero(menuGUI.camerazPos);
    document.forms["controle"].DirX.value = testZero(menuGUI.cameraxDir);
    document.forms["controle"].DirY.value = testZero(menuGUI.camerayDir);
    document.forms["controle"].DirZ.value = testZero(menuGUI.camerazDir);
  } // fin fonction posCamera
  // ajoute le rendu dans l'element HTML
  renduAnim();


  // ajoute le rendu dans l'element HTML
  document.getElementById("webgl").appendChild(rendu.domElement);

  // affichage de la scene
  rendu.render(scene, camera);

  function renduAnim() {
    stats.update();
    // render avec requestAnimationFrame
    requestAnimationFrame(renduAnim);
    // ajoute le rendu dans l'element HTML
    rendu.render(scene, camera);
  }

}// fin fonction init()