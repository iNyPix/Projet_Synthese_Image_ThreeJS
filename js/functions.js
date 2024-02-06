//********************************************************
//
//            F O N C T I O N    M A T H S
//
//********************************************************

const PrecisionArrondi = 50;
const epsilon = 0.00000001;
function testZero(x) { // test si un nombre est nul
  var val = parseFloat(Number(x).toPrecision(PrecisionArrondi));
  if (parseFloat(Math.abs(x).toPrecision(PrecisionArrondi)) < epsilon) val = 0;
  return val;
}

function surfPhong(geom, coulD, transpa, bolTrans, coulSpe) { // primitive avec Phong
  let Material = new THREE.MeshPhongMaterial({
    color: coulD,
    opacity: transpa,
    transparent: bolTrans,
    //     wireframe: false,
    specular: coulSpe,
    flatShading: true,
    side: THREE.DoubleSide,
  });
  let maillage = new THREE.Mesh(geom, Material);
  return maillage;
}

function fact(n) { // Factorielle recursive
  if (n > 1)
    return n * fact(n - 1);
  else return 1;
}

function Ber(t1, i, n) { // I DONT NOW WHAT IT IS ????
  var val = 0;
  switch (i) {
    case 0: val = Math.pow(1. - t1, n);
      break;
    case n: val = Math.pow(t1, n);
      break;
    default: val = (fact(n) / fact(i) / fact(n - i) * Math.pow(1. - t1, n - i) * Math.pow(t1, i));
  }
  val = testZero(val);
  return val.toPrecision(PrecisionArrondi);
}

function TraceBezierQuadratique(P0, P1, P2, nbPts, coul, epaiCbe) {
  let cbeBez = new THREE.QuadraticBezierCurve3(P0, P1, P2);
  let cbeGeometry = new THREE.Geometry();
  cbeGeometry.vertices = cbeBez.getPoints(nbPts);
  let material = new THREE.LineBasicMaterial(
    {
      color: coul,
      linewidth: epaiCbe
    });
  let BezierQuadratique = new THREE.Line(cbeGeometry, material);
  return (BezierQuadratique);
}

function traceRectangle(l, L, color, decalOrX) {  // Bande du
  const geometry = new THREE.PlaneGeometry(l, L);
  const material = new THREE.MeshPhongMaterial({ color: color });
  const rectangle = new THREE.Mesh(geometry, material);
  rectangle.position.x = decalOrX;
  return rectangle
}

function latheBez3(nbePtCbe, nbePtRot, P0, P1, P2, P3, coul, opacite, bolTranspa) {
  let p0 = new THREE.Vector2(P0.x, P0.y);
  let p1 = new THREE.Vector2(P1.x, P1.y);
  let p2 = new THREE.Vector2(P2.x, P2.y);
  let p3 = new THREE.Vector2(P3.x, P3.y);
  let tabp = new Array(4);
  for (let j = 0; j < tabp.length; j++)
    tabp[j] = new THREE.Vector2(0, 0);
  tabp[0].copy(p0); tabp[1].copy(p1);
  tabp[2].copy(p2); tabp[3].copy(p3);
  // points de la courbe de Bezier
  let points = new Array(nbePtCbe + 1);
  for (let k = 0; k <= (nbePtCbe + 1); k++) {
    let t2 = k / nbePtCbe;
    t2 = t2.toPrecision(50);
    let v0 = new THREE.Vector2(0, 0);
    v0.addScaledVector(tabp[0], Ber(t2, 0, tabp.length - 1));
    for (let j = 1; j < tabp.length; j++) {
      let v1 = new THREE.Vector2(0, 0);
      v1.addScaledVector(tabp[j], Ber(t2, j, tabp.length - 1));
      v0.add(v1);
    }
    points[k] = new THREE.Vector2(v0.x, v0.y);
  }
  let latheGeometry = new THREE.LatheGeometry(points, nbePtRot, 0, 2 * Math.PI);
  let lathe = surfPhong(latheGeometry, coul, opacite, bolTranspa, "#223322");
  return lathe;
}

// Fonctions geometries

function terrain(largPlan, hautPlan, nbSegmentLarg, nbSegmentHaut) {
  const terrainGeometry = new THREE.PlaneGeometry(largPlan, hautPlan, nbSegmentLarg, nbSegmentHaut);
  const terrainMaterial = new THREE.MeshPhongMaterial({ color: '#F2EBEA' });
  let terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);
  terrain.position.z = -0.0001;
  terrain.receiveShadow = true;
  terrain.castShadow = true;
  return terrain;
}

function maison() {


  const geometryW1 = new THREE.RingGeometry(0, 0.5, 30);
  const materialW1 = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, side: THREE.DoubleSide });
  const W1 = new THREE.Mesh(geometryW1, materialW1);

  const geometryR1 = new THREE.RingGeometry(0.5, 1, 30);
  const materialR1 = new THREE.MeshBasicMaterial({ color: 0xFF0000, side: THREE.DoubleSide });
  const R1 = new THREE.Mesh(geometryR1, materialR1);

  const geometryW2 = new THREE.RingGeometry(1, 1.5, 30);
  const materialW2 = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, side: THREE.DoubleSide });
  const W2 = new THREE.Mesh(geometryW2, materialW2);

  const geometryB1 = new THREE.RingGeometry(1.5, 2, 30);
  const materialB1 = new THREE.MeshBasicMaterial({ color: 0x0000FF, side: THREE.DoubleSide });
  const B1 = new THREE.Mesh(geometryB1, materialB1);

  W1.position.set(0, 0, 0);
  R1.position.set(0, 0, 0);
  W2.position.set(0, 0, 0);
  B1.position.set(0, 0, 0);

  let m = new THREE.Group();
  m.add(W1, R1, W2, B1);

  return m;
}



function stone(CoulPierre, CoulEquipe) { // Pierre (couleur pierre, couleur equipe)
  let coef = 1;
  let origine = new THREE.Vector3(0, 0, 0);
  let P0 = new THREE.Vector3(0, 0.141, 0);
  let P1 = new THREE.Vector3(0.16, 0.141, 0);
  let P2 = new THREE.Vector3(0.33, 0.2005, 0);
  let P3 = new THREE.Vector3(0.33, 0.0730, 0);
  let M0 = new THREE.Vector3(P3.x, P3.y, 0);
  let M1 = new THREE.Vector3(0, 0, 0);
  let M2 = new THREE.Vector3(0.33, 0.1389, 0);
  let M3 = new THREE.Vector3(0.33, 0.0200, 0);
  let I0 = new THREE.Vector3(M3.x, M3.y, 0);
  let I1 = new THREE.Vector3(0, 0, 0);
  let I2 = new THREE.Vector3(0, -0.1, 0);
  let I3 = new THREE.Vector3(0, -0.125, 0);
  let vP2P3 = new THREE.Vector3(0, 0, 0);
  let vTan2 = new THREE.Vector3(0, 0, 0);

  vP2P3.subVectors(P3, P2);//P3-P2
  vTan2.addScaledVector(vP2P3, coef);
  M1.addVectors(M0, vTan2);

  vP2P3.subVectors(M3, M2);//P3-P2
  vTan2.addScaledVector(vP2P3, coef);
  I1.addVectors(I0, vTan2);

  let nb = 100;//nmbre de pts par courbe
  let epai = 4;//epaisseur de la courbe
  let nbPtCB = 50;//nombre de points sur la courbe de Bezier
  let nbePtRot = 150;// nbe de points sur les cercles

  let lathe1 = latheBez3(nbPtCB, nbePtRot, P0, P1, P2, P3, CoulPierre, 0.95, false);
  let lathe2 = latheBez3(nbPtCB, nbePtRot, M0, M1, M2, M3, CoulEquipe, 0.95, false);
  let lathe3 = latheBez3(nbPtCB, nbePtRot, I0, I1, I2, I3, CoulPierre, 0.95, false);


  var stone = new THREE.Object3D();
  stone.add(lathe1, lathe2, lathe3)

  stone.rotateX(Math.PI / 2);
  stone.position.z = 0.125;

  return stone;
}

function choc(stone1, stone2) {
  if (Math.sqrt(Math.pow(stone2.position.x - stone1.position.x, 2) + Math.pow(stone2.position.y - stone1.position.y, 2)) <= 0.7)
    return true;

  else
    return false;
}


function adapt(xPos, new_cbeBez) {
  var n = 0;
  for (var i = 0; i < 200; i++) {
    if (Math.abs(new_cbeBez[i].xPos) < 0.1) {
      n = i;
    }
  }
  return n;
}

function balais(couleur) {

  // Manche du balais
  let materialPhongManche = new THREE.MeshPhongMaterial({
    color: 0xFFFFFF,
    opacity: 0.5,
    transparent: false,
    wireframe: false,
    side: THREE.DoubleSide,
  });

  let m = new THREE.CylinderGeometry(0.05, 0.05, 1.5, 50, 1, true, 0, 2 * Math.PI);
  let manche = new THREE.Mesh(m, materialPhongManche);
  manche.rotation.x = Math.PI / 2;
  manche.position.set(-20.2, 0, 1);


  // Embout du balais
  let materialPhongEmbout = new THREE.MeshPhongMaterial({
    color: couleur,
    opacity: 0.5,
    transparent: false,
    wireframe: false,
    side: THREE.DoubleSide,
  });
  let box1 = new THREE.BoxGeometry(.5, .2, .2);
  let embout = new THREE.Mesh(box1, materialPhongEmbout);
  embout.rotation.z = -Math.PI / 2;
  embout.position.set(-20.2, 0, 0.2);



  // Poils du balais
  let cone = new THREE.ConeGeometry(0.05, 0.2, 32);
  let material = new THREE.MeshBasicMaterial({ color: 0x000000 });
  let poil1 = new THREE.Mesh(cone, material);
  poil1.rotation.x = -Math.PI / 2;
  poil1.position.set(-20.2, 0, 0.1)


  let cone1 = new THREE.ConeGeometry(0.05, 0.2, 32);
  let material1 = new THREE.MeshBasicMaterial({ color: 0x000000 });
  let poil2 = new THREE.Mesh(cone1, material1);
  poil2.rotation.x = -Math.PI / 2;
  poil2.position.set(-20.2, -0.05, 0.1)


  let cone2 = new THREE.ConeGeometry(0.05, 0.2, 32);
  let material2 = new THREE.MeshBasicMaterial({ color: 0x000000 });
  let poil3 = new THREE.Mesh(cone2, material2);
  poil3.rotation.x = -Math.PI / 2;
  poil3.position.set(-20.2, -0.1, 0.1)


  let cone3 = new THREE.ConeGeometry(0.05, 0.2, 32);
  let material3 = new THREE.MeshBasicMaterial({ color: 0x000000 });
  let poil4 = new THREE.Mesh(cone3, material3);
  poil4.rotation.x = -Math.PI / 2;
  poil4.position.set(-20.2, -0.15, 0.1)


  let cone4 = new THREE.ConeGeometry(0.05, 0.2, 32);
  let material4 = new THREE.MeshBasicMaterial({ color: 0x000000 });
  let poil5 = new THREE.Mesh(cone4, material4);
  poil5.rotation.x = -Math.PI / 2;
  poil5.position.set(-20.2, 0.05, 0.1)


  let cone5 = new THREE.ConeGeometry(0.05, 0.2, 32);
  let material5 = new THREE.MeshBasicMaterial({ color: 0x000000 });
  let poil6 = new THREE.Mesh(cone5, material5);
  poil6.rotation.x = -Math.PI / 2;
  poil6.position.set(-20.2, 0.1, 0.1)

  let cone6 = new THREE.ConeGeometry(0.05, 0.2, 32);
  let material6 = new THREE.MeshBasicMaterial({ color: 0x000000 });
  let poil7 = new THREE.Mesh(cone6, material6);
  poil7.rotation.x = -Math.PI / 2;
  poil7.position.set(-20.2, 0.15, 0.1)

  let balais = new THREE.Group();
  balais.add(manche, embout, poil1, poil2, poil3, poil4, poil5, poil6, poil7);

  return balais;
}