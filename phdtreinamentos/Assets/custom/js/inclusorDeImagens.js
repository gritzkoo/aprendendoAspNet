$(function()
{
	$('#file_upload').uploadify(
	{
		'formData': 
		{
			'alb_id' : $("#alb_id").val()
		},
		'swf'      : 'assets/uploadify/uploadify.swf',
		'uploader' : 'API/controllers/uploadifyController.php',
		'onQueueComplete' : function(queueData) {
			$("#recarregador").show();
            location.reload();
        }
	});

	$("a[rel=example_group]").fancybox({
				'transitionIn'		: 'none',
				'transitionOut'		: 'none',
				'titlePosition' 	: 'over',
				'titleFormat'		: function(title, currentArray, currentIndex, currentOpts) {
					return '<span id="fancybox-title-over">Image ' + (currentIndex + 1) + ' / ' + currentArray.length + (title.length ? ' &nbsp; ' + title : '') + '</span>';
				}
			});



	$("#sortable").sortable(
	{
		update: function( event, ui )
		{
			$("#loadinReordenar").show();
			var dados = [];
			$(".div-inline-block").each(function(index)
			{
				dados.push({'aif_id':$(this).data('imagem-existente'), 'aif_posicao':index});
			});

			console.log({'dados':dados,'event':event,'ui':ui});

			fechaErroEditarOrdem();

			$.post('API/controllers/ajaxOrganizadorDeImagemController.php',
			{
				'dados':dados

			}).done(function(data)
			{
				data = JSON.parse(data);
				console.log(data);

				if (data.status != undefined && data.status == 'OK')
				{
					$("#loadinReordenar").hide();
				}
				else
				{
					$("#loadinReordenar").hide();
					exibeErroEditarOrdem(data.message);
				}
			});
			// 
		}
	});
});

function salvarDadosAlbum()
{
	var alb_id = $("#alb_id").val();
	var tal_id = $("#tal_id").val();
	var alb_titulo = $("#alb_titulo").val();
	var alb_descricao = $("#alb_descricao").val();

	$.post('API/controllers/editorDeAlbumController.php',
	{
		'alb_id':alb_id,
		'tal_id':tal_id,
		'alb_titulo':alb_titulo,
		'alb_descricao':alb_descricao
	
	}).done(function(data)
	{
		data = JSON.parse(data);
		console.log(data);

		if (data.status != undefined && data.status == 'OK')
		{
			window.location = './index.php?url=inclusorDeImagens&tipo=' + data.data.tal_id + '&id=' + data.data.alb_id;
		}
		else
		{
			alert(data.message);
		}

	});
}

function excluirDoRepositorio(obj_call)
{
    var aif_id = $(obj_call).data('aif-id');
    var aif_nome = $(obj_call).data('aif-nome');
    $("#simModal").data('aif-id', aif_id);
    $("#simModal").data('aif-nome', aif_nome);
    $("#cormirmaModal").modal('show');
}

function confirmaExclusao(obj_call)
{
    var aif_id = $(obj_call).data('aif-id');
    var aif_nome = $(obj_call).data('aif-nome');

    exibeLoadingModal();
    escondeErroDelete();
    $.post('API/controllers/ajaxDeletaImagemFtp.php',
	{
		'aif_id':aif_id,
		'aif_nome':aif_nome

	}).done(function(data)
    {
        data = JSON.parse(data);

        if (data.status != undefined && data.status == 'OK')
        {
            escondeLoadingModal();
            console.log('id dentro do Jpost: '+aif_id);
            $("[data-imagem-existente="+aif_id+"]").remove();
            excluirImagemExistente(aif_id);
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

function excluirImagemExistente(id)
{
    $("[data-imagem-existente="+id+"]").remove();
}

function atualizaDescricaoImagem(obj_call)
{
    var aif_id = $(obj_call).data('id');
    var aif_descricao = $("input[name=editorDescricao][data-descricao-id="+aif_id+"]").val().trim();
    exibeLoadingAlteraDescricao(aif_id);
    escondeErroEditar(aif_id);
    $.post('API/controllers/ajaxAtualizaDescricaoImagemFtp.php',
    {
    	'aif_id':aif_id, 
    	'aif_descricao':aif_descricao

    }).done(function(data)
    {
        data = JSON.parse(data);
        console.log(data);

        if (data.status != undefined && data.status == 'OK')
        {
            escondeLoadingAlteraDescricao(aif_id);

        }
        else
        {
            exibeErroEditar(aif_id, data.message);
            escondeLoadingAlteraDescricao(aif_id);
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

function fechaErroEditarOrdem()
{
	$("div[name=alertEditaOrdem]").hide();
	$("span[name=alertEditaOrdem]").html('');
}

function exibeErroEditarOrdem(msg)
{
	$("span[name=alertEditaOrdem]").html(msg);
	$("div[name=alertEditaOrdem]").show();
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