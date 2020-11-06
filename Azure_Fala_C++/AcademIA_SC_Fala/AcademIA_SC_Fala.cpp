#include <iostream>
#include <fstream>
#include <string>
#include <speechapi_cxx.h>


using namespace std;
using namespace Microsoft::CognitiveServices::Speech;
using namespace Microsoft::CognitiveServices::Speech::Audio;

auto autenticacao = SpeechConfig::FromSubscription("<INSIRA AQUI A SUA KEY DO RECURSO>", "<INSIRA AQUI A REGIÃO EM QUE O RECURSO É HOSPEDADO>"); // DECLARAÇÃO DA AUTENTICAÇÃO DO RECURSO
auto requisicao_textofala = SpeechSynthesizer::FromConfig(autenticacao); // DECLARAÇÃO DO OBJETO DE REQUISIÇÃO DE TEXTO EM FALA DO RECURSO
auto audio_config = AudioConfig::FromDefaultMicrophoneInput(); // DECLARAÇÃO DA ENTRADA DO MICROFONE
auto requisicao_falatexto = SpeechRecognizer::FromConfig(autenticacao, audio_config); // DECLARAÇÃO DO OBJETO DE REQUISIÇÃO DE FALA EM TEXTO DO RECURSO

// PROCEDIMENTO QUE REQUISITA DA API A TRANSFORMAÇÃO DE UM TEXTO EM FALA
void texto_em_fala(string Texto)
{
    cout << Texto + "\n";
    requisicao_textofala->SpeakTextAsync(Texto).get(); // REQUISIÇÃO DA SINTETIZAÇÃO DE TEXTO EM FALA
}
// FUNÇÃO QUE REQUISITA DA API O RECONHECIMENTO DE UMA FALA E A TRANSFORMAÇÃO DESSA FALA EM UM TEXTO
string fala_em_texto() {
    auto resultado = requisicao_falatexto->RecognizeOnceAsync().get(); // REQUISIÇÃO DO RECONHEIMENTO DE FALA EM TEXTO
    cout << resultado->Text + "\n";
    return resultado->Text; //CONVERSÃO DO RESULTADO DO RECONHECIMENTO EM TEXTO
}

int main()
{
    cout << "AZURE - SERVICO COGNITIVO DE FALA\n";
    string key = "", region = "";
    cout << "Informe a key do recurso: ";
    cin >> key;                 // ENTRADA DA CHAVE DO RECURSO
    cout << "Informe a regiao em que o recurso e hospedado: ";
    cin >> region;              // ENTRADA DA REGIÃO EM QUE O RECURSO FOI HOSPEDADO
    cout << "--------------------------------------------------------------\n";

    autenticacao = SpeechConfig::FromSubscription(key, region);         //  AUTENTICAÇÃO DO RECURSO COM A CHAVE E REGIÃO INFORMADOS PELO USUÁRIO 
    autenticacao->SetSpeechRecognitionLanguage("pt-BR");                //  CONFIGURAÇÃO DA AUTENTICAÇÃO PARA O RECONHECIMENTO DE FALA EM PORTUGUÊS 
    autenticacao->SetSpeechSynthesisLanguage("pt-BR");                  //  CONFIGURAÇÃO DA AUTENTICAÇÃO PARA A SINTETIZAÇÃO DE FALA EM PORTUGUÊS 
    autenticacao->SetSpeechSynthesisVoiceName("pt-BR-HeloisaRUS"); //pt-BR-Daniel  // CONFIGURAÇÃO DA AUTENTICAÇÃO COM UMA VOZ ESPECÍFICA 
    requisicao_textofala = SpeechSynthesizer::FromConfig(autenticacao); //  REDEFINIÇÃO DO OBJETO REQUISICAO_TEXTOFALA COM AS NOVAS CONFIGURAÇÕES 
    requisicao_falatexto = SpeechRecognizer::FromConfig(autenticacao, audio_config); //  REDEFINIÇÃO DO OBJETO REQUISICAO_FALATEXTO COM AS NOVAS CONFIGURAÇÕES


    try
    {
        texto_em_fala("SISTEMA LIGADO");
        texto_em_fala("Qual e o seu nome?");
        string nome = fala_em_texto();
        texto_em_fala("Ola " + nome + "! Informe a sua senha: ");
        string senha = fala_em_texto();
        texto_em_fala("Verificando. . .");

        if (senha == ("123456.")) {
            texto_em_fala("ACESSO CONCEDIDO");
        }
        else {
            texto_em_fala("ACESSO NEGADO");
        }
    }
    catch (exception e)
    {
        cout << e.what();
    }
    return 0;
}