# Explicação técnica

1. **Qual é a diferença entre JSONPlaceholder e DummyJSON?**  
   O JSONPlaceholder retorna diretamente um array de publicações. A DummyJSON retorna um objeto com o array dentro da propriedade `posts`, além de informações como `total`, `skip` e `limit`. Cada publicação da DummyJSON também possui `tags`, `reactions` e `views`.

2. **Por que utilizamos `dados.posts`?**  
   Depois de converter a resposta para JSON, `dados` é o objeto completo da resposta. O array que podemos percorrer está na propriedade `posts`, por isso usamos `dados.posts` antes de aplicar `slice`, `map` ou `filter`.

3. **O que o primeiro `await` aguarda?**  
   O primeiro `await` aguarda a conclusão da requisição feita por `fetch("https://dummyjson.com/posts")`. Ao terminar, recebemos o objeto `Response` e podemos verificar `resposta.ok`.

4. **O que o segundo `await` aguarda?**  
   O segundo `await` aguarda a leitura e conversão do corpo da resposta para um objeto JavaScript por meio de `resposta.json()`.

5. **Onde existe uma callback no projeto?**  
   `carregarPublicacoes` é passada como callback em `botaoCarregar.addEventListener("click", carregarPublicacoes)`, e `filtrarPublicacoes` é passada como callback do evento `input`. A função `criarCartao` também é usada como callback de `map`.

6. **Como `map()` participa da criação dos cartões?**  
   `exibirPublicacoes` chama `publicacoes.map(criarCartao).join("")`. O `map` executa `criarCartao` para cada objeto e transforma cada publicação em uma string HTML; depois, `join` reúne as strings para inseri-las no mural.

7. **Como `filter()` participa da pesquisa?**  
   `filtrarPublicacoes` monta um texto com título, conteúdo e tags em letras minúsculas. O `filter` mantém somente as publicações cujo texto contém o termo digitado usando `includes`, também ignorando diferenças entre maiúsculas e minúsculas.

8. **O que acontece quando a requisição falha?**  
   Se o `fetch` falhar ou `resposta.ok` for falso, o erro é tratado pelo `catch`. A interface mostra “Não foi possível carregar os dados. Tente novamente.”, o erro é registrado no console e o `finally` reabilita o botão e encerra o estado ocupado.

9. **Qual foi a maior dificuldade encontrada?**  
   A principal dificuldade foi adaptar o código que esperava um array direto para a estrutura da DummyJSON, em que as publicações estão dentro de `dados.posts`. Também foi necessário acessar corretamente os dados aninhados em `reactions.likes`.

10. **Que alteração foi feita além da adaptação mínima?**  
   Foi criado um seletor de ordenação por curtidas ou visualizações. A ordenação é aplicada aos resultados atuais da pesquisa. Além disso, os cartões exibem a quantidade de `dislikes` e a interface soma e mostra o total de curtidas dos cartões exibidos.