'use strict';
// História organizada em 24 páginas. Cada cena conta um momento completo da narrativa.
const BOOK = [
{chapter:'CAPÍTULO I · O CHAMADO',title:'Uma noite diferente',speaker:'lia',set:'room',shot:'rain',paragraphs:[
'Em uma noite chuvosa, Lia estava acordada em seu quarto. A menina adorava observar as estrelas e inventar histórias sobre lugares impossíveis.',
'Ao seu lado, Pingo, uma pequena raposinha dourada, levantou as orelhas. Lá fora, o céu brilhou de um jeito que eles nunca tinham visto.'
],quote:'— Você também viu aquela luz, Pingo?',prompt:'Uma luz misteriosa apareceu na janela.',continueLabel:'Descobrir de onde veio a luz'},
{chapter:'CAPÍTULO I · O CHAMADO',title:'O segredo do guarda-roupa',speaker:'lia',set:'room',shot:'knock',paragraphs:[
'De repente, três batidinhas ecoaram pelo quarto: toc, toc, toc! Mas o som não vinha da porta. Vinha do velho guarda-roupa de madeira.',
'Pequenas estrelas douradas surgiram em suas portas. Então, uma voz fininha sussurrou: “Finalmente você chegou, Lia!”'
],quote:'— Um guarda-roupa que fala? — Lia perguntou, espantada.',continueLabel:'Chegar mais perto'},
{chapter:'CAPÍTULO I · O CHAMADO',title:'A porta encantada',speaker:'lia',set:'room',shot:'portal',paragraphs:[
'A maçaneta parecia feita de luar. Pingo cheirou a madeira, deu um passo para trás e esperou. Lia sentiu medo, mas também uma vontade enorme de descobrir o segredo.',
'Ela sabia que podia ser corajosa sem deixar de tomar cuidado. Primeiro, precisaria decidir como investigar aquela porta misteriosa.'
],prompt:'O que Lia deve fazer?',choices:[
{label:'🚪 Abrir a porta com cuidado',shot:'door',to:4,caption:'A maçaneta gira… a magia desperta!'},
{label:'👂 Ouvir primeiro quem está do outro lado',shot:'listen',to:4,caption:'Uma voz suave convida Lia a entrar.'}
]},
{chapter:'CAPÍTULO I · O CHAMADO',title:'A voz do outro lado',speaker:'luma',set:'portal',shot:'door',paragraphs:[
'Uma estrelinha chamada Luma falou atrás da porta. Sua voz era delicada e estava cheia de esperança: “Lia, o Reino Estelar precisa de ajuda!”',
'Quando a porta se abriu, um vento perfumado de flores atravessou o quarto. Do outro lado não havia roupas, mas uma passagem brilhante para outro mundo.'
],quote:'— Eu explico tudo. Só precisamos de sua coragem e bondade!',continueLabel:'Olhar pela passagem'},
{chapter:'CAPÍTULO I · O CHAMADO',title:'Um mundo do outro lado',speaker:'lia',set:'sky',shot:'reveal',paragraphs:[
'Lia e Pingo atravessaram a passagem. O chão parecia feito de nuvens; ilhas flutuavam entre constelações, e cachoeiras brilhantes subiam em direção ao céu.',
'Lia abriu um sorriso. Aquele lugar era ainda mais extraordinário do que os mundos que criava em sua imaginação.'
],quote:'— Pingo, estamos dentro de uma história!',continueLabel:'Explorar o Reino Estelar'},
{chapter:'CAPÍTULO II · A MISSÃO',title:'Uma missão para os amigos',speaker:'lia',set:'sky',shot:'introduce',paragraphs:[
'Luma contou que havia caído no Lago dos Espelhos e perdido a maior parte de sua luz. Sem seu brilho, o Reino Estelar começaria a adormecer.',
'“Vamos encontrar você”, prometeu Lia. Pingo abanou a cauda e caminhou ao lado da amiga. Juntos, eles seguiriam até o lago antes do nascer do sol.'
],quote:'— Ajudar alguém também é uma forma de coragem — disse Lia.',continueLabel:'Seguir a trilha de estrelas'},
{chapter:'CAPÍTULO II · A MISSÃO',title:'Dois caminhos impossíveis',speaker:'pingo',set:'fork',shot:'fork',paragraphs:[
'O caminho se dividiu em dois. À esquerda havia uma ponte de bolhas transparentes, que balançavam suavemente no ar.',
'À direita crescia uma floresta encantada, onde flores brilhavam e as árvores pareciam conversar com o vento. Os dois caminhos levavam ao mesmo lago.'
],prompt:'Qual caminho você quer explorar?',choices:[
{label:'🫧 Pular pela Ponte de Bolhas',shot:'bubbles',to:8,caption:'As bolhas formam um caminho saltitante!'},
{label:'🌳 Entrar na Floresta Encantada',shot:'forest',to:9,caption:'A floresta acende suas luzes para receber os amigos!'}
]},
{chapter:'CAPÍTULO II · A MISSÃO',title:'A ponte das bolhas',speaker:'lia',set:'bubbles',shot:'bubbles',paragraphs:[
'A primeira bolha era macia como um travesseiro. Lia respirou fundo, deu um pequeno salto e pousou sorrindo. Pingo saltou logo atrás, como uma flecha alaranjada.',
'Cada bolha brilhava mais quando alguém se lembrava de algo feliz. Com coragem e alegria, os amigos chegaram à outra margem.'
],prompt:'Qual lembrança dá força para o próximo salto?',choices:[
{label:'💛 Um abraço cheio de carinho',shot:'jump',to:10,caption:'Lia e Pingo saltam juntos com coragem!'},
{label:'🌈 Uma brincadeira muito divertida',shot:'jump',to:10,caption:'Um salto enorme atravessa a última bolha!'}
]},
{chapter:'CAPÍTULO II · A MISSÃO',title:'A floresta encantada',speaker:'lia',set:'forest',shot:'forest',paragraphs:[
'A floresta estava cheia de vagalumes e cogumelos luminosos. Pingo caminhava à frente, farejando o cheiro doce de flores estelares.',
'Entre os galhos, Lia percebeu que pequenas luzes mostravam uma trilha segura. Eles a seguiram com calma, cuidando uns dos outros até avistar o lago.'
],quote:'— É mais fácil descobrir o caminho quando caminhamos juntos.',prompt:'Como você deseja seguir?',choices:[
{label:'✨ Seguir as luzinhas com Pingo',shot:'forest',to:10,caption:'Os vagalumes iluminam o caminho!'},
{label:'🤝 Caminhar bem perto de Lia',shot:'walk',to:10,caption:'Juntos, todos encontram a saída da floresta.'}
]},
{chapter:'CAPÍTULO III · O RESGATE',title:'O Lago dos Espelhos',speaker:'luma',set:'lake',shot:'lake',paragraphs:[
'Os dois caminhos terminavam diante de um lago quietinho. A água refletia não apenas o céu, mas também as lembranças mais bonitas de quem olhava para ela.',
'No centro, uma concha prateada guardava uma luz muito fraca. Era Luma! Ela precisava de ajuda para chegar ao Sino da Lua.'
],quote:'— Eu estou aqui… vocês conseguiram me encontrar!',continueLabel:'Descobrir como atravessar'},
{chapter:'CAPÍTULO III · O RESGATE',title:'Uma travessia mágica',speaker:'lia',set:'lake',shot:'boat',paragraphs:[
'O lago era largo demais para atravessar a pé. Então, duas opções surgiram na margem: um barquinho de madeira encantada e uma grande vitória-régia flutuante.',
'“O barquinho se move com desejos gentis”, explicou Luma. “A vitória-régia desliza quando alguém desperta suas luzes.” Lia olhou para você, esperando sua escolha.'
],prompt:'Como atravessar o lago?',choices:[
{label:'⛵ Navegar no barquinho dos desejos',shot:'boat',to:12,caption:'O barco atravessa o lago sob a luz das estrelas!'},
{label:'🍃 Viajar numa vitória-régia iluminada',shot:'lilypad',to:12,caption:'A folha encantada desliza sobre a água!'}
]},
{chapter:'CAPÍTULO III · O RESGATE',title:'Luma precisa de coragem',speaker:'luma',set:'lake',shot:'encourage',paragraphs:[
'Na concha prateada, Luma tremia: “As outras estrelas brilham tanto… e se minha luz não for importante?”',
'Lia sentou ao lado dela. “Cada estrela tem seu próprio brilho”, respondeu. Pingo encostou o focinho na pequena amiga. Agora era a sua vez de encorajá-la.'
],prompt:'O que você quer dizer para Luma?',choices:[
{label:'💛 “Seu brilho é único, Luma!”',shot:'encourage',to:13,caption:'Luma brilha um pouquinho mais!'},
{label:'🤝 “Vamos conseguir juntos!”',shot:'encourage',to:13,caption:'A amizade desperta a luz de Luma!'}
]},
{chapter:'CAPÍTULO III · O RESGATE',title:'O caminho para a torre',speaker:'pingo',set:'stairs',shot:'stairs',paragraphs:[
'Com as palavras de incentivo, Luma recuperou uma pequena faísca dourada. Ela apontou para uma torre nas montanhas de nuvens.',
'“O Sino da Lua fica lá no alto!”, disse. Os amigos subiram a escada luminosa. Cada degrau tocava uma nota, formando uma música suave pelo caminho.'
],quote:'— Estamos quase lá! — comemorou Pingo.',continueLabel:'Subir até o sino'},
{chapter:'CAPÍTULO III · O RESGATE',title:'O Sino da Lua',speaker:'lia',set:'tower',shot:'bell',paragraphs:[
'A torre era feita de cristal e guardava um enorme sino dourado. Para despertá-lo, não era preciso ter força: bastava escolher uma palavra que viesse do coração.',
'Lia colocou a mão no sino. Pingo e Luma ficaram ao lado dela. Uma luz suave começou a crescer, esperando sua decisão.'
],prompt:'Que palavra vai despertar o sino?',choices:[
{label:'❤️ Amor',shot:'bell',to:15,caption:'O sino ressoa com amor!'},
{label:'🦁 Coragem',shot:'bell',to:15,caption:'O sino ressoa com coragem!'},
{label:'🌈 Esperança',shot:'bell',to:15,caption:'O sino ressoa com esperança!'}
]},
{chapter:'CAPÍTULO IV · O BRILHO',title:'O brilho de Luma',speaker:'luma',set:'tower',shot:'starburst',paragraphs:[
'O som do sino viajou por todas as ilhas do Reino Estelar. Uma chuva de pequenos brilhos dourados iluminou a torre.',
'Luma começou a brilhar intensamente! Ela girou no ar, encantada, enquanto Lia e Pingo comemoravam. O reino estava salvo, porque ninguém precisou enfrentar o medo sozinho.'
],quote:'— Minha luz voltou! Obrigada por acreditarem em mim!',continueLabel:'Ver o reino acordar'},
{chapter:'CAPÍTULO IV · O BRILHO',title:'Uma promessa entre estrelas',speaker:'luma',set:'sky',shot:'thanks',paragraphs:[
'Luma pousou suavemente perto de Lia. A pequena estrela já não parecia preocupada com o brilho das outras.',
'“Aprendi que não preciso ser igual a ninguém para ser especial”, disse. Lia sorriu. As três amigas prometeram guardar aquela aventura no coração.'
],quote:'— Cada um de nós ilumina o mundo do seu próprio jeito.',continueLabel:'Continuar a aventura'},
{chapter:'CAPÍTULO IV · O BRILHO',title:'Peixes que nadam no céu',speaker:'lia',set:'sky',shot:'fish',paragraphs:[
'Com o retorno de Luma, o Reino Estelar despertou. Peixes dourados passaram nadando entre as nuvens, como se o céu fosse um enorme oceano.',
'As ilhas flutuantes ficaram cobertas de flores e os moradores do reino surgiram nas janelas para celebrar o fim da escuridão.'
],quote:'— Acho que nunca vou esquecer este lugar! — disse Lia.',continueLabel:'Passear pelas ilhas'},
{chapter:'CAPÍTULO IV · O BRILHO',title:'A floresta desperta',speaker:'pingo',set:'forest',shot:'bloom',paragraphs:[
'As árvores da floresta balançavam como se dançassem. Uma após a outra, as flores se abriram, espalhando pétalas coloridas pelo chão.',
'Pingo tentou seguir uma borboleta azul, mas ela pousou bem na ponta de seu nariz. Lia caiu na gargalhada.'
],quote:'— Parece que a própria floresta está dizendo “obrigada”! ',continueLabel:'Conhecer a guardiã'},
{chapter:'CAPÍTULO V · O RETORNO',title:'O conselho da coruja',speaker:'coruja',set:'forest',shot:'owl',paragraphs:[
'Em um galho alto, uma coruja de óculos dourados acompanhava tudo com olhos atentos. Ela era a guardiã das antigas histórias do reino.',
'“Vocês fizeram algo importante”, disse. “A verdadeira coragem não é nunca sentir medo. É seguir em frente com gentileza e pedir ajuda quando precisar.”'
],quote:'— Quem cuida dos outros também faz a magia crescer.',continueLabel:'Guardar o conselho'},
{chapter:'CAPÍTULO V · O RETORNO',title:'O arco-íris da despedida',speaker:'lia',set:'sky',shot:'rainbow',paragraphs:[
'Um arco-íris de luz surgiu diante dos amigos. Era a passagem de volta para o quarto de Lia. O céu já começava a clarear.',
'Lia respirou fundo. Estava com saudade de casa, mas também sabia que despedidas não apagam as boas lembranças. Pingo deu uma última voltinha entre as estrelas.'
],quote:'— Podemos levar a magia na imaginação — disse Lia.',continueLabel:'Atravessar o arco-íris'},
{chapter:'CAPÍTULO V · O RETORNO',title:'Uma lembrança dourada',speaker:'luma',set:'sky',shot:'keepsake',paragraphs:[
'Antes da despedida, Luma deixou uma centelha dourada na mão de Lia. Era pequena, mas aquecia como um abraço.',
'“Quando você olhar para o céu, lembre-se de que a amizade pode brilhar mesmo de longe”, disse a estrelinha. Lia guardou o presente com cuidado.'
],quote:'— Obrigada por me ajudar a encontrar minha luz.',continueLabel:'Voltar para casa'},
{chapter:'CAPÍTULO V · O RETORNO',title:'Uma estrelinha na janela',speaker:'lia',set:'room',shot:'home',paragraphs:[
'A passagem se fechou em silêncio. Lia e Pingo estavam outra vez no quarto, com a cama quentinha e a chuva já fraquinha do lado de fora.',
'Na janela, uma estrela piscou três vezes. Lia sorriu: sabia exatamente quem estava se despedindo.'
],quote:'— Boa noite, Luma. Até a próxima aventura.',continueLabel:'Descobrir o que Lia aprendeu'},
{chapter:'CAPÍTULO V · O RETORNO',title:'A maior descoberta',speaker:'lia',set:'room',shot:'hug',paragraphs:[
'Lia abraçou Pingo e pensou em tudo o que tinha vivido: o medo da porta, as bolhas saltitantes, o lago e o sino.',
'Agora ela entendia uma coisa que nenhum livro de magia havia ensinado: coragem, gentileza e amizade podem transformar até as noites mais escuras.'
],quote:'— Às vezes, o maior tesouro é aquilo que aprendemos juntos.',continueLabel:'Ler o final da história'},
{chapter:'CAPÍTULO V · O RETORNO',title:'O começo de outra aventura',speaker:'lia',set:'room',shot:'sleep',paragraphs:[
'Lia adormeceu segurando sua pequena estrela dourada. Pingo se enrolou ao pé da cama, sonhando com peixes voadores e bolhas brilhantes.',
'Lá fora, uma estrela sorriu no céu. E, em algum lugar do Reino Estelar, outra aventura já estava começando. Fim.'
],quote:'Toda grande aventura começa com uma pequena curiosidade. ✨',prompt:'Você chegou ao fim! Quer guardar uma lembrança?',end:true}
];
const SPEAKERS={lia:['👧','Lia e Pingo','Os exploradores do Reino Estelar'],pingo:['🦊','Pingo','A raposinha corajosa'],luma:['⭐','Luma','A estrelinha do Reino Estelar'],coruja:['🦉','Coruja Sábia','A guardiã das histórias']};
