// server infos
const uuid = 'c5a5c2be-9b80-466b-bd42-8f1dd34ea0f1'; // uuid gerado pela requisição comentada no fim do arquivo.
const server = 'https://news-api-node.herokuapp.com/api/v1/news/';
const url = server + uuid;

// elementos html
const post = document.getElementById('post');      // post form 
const posts = document.getElementById('posts');    // post list of li's
const postSendMessage = document.getElementById('post-message')
const postSendButton = document.getElementById('post-send-button');

// função para listar todos os posts
function listPosts() {
    // o que acontece após a requisição ter sido concluída
    const action = function() {
        // caso a requisição der errado, retorna um alerta e para a execução da função. 
        if (this.status != 200) {
            alert('Ops! parece que houve um erro ao tentar se conectar ao servidor.\n\nCodigo de erro' + this.status);
            return false;
        }
        // o retorno de response vem em texto, precisamos converte-lo para JSON
        // a conversão é guardada numa var list.
        const emptyList = '<li>Não há registro</li>'
        const list = JSON.parse(this.responseText);
        // var para guardar o html da lista de posts 
        let html = '';
        for(i = 0; i < list.length; i++) {
            // html = '<li><a href="?id='+list[i].id+'">' + list[i].post + '</a></li>' + html;
            html = '<li>' + list[i].post + ' <a href="javascript:deletePost(' + list[i].id + ')">[apagar]</a></li>' + html;
        }
        // retorna a lista no html
        posts.innerHTML = html || emptyList;
        return true;
    };
    // faz a requisição buscando posts existentes:
    makeRequest(url, 'get', null, action);
}
// função para mudar o estado do botão de envio
// state=0: desativa botão 
// state=1: ativa botão
function buttonState(state) {  
    if (state == 0) { 
        postSendButton.disabled = true;
        postSendButton.innerText = 'Enviando...';
    } else {
        postSendButton.disabled = false;
        postSendButton.innerText = 'Enviar Post';
    }
}
// função para criar post 
function createPost() {
    const message = postSendMessage.value.trim();
    if (message.length == 0) { 
        alert('Escreva uma mensagem para o post.');
        return false;
    }
    buttonState(0);    
    const action = function() {
        buttonState(1);
        if (this.status != 201) {
            alert('Ops! parece que houve um erro ao tentar enviar para o servidor. \n\nCodigo de erro: ' + this.status);
            return false;
        }
        postSendMessage.value = '';
        alert('Post Enviado!');
        listPosts();
        return  true;
    }
    makeRequest(url, 'post', {post: message}, action);
}
function deletePost(id) {
	const urlDelete = url + '/' + id;
	
	const action = function() {
		if (this.status != 200) {
            alert('Ops! parece que houve um erro ao tentar deletar este post. \n\nCodigo de erro: ' + this.status);
            return false;
        }		
		alert('Post Apagado!');
		listPosts();
		return true;
	};

	
	if (!confirm('deseja apagar esse post?')) return false;
	
	
	makeRequest(urlDelete, 'delete', null, action);
}

function makeRequest(url, method, data, callback) {

    const request = new XMLHttpRequest();
    request.onload = callback;
    request.onerror = function() {
        alert('Erro no envio da requisição. Verifique sua internet!')
    }
    request.open(method, url, true);
    
    request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    
    request.send(JSON.stringify(data));
}

listPosts();    

postSendButton.onclick = createPost;

