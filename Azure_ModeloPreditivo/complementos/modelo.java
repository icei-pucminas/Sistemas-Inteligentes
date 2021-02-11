import java.net.http.*;
import java.util.*;
import java.net.*;

public class modelo{


	public static void main(String[] Args)throws Exception{
	
		/**
			Importante lembrar de entregar dados em modelo JSON, em java necessario usar caracteres de escape, como ' \" ' para imprimir uma aspas
		
		**/
		String body = "elementos a serem enviados para a API";
		
		

		String url = "Sua URL";//encontrada na pagina de detalhes da API criada
		
   		HttpClient client = HttpClient.newHttpClient();
		HttpRequest req = HttpRequest.newBuilder()
		                .uri(URI.create(url)).header("Content-Type","application/json").header("Authorization","Bearer *CODIGO DE AUTORIZACAO*")//Nao esquecer do espaço apos o bearer 
		                .header("Accept","application/json")
		                .POST(HttpRequest.BodyPublishers.ofString(body))
		                .build();
		                
		HttpResponse<String> resp = client.send(req,HttpResponse.BodyHandlers.ofString());
		
		MyIO.println(resp.body());//usando MyIO do Max, caso nao possua pode ser alterado para System.out.println()
	}
}
