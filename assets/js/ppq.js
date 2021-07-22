//variable de sesion
const data_s = {
  survey_id: [idPregunta],
};
var data_survey;
//Envio de datos por metodo post
//$.getJSON("test.json", function(data_survey) {
////////////////////////////////////////////
fetch("https://crm.grupopetroil.com.mx:81/api/odoo/read_survey", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(data_s),
})
  .then((response) => response.json())
  //Datos correctos
  .then((data) => {
    data_survey = data;
    //BORRA ESTO
    /*$.getJSON("s7.json", function (data) {
  //data_survey = data;*/
    //console.log('Success:', data);
    //data.forEach(element => console.log(element));
    data.forEach((element) => {
      console.log(element.preguntas);
    });
    var infoPreguntas = "";
    var paginas;
    var objetos = [];
    var cuestionario = document.getElementById("cuestionario");
    data.forEach((encuesta) => {
      console.log(data);
      //RELLENAMOS CADA PAGINA CON PREGUNTAS
      var first = 0;
      encuesta.preguntas.forEach((pregunta) => {
        if (!pregunta.is_page) {
          //
          var _pregunta;
          _pregunta = "<div class='form-section'>";
          _pregunta +=
            "<label class='form-label' for='#" +
            pregunta.id_pregunta +
            "'>" +
            pregunta.title +
            "</label>";
          var req = pregunta.constr_mandatory ? 'required="required"' : "";
          switch (pregunta.question_type) {
            //CASO SIMPLE_CHOICE
            case "simple_choice":
              //SIMPLE_CHOICE.DROPDOWNS
              if (pregunta.display_mode == "dropdown") {
                _pregunta +=
                  "<select class='form-control' name='" +
                  pregunta.id_pregunta +
                  "' id='" +
                  pregunta.id_pregunta +
                  "'>";
                _pregunta +=
                  "<option hidden disabled selected value> -- Selecciona una opción -- </option>";
                pregunta.valores.forEach((valor) => {
                  _pregunta +=
                    "<option value='" +
                    valor.id +
                    "'>" +
                    valor.value +
                    "</option>";
                });
                _pregunta += "</select>";
              }

              //SIMPLE_CHOICE.OTHER
              else {
                pregunta.valores.forEach((valor) => {
                  _pregunta +=
                    "<div class='form-check'>" +
                    "<input class='form-check-input' " +
                    req +
                    " value='" +
                    valor.id +
                    "' id='" +
                    pregunta.id_pregunta +
                    "_" +
                    valor.id +
                    "' name='" +
                    pregunta.id_pregunta +
                    "' type='radio' />" +
                    "<label class='form-check-label' for='" +
                    pregunta.id_pregunta +
                    "_" +
                    valor.id +
                    "'>" +
                    valor.value +
                    "</label>" +
                    "</div>";
                });
              }

              break;
            //CASO MULTIPLE_CHOICE
            case "multiple_choice":
              pregunta.valores.forEach(valor => {
                _pregunta += "<div class='form-check'>" +
                  "<input class='form-check-input' " + req + " value='" + valor.id + "' id='" + pregunta.id_pregunta + "_" + valor.id + "' name='" + pregunta.id_pregunta + "' type='checkbox' />" +
                  "<label class='form-check-label' for='" + pregunta.id_pregunta + "_" + valor.id + "'>" + valor.value + "</label>" +
                  "</div>";
              });
              break;
            //CASO MATRIX
            case "matrix":
              var headers = $.grep(pregunta.valores, function (n, i) {
                return n.header != null;
              });
              var values = $.grep(pregunta.valores, function (n, i) {
                return n.value != null;
              });
              _pregunta +=
                "<table class='table table-striped'><thead><tr><th></th>";
              headers.forEach((header) => {
                _pregunta += "<th scope='col'>" + header.header + "</th>";
              });
              _pregunta += "</tr></thead class='thead-light'><tbody>";
              values.forEach((value) => {
                _pregunta += "<tr>";
                _pregunta += "<td class=''>" + value.value + "</td>";
                headers.forEach((header) => {
                  _pregunta +=
                    "<td><input class='radio' " +
                    req +
                    " value='" +
                    header.id +
                    "' id='" +
                    pregunta.id_pregunta +
                    "_" +
                    value.id +
                    "_" +
                    header.id +
                    "' name='" +
                    pregunta.id_pregunta +
                    "_" +
                    value.id +
                    "' type='radio' /></td>";
                });
                _pregunta += "</tr>";
              });
              _pregunta += "</tbody></table>";
              break;
            //CASO TEXTBOX
            case "textbox":
            case "free_text":
              _pregunta +=
                "<div class='mb-3' style='padding:15px;'><input class='form-control' " +
                req +
                " id='" +
                pregunta.id_pregunta +
                "' name='" +
                pregunta.id_pregunta +
                "' type='text' placeholder='" +
                pregunta.title +
                "' /></div>";
              break;
            //CASO numerical_box
            case "numerical_box":
              _pregunta +=
                "<div class='mb-3' style='padding:15px;'><input class='form-control' " +
                req +
                " id='" +
                pregunta.id_pregunta +
                "' name='" +
                pregunta.id_pregunta +
                "' type='number' /></div>";
              break;
          }

          _pregunta += "<br></div>";
          /*if (pregunta.page_id != null) {
              document.getElementById("body_page_" + pregunta.page_id).childNodes[0].innerHTML += _pregunta;
            } else {*/
          cuestionario.innerHTML += _pregunta;
          //}
        }
      });
      var end =
        "<div class='form-navigation'>" +
        "<button type='button' class='previous btn boton pull-left'>&lt; Anterior</button>" +
        "<button type='button' class='next btn boton pull-right'>Siguiente &gt;</button>" +
        "<input type='submit' class='btn btn-default pull-right'>";
      encuesta.preguntas.forEach((pregunta) => {
        if (!pregunta.is_page) {
          end += "<span class='clearfix'></span>";
        }
      });
      end += "</div>";
      cuestionario.innerHTML += end;
    });
    //document.getElementById("p1").innerHTML = infoPreguntas;
  })
  .then(() => {
    $(document).ready(function () {
      var $sections = $(".form-section");
      function navigateTo(index) {
        // Mark the current section with the class 'current'
        $sections.removeClass("current").eq(index).addClass("current");
        // Show only the navigation buttons that make sense for the current section:
        $(".form-navigation .previous").toggle(index > 0);
        var atTheEnd = index >= $sections.length - 1;
        $(".form-navigation .next").toggle(!atTheEnd);
        $(".form-navigation [type=submit]").toggle(atTheEnd);
      }

      function curIndex() {
        // Return the current index by looking at which section has the class 'current'
        return $sections.index($sections.filter(".current"));
      }

      // Previous button is easy, just go back
      $(".form-navigation .previous").click(function () {
        navigateTo(curIndex() - 1);
      });
      // Next button goes forward iff current block validates
      $(".form-navigation .next").click(function () {
        if (
          $("#cuestionario")
            .parsley()
            .validate("block-" + curIndex())
        )
          navigateTo(curIndex() + 1);
      });
      // Prepare sections by setting the `data-parsley-group` attribute to 'block-0', 'block-1', etc.
      $sections.each(function (index, section) {
        $(section)
          .find(":input")
          .attr("data-parsley-group", "block-" + index);
      });
      navigateTo(0); // Start at the beginning
    });
  })
  ////////////////// TERMINA ACA ///////////////////
  .catch((error) => {
    console.error("Error:", error);
  });
var respuestas;
function handleFormSubmit(event) {
  event.preventDefault();
  console.log(data_survey);
  const data = new FormData(event.target);
  const formJSON = Object.fromEntries(data.entries());
  const results = document.querySelector("#res");
  respuestas = JSON.parse(JSON.stringify(formJSON, null, 2));
  var jsonSubida = [];
  var id_encuesta = data_survey[0].id_encuesta;
  data_survey[0].preguntas.forEach((pregunta) => {
    if (!pregunta.is_page) {
      var r = {
        question_type: pregunta.question_type,
        question_id: pregunta.id_pregunta,
        survey_id: Number(id_encuesta),
        usr_mail: localStorage.getItem("usr_mail"),
        value_s: 0,
        value_sr: 0,
        value_n: 0,
        value_t: "",
        value_ft: "",
      };
      switch (pregunta.question_type) {
        //CASO SIMPLE_CHOICE
        case "simple_choice":
          r.value_s = Number(respuestas[pregunta.id_pregunta]);
          if (!(respuestas[pregunta.id_pregunta] === undefined || respuestas[pregunta.id_pregunta].isNaN)) {
            jsonSubida.push(r);
          }

          break;
        //CASO MULTIPLE_CHOICE
        case "multiple_choice":
          pregunta.valores.forEach(valor => {
            var r1 = Object.assign({}, r);
            r.value_s = Number(respuestas[pregunta.id_pregunta]);
            if (!(respuestas[pregunta.id_pregunta] === undefined || respuestas[pregunta.id_pregunta].isNaN)) {
              jsonSubida.push(r);
            }
          });
          break;
        //CASO MATRIX
        case "matrix":
          pregunta.valores.forEach((valor) => {
            if (valor.value != null) {
              var r1 = Object.assign({}, r);
              r1.value_s = Number(valor.id);
              r1.value_sr = Number(
                respuestas[pregunta.id_pregunta + "_" + valor.id]
              );
              if (
                respuestas[pregunta.id_pregunta + "_" + valor.id] !== undefined
              ) {
                jsonSubida.push(r1);
              }
            }
          });
          break;
        //CASO TEXTBOX
        case "textbox":
          r.value_t = respuestas[pregunta.id_pregunta];
          if (respuestas[pregunta.id_pregunta] !== undefined) {
            jsonSubida.push(r);
          }

          break;
        case "free_text":
          r.value_ft = respuestas[pregunta.id_pregunta];
          if (respuestas[pregunta.id_pregunta] !== undefined) {
            jsonSubida.push(r);
          }

          break;
        //CASO NUMERICAL_BOX
        case "numerical_box":
          r.value_n = Number(respuestas[pregunta.id_pregunta]);
          if (r.value_n) {
            jsonSubida.push(r);
          }

          break;
      }
    }
  });
  console.log(jsonSubida);
  fetch("https://crm.grupopetroil.com.mx:81/api/odoo/create_survey", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jsonSubida),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      //window.location = "enviado.html";
    });
}

const form = document.querySelector(".form");
form.addEventListener("submit", handleFormSubmit);
$("button[type='submit']").on("click", function (event) {
  $("input[required='required']").each(function () {
    if ($(this).val() == "") {
      var item = $(this).closest(".collapse");
      item.collapse("show");
      return false;
    }
  });
});
function salida() {
  swal({
    title: "Regresar",
    text: "¿Esta seguro que desea regresar al listado?",
    icon: "warning",
    buttons: ["Cancelar", "Ir al listado"],
    dangerMode: true,
    type: "success",
  }).then((okay) => {
    if (okay) {
      window.location.href = "listadoEncuesta.html";
    }
  });
}