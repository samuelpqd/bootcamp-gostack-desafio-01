const express = require('express');

const server = express();

server.use(express.json());  // retorno do express em json

/**
 * A variável `projects` pode ser `const` porque um `array`
 * pode receber adições ou exclusões mesmo sendo uma constante.
 */
const projects = [];

/**
 * Middleware que checa se o projeto existe
 */
function checkProjectExists(request, response, next) {
  const { id } = request.params;
  const project = projects.find(p => p.id == id);
  if (!project) { 
    // verifica se project é undefined e se for retorna status 400
    return response.status(400).json({ error: 'Project not found' });
  }

  return next(); // continua a executar o fluxo de funções
}

/**
 * Middleware que checa se foi informado o id
 */
 function checkId(req,res,next) {
   const { id } = req.body; // pega o id no body
   if (!id) {
    // verifica se id é undefined e se for retorna status 400
    return res.status(400).json({ error: 'ID does not exist' });   
   }
   return next();
 }


/**
 * Middleware que mostra no consolelog o número de requisições
 * atraves do count
 */
 function logRequestsNumber(req, res, next) {

  console.count("Número de requisições");
  return next();
}

server.use(logRequestsNumber);   

/*
server.use((req,res,next)=>{
  console.count('Count Request');
  next();
  }) */

/**
 * Retorna todos os projetos do array
 */
server.get('/projects', (req , res) => {
  return res.json(projects);
});

/**
 * Request body: id, title
 * Cadastra um novo projeto
 */
server.post('/projects', checkId, (req, res) => {
  const { id, title } = req.body;  // usando desestruturação

  const project = {
    id,
    title,
    tasks: [] // informação da task inicialmente vazia 
  };

  projects.push(project);   //adiciona a constante project no array projects
  return res.json(project); // retorna o json do project adicionado

});

/**
 * Route params: id
 * Request body: title
 * Altera o título do projeto com o id presente nos parâmetros da rota.
 * verificando no middleware checkProjectExists se o projeto existe
 */
server.put('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;  // id dos parametros da requisicao
  const { title } = req.body; // title do body da requisicao

  const project = projects.find(p => p.id == id);

  project.title = title;

  return res.json(project);
});

/**
 * Route params: id
 * Deleta o projeto associado ao id presente nos parâmetros da rota.
 * usando o middleware  checkProjectExists para verificar se o projeto 
 * existe
 */
server.delete('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(p => p.id == id);

  projects.splice(projectIndex, 1); // deleta 1 item a partir do item informado

  return res.send();
});

/**
 * Route params: id;
 * Adiciona uma nova task no projeto escolhido via parametro id; 
 * atraves do parametro title do body
 * usando middleware checkProjectExists
 */
server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
  const { id } = req.params;  // usando desestruturação
  const { title } = req.body; // title do body

  const project = projects.find(p => p.id == id);

  project.tasks.push(title);

  return res.json(project); // retorna o item do array alterado
});

// aguardar requisições na porta 3333
server.listen(3333);