window.onload = () =>{
  //Ao adicionar um arquivo no input, chama a função post;
    document.getElementById('arq').addEventListener('change', pdfHandler, false);
  //Ao clicar no botão PDF, chama a função get e preenche os campos;
    document.getElementById('btn_pdf').addEventListener('click', retrurnJson, false);
}

pdfHandler = (e) => {
  //Lê o arquivo do input e o formata
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    let formData = new FormData();
    formData.append("file", e.target.files[0]);
  //URL da API criada no localhost para o post
    let url = "http://127.0.0.1:3002/api/analyze/";
  //POST
    axios
      .post(url, formData, {
        headers: {
          "content-type": "application/pdf",
          "Ocp-Apim-Subscription-Key": "267a6513a34b45bb8c045a7099016532",
        },
      })
      .then((res) => {
        console.log(res);
        let rec = res.data.output[0].fields;
      });
    alert("Obtendo informações! Espere um momento e depois clique em PDF para preencher os campos.");
  };

retrurnJson = () => {
  //URL da API criada no localhost para o get
    let url = "http://127.0.0.1:3002/api/json/";
    //GET 
    axios
      .get(url)
      .then((res) => {
        console.log(res);
        
        //rec recebe o campo de dados das análises
        let rec = res.data;
        //função render que preenche os campos do formulário com os dados
        render(rec);
    });
  };
 
function render(rec){
    var nome = "";
    var sobrenome = "";
    var email = "";
    var periodo = "";
    var curso = "";
    var telefone = "";

  //Trata os campos do JSON pois nem sempre estão na mesma ordem no array
    for(var i in rec.output){
      if (rec.output[i].Nome){
        nome = rec.output[i].Nome;
      }if (rec.output[i].Sobrenome){
        sobrenome = rec.output[i].Sobrenome;
      }if (rec.output[i].Email){
        email = rec.output[i].Email;
      }if (rec.output[i].Periodo){
        periodo = rec.output[i].Periodo;
      }if (rec.output[i].Curso){
        curso = rec.output[i].Curso;
      }if (rec.output[i].Telefone){
        telefone = rec.output[i].Telefone;
      }
    }

  //Preenche os campos do formulário
    $("#prenome").val(nome + " " + sobrenome);
    $("#email").val(email);
    $("#periodo").val(periodo);
    $("#curso").val(curso);
    $("#telefone").val(telefone);
  }