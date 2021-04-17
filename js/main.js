const img = document.getElementById('start-img');
const imageFile = document.getElementById('imageFile');

const titulo = document.getElementById("titulo");
titulo.value = "";

const mensaje = document.getElementById("mensaje");
mensaje.value = "";

const nombres = document.getElementById("nombres");
nombres.value = "";
const colorNombre = document.getElementById("colorNombre");

var selectedText = -1;
var offsetX = 0;
var offsetX = 0;

let textos = [
    {
        texto: '',
        x: 0,
        y: 0,
    },
    {
        texto: '',
        x: 0,
        y: 0,
    },
    {
        texto: '',
        x: 0,
        y: 0,
    }
];

const opacidad = document.getElementById("opacidad");

const color = document.getElementById("color");
const colorTitulo = document.getElementById("colorTitulo");
const colorMensaje = document.getElementById("colorMensaje");
const escala = document.getElementById("escala");

const titleFont = document.getElementById("titleFont");
var fuenteTitulo = "Courier";

const msgFont = document.getElementById("msgFont");
var fuenteMensaje = "Courier";

const namesFont = document.getElementById("namesFont");
var fuenteNombres = "Courier";

const canvas = document.getElementById('birthday');
const ctx = canvas.getContext("2d");

const imagen = new Image();

//Iniciar valores por defecto del canvas.
initCanvas();

//EventListeners para vigilar los click e inputs.
imageFile.addEventListener("change", handleImage);

titulo.addEventListener("keyup", () => {
    textos[0].texto = titulo.value;
    render();
});
mensaje.addEventListener("keyup", () => {
    textos[2].texto = mensaje.value;
    render();
});
nombres.addEventListener("keyup", () => {
    textos[1].texto = nombres.value;
    render();
});

opacidad.addEventListener("input", render);

color.addEventListener("change", render);
colorTitulo.addEventListener("change", render);
colorMensaje.addEventListener("change", render);
escala.addEventListener("input", render);
document.getElementById("descargar").addEventListener("click", descargar);

titleFont.addEventListener('change', (event) => {
    fuenteTitulo = event.target.value;
    render();
});
msgFont.addEventListener('change', (event) => {
    fuenteMensaje = event.target.value;
    render();
});
namesFont.addEventListener('change', (event) => {
    fuenteNombres = event.target.value;
    render();
});

colorNombre.addEventListener("change", render);

//Creamos nuevos Listeners :D
canvas.addEventListener('mousedown', handleMouseDown);
canvas.addEventListener('mousemove', handleMouseMove);
canvas.addEventListener('mouseup', handleMouseUp);
canvas.addEventListener('mouseout', handleMouseOut);

/*******************+/
/******Fnciones******/
/********************/
function initCanvas() {
    let deviceWidth = window.innerWidth;
    canvasWidth = Math.min(450, deviceWidth - 20);
    canvasHeight = Math.min(480, deviceWidth - 20);

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    //Iniciamos las posiciones de X y Y de nuestro objeto de Nombre.
    textos[0].x =  (canvas.width/2)-8;
    textos[0].y =  50;

    textos[1].x =  canvas.width/2;
    textos[1].y =  canvas.height/2;

    textos[2].x =  canvas.width/2;
    textos[2].y =  canvas.height - 75;
    offsetX = canvas.offsetLeft;
    offsetY = canvas.offsetTop;
    //Colocamos el fondo del color por defecto, que sera e gris.
    drawBackground();

    //Ejecutamos una funcion cuando la imagen esta cargada al 100%
    img.onload = function() {
        scaleToFill(this);
        imagen.src = '../img/default.jpg';
    }
    img.onerror = function() {
        console.log("Error al cargar la imagen por defecto.");
    }
}
function drawBackground() {
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = color.value ? color.value:'#d6d6d6';
    ctx.fill();
}
function scaleToFill(img){
    //Obtenemos una ecala segun el ancho y alto del canvas y la imagen.
    //Esta escala la usamos para hacer que la imagen cambie al tamaño del canvas.
    let scale = Math.max(canvas.width / img.width, canvas.height / img.height) * escala.value;

    //Usamos el tamaño del canvas y de la imagen para
    //obtener la posicion 'X' y 'Y' para que quede centrada.
    let x = (canvas.width / 2) - (img.width / 2) * scale;
    let y = (canvas.height / 2) - (img.height / 2) * scale;
    
    // Dibujamos la imagne en el canvas.
    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
}
async function handleImage(e) {
    let file = e.target.files[0];
    const result = await toBase64(file).catch(e => Error(e));
    if(result instanceof Error) {
        console.log('Error: ', result.message);
        return;
    }
    imagen.src = result;
    imagen.onload = () => {
        render();
    };
}
function toBase64(file){
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}
function render() {
    drawBackground();
    drawImage();
    drawText("top", (canvas.width/2)-8, 50);
    drawText("bottom", canvas.width/2, canvas.height - 75);
    drawText("middle", canvas.width/2, canvas.height/2);
}
function drawImage() {
    ctx.save();
    ctx.globalAlpha = opacidad.value;
    scaleToFill(imagen);
    ctx.globalAlpha = 1;
    ctx.restore();
}
function drawText(text, positionX, positionY) {
    ctx.fillStyle = "white";
    ctx.font = "17pt Courier";
    
    ctx.lineWidth  = 5;
    ctx.strokeStyle = 'black';
    ctx.textAlign = 'center';
    ctx.lineJoin = 'round';

    // Cambiamos nuestra variable 'top' para que haga salto de linea automatico.
    const top = saltosDeLinea(textos[0].texto).map((linea) => Object.assign({}, {
        text: `${linea}`,
        font: `bolder 17pt ${fuenteTitulo}`,
        fillStyle: colorTitulo.value
    }));

    const bottom = saltosDeLinea(textos[2].texto).map((linea, index) => Object.assign({}, {
        text: `${linea}`,
        font: `bolder 17pt ${fuenteMensaje}`,
        fillStyle: colorMensaje.value
    }));

    //Variable "middle" para mostrar los nombres en el medio.
    const middle = saltosDeLinea(textos[1].texto).map((linea, index) => Object.assign({}, {
        text: `${linea}`,
        font: `bolder 17pt ${fuenteNombres}`,
        fillStyle: colorNombre.value
    }));

    let position = [];
    switch (text) {
        case 'top':
            position = top;
            positionX = textos[0].x;
            positionY = textos[0].y;
            break;
        case 'bottom':
            position = bottom;
            positionX = textos[2].x;
            positionY = textos[2].y;
            break;
        case 'middle':
            position = middle;
            positionX = textos[1].x;
            positionY = textos[1].y;
            break;
    }

    fillMixedText(ctx, position, positionX, positionY);
}
function fillMixedText(ctx, args, x, y) {
    let defaultFillStyle = ctx.fillStyle;
    let defaultFont = ctx.font;

    ctx.save();
    args.forEach(({
        text,
        fillStyle,
        font
    }) => {
        ctx.fillStyle = fillStyle || defaultFillStyle;
        ctx.font = font || defaultFont;
        

        ctx.strokeText(text, x, y);
        ctx.fillText(text, x, y);

        y += ctx.measureText(text).actualBoundingBoxAscent + ctx.measureText(text).actualBoundingBoxDescent + 10;
    });
    ctx.restore();
}
function descargar() {
    let nombre = new Date().toString();

    let link = document.createElement("a");
    link.download = `${nombre}.png`;
    link.href = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    link.click();
}

function saltosDeLinea(str){ 
    return str.match(/[\s\S]{1,30}/g) || [];
}

//Mover Nombre
function textHitBox(x, y, index) {
  let texto = textos[index];
  return (x >= texto.x - 300 && x <= texto.x + 300 && y >= texto.y - 30 && y <= texto.y + 30);
}

function handleMouseDown(e) {
    e.preventDefault();
    startX = parseInt(e.clientX - offsetX);
    startY = parseInt(e.clientY - offsetY);

    for (let index = 0; index < textos.length; index++) {
        if(textHitBox(startX, startY, index))
            selectedText = index;
    }
}
function handleMouseUp(e) {
    e.preventDefault();
    selectedText = -1;
}
function handleMouseOut(e) {
    e.preventDefault();
    selectedText = -1;
}
function handleMouseMove(e) {
    if (selectedText < 0) {
        return;
    }
    e.preventDefault();
    mouseX = parseInt(e.clientX - offsetX);
    mouseY = parseInt(e.clientY - offsetY);

    var dx = mouseX - startX;
    var dy = mouseY - startY;
    startX = mouseX;
    startY = mouseY;

    textos[selectedText].x += dx;
    textos[selectedText].y += dy;
    render();
}

//Extra
function scaleToFit(img){
    // get the scale
    let scale = Math.min(canvas.width / img.width, canvas.height / img.height);
    // get the top left position of the image
    let x = (canvas.width / 2) - (img.width / 2) * scale;
    let y = (canvas.height / 2) - (img.height / 2) * scale;
    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
}