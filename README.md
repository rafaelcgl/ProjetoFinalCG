# Projeto Final de Computação Gráfica

Aluno: Rafael Coelho Gondim de Oliveira Lima - Matrícula: 497493

Informações e instruções sobre o passeio virtual 3D:

- O cenário construído "na mão" foi um quarto, com paredes, chão, teto,
bancada, cama e ventilador de teto (animado por transformações).

- Foi composto o seguinte modelo de reflexão de Phong:

    - 20% (3/15) de luz ambiente;
    - 13,3% (2/15) de luz direcional, simulando raios solares entrando
    pela janela;
    - 26,7% (4/15) de luz pontual, localizada logo abaixo do eixo do
    ventilador de teto, simulando uma lâmpada;
    - 26,7% (4/15) de luz pontual, colada ao teto e se movimentando no
    eixo "x";
    - 13,3% (2/15) de luz especular, simulando o efeito da lâmpada
    refletindo nos objetos da cena.

- É possivel fazer a movimentação da câmera, de forma a controlar a visão
da cena, da seguinte maneira:

    - Teclas "w", "a", "s", "d" mudam a posição da câmera, simulando a
    movimentação da pessoa dentro do quarto:
        - Tecla "w": movimenta sempre para a direção sul (frente na
        configuração inicial);
        - Tecla "a": movimenta sempre para a direção leste (esquerda na
        configuração inicial);
        - Tecla "s": movimenta sempre para a direção norte (para trás na
        configuração inicial);
        - Tecla "d": movimenta sempre para a direção oeste (direita na
        configuração inicial).

    - Botões "esquerdo" e "direito" do mouse mudam o foco da câmera:
        - Botão "esquerdo": rotaciona a câmera no sentido anti-horário
        em torno de seu eixo vertical ("y"), mudando os valores de x e z
        do foco;
        - Botão "direito": rotaciona a câmera no sentido horário em torno
        de seu eixo vertical ("y"), mudando os valores de x e z do foco.

    - Scroll do mouse aumenta e diminui o campo de visão (fov) da câmera.

- Os objetos foram compostos com texturas (paredes, chão e janela) e
cores sólidas (cama, teto, bancada e ventilador).

- A câmera visualiza a cena com projeção perspectiva.