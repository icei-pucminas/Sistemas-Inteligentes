import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.JSONValue;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.HashMap;

/*
Esse código é responsável por enviar as características de áudio de uma música (valence, energy, etc)
e obter de volta a classe prevista (triste, alegre, etc). O serviço que receberá esses dados é o que foi
feito deploy nos vídeos - o serviço web do nosso modelo na Azure.

Funciona em 4 passos principais:

1) Constrói o objeto da chamada HTTP a ser enviado ao serviço web do modelo
2) Coloca como o `body` da chamada HTTP as características de áudio que são classificados
3) Envia a requisição ao serviço
4) Recebe a resposta em JSON e a converte para uma List de HashMaps. O retorno do modelo
   contém as características de cada áudio enviadas, a probabilidade de cada set de características
   pertencer a uma classe e a classe prevista.
*/

public class Main {
    // Endpoint do modelo. Para mais informações, ver o seguinte
    // vídeo no tempo já marcado: https://youtu.be/jTUvOlWBuVw?t=188.
    // O endpoint está presente no campo "REST Endpoint" no serviço web do modelo.
    private static final String MODEL_URL = "";
    
    // Chave de API do seu serviço na Azure. Para mais informações assistir o seguinte
    // vídeo no tempo já marcado: https://youtu.be/jTUvOlWBuVw?t=188
    // A chave está presente no campo "Primary Key" no serviço web do modelo.
    private static final String API_KEY = "";

    public static void main(String[] Args) throws Exception {
        // Construímos a nosso objeto HTTP que será enviado ao servidor do modelo. 
        // O `API_KEY` é utilizado nos headers e os dados enviados são atribuídos ao objeto
        // na linha 43 por meio da função `.sampleData`
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder().uri(URI.create(MODEL_URL))
                .headers("Content-Type", "application/json", "Authorization", "Bearer " + API_KEY)
                .POST(HttpRequest.BodyPublishers.ofString(sampleData()))
                .build();

        try {
            // Realiza-se a chamada HTTP para o servidor do modelo. O objeto `client` definido na linha 40
            // chama o método `#send` passando o request da linha 41, que é quem contém as informações da URL, 
            // autenticação com a API_KEY e os dados a serem classificados.
            HttpResponse<String> response  = client.send(request, HttpResponse.BodyHandlers.ofString());
            
            // Convertemos a reposta para uma List de objetos de HashMap. Nas linhas 86-111 há um exemplo de retorno
            // da função `.responseMapBody`.
            List<Map<String, Object>> classification = responseMapBody(response.body());
            System.out.println(classification);
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
        }
    }

    // Cria caracteristicas fakes de áudio a serem classificadas, neste caso há somente um objeto
    // na lista, porém podem ser quantos forem necessários. Mais explicadas no vídeo https://youtu.be/jTUvOlWBuVw
    private static String sampleData() {
        JSONArray array = new JSONArray();
        JSONObject item = new JSONObject();
        item.put("class", "");
        item.put("valence", 3.9394);
        item.put("energy", 1);
        item.put("liveness", 1);
        item.put("speechiness", 1);
        item.put("instrumentalness", 1);
        item.put("tempo", 150);
        item.put("danceability", 8.393);
        item.put("acousticness", 0.992);

        array.add(item);

        return array.toString();
    }

    /*
    Recebe como argumento o retorno da chamada ao modelo, que é uma string, a
    converte para JSON e depois para uma lista de HashMap.
        
    Exemplo de retorno:
    [
      {
         "Scored Probabilities_feliz": 2.0532116841698607E-6,
         "Scored Probabilities_dormir": 9.48652830187802E-28,
         "Scored Probabilities_foco": 2.0256458418315827E-14,
         "Scored Probabilities_correr": 0.9982468202418197,
         "Scored Probabilities_gaming": 0.001751024180401978,
         "Scored Probabilities_energetico": 1.9553258735535537E-11,
         "Scored Probabilities_triste": 6.480293395209065E-16,
         "Scored Probabilities_calmo": 1.0234652002373781E-7,
         "liveness": 1.0,
         "tempo": 150.0,
         "valence": 3.9394,
         "instrumentalness": 1.0,
         "danceability: 8.393,
         "speechiness": 1.0,
         "acousticness": 0.992,
         "class": "", 
         "energy" 1.0
         "Scored Labels": "correr", 
      },
      {
        ...      
      },
      ...
    ]
    
    Cada HashMap contém as características de áudio que foram enviadas para a classificação (liveness,
    tempo, valence, instrumentalness, danceability, speechiness, acousticness, energy), a probabilidade
    delas pertencerem a cada uma das classes (Scored Probabilities_feliz, Scored Probabilities_dormir,
    Scored Probabilities_correr, Scored Probabilities_gaming, Scored Probabilities_energetico,
    Scored Probabilities_triste, Scored Probabilities_calmo) e, por fim, a classe prevista (Scored Labels),
    que nada mais é a classe com a maior probabilidade das características pertencerem
    */
    private static List<Map<String, Object>> responseMapBody(String body) {
        Map<String, Object> hm;
        List<Map<String, Object>> res = new ArrayList<>();

        // Parseia a resposta em string para JSON
        Object obj = JSONValue.parse(body);
        JSONObject jsonObject = (JSONObject) obj;
        
        // O retorno do modelo vem dentro da chave `result` 
        JSONArray objs = (JSONArray) jsonObject.get("result"); 

        // Iterar sobre os objetos do `result`, onde cada um representa o resultado da classificação de um set
        // de características de áudio do Spotify
        for (Object _obj : objs) {
            hm = new HashMap<>();
            // Obtém o set de chaves do objeto e itera sobre eles, acessando o valor de cada um 
            // e o adicionando no dicionário em Java a ser retornado
            for (Object o : ((JSONObject) _obj).keySet()) {
                String key = (String) o;
                hm.put(key, ((JSONObject) _obj).get(key));
            }
            res.add(hm);
        }

        return res;
    }
}
