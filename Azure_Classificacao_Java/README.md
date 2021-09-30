# Azure | Classificação Multiclasse em Java

Aqui aprenderemos como treinar um modelo de classificação multiclasse (Rede Neural Multiclasse) na Azure, como implantar e depois consumir o modelo utilizando novos dados.

## Contexto

Na Azure, os algoritmos de classificação suportados podem ser encontrados nesse [link](https://docs.microsoft.com/pt-br/azure/machine-learning/how-to-select-algorithms#comparison-of-machine-learning-algorithms). Aqui iremos focar somente nos de multiclasse, e, em específico, a Rede Neural Multiclasse.

Uma Rede Neural Multiclasse pode ser utilizada em tarefas de pesquisa visual computacional complexas, como reconhecimento de letra ou dígitos, classificação de documentos e reconhecimento de padrões ([Módulo Rede Neural Multiclasse, Azure](https://docs.microsoft.com/pt-br/azure/machine-learning/algorithm-module-reference/multiclass-neural-network?WT.mc_id=docs-article-lazzeri#about-neural-networks))

## Problema

Tendo algumas classes existentes, como dormir, correr e focar, classificar músicas do Spotify em sua classe mais apropriada dada as suas características de áudio.

Iremos treinar o algoritmo com diversas músicas e sua respectiva classe. Playlists com temas pré-estabelecidos foram pesquisadas e as suas músicas obtidas, então, por exemplo, as músicas de uma playlist triste foram utilizadas para treinar o algoritmo sobre o que seria uma música triste.

A entidade música é na verdade um set de características de áudio e um identificador. Essas características são explicadas mais na seção de Dados abaixo.

## Dados

Todas as músicas do Spotify contêm características de áudio. As que iremos utilizar nesse exemplo são as seguintes:

- acousticness
- danceability
- energy
- instrumentalness
- liveness
- loudness
- speechiness
- tempo
- valence

O significado de cada característica pode ser encontrado na [documentação do Spotify](https://developer.spotify.com/documentation/web-api/reference/#object-audiofeaturesobject).

O dataset utilizado está presente no seguinte [link](https://gist.github.com/danielSbastos/9a57551c883ded195e9e1be6c967ccda) e foi gerado por um [script em Python](https://github.com/danielSbastos/vibe-fi/blob/master/scripts/requests-spotify.py)

Com as características de áudio e qual classe cada uma pertence, podemos agora treinar o modelo.

## Passos

 1. Criar um Workspace na Microsoft Azure Machine Learning
 2. Importar um dataset
 3. Criar um pipeline e treinar um modelo 
 4. Publicar o modelo em um serviço web
 5. Baixar os arquivos para o serviço web
 6. Testar o modelo
 7. Programando em Java para realizar as chamadas

### 1. Criar um Workspace na Microsoft Azure Machine Learning

Seguir o [tutorial da própria Microsoft](https://docs.microsoft.com/pt-br/azure/machine-learning/how-to-manage-workspace?tabs=azure-portal).

### 2. Importar um dataset

[Vídeo](https://youtu.be/8RP4Gp5VZAM)
 
### 3. Criar um pipeline e treinar um modelo 

[Vídeo](https://youtu.be/iZs0rBS2gFk)

### 4. Publicar o modelo em um serviço web

[Vídeo](https://youtu.be/gluOhQOVV3E)

### 5. Baixar os arquivos para o serviço web

O arquivos no vídeo podem ser acessados em [`score.py`](https://github.com/danielSbastos/vibe-fi/blob/master/scripts/score2.py)
e [`conda_env.yaml`](https://github.com/danielSbastos/vibe-fi/blob/master/scripts/conda_env2.yaml) 

[Vídeo](https://youtu.be/8JgRNa9Golw)

### 6. Testar o modelo

[Vídeo](https://youtu.be/jTUvOlWBuVw)

### 7. Programando em Java para realizar as chamadas

Obs: se você utilizar algum IDE que já baixe o `.jar`, configure o CLASSPATH, compile e rode programas em Java, como o Eclipse,
pode ignorar todos os passos abaixo, menos o de configurar as constantes.

- Você deve baixar antes o `.jar` do pacote `org.json.simple` e o deixar nessa pasta. Link para download: [http://www.java2s.com/Code/Jar/j/Downloadjsonsimple11jar.htm](http://www.java2s.com/Code/Jar/j/Downloadjsonsimple11jar.htm)
- Altere as constantes `MODEL_URL` e `API_KEY` em `Main.java` com os valores do seu serviço
- Executar o código [`Main.java`](https://github.com/icei-pucminas/Sistemas-Inteligentes/blob/main/Azure_Classificacao_Java/Main.java) com o seguinte comando:

`javac -cp json-simple-1.1.jar Main.java && java -cp .:json-simple-1.1.jar Main`

O resultado deve ser algo similar com o exemplo abaixo:

```bash
[{Scored Probabilities_feliz=2.0532116841698607E-6, Scored Probabilities_dormir=9.48652830187802E-28, Scored Probabilities_foco=2.0256458418315827E-14, Scored Probabilities_correr=0.9982468202418197, liveness=1.0, Scored Probabilities_gaming=0.001751024180401978, tempo=150.0, Scored Probabilities_energetico=1.9553258735535537E-11, valence=3.9394, instrumentalness=1.0, danceability=8.393, Scored Probabilities_triste=6.480293395209065E-16, speechiness=1.0, Scored Probabilities_calmo=1.0234652002373781E-7, Scored Labels=correr, acousticness=0.992, class=, energy=1.0}]
```
