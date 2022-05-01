

var idModifica;
var pagina = 0;

$(document).ready(function () {
  var dati;
  var index = "http://localhost:8080/pages/methodsBackend.php";

  $("body").ready(function () {
    getDati(index);
  });



  function disegnaRighe(data) {
    var riga = "";

    for (var i = 0; i < data.length; i++) {
      riga += "<tr> <th scope='row'>" + data[i].id + "</th> " + " <td>" + data[i].firstName + "</td> " +
        " <td>" + data[i].lastName + "</td> " + " <td data-id = " + data[i].id + ">" + " <button type='button' class='btn btn-danger btn-sm px-3 elimina '> Elimina </button> <button type='button' class='btn btn-warning btn-sm px-3 edit'> Modifica </button></td> </tr>";
    }

    $("tbody").html(riga);
  };


  function getDati(url) {
    $.get(url, function (data) {
      dati = data;
      console.log(data);
      disegnaRighe(data['_embedded']['employees']);

      $("#self").html(data['page']['number'] + 1);
      if (data['page']['number'] == 0) {
        $(".zero").css("display", "none");
      } else {
        $(".zero").css("display", "inline");
      }
      if (data['page']['number'] + 1 == data['page']['totalPages']) {
        $(".ultm").css("display", "none");
      } else {
        $(".ultm").css("display", "inline");
      }
    })
  };
  function postDati(person) {
    $.ajax({
      type: "POST",
      url: index,
      data: JSON.stringify(person),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function (data) { getDati(dati['_links']['last']['href']) },
      error: function (errMsg) { console.log(errMsg); }
    });
  };

  function deleteDati(id) {
    $.ajax({
      url: index + '/' + id,
      type: "delete",
      success: function (data) { getDati(index + "?page=" + dati['page']['number'] + "&size=20"); }
    })
  };

  function putDati(person) {
    $.ajax({
      type: "PUT",
      url: index + "/" + person.id,
      data: JSON.stringify(person),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function (data) { getDati(dati['_links']['last']['href']); },
      error: function (errMsg) { console.log(errMsg); }
    });
  };



  $("body").on('click', '.prossimaPagina', function (e) {
    var link = "http://localhost:8080/employees?";

    pagina++;

    link += "page=" + pagina + "&size=20";

    $.get(link, function (data) {
      disegnaRighe(data['_embedded']['employees']);
    });

  });

  $("body").on('click', '.precedentePagina', function (e) {
    var link = "http://localhost:8080/employees?";

    if (pagina > 0)
      pagina--;

    link += "page=" + pagina + "&size=20";

    $.get(link, function (data) {
      disegnaRighe(data['_embedded']['employees']);
    });

  });

  $("body").on('click', '.ultimaPagina', function (e) {
    var link = "http://localhost:8080/employees?";

    pagina = 15001;

    link += "page=" + pagina + "&size=20";

    $.get(link, function (data) {
      disegnaRighe(data['_embedded']['employees']);
    });

  });

  $("body").on('click', '.primaPagina', function (e) {
    var link = "http://localhost:8080/employees?";

    pagina = 0;

    link += "page=" + pagina + "&size=20";

    $.get(link, function (data) {
      disegnaRighe(data['_embedded']['employees']);
    });

  });




  $("body").on('click', '.elimina', function (event) {
    console.log($(this).parent().attr("data-id"));
    deleteDati($(this).parent().attr("data-id"));
  });

  $("body").on("click", ".edit", function (event) {
    $("#modalModifica").modal('show');
    idModifica = $(this).parent("td").data("id");

    $("body").on('click', '.modifica', function (e) {
      var nome = $("#name").val();
      var cognome = $("#lastname").val();

      var dipendente =      //Oggetto JS
      {
        "id": idModifica,
        "birthDate": "1952-12-24",
        "firstName": nome,
        "lastName": cognome,
        "gender": "M",
        "hireDate": "1991-01-26",
      };

      putDati(dipendente)

      $("#modalModifica").modal('hide');

    });
  });


  $(".aggiungi").click(function (e) {

    var nome = $("#recipient-name").val();
    var cognome = $("#recipient-lastname").val();

    var person = {
      "birthDate": "2022-03-02",
      "firstName": nome,
      "gender": "M",
      "hireDate": "2022-03-02",
      "lastName": cognome,
    };

    $("#modalAggiungi").modal('hide');
    postDati(person);


  });




});