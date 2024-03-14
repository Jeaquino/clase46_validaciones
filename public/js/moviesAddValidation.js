window.onload = function () {
  let titulo = document.querySelector(".moviesAddTitulo");
  let formulario = document.querySelector("#formulario");
  let article = document.querySelector("article");
  let inputs = document.querySelectorAll(".input");
  let form = document.querySelector("form");
  let listErrores = document.querySelector(".errores");
  const errores = {};
  const input_title = document.querySelector("#title");
  titulo.classList.add("titulo");
  article.classList.add("fondoTransparente");
  formulario.classList.add("fondoCRUD");

  const isEmpty = function (elemento) {
    return elemento.value == "";
  };

  const between = function (value, min, max) {
    return value >= min && value <= max;
  };

  const addError = function (elemento, msj) {
    elemento.classList.add("is-invalid");
    errores[elemento.name] = msj;
    const child = document.querySelector(`#Error${elemento.name}`);
    const tag = document.createElement("li");
    tag.id = `Error${elemento.name}`;
    tag.innerText = msj;
    tag.classList.add("alert-warning");
    child ? listErrores.replaceChild(tag, child) : listErrores.appendChild(tag);
  };

  const removeError = function (elemento) {
    elemento.classList.remove("is-invalid");
    elemento.classList.add("is-valid");
    delete errores[elemento.name];
    const childList = document.querySelector(`#Error${elemento.name}`);
    const childMessage = document.querySelector(`#Message${elemento.name}`);
    const contenedor = document.querySelector(`.${elemento.name}`);
    childList ? listErrores.removeChild(childList) : null;
    childMessage ? contenedor.removeChild(childMessage) : null;
  };

  const addMessage = function (elemento, msj) {
    const message = document.createElement("p");
    message.innerText = msj;
    message.id = `Message${elemento.name}`;
    message.classList.add("is-invalid");
    const contenedor = document.querySelector(`.${elemento.name}`);
    const oldMessage = document.querySelector(`#Message${elemento.name}`);
    oldMessage
      ? contenedor.replaceChild(message, oldMessage)
      : contenedor.appendChild(message);
  };

  const validate = function (elemento, e) {
    console.log("evento: ", e);

    if (isEmpty(elemento)) {
      let mensaje = `El input ${elemento.name} no puede estar vacio`;
      e.type == "blur"
        ? addMessage(elemento, mensaje)
        : addError(elemento, mensaje);
      return;
    }

    if (elemento.name == "awards" || elemento.name == "rating") {
      if (!between(elemento.value, 0, 10)) {
        let mensaje = `El campo ${elemento.name} debe contener un valor entre 0 y 10`;
        e.type == "blur"
          ? addMessage(elemento, mensaje)
          : addError(elemento, mensaje);
        return;
      }
    } else if (elemento.name == "length") {
      if (!between(elemento.value, 60, 360)) {
        let mensaje = `El campo ${elemento.name} debe contener un valor entre 60 y 360`;
        e.type == "blur"
          ? addMessage(elemento, mensaje)
          : addError(elemento, mensaje);
        return;
      }
    }

    removeError(elemento);

    return;
  };

  const getCountry = async function () {
    try {
      const response = await fetch("https://restcountries.com/v3.1/all");
      const countrys = await response.json();
      const select = document.querySelector("#country_id");
      countrys.sort((a, b) => {
        if (a.name.common < b.name.common) {
          return -1;
        }
        if (a.name.common > b.name.common) {
          return 1;
        }
        return 0;
      });

      countrys.forEach((elemento) => {
        let option = document.createElement("option");
        option.value = elemento.name.common;
        option.innerText = elemento.name.common;
        option.id = elemento.name.common;
        select.appendChild(option);
      });
    } catch (error) {
      console.log(error);
    }
  };

  //------DESDE AQUÍ CONTINÚE CON LAS VALIDACIONES DEL FORMULARIO //
  //-------------------DE REGISTRO DE PELÍCULAS------------------//
  getCountry();
  input_title.focus();
  inputs.forEach((node) => {
    node.addEventListener("blur", function (e) {
      validate(this, e);
    });
  });

  form.addEventListener("submit", function (e) {
    inputs.forEach((elemento) => {
      validate(elemento, e);
    });

    const allP = document.querySelectorAll("p");
    allP.forEach((elemento) => {
      elemento.remove();
    });

    if (Object.keys(errores).length > 0) {
      e.preventDefault();
    }

    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "La película se guardó satisfactoriamente",
      showConfirmButton: true,
    }).then((result) => {
      console.log(result);
      if (result.isConfirmed) {
        Swal.fire("Saved!", "", "success");
      }
    });
  });
};
