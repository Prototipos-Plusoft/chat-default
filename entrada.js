now = new Date
h=now.getHours();

// script pro ie9, porque ele não reconhece o atributo required
if (document.documentMode === 9) {

    $("input").each(function() {

        if( $(this).attr("required") === "required" ) {
            $(this).css("border-color","#eea236");
        }

    });

}

// MOSTRA SAUDAÇÃO COM BOM DIA, BOA TARDE E BOA NOITE
if( document.getElementById('saudacao') != null) {
    if( h < 12 ) {  
        document.getElementById('saudacao').innerHTML = "Bom dia!";
    } else if( h < 18 ) {
        document.getElementById('saudacao').innerHTML = "Boa tarde!";
    } else {
        document.getElementById('saudacao').innerHTML = "Boa noite!";
    }
}

//VALIDA CAMPO EMAIL
function IsEmail(email){
    var exclude=/[^@\-\.\w]|^[_@\.\-]|[\._\-]{2}|[@\.]{2}|(@)[^@]*\1/;
    var check=/@[\w\-]+\./;
    var checkend=/\.[a-zA-Z]{2,3}$/;
    if(((email.search(exclude) != -1)||(email.search(check)) == -1)||(email.search(checkend) == -1)){return false;}
    else {return true;}
}

//MASCARA TELEFONE
function mascara(o,f){
    v_obj=o
    v_fun=f
    setTimeout("execmascara()",1)
}
function execmascara(){
    v_obj.value=v_fun(v_obj.value)
}
function mtel(v){
    v=v.replace(/\D/g,"");             //Remove tudo o que não é dígito
    v=v.replace(/^(\d{2})(\d)/g,"($1) $2"); //Coloca parênteses em volta dos dois primeiros dígitos
    v=v.replace(/(\d)(\d{4})$/,"$1-$2");    //Coloca hífen entre o quarto e o quinto dígitos
    return v;
}
function id( el ){
    return document.getElementById( el );
}

// script pra inserir mascaras
function formatar(mascara, documento){
  var i = documento.value.length;
  var saida = mascara.substring(0,1);
  var texto = mascara.substring(i)
  
  if (texto.substring(0,1) != saida){
            documento.value += texto.substring(0,1);
  }
  
}
function somenteNumero(e){
    var tecla=(window.event)?event.keyCode:e.which;   
    if((tecla>47 && tecla<58)) return true;
    else{
        if (tecla==8 || tecla==0) return true;
    else  return false;
    }
}

/*!
 * jQuery CPF/CNPJ Validator Plugin v1.1.0
 * Developed by: Guilherme Gomes (gmgomess@gmail.com)
 * Date: 2014-10-06
 */
(function ($) {
    var type = null;

    $.fn.cpfcnpj = function (options) {
        // Default settings
        var settings = $.extend({
            mask: false,
            validate: 'cpfcnpj',
            event: 'focusout',
            handler: $(this),
            ifValid: null,
            ifInvalid: null
        }, options);

        if (settings.mask) {
            if (jQuery().mask == null) {
                settings.mask = false;
                console.log("jQuery mask not found.");
            }
            else {
                if (settings.validate == 'cpf') {
                    $(this).mask('000.000.000-00');
                }
                else if (settings.validate == 'cnpj') {
                    $(this).mask('00.000.000/0000-00');
                }
                else {
                    var ctrl = $(this);
                    var opt = {
                        onKeyPress: function (field) {
                            var masks = ['000.000.000-009', '00.000.000/0000-00'];
                            msk = (field.length > 14) ? masks[1] : masks[0];
                            ctrl.mask(msk, this);
                        }
                    };

                    $(this).mask('000.000.000-009', opt);
                }
            }

        }

        return this.each(function () {
            var valid = null;
            var control = $(this);

            $(document).on(settings.event, settings.handler,
               function () {
                   if (control.val().length == 14 || control.val().length == 18) {
                       if (settings.validate == 'cpf') {
                           valid = validate_cpf(control.val());
                       }
                       else if (settings.validate == 'cnpj') {
                           valid = validate_cnpj(control.val())
                       }
                       else if (settings.validate == 'cpfcnpj') {
                           if (validate_cpf(control.val())) {
                               valid = true;
                               type = 'cpf';
                           }
                           else if (validate_cnpj(control.val())) {
                               valid = true;
                               type = 'cnpj';
                           }
                           else valid = false;
                       }
                   }
                   else valid = false;

                   if ($.isFunction(settings.ifValid)) {
                       if (valid != null && valid) {
                           if ($.isFunction(settings.ifValid)) {
                               var callbacks = $.Callbacks();
                               callbacks.add(settings.ifValid);
                               callbacks.fire(control);
                           }
                       }
                       else if ($.isFunction(settings.ifInvalid)) {
                           settings.ifInvalid(control);
                       }
                   }
               });
        });
    }

    function validate_cnpj(val) {

        if (val.match(/^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/) != null) {
            var val1 = val.substring(0, 2);
            var val2 = val.substring(3, 6);
            var val3 = val.substring(7, 10);
            var val4 = val.substring(11, 15);
            var val5 = val.substring(16, 18);

            var i;
            var number;
            var result = true;

            number = (val1 + val2 + val3 + val4 + val5);

            s = number;

            c = s.substr(0, 12);
            var dv = s.substr(12, 2);
            var d1 = 0;

            for (i = 0; i < 12; i++)
                d1 += c.charAt(11 - i) * (2 + (i % 8));

            if (d1 == 0)
                result = false;

            d1 = 11 - (d1 % 11);

            if (d1 > 9) d1 = 0;

            if (dv.charAt(0) != d1)
                result = false;

            d1 *= 2;
            for (i = 0; i < 12; i++) {
                d1 += c.charAt(11 - i) * (2 + ((i + 1) % 8));
            }

            d1 = 11 - (d1 % 11);
            if (d1 > 9) d1 = 0;

            if (dv.charAt(1) != d1)
                result = false;

            return result;
        }
        return false;
    }

    function validate_cpf(val) {

        if (val.match(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/) != null) {
            var val1 = val.substring(0, 3);
            var val2 = val.substring(4, 7);
            var val3 = val.substring(8, 11);
            var val4 = val.substring(12, 14);

            var i;
            var number;
            var result = true;

            number = (val1 + val2 + val3 + val4);

            s = number;
            c = s.substr(0, 9);
            var dv = s.substr(9, 2);
            var d1 = 0;

            for (i = 0; i < 9; i++) {
                d1 += c.charAt(i) * (10 - i);
            }

            if (d1 == 0)
                result = false;

            d1 = 11 - (d1 % 11);
            if (d1 > 9) d1 = 0;

            if (dv.charAt(0) != d1)
                result = false;

            d1 *= 2;
            for (i = 0; i < 9; i++) {
                d1 += c.charAt(i) * (11 - i);
            }

            d1 = 11 - (d1 % 11);
            if (d1 > 9) d1 = 0;

            if (dv.charAt(1) != d1)
                result = false;

            return result;
        }

        return false;
    }
}(jQuery));

var qtd_campos_erros = 0;
var var_cpf = false;
var min_length;  

function valida_campo(campo_atual) {    

    // pega a quantidade minima de caracteres do campo
    if( $("#"+campo_atual).attr("minlength") === undefined ) {

        console.log("Existe input sem minlength, favor coloque o minlength e a quantidade de caracteres mínimos aceitos no input");

    } else if( $("#"+campo_atual).attr("minlength") ) {

        min_length = $("#"+campo_atual).attr("minlength");

    }

    // verifica se o campo é obrigatório
    if( $("#"+campo_atual).attr("required") === "required" ) {
        // verifica se o campo está sem dados inseridos
        if( $("#"+campo_atual).val().trim().length === 0 || $("#"+campo_atual).val().trim().length < min_length ) {
            
            campo_invalido(campo_atual);

        } else {

            campo_valido(campo_atual);

        }
    } else if( $("#"+campo_atual).val().trim().length === 0 ) {

        campo_valido(campo_atual);

    } else {

        campo_invalido(campo_atual);

    }

    // verifica se o campo já tem algum dado inserido
    if( $("#"+campo_atual).val().trim().length > 0 ) {

        // verifica se o campo está com caracteres abaixo do mínimo e dá uma mensagem de erro
        if( $("#"+campo_atual).val().trim().length < min_length ) {
            
            campo_invalido(campo_atual);
        }

        // verifica se o campo está com o mínimo de caracteres preenchido
        if( $("#"+campo_atual).val().trim().length >= min_length ) {
            
            campo_valido(campo_atual);

            // validação de campos específicos

            // verifica se o campo_atual é um campo de email
            if( $("#"+campo_atual).hasClass("email") === true ) {

                // verifica se o email é válido
                if( IsEmail( $("#"+campo_atual).val() ) === false ) {

                    campo_invalido(campo_atual);

                }  else {                    
                    
                    campo_valido(campo_atual);
                    
                }
            }

            // verifica se o campo_atual é um campo de cpf
            if( $("#"+campo_atual).hasClass("cpf") === true ) {                              
                
                if( var_cpf === false ) {
                    campo_invalido(campo_atual);               
                }  else {                    
                    campo_valido(campo_atual);
                    
                }   
            }            
        }

    } 

    console.log("Quantidades campos com erro = "+qtd_campos_erros);

    if( qtd_campos_erros === 0 ) {
        $(".alert.alert-danger").hide();
    }

    if( qtd_campos_erros > 0 ) {
        $(".alert.alert-danger").show();
        return false;
    }

};

function campo_invalido(campo_atual) {

    if( $("#"+campo_atual).hasClass("alert-danger") === false ) {

        qtd_campos_erros++;

    }

    $("#"+campo_atual).addClass("alert-danger");    

}

function campo_valido(campo_atual) {    

    if( qtd_campos_erros > 0 && $("#"+campo_atual).hasClass("alert-danger") === true ) {

        qtd_campos_erros--;

    } 

    $("#"+campo_atual).removeClass("alert-danger");

}

$("input").blur(function() {

    valida_campo( $(this).attr("id") );

});

$("#entrar_no_chat").click(function() {

    $("input").each(function() {

        if( $(this).attr("required") === "required" ) {

            $(this).blur();

        }

    });

    if( qtd_campos_erros === 0 ) {

        document.forms[0].submit();

    }
    
       
        
});
// fim validações tela de entrada

function isMobile(){
    var a = navigator.userAgent||navigator.vendor||window.opera;
    if(/android|avantgo|blackberry|blazer|compal|elaine|fennec|hiptop|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|mobile|o2|opera m(ob|in)i|palm( os)?|p(ixi|re)\/|plucker|pocket|psp|smartphone|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce; (iemobile|ppc)|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|e\-|e\/|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|xda(\-|2|g)|yas\-|your|zeto|zte\-/i.test(a))
        return true;
    else
        return false;
}

if( isMobile() ) {
    // document.body.style.zoom="300%";
    $("html").css("zoom","200%");
    $(".alert + .alert").css("margin-left","0");
} else {
    $("html").css("zoom","100%");  
}

document.addEventListener('keydown', function(e) {
    e = e || window.event;
    var code = e.which || e.keyCode;
    if( code === 13 ) {
        $("#entrar_no_chat").click();
    }
});

 window.onload = function() {       

    $(".telefone").keypress(function() {
        return somenteNumero(event);
    });

    $( ".telefone" ).keyup(function() {
      mascara( this, mtel );
    });   

    $(".cpf").keypress(function() {
        formatar('###.###.###-##', this);
        return somenteNumero(event);
    });

    $('.cpf').cpfcnpj({
        mask: false,
        validate: 'cpfcnpj',
        event: 'blur',
        handler: '.cpf',
        ifValid: function (input) { var_cpf =  true },
        ifInvalid: function (input) { var_cpf = false }
    });

} 
