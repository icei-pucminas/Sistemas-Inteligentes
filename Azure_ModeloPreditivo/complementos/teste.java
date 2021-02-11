import java.net.http.*;
import java.util.*;
import java.net.*;

public class teste{


	public static void main(String[] Args)throws Exception{
	
		String body = "{\"Inputs\": {\"input1\": [{\"senha\": \"kzde5577\",\"special character\": 0,\"uppercase\": 0,\">=8\": 1,\"number\": 1,\"strength\": 1}]},\"GlobalParameters\": {}}";

		String url = "https://ussouthcentral.services.azureml.net/workspaces/34c27db996a549be84d8289e923d4da0/services/6cf1f6cbd1a64b2ca1125c5cffc91f4a/execute?api-version=2.0&format=swagger";
		
   		HttpClient client = HttpClient.newHttpClient();
		HttpRequest req = HttpRequest.newBuilder()
		                .uri(URI.create(url)).header("Content-Type","application/json").header("Authorization","Bearer KFMY5hDLlxtxNlL9mzGh/1TLkoe/xx2KkmFb5taAyrOtSOaCuRutrHc7G0+aaePmLshfT5XlEt6jBaWCx+8cEA==").header("Accept","application/json")
		                .POST(HttpRequest.BodyPublishers.ofString(body))
		                .build();
		HttpResponse<String> resp = client.send(req,HttpResponse.BodyHandlers.ofString());
		        System.out.println(resp.body());

		 	
		 
		 

	
	
	
	}



}
