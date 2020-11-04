#include <iostream>
#include <fstream>
#include <string>
#include <speechapi_cxx.h>
#include <locale.h>

using namespace std;
using namespace Microsoft::CognitiveServices::Speech;
using namespace Microsoft::CognitiveServices::Speech::Audio;

auto autenticacao = SpeechConfig::FromSubscription("<INSIRA AQUI A SUA KEY DO RECURSO>", "<INSIRA AQUI A REGIÃO EM QUE O RECURSO É HOSPEDADO>"); 
auto requisicao_textofala = SpeechSynthesizer::FromConfig(autenticacao);
auto audio_config = AudioConfig::FromDefaultMicrophoneInput();
auto requisicao_falatexto = SpeechRecognizer::FromConfig(autenticacao, audio_config);

void texto_em_fala(string Texto)
{
    cout << Texto + "\n";
    requisicao_textofala->SpeakTextAsync(Texto).get();
}

string fala_em_texto() {
    auto resultado = requisicao_falatexto->RecognizeOnceAsync().get();
    cout << resultado->Text+ "\n";
    return resultado->Text;
}

int main()
{
    setlocale(LC_ALL, "pt-BR");
    autenticacao->SetSpeechRecognitionLanguage("pt-BR");
    autenticacao->SetSpeechSynthesisLanguage("pt-BR");
    autenticacao->SetSpeechSynthesisVoiceName("pt-BR-HeloisaRUS"); //pt-BR-HeloisaRUS
    requisicao_textofala = SpeechSynthesizer::FromConfig(autenticacao);
    requisicao_falatexto = SpeechRecognizer::FromConfig(autenticacao, audio_config);

    try
    {
        texto_em_fala("SISTEMA LIGADO");
        texto_em_fala("Qual é o seu nome?");
        string nome = fala_em_texto();
        texto_em_fala("Olá "+nome+"! Informe a sua senha: ");
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
