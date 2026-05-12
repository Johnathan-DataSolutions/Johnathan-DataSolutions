const containerProjetos = document.getElementById('meus-projetos');
const containerFiltros = document.getElementById('menu-filtros');

let listaGlobalProjetos = [];

// EXTRAÇÃO DE DADOS - Busca o arquivo JSON localmente (ou no servidor do GitHub Pages)
fetch('projetos.json')
	// PROCESSAMENTO DE DADOS
	.then(resposta => resposta.json()) // Converte a resposta para JSON
	.then(dados => {
		listaGlobalProjetos = dados;

		const categorias = ["Todos", ...new Set(dados.map(projeto => projeto.categoria))];

		// Exibi os botões de filtro
		renderizarFiltros(categorias);

		// Exibi os projetos
		// renderizarProjetos(dados);
		filtrarProjetos("Todos"); // Exibe todos os projetos inicialmente
	})
	.catch(erro => {
			console.error("Erro ao carregar:", erro);
			containerProjetos.innerHTML = "<p style='color: red;'>Erro ao carregar projetos.</p>";
	});

// ###################################################################################
// FUNÇÕES DE RENDERIZAÇÃO E FILTRAGEM PARA PROJETOS
// ###################################################################################


window.filtrarProjetos = function(categoriaSelecionada) {
	
	// A - Muda a cor dos botões (Efeito Visual)
	document.querySelectorAll('.filtro-btn').forEach(botao => {
		if(botao.innerText === categoriaSelecionada) {
			botao.className = "btn filtro-btn"; // Fica sólido
		} else {
			botao.className = "btn btn-outline filtro-btn"; // Fica com contorno vazado
		}
	});
	
	// B - Filtra a lista de projetos
	const projetosFiltrados = categoriaSelecionada === "Todos" 
	? listaGlobalProjetos 
	: listaGlobalProjetos.filter(projeto => projeto.categoria === categoriaSelecionada);
	
	// C - Desenha os cartões filtrados na tela
	renderizarProjetosHTML(projetosFiltrados);
}

/**
 * Renderiza os botões de filtro da seção Projetos
 * @param {*} categorias 
 */
function renderizarFiltros(categorias) {
		containerFiltros.innerHTML = categorias.map(cat => {
				// O botão "Todos" já começa com a cor sólida (ativo), os outros começam com contorno
				const classeBotao = cat === "Todos" ? "btn" : "btn btn-outline";
				return `<button class="${classeBotao} filtro-btn" onclick="filtrarProjetos('${cat}')">${cat}</button>`;
		}).join('');
}

/**
 * Renderiza os cartões de projetos na tela
 * @param {*} projetos 
 */
function renderizarProjetosHTML(projetos){
	// Desenha os cartões na tela usando a lista vinda do JSON
	containerProjetos.innerHTML = projetos.map(projeto => {
		
		// Condição para mostrar o botão de Dashboard apenas se o link existir
		const botaoDashboard = projeto.linkDashboard 
			? `<a href="${projeto.linkDashboard}" target="_blank" class="btn" style="padding: 8px 16px; font-size: 0.9rem; margin-left: 10px;">Ver Dashboard</a>` 
			: '';

		const botaoGithub = projeto.linkGithub
			? `<a href="${projeto.linkGithub}" target="_blank" class="btn btn-outline" style="padding: 8px 16px; font-size: 0.9rem;">Ver no GitHub</a>`
			: '';

		return `
			<div class="card">
				<h3>${projeto.icone} ${projeto.titulo}</h3>
				<p><strong>Desafio:</strong> ${projeto.desafio}</p>
				<p><strong>Solução:</strong> ${projeto.solucao}</p>
				<br>
				<div style="display: flex; flex-wrap: wrap; gap: 10px;">
					${botaoGithub}
					${botaoDashboard}
				</div>
			</div>
		`;
	}).join('');
}