const urlMetodoDePago = "https://api.mercadopago.com/v1/payment_methods";
const accessToken = "Bearer TEST-673136525867555-072001-ca4e73c829141b0f8aa65c49ac99778f-275480606";

const comisionesPorPais = {
  argentina: {
    comision:0.0599, 
  },
  mexico: {
    comision:0.0349, 
   },
  uruguay: {
    comision:0.0649,
    },
}

class Propuesta {
  constructor(nombre, pais, nombreProducto, precioProducto) {
    this.nombreEmpresa = nombre;
    this.pais = pais;
    this.nombreProducto = nombreProducto;
    this.precioProducto = precioProducto;
    this.comision = 0;
    this.mediosDePago = [];
  }
  calcularComision() {
      this.comision = comisionesPorPais[this.pais.toLowerCase()].comision * this.precioProducto;
  }
  toString() {
    return (
      "Nombre de empresa: " +
      this.nombreEmpresa +
      "\nPais: " +
      this.pais +
      "\nNombre de producto: " +
      this.nombreProducto +
      "\nPrecio de producto: $" +
      this.precioProducto +
      "\nComision a cobrar: $" +
      this.comision +
      "."
    );
  }
}
///Reemplazamos el boton por formulario y las alerts por inputs y eventos. No movemos el listener para antes de la funcion porque no funcionaria.
function comenzarSimulador() {
  let propuestaPasada = localStorage.getItem('datosIngresados');
  if(propuestaPasada != null){
      propuestaPasada = JSON.parse(propuestaPasada);
    }
    console.log($(".btn.btn-primary.btn-lg"));
    $(".btn.btn-primary.btn-lg").fadeOut(400, function() {
      $(".btn.btn-primary.btn-lg").remove();
      $(".jumbotron").append(`
        <div class="contenedorFormulario" style="display: none" >
          <form id='formularioCalculadora' class='formularioEstilo'>
            <span>Nombre de empresa</span>
            <input type='text' value=${propuestaPasada != null ? propuestaPasada.nombreEmpresa : ''} > <br />
            <span>Pais</span> 
            <input type="text" list="listaPaises" ${propuestaPasada != null ? 'value='+ propuestaPasada.pais : ''}>
            <datalist id="listaPaises">
              <option value="Argentina">  
              <option value="Mexico">
              <option value="Uruguay">
            </datalist>
              <br />
            <span>Nombre del producto</span>
            <input type='text' value=${propuestaPasada != null ? propuestaPasada.nombreProducto : ''}> <br />
            <span>Precio del producto</span>
            <input type='number' value=${propuestaPasada != null ? propuestaPasada.precioProducto : ''}><br />
            <a
              class="btn btn-primary btn-lg"
              href="#"
              role="button"
              > Calcular</a
            >
          </form>
        </div>`);
    $(".contenedorFormulario").fadeIn();
    $(".btn.btn-primary.btn-lg").click(ejecutarSimulador);
  });
    
}
function cargarDatos() {
  const formulario = document.getElementById("formularioCalculadora");

  return new Propuesta(
    formulario.children[1].value,
    formulario.children[4].value,
    formulario.children[8].value,
    formulario.children[11].value
  );
}

function ejecutarSimulador() {
  const propuestaDeNegocios = cargarDatos();
  propuestaDeNegocios.calcularComision();
  localStorage.setItem('datosIngresados',JSON.stringify(propuestaDeNegocios));
  
  document
    .getElementsByClassName("jumbotron")[0]
    .removeChild(document.getElementsByClassName("contenedorFormulario")[0]);
  let resultado = document.createElement("div");
  //Definimos el innerHTML del elemento con una plantilla de texto que va a agregar el div con todo el contenido
  resultado.innerHTML = `
    <p>Nombre Empresa: ${propuestaDeNegocios.nombreEmpresa}  </p> 
    <p>Pais:  ${propuestaDeNegocios.pais} </p> 
    <p>Producto: ${propuestaDeNegocios.nombreProducto}  </p>
    <p>Precio del producto:  $${propuestaDeNegocios.precioProducto}  </p>  
    <p>Comision:  $${propuestaDeNegocios.comision} </p> 
    <p id="metodosDePago">Medios de pago: Cargando... </p> 
    `;
  resultado.className = "resultado";

  $.get({
    url:urlMetodoDePago,
    success: (respuesta, estado) => {
    if(estado === "success"){
        $("#metodosDePago").text(`Medios de pago: ${respuesta.map(mdp=>mdp.name).toString()}`);
              }  
          },
    headers: {Authorization: accessToken},
    });


  //Agregamos el contenedor creado al body
  document.getElementsByClassName("jumbotron")[0].appendChild(resultado);
}
