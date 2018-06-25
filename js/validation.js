'use strict';

(function() {

	var elements = [
		{
			id: "inputCardNumber",
			emptyErr: "Provide card number",
			invalidErr: "Invalid card number",
			validateFn: function($el) {
				var val = $el.val();
				return (!$el.hasClass('cc_type_unknown') && val.length === 19);
			},
			select: false,
			valid: false
		},
		{
			id: "inputHolderName",
			emptyErr: "Provide card holder name",
			invalidErr: "Invalid card holder name",
			validateFn: function($el) {
				var val = $el.val();
				var vals = val.split(' ').filter(function(v){return v!==''});
				var noNumbers = !(/\d/.test(val));
				var twoWords = (vals.length === 2);
				return (noNumbers && vals.length === 2);
			},
			select: false,
			valid: false
		},
		{
			id: "selectExpireMonth",
			invalidErr: "Select expiration month",
			validateFn: selectValidate,
			select: true,
			valid: false
		},
		{
			id: "selectExpireYear",
			invalidErr: "Select expiration year",
			validateFn: selectValidate,
			select: true,
			valid: false
		},
		{
			id: "inputCardCVV",
			emptyErr: "Enter your card's CVV number",
			invalidErr: "Invalid CVV number",
			validateFn: function($el) {
				var val = $el.val();
				return (val.length > 2 && val.length < 5 && !isNaN(val));
			},
			select: false,
			valid: false
		}
	];

	var $submitPayment = $('#submitPayment');
	var $mainStage = $('#mainStage');
	var $loadingPayment = $('#loadingPayment');
	var $summarySuccess = $('#summarySuccess');
	var $summaryStage = $('#summaryStage');
	var $summaryTitle = $('#summaryTitle');
	var $summarySubtitle = $('#summarySubtitle');

	elements.forEach(function(element){
		var $el = $('#' + element.id);
		if(!element.select) {
			$el.on('keyup', function(){
				validateElement(element, false);
			})
			$el.on('blur', function(){
				validateElement(element);
			});
		} else {
			$el.on('change', function(){
				validateElement(element);
			});
		}
	});

	$submitPayment.on('click', function(e) {
		e.preventDefault();
		if(allValid()) {
			processLoading();
		} else {
			elements.forEach(function(element){
				validateElement(element);
			});
		}
	});

	function processLoading() {
		$mainStage.addClass('to-payment');
		setTimeout(function(){
			$summaryStage.addClass('complete');
			successMessage();
		}, 2000);
	}

	function successMessage() {
		$summaryTitle.text(function() {
			return $(this).data('complete');
		});
		$summarySubtitle.text(function() {
			return $(this).data('complete');
		});
	}

	// function completeMsg() {
	// 	$(this).data('complete');
	// }

	function validateElement(element, invalid = true) {
		var $el = $('#' + element.id);
		var validated = element.validateFn($el);
		if(validated && $el.val()) {
			setValid(element, $el);
		} else if(invalid) {
			setInvalid(element, $el);
		} else {
			element.valid = false;
			$el.removeClass('valid');
		}

		activeValid();
	}

	function allValid() {
		return elements.every(function(element){
			return element.valid === true;
		});
	}

	function activeValid() {

		if(allValid()) {
			$submitPayment.addClass('active');
		} else {
			$submitPayment.removeClass('active');
		}
	}

	function setValid(elObj, $el) {
		$el.addClass('valid');
		$el.removeClass('invalid');
		errMsg(elObj, $el).hide();
		elObj.valid = true;
	}

	function setInvalid(elObj, $el) {
		$el.addClass('invalid');
		$el.removeClass('valid');
		errMsg(elObj, $el).show();
		elObj.valid = false;
	}

	function selectValidate($el) {
		return $el.val() !== $($el.children()[0]).val();
	}

	function errMsg(elObj, $el) {
		var errText;
		if(!$el.val()) {
			errText = elObj.emptyErr;
		} else {
			errText = elObj.invalidErr;
		}
		return $('#' + $el.data('err')).text(errText);
	}

	function inputList(elements) {
		var elementsList = [];

		elements.forEach(function(element){
			elementsList.push($('#' + element.id));
		});

		return elementsList;
	}

})();
