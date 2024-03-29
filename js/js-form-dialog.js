(function(window) {
  var modal;
  var options = {};

  const _init = function(opts) {
    options = opts;
    if (opts && opts.container) {
      container = document.getElementById(opts.container);
    } else {
      container = document.getElementsByTagName("body")[0];
    }

    HTMLCollection.prototype.forEach = Array.prototype.forEach;

    return this;
  };

  const _show = function() {
    var dialog = getDialog();

    container.appendChild(dialog);

    modal.style.display = "block";
    if (options.backdrop && options.backdrop == "dismiss") {
      modal.addEventListener(
        "click",
        function(e) {
          if (e.currentTarget != e.target) return;
          JSDialog.hide();
          options.closeCallback();
        },
        true
      );
    }
  };

  const _hide = function() {
    modal.style.display = "none";
    container.removeChild(modal);
  };

  getDialog = function() {
    modal = document.createElement("div");
    modal.setAttribute("id", "jsModal");
    modal.setAttribute("class", "modal");
    modalContent = document.createElement("div");
    modalContent.setAttribute("class", "modal-content");
    modal.appendChild(modalContent);
    if (options.width) modalContent.style.width = options.width;

    addTitle(options.title);
    addCloseButton(options.showClose);

    modalBody = document.createElement("div");
    modalBody.setAttribute("class", "modal-body");
    modalContent.appendChild(modalBody);

    modalBody.appendChild(generateForm());

    addSubmitButton();
    return modal;
  };

  addTitle = function(t) {
    if (t) {
      title = document.createElement("span");
      title.setAttribute("class", "title");
      if (options.titleCenter)
        title.setAttribute("class", title.className + " center");
      title.innerHTML = t;
      modalContent.appendChild(title);
    }
  };

  addCloseButton = function(showClose) {
    if (showClose) {
      close = document.createElement("span");
      close.setAttribute("class", "close");
      close.innerHTML = "&times;";
      modalContent.appendChild(close);

      close.onclick = function() {
        JSDialog.hide();

        options.closeCallback();
      };
    }
  };

  addSubmitButton = function() {
    submit = document.createElement("input");
    submit.setAttribute("type", "button");
    submit.value = "Submit";
    form.appendChild(submit);

    submit.onclick = function() {
      try {
        if (form.reportValidity()) {
          submitValidForm();
        }
      } catch (e) {
        legacyValidationCheck();
      }
    };
  };

  legacyValidationCheck = function() {
    // Form is invalid!
    if (!form.checkValidity()) {
      // Create the temporary button, click and remove it
      var tmpSubmit = document.createElement("button");
      form.appendChild(tmpSubmit);
      tmpSubmit.click();
      form.removeChild(tmpSubmit);
    } else {
      submitValidForm();
    }
  };

  submitValidForm = function() {
    var inputs = modalContent.getElementsByTagName("input");
    // var data = [];
    var val = {};
    inputs.forEach(function(item) {
      if (item.type != "button") {
        val[item.dataset.key] = item.value;
        item.checkValidity();
      }
    });

    options.submitCallback(val);

    JSDialog.hide();
    options.closeCallback();
  };

  generateForm = function() {
    if (options.fields) {
      form = document.createElement("form");
      form.setAttribute("id", "form_body");
      for (field of options.fields) {
        form.appendChild(getField(field));
      }
    }
    return form;
  };

  getField = function(field) {
    var el;
    el = document.createElement("input");
    el.setAttribute("type", field.type);
    el.setAttribute("placeholder", field.placeholder);
    el.style.width = field.expand;
    el.setAttribute("data-key", field.key);

    if (field.required) el.setAttribute("required", "required");

    return el;
  };

  window.JSDialog = {
    init: _init,
    show: _show,
    hide: _hide
  };
})(window);
