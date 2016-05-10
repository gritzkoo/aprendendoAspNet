//variável de controle para poder conter os elementos da canvas de crop
var canvas = document.getElementById('viewport'),
context = canvas.getContext('2d');
//variavel de controle do preview para mudar de tamanho

var PREVIEW  = document.getElementById('preview');

//variavel de controle do index de imagens para a prévisualização
var INDEX = 0, QUANTIDADE = 0;

//variavel de controle para linkar imagem ao input hidden para excluir no click do thumbnail
var DATA_REF = 0;
// make_base();
var AQUI;

//função que coloca a imagem na canvas de crop
function make_base(url)
{
    var width, height, x = 0, y = 0;
    var base_image = new Image();
    base_image.src = url;
    base_image.onload = function ()
    {
        // width = base_image.width < 1920 ? base_image.width : 1920;
        // height = base_image.height < 1080 ? base_image.height : 1080;
        width = base_image.width;
        height = base_image.height;
        limpaCanvas(width, height);
        context.drawImage(base_image, x, y, width, height);
        escondeLoading();
    }
}

function limpaCanvas(width, height)
{
    AQUI.destroy();
    var tmp = document.createElement('canvas');
    tmp.width = width;
    tmp.height = height;
    tmp.id = 'viewport';
    $("#lugarDaCanvas").append(tmp);
    canvas = tmp;
    context = canvas.getContext('2d');
    testeNinja();
    // context.clearRect(0, 0, canvas.width, canvas.height);
}

//função que atualiza o préview da canvas de preview
function updatePreview(c) 
{
    if (parseInt(c.w) > 0)
    {
        // Show image preview
        var imageObj = $("#viewport")[0];
        if (imageObj != null && c.x != 0 && c.y != 0 && c.w != 0 && c.h != 0)
        {
            var myWidth = c.w, myHeigh = c.h;
            updatePreviewSize(myWidth, myHeigh);
        }

        var canvas = $("#preview")[0];
        var context = canvas.getContext("2d");

        if (imageObj != null && c.x != 0 && c.y != 0 && c.w != 0 && c.h != 0)
        {
            context.drawImage(imageObj, c.x, c.y, c.w, c.h, 0, 0, canvas.width, canvas.height);
        }
    }
}

function updatePreviewSize(width, height)
{
    PREVIEW.width = width;
    PREVIEW.height = height;
}

function readImage(input, index)
{
    if ( input.files && input.files[index] )
    {
        var FR= new FileReader();
        FR.onload = function(e)
        {
            make_base(e.target.result);
        };
        FR.readAsDataURL( input.files[index] );
    }
}

function validaInput()
{
    escondeErro();
    var array_de_extencoes = ['image/jpeg', 'image/jpg', 'image/png', 'image/bmp'];
    var inpuFile = $("#imagem")[0].files;
    $.each(inpuFile, function(k,v)
    {
        if ($.inArray(v.type, array_de_extencoes) === -1)
        {
            exibeErro('Arquivo '+ v.name +' não é uma imagem');
            limpaInputFile();
            return;
        }
    });
    INDEX = 0;
    QUANTIDADE = $("#imagem")[0].files.length;
    atualizaDados();
    iniciaEdicao();
}

function limpaInputFile()
{
  var inputFile = $("#imagem");
  inputFile.replaceWith( inputFile = inputFile.clone( true ) );
}

function exibeErro(message)
{
    $("#erroEXT").html(message);
    $("#divErros").show();
}

function escondeErro()
{
    $("#erroEXT").html('');
    $("#divErros").hide();
}


$('#viewport').Jcrop({
    onChange: updatePreview,
    onSelect: updatePreview,
    allowSelect: true,
    allowMove: true,
    allowResize: true,
    aspectRatio: 0
}, function(){
    AQUI = this;
});

function testeNinja()
{
    $('#viewport').Jcrop({
    onChange: updatePreview,
    onSelect: updatePreview,
    allowSelect: true,
    allowMove: true,
    allowResize: true,
    aspectRatio: 0
    }, function(){
        AQUI = this;
    });
}

function iniciaEdicao()
{
    if ( validaBotoes() ) return;
    readImage($("#imagem")[0], INDEX);
    atualizaDados();
    exibeLoading();
}

function proxima()
{
    if ( (INDEX + 1 > QUANTIDADE - 1) || validaBotoes() ) return;
    INDEX = INDEX + 1 > QUANTIDADE -1 ? INDEX : INDEX + 1;
    readImage($("#imagem")[0], INDEX);
    atualizaDados();
    exibeLoading();
}

function anterior()
{
    if ( INDEX == 0 || validaBotoes() ) return;
    INDEX = INDEX - 1 < 0 ? INDEX : INDEX - 1;
    readImage($("#imagem")[0], INDEX);
    atualizaDados();
    exibeLoading();
}

function atualizaDados()
{
    var trocaBaseZero = QUANTIDADE == 0 ? QUANTIDADE : INDEX + 1;
    $("#atual").html(trocaBaseZero);
    $("#total").html(QUANTIDADE);
}

function validaBotoes()
{
    return INDEX == 0 && QUANTIDADE == 0 ? true : false;
}

function exibeLoading()
{
    $("#loadingImagem").show();
}

function escondeLoading()
{
    $("#loadingImagem").hide();
}

function recortar()
{
    ++DATA_REF;
    var img = transformaEmImagem();
    var t = img.split('base64,');
    var descricao = $("#imagemDescricao").val();
    $("#imagemDescricao").val('');
    incluirImagemFormulario(t[1], DATA_REF, descricao);
    incluirExibicao(img, DATA_REF, descricao);
    controlaContadorDeImagensParaPost();
}

function recortaTudo()
{
    ++DATA_REF;
    var img = transformaEmImagemInteira();
    var t = img.split('base64,');
    var descricao = $("#imagemDescricao").val();
    $("#imagemDescricao").val('');
    incluirImagemFormulario(t[1], DATA_REF, descricao);
    incluirExibicao(img, DATA_REF, descricao);
    controlaContadorDeImagensParaPost();
}

function transformaEmImagemInteira()
{
    var preview = document.getElementById("viewport");
    var img    = preview.toDataURL("image/jpeg");
    return img;
}


function transformaEmImagem()
{
    var preview = document.getElementById("preview");
    var img    = preview.toDataURL("image/jpeg");
    return img;
}

function incluirImagemFormulario(binario, ref, descricao)
{
    var html = "<input data-ref='"+ref+"' type='hidden' name='aim_blob[]' value='"+binario+"'>"+
        "<input type='hidden' data-ref='"+ref+"' name='aim_descricao[]' value='"+descricao+"'>";
    $("#formAlbumEditor").append(html);
}

function incluirExibicao(binario, ref, descricao)
{
    var html = "<div class='div-inline-block' data-ref='"+ref+"'>"+
    "<img onclick='reVisualizar(this)' src='"+binario+"' class='img-thumbnail' title='"+descricao+"' style='width:100px;height:100px;'>"+
    "<span onclick='excluirAntesDoSave(this)' class='glyphicon glyphicon-remove' style='font-size:x-smal; color:red; cursor:pointer;' data-ref='"+ref+"'></span>"+
    "</div>";
    $("#lista").append(html);
}

function preVisualizar()
{
    var img = transformaEmImagem();
    $("#imgModal").attr('src', img);
    $("#myModal").modal("show");
}

function reVisualizar(obj_call)
{
    var img = $(obj_call).attr('src');
    $("#imgModal").attr('src', img);
    $("#myModal").modal("show");
}

function excluirAntesDoSave(obj_call)
{
    var ref = $(obj_call).data('ref');
    $("[data-ref=" + ref +"]").remove();
    controlaContadorDeImagensParaPost();
}

function controlaContadorDeImagensParaPost()
{
    $("#qtd").html($("input[name^=aim_blob]").length);
}

function enviarDados()
{
    var tipador = ['espacoNoiva', 'espacoNoivo', 'salao'];
    var tipo = $("#tipo").val();
    // var t = tipo == 1 ? 'espacoNoiva' : 'espacoNoivo'
    if (tipo == 4)
    {
        var url = './index.php?url=home';
    }
    else
    {
        var url = './index.php?url='+tipador[tipo-1];
    }
    exibeLoadingSave();
    escondeErroSave();
    
    $.post('API/controllers/albumController.php', $("#formAlbumEditor").serialize())
        .done(function(data)
        {
            data = JSON.parse(data);
            console.log(data);

            if (data.status != undefined && data.status == 'OK')
            {
                window.location = url;
            }
            else
            {
                exibeErroSave(data.message);
                escondeLoadingSave();
            }
        });
}

function exibeLoadingSave()
{
    $("#saveButton").attr('disabled', true);
    $("#loadingSave").show();

}

function escondeLoadingSave()
{
    $("#saveButton").attr('disabled', false);
    $("#loadingSave").hide();
}

function exibeErroSave(msg)
{
    $("#erroSave").html(msg);
    $("#divErrosSave").show();
}

function escondeErroSave()
{
    $("#erroSave").html('');
    $("#divErrosSave").hide();
}

function excluirDoRepositorio(obj_call)
{
    var id = $(obj_call).data('aim-id');
    $("#simModal").data('aim-id', id);
    $("#cormirmaModal").modal('show');
}

function confirmaExclusao(obj_call)
{
    var id = $(obj_call).data('aim-id');
    console.log($(obj_call).data);
    console.log('id fora do Jpost: '+id);
    exibeLoadingModal();
    escondeErroDelete();
    $.post('API/controllers/ajaxDeletaImagem.php', {aim_id:id})
        .done(function(data)
        {
            data = JSON.parse(data);

            if (data.status != undefined && data.status == 'OK')
            {
                escondeLoadingModal();
                console.log('id dentro do Jpost: '+id);
                $("[data-imagem-existente="+id+"]").remove();
                excluirImagemExistente(id);
                $("#cormirmaModal").modal('hide');
                escondeErroDelete();
            }
            else
            {
                exibeErroDelete(data.message);
                escondeLoadingModal();
            }
        });
}

function exibeLoadingModal()
{
    $("#simModal").attr('disabled',true);
    $("#naoModal").attr('disabled',true);
    $("#textoModal").hide();
    $("#loadingModal").show();
}

function escondeLoadingModal()
{
    $("#simModal").attr('disabled',false);
    $("#naoModal").attr('disabled',false);
    $("#textoModal").show();
    $("#loadingModal").hide();    
}

function excluirImagemExistente(id)
{
    $("[data-imagem-existente="+id+"]").remove();
}

function exibeErroDelete(msg)
{
    $("#erroDelete").html(msg);
    $("#erroDeleteAjax").show();
}

function escondeErroDelete()
{
    $("#erroDelete").html('');
    $("#erroDeleteAjax").hide();
}

function atualizaDescricaoImagem(obj_call)
{
    var aim_id = $(obj_call).data('id');
    var aim_descricao = $("input[name=editorDescricao][data-descricao-id="+aim_id+"]").val().trim();
    exibeLoadingAlteraDescricao(aim_id);
    escondeErroEditar(aim_id);
    $.post('API/controllers/ajaxAtualizaDescricaoImagem.php', {'aim_id':aim_id, 'aim_descricao':aim_descricao})
        .done(function(data)
        {
            data = JSON.parse(data);
            console.log(data);

            if (data.status != undefined && data.status == 'OK')
            {
                escondeLoadingAlteraDescricao(aim_id);

            }
            else
            {
                exibeErroEditar(aim_id, data.message);
                escondeLoadingAlteraDescricao(aim_id);
            }
        });
}

function exibeLoadingAlteraDescricao(id)
{
    $("button[name=buttonEdita][data-id="+id+"]").attr('disabled', true);
    $("img[name=loadingEdita][data-id="+id+"]").show();
}

function escondeLoadingAlteraDescricao(id)
{
    $("button[name=buttonEdita][data-id="+id+"]").attr('disabled', false);
    $("img[name=loadingEdita][data-id="+id+"]").hide();
}

function exibeErroEditar(id, msg)
{
    $("span[name=erroEdita][data-id="+id+"]").html(msg);
    $("div[name=alertEdita][data-id="+id+"]").show();
}

function escondeErroEditar(id)
{
    $("span[name=erroEdita][data-id="+id+"]").html('');
    $("div[name=alertEdita][data-id="+id+"]").hide();
}

function fechaErroEditar(obj_call)
{
    var id = $(obj_call).data('id');
    escondeErroEditar(id);
}


window.onload = atualizaDados;