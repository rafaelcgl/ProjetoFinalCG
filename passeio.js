var teximg = [];
var texSrc = ["cimentoq.jpg", "tijolo.jpg", "piso.jpg", "branco.png", "madeira.png", "paisagem.jpg", "preto.png"];
var loadTexs = 0;
var gl;
var prog;
var xFoco = 0;
var zFoco = 0;
var xCam = 0;
var zCam = 0;
var wheel = 0;
var angle = 0;

function init() {
    for (i = 0; i < texSrc.length; i++) {
        teximg[i] = new Image();
        teximg[i].src = texSrc[i];

        teximg[i].onload = function() {
            loadTexs++;
    	    loadTextures();
        }
    }
}

function loadTextures() {
    if (loadTexs == texSrc.length) {
       initGL();
       configScene();
       draw();
    }
}


function initGL() {
	var canvas = document.getElementById("canvas1");
	gl = getGL(canvas);
    
	if (gl) {
        // Inicializa shaders
 		var vtxShSrc = document.getElementById("vertex-shader").text;
		var fragShSrc = document.getElementById("frag-shader").text;

        var vtxShader = createShader(gl, gl.VERTEX_SHADER, vtxShSrc);
        var fragShader = createShader(gl, gl.FRAGMENT_SHADER, fragShSrc);
        prog = createProgram(gl, vtxShader, fragShader);	
        
        gl.useProgram(prog);

        //Inicializa área de desenho: viewport e cor de limpeza; limpa a tela
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(0, 0, 0, 1);
        gl.enable( gl.BLEND );
        gl.blendFunc( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA );
        gl.enable(gl.DEPTH_TEST);
        //gl.enable(gl.CULL_FACE);

        // Eventos:
        document.addEventListener("keydown", keyDown, false);
        canvas.addEventListener("mousedown", mouseDown, false);
        canvas.addEventListener("wheel", mouseWheel, false);
        canvas.addEventListener("contextmenu", e => e.preventDefault());
    }
}    

function configScene() {    
    // Define coordenadas dos triângulos
    var coordTrianglesTex = new Float32Array([

        // Parede (Sul, Norte, Leste e Oeste)
        0.0, 3.0, 0.0, 1.0, 0.0,    0.0, 0.0, 0.0, 1.0, 1.0,    4.0, 0.0, 0.0, 0.0, 1.0,    4.0, 3.0, 0.0, 0.0, 0.0,    0.0, 3.0, 0.0, 1.0, 0.0,
        4.0, 3.0, 5.0, 1.0, 0.0,    4.0, 0.0, 5.0, 1.0, 1.0,    0.0, 0.0, 5.0, 0.0, 1.0,    0.0, 3.0, 5.0, 0.0, 0.0,    4.0, 3.0, 5.0, 1.0, 0.0,
        0.0, 3.0, 5.0, 1.0, 0.0,    0.0, 0.0, 5.0, 1.0, 1.0,    0.0, 0.0, 0.0, 0.0, 1.0,    0.0, 3.0, 0.0, 0.0, 0.0,    0.0, 3.0, 5.0, 1.0, 0.0,
        4.0, 3.0, 0.0, 1.0, 0.0,    4.0, 0.0, 0.0, 1.0, 1.0,    4.0, 0.0, 5.0, 0.0, 1.0,    4.0, 3.0, 5.0, 0.0, 0.0,    4.0, 3.0, 0.0, 1.0, 0.0,
        // Chão
        0.0, 0.0, 0.0, 1.0, 1.0,    0.0, 0.0, 5.0, 0.0, 1.0,    4.0, 0.0, 5.0, 0.0, 0.0,    4.0, 0.0, 0.0, 1.0, 0.0,    0.0, 0.0, 0.0, 1.0, 1.0,
        // Teto
        0.0, 3.0, 0.0, 1.0, 1.0,    0.0, 3.0, 5.0, 0.0, 1.0,    4.0, 3.0, 5.0, 0.0, 0.0,    4.0, 3.0, 0.0, 1.0, 0.0,    0.0, 3.0, 0.0, 1.0, 1.0,

        // Cama (Cima, Esquerda, Frente e Direita)
        4.0, 0.5, 0.8, 1.0, 1.0,    1.9, 0.5, 0.8, 1.0, 1.0,    1.9, 0.5, 2.4, 1.0, 1.0,    4.0, 0.5, 2.4, 1.0, 1.0,    4.0, 0.5, 0.8, 1.0, 1.0,
        4.0, 0.5, 0.8, 1.0, 1.0,    4.0, 0.0, 0.8, 1.0, 1.0,    1.9, 0.0, 0.8, 1.0, 1.0,    1.9, 0.5, 0.8, 1.0, 1.0,    4.0, 0.5, 0.8, 1.0, 1.0,
        1.9, 0.5, 0.8, 1.0, 1.0,    1.9, 0.0, 0.8, 1.0, 1.0,    1.9, 0.0, 2.4, 1.0, 1.0,    1.9, 0.5, 2.4, 1.0, 1.0,    1.9, 0.5, 0.8, 1.0, 1.0,
        1.9, 0.5, 2.4, 1.0, 1.0,    1.9, 0.0, 2.4, 1.0, 1.0,    4.0, 0.0, 2.4, 1.0, 1.0,    4.0, 0.5, 2.4, 1.0, 1.0,    1.9, 0.5, 2.4, 1.0, 1.0,

        // Bancada (Cima, Frente e Baixo)
        0.0, 0.85, 0.0, 1.0, 1.0,   0.0, 0.85, 5.0, 1.0, 1.0,   0.5, 0.85, 5.0, 1.0, 1.0,   0.5, 0.85, 0.0, 1.0, 1.0,   0.0, 0.85, 0.0, 1.0, 1.0,
        0.5, 0.85, 5.0, 1.0, 1.0,   0.5, 0.8, 5.0, 1.0, 1.0,    0.5, 0.8, 0.0, 1.0, 1.0,    0.5, 0.85, 0.0, 1.0, 1.0,   0.5, 0.85, 5.0, 1.0, 1.0,
        0.5, 0.8, 5.0, 1.0, 1.0,    0.0, 0.8, 5.0, 1.0, 1.0,    0.0, 0.8, 0.0, 1.0, 1.0,    0.5, 0.8, 0.0, 1.0, 1.0,    0.5, 0.8, 5.0, 1.0, 1.0,

        // Janela (Esquadria, Divisão e Paisagem)
        0.001, 2.05, 4.55, 1.0, 1.0,    0.001, 1.0, 4.55, 1.0, 1.0,     0.001, 1.0, 1.45, 1.0, 1.0,     0.001, 2.05, 1.45, 1.0, 1.0,    0.001, 2.05, 4.55, 1.0, 1.0,
        0.003, 2.05, 3.05, 1.0, 1.0,    0.003, 1.0, 3.05, 1.0, 1.0,     0.003, 1.0, 2.95, 1.0, 1.0,     0.003, 2.05, 2.95, 1.0, 1.0,    0.003, 2.05, 3.05, 1.0, 1.0,
        0.002, 2.0, 4.5, 1.0, 0.0,      0.002, 1.05, 4.5, 1.0, 1.0,     0.002, 1.05, 1.5, 0.0, 1.0,     0.002, 2.0, 1.5, 0.0, 0.0,      0.002, 2.0, 4.5, 1.0, 0.0,

        // Ventilador (Eixo e Pás)
        1.97, 3.0, 2.53, 1.0, 1.0,  1.97, 2.7, 2.53, 1.0, 1.0,  2.03, 2.7, 2.53, 1.0, 1.0,  2.03, 3.0, 2.53, 1.0, 1.0,  1.97, 3.0, 2.53, 1.0, 1.0,
        2.03, 3.0, 2.53, 1.0, 1.0,  2.03, 2.7, 2.53, 1.0, 1.0,  2.03, 2.7, 2.47, 1.0, 1.0,  2.03, 3.0, 2.47, 1.0, 1.0,  2.03, 3.0, 2.53, 1.0, 1.0,
        2.03, 3.0, 2.47, 1.0, 1.0,  2.03, 2.7, 2.47, 1.0, 1.0,  1.97, 2.7, 2.47, 1.0, 1.0,  1.97, 3.0, 2.47, 1.0, 1.0,  2.03, 3.0, 2.47, 1.0, 1.0,
        1.97, 3.0, 2.47, 1.0, 1.0,  1.97, 2.7, 2.47, 1.0, 1.0,  1.97, 2.7, 2.53, 1.0, 1.0,  1.97, 3.0, 2.53, 1.0, 1.0,  1.97, 3.0, 2.47, 1.0, 1.0,

        1.97, 2.7, 2.4, 1.0, 1.0,   1.37, 2.7, 2.4, 1.0, 1.0,   1.37, 2.7, 2.6, 1.0, 1.0,   1.97, 2.7, 2.6, 1.0, 1.0,   1.97, 2.7, 2.4, 1.0, 1.0,
        2.63, 2.7, 2.4, 1.0, 1.0,   2.03, 2.7, 2.4, 1.0, 1.0,   2.03, 2.7, 2.6, 1.0, 1.0,   2.63, 2.7, 2.6, 1.0, 1.0,   2.63, 2.7, 2.4, 1.0, 1.0
        ]);
    
    //Cria buffer na GPU e copia coordenadas para ele
    var bufPtr = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufPtr);
    gl.bufferData(gl.ARRAY_BUFFER, coordTrianglesTex, gl.STATIC_DRAW);
    
    //Pega ponteiro para o atributo "position" do vertex shader
    var positionPtr = gl.getAttribLocation(prog, "position");
    gl.enableVertexAttribArray(positionPtr);
    //Especifica a cópia dos valores do buffer para o atributo
    gl.vertexAttribPointer(positionPtr, 
                            3,        //quantidade de dados em cada processamento
                            gl.FLOAT, //tipo de cada dado (tamanho)
                            false,    //não normalizar
                            5*4,      //tamanho do bloco de dados a processar em cada passo
                                        //0 indica que o tamanho do bloco é igual a tamanho
                                        //lido (2 floats, ou seja, 2*4 bytes = 8 bytes)
                            0         //salto inicial (em bytes)
                            );
    
    //Pega ponteiro para o atributo "texCoord" do vertex shader
    var texcoordPtr = gl.getAttribLocation(prog, "texCoord");
    gl.enableVertexAttribArray(texcoordPtr);
    //Especifica a cópia dos valores do buffer para o atributo
    gl.vertexAttribPointer(texcoordPtr, 
                            2,        //quantidade de dados em cada processamento
                            gl.FLOAT, //tipo de cada dado (tamanho)
                            false,    //não normalizar
                            5*4,      //tamanho do bloco de dados a processar em cada passo
                                        //0 indica que o tamanho do bloco é igual a tamanho
                                        //lido (2 floats, ou seja, 2*4 bytes = 8 bytes)
                            3*4       //salto inicial (em bytes)
                            );
                            
    submitTexs()
}  

function draw()
{
    var mproj = createPerspective(wheel+70, gl.canvas.width/gl.canvas.height, 1, 50);
    var cam = createCamera([xCam+2, 1.5, zCam+5.0], [xFoco+2, 1.5, zFoco+0], [xCam+2, 2.5, zCam+5.0]);

    var mattransida = math.matrix(
        [[1.0, 0.0, 0.0, -2.0],
         [0.0, 1.0, 0.0, -2.7],
         [0.0, 0.0, 1.0, -2.5],
         [0.0, 0.0, 0.0,  1.0]]
        );

    var matrotY = math.matrix(
        [[Math.cos(angle*Math.PI/180.0), 0.0, -Math.sin(angle*Math.PI/180.0), 0.0], 
         [0.0, 1.0, 0.0, 0.0],
         [Math.sin(angle*Math.PI/180.0), 0.0, Math.cos(angle*Math.PI/180.0), 0.0],
         [0.0, 0.0, 0.0, 1.0]]
         );
    
    var mattransvolta = math.matrix(
        [[1.0, 0.0, 0.0, 2.0],
         [0.0, 1.0, 0.0, 2.7],
         [0.0, 0.0, 1.0, 2.5],
         [0.0, 0.0, 0.0, 1.0]]
        );
    
    var transforma = math.multiply(mproj, cam);
    transforma = math.flatten(math.transpose(transforma))._data;

    var rot = math.multiply(matrotY, mattransida);
    rot = math.multiply(mattransvolta, rot);
    rot = math.multiply(cam, rot);
    rot = math.multiply(mproj, rot);
    rot = math.flatten(math.transpose(rot))._data;
                    
    transfPtr = gl.getUniformLocation(prog, "transf");
    gl.uniformMatrix4fv(transfPtr, false, transforma);
    
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
    
    // Desenha triângulos (executa shaders):

    var texPtr = gl.getUniformLocation(prog, "tex");
    // Parede cimento queimado:
    gl.uniform1i(texPtr, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.drawArrays(gl.TRIANGLES, 2, 3);
    
    gl.drawArrays(gl.TRIANGLES, 5, 3);
    gl.drawArrays(gl.TRIANGLES, 7, 3);
    
    gl.drawArrays(gl.TRIANGLES, 10, 3);
    gl.drawArrays(gl.TRIANGLES, 12, 3);

    // Parede tijolo:
    gl.uniform1i(texPtr, 1);
    gl.drawArrays(gl.TRIANGLES, 15, 3);
    gl.drawArrays(gl.TRIANGLES, 17, 3);

    // Chão:
    gl.uniform1i(texPtr, 2);
    gl.drawArrays(gl.TRIANGLES, 20, 3);
    gl.drawArrays(gl.TRIANGLES, 22, 3);

    // Teto:
    gl.uniform1i(texPtr, 3);
    gl.drawArrays(gl.TRIANGLES, 25, 3);
    gl.drawArrays(gl.TRIANGLES, 27, 3);

    // Cama:
    gl.uniform1i(texPtr, 3);
    gl.drawArrays(gl.TRIANGLES, 30, 3);
    gl.drawArrays(gl.TRIANGLES, 32, 3);

    gl.drawArrays(gl.TRIANGLES, 35, 3);
    gl.drawArrays(gl.TRIANGLES, 37, 3);

    gl.drawArrays(gl.TRIANGLES, 40, 3);
    gl.drawArrays(gl.TRIANGLES, 42, 3);

    gl.drawArrays(gl.TRIANGLES, 45, 3);
    gl.drawArrays(gl.TRIANGLES, 47, 3);

    // Bancada:
    gl.uniform1i(texPtr, 4);
    gl.drawArrays(gl.TRIANGLES, 50, 3);
    gl.drawArrays(gl.TRIANGLES, 52, 3);

    gl.drawArrays(gl.TRIANGLES, 55, 3);
    gl.drawArrays(gl.TRIANGLES, 57, 3);

    gl.drawArrays(gl.TRIANGLES, 60, 3);
    gl.drawArrays(gl.TRIANGLES, 62, 3);

    // Janela:
    gl.uniform1i(texPtr, 6);
    gl.drawArrays(gl.TRIANGLES, 65, 3);
    gl.drawArrays(gl.TRIANGLES, 67, 3);
    gl.drawArrays(gl.TRIANGLES, 70, 3);
    gl.drawArrays(gl.TRIANGLES, 72, 3);
    gl.uniform1i(texPtr, 5);
    gl.drawArrays(gl.TRIANGLES, 75, 3);
    gl.drawArrays(gl.TRIANGLES, 77, 3);

    // Ventilador (Eixo):
    gl.uniform1i(texPtr, 6);
    gl.drawArrays(gl.TRIANGLES, 80, 3);
    gl.drawArrays(gl.TRIANGLES, 82, 3);
    gl.drawArrays(gl.TRIANGLES, 85, 3);
    gl.drawArrays(gl.TRIANGLES, 87, 3);
    gl.drawArrays(gl.TRIANGLES, 90, 3);
    gl.drawArrays(gl.TRIANGLES, 92, 3);
    gl.drawArrays(gl.TRIANGLES, 95, 3);
    gl.drawArrays(gl.TRIANGLES, 97, 3);

    gl.uniformMatrix4fv(transfPtr, false, rot);
    
    // Ventilador (Pás):
    gl.drawArrays(gl.TRIANGLES, 100, 3);
    gl.drawArrays(gl.TRIANGLES, 102, 3);
    gl.drawArrays(gl.TRIANGLES, 105, 3);
    gl.drawArrays(gl.TRIANGLES, 107, 3);

    angle++;
    angle++;
    requestAnimationFrame(draw);
}

function getGL(canvas)
{
    var gl = canvas.getContext("webgl");
    if(gl) return gl;
    
    gl = canvas.getContext("experimental-webgl");
    if(gl) return gl;
    
    alert("Contexto WebGL inexistente! Troque de navegador!");
    return false;
}

function createShader(gl, shaderType, shaderSrc)
{
	var shader = gl.createShader(shaderType);
	gl.shaderSource(shader, shaderSrc);
	gl.compileShader(shader);
	
	if(gl.getShaderParameter(shader, gl.COMPILE_STATUS))
		return shader;
	
	alert("Erro de compilação: " + gl.getShaderInfoLog(shader));
	
	gl.deleteShader(shader);
}

function createProgram(gl, vtxShader, fragShader)
{
	var prog = gl.createProgram();
	gl.attachShader(prog, vtxShader);
	gl.attachShader(prog, fragShader);
	gl.linkProgram(prog);
	
	if(gl.getProgramParameter(prog, gl.LINK_STATUS))
		return prog;

    alert("Erro de linkagem: " + gl.getProgramInfoLog(prog));
	
	gl.deleteProgram(prog);	
}
    

function createPerspective(fovy, aspect, near, far)
{
    fovy = fovy*Math.PI/180.0;

    var fy = 1/math.tan(fovy/2.0);
    var fx = fy/aspect;
    var B = -2*far*near/(far-near);
    var A = -(far+near)/(far-near);

	var proj = math.matrix(
							[[ fx, 0.0,  0.0, 0.0],
							 [0.0,  fy,  0.0, 0.0],
							 [0.0, 0.0,    A,   B],
							 [0.0, 0.0, -1.0, 0.0]]
							);
							
	return proj;
}

function createCamera(pos, target, up)
{  
  var zc = math.subtract(pos, target);
  zc = math.divide(zc, math.norm(zc));
  
  var yt = math.subtract(up, pos);
  yt = math.divide(yt, math.norm(yt));
  
  var xc = math.cross(yt, zc);
  xc = math.divide(xc, math.norm(xc));
  
  var yc = math.cross(zc, xc);
  yc = math.divide(yc,math.norm(yc));
  
  var mt = math.inv(math.transpose(math.matrix([xc,yc,zc])));
  
  mt = math.resize(mt, [4,4], 0);
  mt._data[3][3] = 1;
  
  var mov = math.matrix([[1, 0, 0, -pos[0]], 
                         [0, 1, 0, -pos[1]],
                         [0, 0, 1, -pos[2]],
                         [0, 0, 0, 1]]);
  
  var cam = math.multiply(mt, mov);
  
  return cam;
}

function submitTexs()
{
    //submeter textura para gpu
    var tex0 = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tex0);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);        
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, teximg[0]);

    var tex1 = gl.createTexture();
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, tex1);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);        
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, teximg[1]);

    var tex2 = gl.createTexture();
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, tex2);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);        
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, teximg[2]);

    var tex3 = gl.createTexture();
    gl.activeTexture(gl.TEXTURE3);
    gl.bindTexture(gl.TEXTURE_2D, tex3);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);        
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, teximg[3]);

    var tex4 = gl.createTexture();
    gl.activeTexture(gl.TEXTURE4);
    gl.bindTexture(gl.TEXTURE_2D, tex4);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);        
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, teximg[4]);

    var tex5 = gl.createTexture();
    gl.activeTexture(gl.TEXTURE5);
    gl.bindTexture(gl.TEXTURE_2D, tex5);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);        
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, teximg[5]);

    var tex6 = gl.createTexture();
    gl.activeTexture(gl.TEXTURE6);
    gl.bindTexture(gl.TEXTURE_2D, tex6);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);        
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, teximg[6]);
}

function keyDown(event) {
    console.log(event);

    if (event.key === 'w') {
        zCam -= 0.5
    }

    if (event.key === 'a') {
        xCam -= 0.5
    }

    if (event.key === 's') {
        zCam += 0.5
    }

    if (event.key === 'd') {
        xCam += 0.5
    }
}

function mouseDown(event) {
    console.log(event);

    if (event.button === 0) {
        if (zFoco === 0 && xFoco > -2 && xFoco <= 2) {
            xFoco -= 0.25
        }
        else if (xFoco === -2 && zFoco >= 0 && zFoco < 5) {
            zFoco += 0.25
        }
        else if (zFoco === 5 && xFoco >= -2 && xFoco < 2) {
            xFoco += 0.25
        }
        else if (xFoco === 2 && zFoco > 0 && zFoco <= 5) {
            zFoco -= 0.25
        }
    }

    if (event.button === 2) {
        if (zFoco === 0 && xFoco >= -2 && xFoco < 2) {
            xFoco += 0.25
        }
        else if (xFoco === -2 && zFoco > 0 && zFoco <= 5) {
            zFoco -= 0.25
        }
        else if (zFoco === 5 && xFoco > -2 && xFoco <= 2) {
            xFoco -= 0.25
        }
        else if (xFoco === 2 && zFoco >= 0 && zFoco < 5) {
            zFoco += 0.25
        }
    }
}

function mouseWheel(event) {
    console.log(event);

    if (event.deltaY > 0 && wheel < 30) {
        wheel += 0.5
    }

    if (event.deltaY < 0 && wheel > -30) {
        wheel -= 0.5
    }
}
