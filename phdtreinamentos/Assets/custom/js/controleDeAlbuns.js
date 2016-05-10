function confirmaExclusao(obj_call)
{
	var id = $(obj_call).data('alb-id');
	$("#simModal").attr('data-alb-id', id);
	$("#cormirmaModalAlbuns").modal('show');
}

function excluirAlbum(obj_call)
{
	escondeErroDelete();
	var id = $(obj_call).data('alb-id');
	exibeLoadingModal();
	// trocada a forma de excluir imagens pois agora esta tudo no ftp
	// $.post('API/controllers/ajaxDeletaAlbum.php', {alb_id:id})
	$.post('API/controllers/ajaxDeletaAlbumFtp.php', {alb_id:id})
		.done(function(data)
		{
			data = JSON.parse(data);
			console.log(data);

			if (data.status != undefined && data.status == 'OK')
			{
				location.reload();
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

