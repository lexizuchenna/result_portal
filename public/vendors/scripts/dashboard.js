// datatable init
$('document').ready(function(){
	$('.data-table').DataTable({
		scrollCollapse: true,
		autoWidth: true,
		responsive: true,
		searching: false,
		bLengthChange: false,
		bPaginate: false,
		bInfo: false,
		columnDefs: [{
			targets: "datatable-nosort",
			orderable: false,
		}],
		"lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
		"language": {
			"info": "_START_-_END_ of _TOTAL_ entries",
			searchPlaceholder: "Search",
		},
	});
});