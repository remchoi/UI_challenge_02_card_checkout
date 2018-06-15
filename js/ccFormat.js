(function($) {
	
	
	/**
	  *
	  */
	var _self = this;
	var $cardsWrap = $('.credit-cards');
	
	
	/**
	  *
	  */
	_self.card_types = [
			{
				name: 'American Express',
				code: 'ax',
				pattern: /^3[47]/,
				valid_length: [15],
				formats : [
					{
						length: 15,
						format: 'xxxx xxxxxxx xxxx'
					}
				]
			}, {
				name: 'Visa',
				code: 'vs',
				pattern: /^4/,
				valid_length: [16],
				formats : [
					{
						length: 16,
						format: 'xxxx xxxx xxxx xxxx'
					}
				]
			}, {
				name: 'Mastercard',
				code: 'mc',
				pattern: /^5[1-5]/,
				valid_length: [16],
				formats : [
					{
						length: 16,
						format: 'xxxx xxxx xxxx xxxx'
					}
				]
			}
		];
	
	/**
	  *
	  */
	this.isValidLength = function(cc_num, card_type) {
		for(var i in card_type.valid_length) {
			if (cc_num.length <= card_type.valid_length[i]) {
				return true;
			}
		}
		return false;
	};
	
	/**
	  *
	  */
	this.getCardType = function(cc_num) {
		for(var i in _self.card_types) {
			var card_type = _self.card_types[i];
			if (cc_num.match(card_type.pattern) && _self.isValidLength(cc_num, card_type)) {
				return card_type;
			}
		}
	};
	
	/**
	  *
	  */
	this.getCardFormatString = function(cc_num, card_type) {
		for(var i in card_type.formats) {
			var format = card_type.formats[i];
			if (cc_num.length <= format.length) {
				return format.format;
			}
		}
	};
	
	/**
	  *
	  */
	this.formatCardNumber = function(cc_num, card_type) {
		var numAppendedChars = 0;
		var formattedNumber = '';
		
		if (!card_type) {
			return cc_num;
		}
		
		var cardFormatString = _self.getCardFormatString(cc_num, card_type);
		for(var i = 0; i < cc_num.length; i++) {
			cardFormatIndex = i + numAppendedChars;
			if (!cardFormatString || cardFormatIndex >= cardFormatString.length) {
				return cc_num;
			}
			
			if (cardFormatString.charAt(cardFormatIndex) !== 'x') {
				numAppendedChars++;
				formattedNumber += cardFormatString.charAt(cardFormatIndex) + cc_num.charAt(i);
			} else {
				formattedNumber += cc_num.charAt(i);
			}
		}
		
		return formattedNumber;
	};
	
	/**
	  *
	  */
	this.monitorCcFormat = function($elem) {
		var cc_num = $elem.val().replace(/\D/g,'');
		var card_type = _self.getCardType(cc_num);

		if(card_type) {
			var cardImg = $cardsWrap.find('#' + card_type.code);
			$(cardImg).addClass('active');
		} else {
			$cardsWrap.find('.active').removeClass('active');
		}
		$elem.val(_self.formatCardNumber(cc_num, card_type));
		_self.addCardClassIdentifier($elem, card_type);
	};
	
	/**
	  *
	  */
	this.addCardClassIdentifier = function($elem, card_type) {
		var classIdentifier = 'cc_type_unknown';
		if (card_type) {
			classIdentifier = 'cc_type_' + card_type.code;
		}
		
		if (!$elem.hasClass(classIdentifier)) {
			var classes = '';
			for(var i in _self.card_types) {
				classes += 'cc_type_' + _self.card_types[i].code + ' ';
			}
			$elem.removeClass(classes + 'cc_type_unknown');
			$elem.addClass(classIdentifier);
		}
	};
	
	/**
	  *
	  */
	$(function() {
		$(document).find('.ccFormatMonitor').each(function() {
			var $elem = $(this);
			if ($elem.is('input')) {
				$elem.on('input', function () {
					_self.monitorCcFormat($elem);
				});
			}
		});
	});
}(jQuery));