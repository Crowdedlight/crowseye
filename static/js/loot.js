function syncLootSheet() {
	var data = {};
	data.sheetID = sheetID;
	data.entries = [];
	data.totalIsk = $('#totalIsk').val();
	if (isNaN(data.totalIsk)) data.totalIsk = 0;
	data.totalSites = $('#sitesRan').val();
	$('tr.entry').each(function () {
		var entry = {};
		entry.rowid = $(this).attr('name');
		entry.name = $(this).find('input[name=name]').val();
		entry.sites = $(this).find('input[name=sites]').val();
		entry.role = $(this).find('option:selected').text();
		entry.isk = $(this).find('input[name=isk]').val();
		if (isNaN(entry.isk)) entry.isk = 0;
		data.entries.push(entry);
	});

	$.post(location.href+"/update", {data: data}, function (data) {if (readonly) updateTable(eval(("a = "+data)));});
}
var lastSitesRan;

updateTable = function(data) {
	var sheet = data;

	$('#totalIsk').val(sheet.totalIsk);
	$('#sitesRan').val(sheet.totalSites);
	lastSitesRan = sheet.totalSites;

	for (var x=0; x<sheet.entries.length ; x++) {
		var exists = false;
		var element;
		var entry = sheet.entries[x];

		if ($('tr[name='+entry.rowid+']').length != 0) {
			element = $('tr[name='+entry.rowid+']');	
			exists = true;
		} else {
			element = $('.template').find('tr').clone().first();
			element.addClass('entry');
		}

		element.attr('name', entry.rowid);
		element.find('input[name=name]').val(entry.name);
		element.find('input[name=sites]').val(entry.sites);
		element.find('option:contains("'+entry.role+'")').prop('selected', true);

		if (!exists) {
			element.insertBefore('tr:last');
			$('.template').find('tr.entry').remove();
		}

	}
	updateIsk();
};

$('#sitesRan').change(function (ev) {
	var newval = $('#sitesRan').val();
	var diff = newval - lastSitesRan;
	lastSitesRan = newval;
	$('tr.entry').each(function () {
		var active = $(this).find('input[type=checkbox]').prop('checked');

		if (active) {
			var ov = $(this).find('input[name=sites]').val()
			$(this).find('input[name=sites]').val(parseInt(ov)+parseInt(diff));
		}
	})

	
});

$('input').change(function () {
	updateIsk();
});
$('input').keyup(function () {
	$(this).trigger('change');
});

var updateIsk = function () {
	var total = parseInt($('#totalIsk').val());
	var sitenumber = parseInt($('#sitesRan').val()); 
	var totalpoints = 0;
	var points = {};
	$('tr.entry').each(function () {
		var sites = $(this).find('input[name=sites]').val();
		var share = $(this).find('option:selected').val();
		var mypoints = sites*share;
		points[$(this).attr('name')] = mypoints;
		totalpoints += mypoints;
	});

	for (rowid in points) {
		var newisk = Math.floor((points[rowid]/totalpoints)*total);
		if (isNaN(newisk)) newisk = 0;
		$('tr[name='+rowid+']').find('input[name=isk]').val(newisk);
	}



}

var addMember = function () {
	syncLootSheet();
	$.get(location.href+"/addMember", function (data) {updateTable(eval(("a = "+data)));})
}