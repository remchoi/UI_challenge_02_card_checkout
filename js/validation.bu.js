'use strict';

(function() {

	var errors = [
		{
			elId: "inputCardNumber",
			emptyErr: "Provide card number",
			invalidErr: "Invalid card number"
		},
		{
			elId: "inputHolderName",
			emptyErr: "Provide card holder name",
			invalidErr: "Invalid card holder name"
		},
		{
			elId: "selectExpireMonth",
			invalidErr: "Select expiration month"
		},
		{
			elId: "selectExpireYear",
			invalidErr: "Select expiration year"
		},
		{
			elId: "inputCardCVV",
			emptyErr: "Enter your card's CCV number",
			invalidErr: "Invalid CCV number"
		}
	];

	var $submitPayment = $('#submitPayment');
	var $validImputs = $('.validateInput');
	var $errList = $('#errList');
	var validated = true;


	var $cardInput = $('#inputCardNumber');
	var $nameInput = $('#inputHolderName');
	var $CCVInput = $('#inputCardCVV');
	var $monthSelect = $('#selectExpireMonth');
	var $yearSelect = $('#selectExpireYear');


	blurValidate($cardInput, isCardValid);
	blurValidate($nameInput, isNameValid);
	blurValidate($CCVInput, isCCVValid);

	$CCVInput.on('keydown', '#child', function(e){-1!==$.inArray(e.keyCode,[46,8,9,27,13,110,190])||(/65|67|86|88/.test(e.keyCode)&&(e.ctrlKey===true||e.metaKey===true))&&(!0===e.ctrlKey||!0===e.metaKey)||35<=e.keyCode&&40>=e.keyCode||(e.shiftKey||48>e.keyCode||57<e.keyCode)&&(96>e.keyCode||105<e.keyCode)&&e.preventDefault()});

	selectValidate($monthSelect, isSelectValid);
	selectValidate($yearSelect, isSelectValid);

	function blurValidate($el, valid) {
		$el.on('blur', function(){
			if(valid($el)) {
				setValid($el);
			} else {
				setInvalid($el);
			}
		});
	}

	function selectValidate($el) {
		$el.on('change', function(){
			if(isSelectValid($el)) {
				setValid($el);
			} else {
				setInvalid($el);
			}
		});
	}


	function setValid($el) {
		var $errItem = errItem($el);

		$el.removeClass('invalid');
		$el.addClass('valid');
		$errItem.hide();
	}

	function setInvalid($el) {
		var $errItem = errItem($el);

		$el.addClass('invalid');
		$el.removeClass('valid');
		$errItem.text(errText($el));
		$errItem.show();
	}

	function errItem($el) {
		return $('#' + $el.data('err'));
	}

	function errText($el) {
		var errObj = getErr($el);
		if(!$el.val()) {
			return errObj.emptyErr;
		}

		return errObj.invalidErr;
	}


	function getErr($el) {
		// console.log($el.prop('id'));
		var elId = $el.prop('id');
		var elObj;
		errors.forEach(function(obj){
			if(obj.elId === elId) {
				elObj = obj;
			}
		});

		return elObj;
	}

	function invalidHighlight($el) {
		$el.addClass('invalid');
	}

	function validateCardNumber($el, $errItem, err) {
		var val = $el.val();
		val = val.replace(/\s/g, '');
		console.log(val.length);

		if($el.hasClass('cc_type_unknown') || val.length !== 16) {
			$errItem.show();
			$errItem.text(err.invalidErr);
			invalidHighlight($el);
		}
	}

	function isCardValid($cardInput){
		var val = $cardInput.val();
		val = val.replace(/\s/g, '');
		return (!$cardInput.hasClass('cc_type_unknown') && val.length === 16);
	}

	function isNameValid($nameInput) {
		var val = $nameInput.val();
		var vals = val.split(' ').filter(function(v){return v!==''});
		var noNumbers = !(/\d/.test(val));
		var twoWords = (vals.length === 2);
		return (noNumbers && vals.length === 2);
	}

	function isCCVValid($CCVInput) {
		var val = $CCVInput.val();
		return (val.length === 3 && !isNaN(val));
	}

	function isSelectValid($selectInput) {
		return $selectInput.val() !== $($selectInput.children()[0]).val();
	}

	function validateName($el, $errItem, err) {
		var val = $el.val();
		var vals = val.split(' ').filter(function(v){return v!==''});
		var noNumbers = !(/\d/.test(val));
		var twoWords = (vals.length === 2);
		if(!noNumbers || !twoWords) {
			$errItem.show();
			$errItem.text(err.invalidErr);
			invalidHighlight($el);
		}
	}

	function validateCCV($el, $errItem, err) {
		var val = $el.val();

		if(val.length !== 3 || isNaN(val)) {
			$errItem.show();
			$errItem.text(err.invalidErr);
			invalidHighlight($el);
		}
	}

	$submitPayment.on('click', function(e){
		e.preventDefault();
		// Reset all errors before next validation click
		$errList.children().hide();
		// TODO 
		// - Check all inputs been filled (not default for month and year select)
		// - Display error messages for none filled inputs
		$validImputs.each(function(index, el){
			// console.log($(el).prop('tagName'));
			var $el = $(el);
			var err = getErr($el);
			var errItemId = $el.data('err');
			var $errItem = $('#' + errItemId);
			var elTag = $el.prop('tagName');
			var elId = $el.prop('id');

			$el.removeClass('invalid');

			if(elTag === 'INPUT') {
				if(!$el.val()) {
					$errItem.show();
					$errItem.text(err.emptyErr);
					invalidHighlight($el);
				} else {
					if(elId === "inputCardNumber") {
						validateCardNumber($el, $errItem, err);
					} else if(elId === "inputHolderName") {
						validateName($el, $errItem, err);
					} else if(elId === "inputCardCVV") {
						validateCCV($el, $errItem, err);
					}
				}
			}

			if(elTag === 'SELECT') {
				// Check if selected element is default first
				if($el.val() === $($el.children()[0]).val()) {
					$errItem.show();
					$errItem.text(err.emptyErr);
					invalidHighlight($el);
				}
			}

		});

	});

})();