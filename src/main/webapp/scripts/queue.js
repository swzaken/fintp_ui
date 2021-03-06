var refreshSeconds = 10;
var timeOut = refreshSeconds * 1000;

$(function() {
	$("#tabs").tabs();
	$(".accordion").accordion({
		heightStyle : "content",
		collapsible : true,
		active : false
	});
	$('.accordion input[type="checkbox"]').click(function(e) {
		e.stopPropagation();
	});

	$('.notGroupable').each(function() {
		loadTable($(this), true, false);
	});

	$('.isComposedMsgType').each(function() {
		
		loadTableIsComposed($(this), true, true);
	});

	$('.groupable').each(function() {
		loadTable($(this), false, false);
	});

	$("#itemsPerPage").change(function() {
		$(".fintpTable").each(function() {
			$(this).parent().find("input[name='page']").val(1);
			loadTable($(this), false);
		});
		$(".paginator").each(function() {
			loadPaginator($(this));
		});
	});
	completeBatchesBar();
	setInterval(function() {
		completeBatchesBar();
	}, timeOut);

});

function loadTable(table, isTotalRequested, isComposedMsgType, filterArguments) {

	var $parentDiv = table.parent();
	var $totalSpan = $parentDiv.find("span[class='total']");

	// get table fields (to read from json)
	var fields = new Array();
	table.find("thead").find("th").each(function() {
		var field = $(this).find("input[name='field']").val();
		if (field != null) {
			fields.push(field);
		}

	});

	// get pagination options
	var pageSize = $("#itemsPerPage").val();
	var page = table.parent().find("input[name='page']").val();

	// get sort values
	var sortField = table.parent().find("input[name='sortField']").val();
	var sortOrder = table.parent().find("input[name='sortOrder']").val();
	var id = table.parent().find("input[name='id']").val();
	var isParent = table.parent().find("input[name='isParent']").val();

	// if the table is grouped, find out the field names and
	// values in order to filter properly
	var groupFieldsNames = new Array();
	var groupFieldsValues = new Array();

	var $listKeys = table.parent().find("ul[class='groupFields']");
	var $listValues = table.parent().find("ul[class='groupValues']");
	var trnSearch = table.find("input[name='searchTrnValue']").val();
	var amntSearch =table.find("input[name='searchAmntValue']").val();
	$listKeys.find("li").each(function() {
		groupFieldsNames.push($(this).text());
	});

	$listValues.find("li").each(function() {
		groupFieldsValues.push($(this).text());
	});

	var $auxTbody = $("<tbody>");
	//alert($amntSearch+" - "+$trnSearch);
	$.ajax({

		data : {
			queue : $("#queueName").text(),
			type : table.find("input[name='messageType']").val(),
			page : page,
			pageSize : pageSize,
			sortField : sortField,
			sortOrder : sortOrder,
			isTotalRequested : isTotalRequested,
			groupFieldsNames : groupFieldsNames,
			groupFieldsValues : groupFieldsValues,
			trnSearch: trnSearch,
			amountSearch : amntSearch
		},
		method : 'POST',
		url : "../messagesDynamic",
		dataType : 'json',
		async : false,
		success : function(data) {
			for (var index = 0; index < data.messages.length; index++) {
				var message = data.messages[index];
			
			/*	if(isComposedMsgType && message.stmtuid== table.find("input[name='composedMsgId']").val())	{
				//	alert("afiseaza mesaje cu message.stmtuid=  " + message.stmtuid);
					var $tr = $("<tr>");
					
					$tr.attr("id", message.guid);
					$tr.attr("stmtuid", message.stmtuid);
				
				$tr.append($("<td>").append(
						$("<input>").attr("type", "checkbox").addClass(
								"routeCheckbox")).append(
						$("<button>").addClass("viewPayload")));
				
				
				jQuery.each(fields, function(i, fieldName) {
					$tr.append($("<td>").append(message[fieldName]));
				});
				$auxTbody.append($tr);
				
				}*/
				
				var $tr = $("<tr>");
					
						$tr.attr("id", message.guid);
						$tr.attr("stmtuid", message.stmtuid);
					
					$tr.append($("<td>").append(
							$("<input>").attr("type", "checkbox").addClass(
									"routeCheckbox")).append(
							$("<button>").addClass("viewPayload")));
					
					
					jQuery.each(fields, function(i, fieldName) {
						$tr.append($("<td>").append(message[fieldName]));
					});
					$auxTbody.append($tr);
				 }
					if (isTotalRequested) {
						$totalSpan.text(data.total);
						$parentDiv.find("input[name='total']").first().val(
								data.total);
					
		
			}
			table.find("tbody").remove();
			table.append($auxTbody);

			$("button.viewPayload").each(
					function() {
						$(this).button({
							icons : {
								primary : "ui-icon-folder-open"
							}
						});
						var $parentTable = $(this).closest("table");
						var messageId = $(this).closest("tr").attr("id");
						var messageStmtuid = $(this).closest("tr").attr("stmtuid");
						var messageType = $parentTable.find(
								"input[name='messageType']").val();
						var childMessageType = $parentTable.find(
								"input[name='childMessageType']").val();
						var isParent = $parentTable.find(
								"input[name='isParent']").val();

						if (isParent == 'false') {
							var functionCall = "viewPayload('" + messageId
									+ "', '" + messageType + "');";

						} else if (isParent == 'true') {
							var functionCall = "viewChild('" + messageStmtuid
									+ "','" + childMessageType + "');";

						}
						$(this).attr("onclick", functionCall);

					});

		},
		error : function(jqXHR, text, errorThrown) {
			// HandleAjaxError(jqXHR, text, errorThrown);
		}
	});

}
function loadTableIsComposed(table, isTotalRequested, isComposedMsgType, filterArguments) {

	var $parentDiv = table.parent();
	var $totalSpan = $parentDiv.find("span[class='total']");

	// get table fields (to read from json)
	var fields = new Array();
	table.find("thead").find("th").each(function() {
		var field = $(this).find("input[name='field']").val();
		if (field != null) {
			fields.push(field);
		}

	});

	// get pagination options
	var pageSize = $("#itemsPerPage").val();
	var page = table.parent().find("input[name='page']").val();

	// get sort values
	var sortField = table.parent().find("input[name='sortField']").val();
	var sortOrder = table.parent().find("input[name='sortOrder']").val();
	var id = table.parent().find("input[name='id']").val();
	var isParent = table.parent().find("input[name='isParent']").val();
	var amntSearch =table.find("input[name='searchAmntValue']").val();

	// if the table is grouped, find out the field names and
	// values in order to filter properly
	var groupFieldsNames = new Array();
	var groupFieldsValues = new Array();

	var $listKeys = table.parent().find("ul[class='groupFields']");
	var $listValues = table.parent().find("ul[class='groupValues']");
	$listKeys.find("li").each(function() {
		groupFieldsNames.push($(this).text());
	});

	$listValues.find("li").each(function() {
		groupFieldsValues.push($(this).text());
	});

	var $auxTbody = $("<tbody>");

	$.ajax({

		data : {
			queue : $("#queueName").text(),
			type : table.find("input[name='messageType']").val(),
			page : page,
			pageSize : pageSize,
			sortField : sortField,
			sortOrder : sortOrder,
			isTotalRequested : isTotalRequested,
			groupFieldsNames : groupFieldsNames,
			groupFieldsValues : groupFieldsValues,
			trnSearch: table.find("input[name='searchTrnValue']").val(),
			amountSearch : amntSearch
			
		},
		method : 'POST',
		url : "../messagesDynamic",
		dataType : 'json',
		async : false,
		success : function(data) {
			for (var index = 0; index < data.messages.length; index++) {
				var message = data.messages[index];
			
				if(isComposedMsgType && message.stmtuid== table.find("input[name='composedMsgId']").val())	{
					var $tr = $("<tr>");
					
					$tr.attr("id", message.guid);
					$tr.attr("stmtuid", message.stmtuid);
				
				$tr.append($("<td>").append(
						$("<input>").attr("type", "checkbox").addClass(
								"routeCheckbox")).append(
						$("<button>").addClass("viewPayload")));
				
				
				jQuery.each(fields, function(i, fieldName) {
					$tr.append($("<td>").append(message[fieldName]));
				});
				$auxTbody.append($tr);
				
				}
				
				 }
					if (isTotalRequested) {
						$totalSpan.text(data.total);
						$parentDiv.find("input[name='total']").first().val(
								data.total);
					
		
			}
			table.find("tbody").remove();
			table.append($auxTbody);

			$("button.viewPayload").each(
					function() {
						$(this).button({
							icons : {
								primary : "ui-icon-folder-open"
							}
						});
						var $parentTable = $(this).closest("table");
						var messageId = $(this).closest("tr").attr("id");
						var messageStmtuid = $(this).closest("tr").attr("stmtuid");
						var messageType = $parentTable.find(
								"input[name='messageType']").val();
						var childMessageType = $parentTable.find(
								"input[name='childMessageType']").val();
						var isParent = $parentTable.find(
								"input[name='isParent']").val();

						if (isParent == 'false') {
							var functionCall = "viewPayload('" + messageId
									+ "', '" + messageType + "');";

						} else if (isParent == 'true') {
							var functionCall = "viewChild('" + messageStmtuid
									+ "','" + childMessageType + "');";

						}
						$(this).attr("onclick", functionCall);

					});

		},
		error : function(jqXHR, text, errorThrown) {
			// HandleAjaxError(jqXHR, text, errorThrown);
		}
	});

}
function viewPayload(id, type) {
	document.location.href = '../viewPayload.htm?id=' + id + '&type=' + type
			+ '&queue=' + $("#queueName").text();
}

function viewChild(id, type) {
	document.location.href = '../queues/' + $("#queueName").text() + '.htm?composedMsgId='
			+ id + '&type=' + type + '&isComposedMsgType=true' + '&queue='
			+ $("#queueName").text();
}

function completeBatchesBar() {

	var servletURL = "../batchRequest";
	var index = location.href.indexOf("batchrequests.htm");
	if (index != -1) {
		servletURL = "./batchRequest";
	}
	var countTotal = 0;
	var countSuccess = 0;
	var countFailed = 0;
	var countInProgress = 0;
	var countWaiting = 0;
	$
			.ajax({
				data : {
					userFilter : true
				},
				// todo : investigate if this shold be true or false
				async : true,

				url : servletURL,
				method : 'GET',
				success : function(data, textStatus, xhr) {

					$
							.each(
									data.groupkeys,
									function(index, value) {
										$
												.ajax({
													async : true,
													url : servletURL,
													method : 'GET',
													data : {
														groupkey : value
													},
													success : function(
															response,
															textStatus, xhr) {
														countTotal += response.nb_batches;
														if (response.progress == 0) {
															return;
														} else {
															var $tr = $("<tr>");
															$
																	.each(
																			response.batches,
																			function(
																					index,
																					batch) {
																				if (batch.status == "SUCCESS") {
																					countSuccess++;
																				} else if (batch.status == "FAILED") {
																					countFailed++;
																				} else {
																					countInProgress++;
																				}
																				countWaiting = countTotal
																						- (countSuccess
																								+ countFailed + countInProgress);
																				$tr
																						.append($(
																								"<td>")
																								.append(
																										batch.id));
																				$tr
																						.append($(
																								"<td>")
																								.append(
																										batch.status));
																				$progressBar = $(
																						"<div>")
																						.progressbar(
																								{
																									value : batch.progress
																								});
																				$tr
																						.append($(
																								"<td>")
																								.append(
																										$progressBar));
																			});
															$("#nbBatches")
																	.text(
																			countTotal);
															$("#nbSuccess")
																	.text(
																			countSuccess);
															$("#nbFailed")
																	.text(
																			countFailed);
															$("#nbInProgress")
																	.text(
																			countInProgress);
															$("#nbWaiting")
																	.text(
																			countWaiting);
														}
													}
												});
									});

				},
				error : function(xhr, textStatus, error) {
					switch (xhr.status) {
					case 403:
						alert("You don't have necessary authorities to perform this action.");
						break;
					case 406:
						var json = $.parseJSON(xhr.responseText);
						alert(json.message);
						break;
					default:
						break;
					}
				}
			});

}
