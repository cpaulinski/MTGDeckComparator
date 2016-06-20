$(document).ready(function() {
	$("#deck1Selector").selectmenu({
		select: function (event, ui) {
			displayInput($("#deck1Selector option:selected").text(), 1);
		}
	});
	
	$("#deck1Selector").on("create", displayInput("Text", 1));
	
	$("#deck2Selector").selectmenu({
		select: function (event, ui) {
			displayInput($("#deck2Selector option:selected").text(), 2);
		}
	});
	
	$("#deck2Selector").on("create", displayInput("Text", 2));
	
	$("#compareButton").button();
	$("#compareButton").click(function() {
		goCompare($("#deck1Selector option:selected").text(), $("#deck2Selector option:selected").text());
	});
	
});

function displayInput(selectedOption, deckNum) {
	var inputElementName = "deck" + deckNum + "Input";
	var jqInputElementName = "#" + inputElementName;
	var groupElementName = jqInputElementName + "Group";
	
	/* Clear unneeded input if necessary */
	if ($(jqInputElementName).length) {
		$(jqInputElementName).remove();
	}	
	
	if (selectedOption == "Text") {
		if (deckNum == 1) {
			var placeholderText = "1x Tragic Slip\n1 Nice2\n1 Meetu\n1 Wherevu\n1 Been";
		} else if (deckNum == 2) {
			var placeholderText = "1 I can show you\n1x Incredible Things";
		}
		
		var deckInput = $(document.createElement('div')).attr("id", inputElementName).attr("class", inputElementName);
		var deckInputTextArea = $(document.createElement('textarea')).attr("rows", 10).attr("cols", 40).attr("placeholder", placeholderText).attr("id", inputElementName + "TextArea");
		deckInputTextArea.appendTo(deckInput);
		deckInput.appendTo(groupElementName);
	} else {
		alert("TODO: everything else");
	}
}

function getDeckHash(deckInput) {
	var deckHash = {};
	
	for (var i = 0; i < deckInput.length; ++i) {
		var entry = deckInput[i];
		var numCardText = entry.substr(0, entry.indexOf(' '));
		
		if (numCardText.charAt(numCardText.length - 1) == "x") {
			numCardText = numCardText.substring(0, numCardText.length - 1)
		}
		
		var numCard = parseInt(numCardText);
		var cardName = entry.substr(entry.indexOf(' ')+1).toLowerCase();
		
		if (!deckHash.hasOwnProperty(cardName)) {
			deckHash[cardName] = numCard;
		} else {
			deckHash[cardName] = deckHash[cardName] + numCard;
		}
	}
	
	return deckHash;
}

function compareDeckHashMissing(deck1Hash, deck2Hash) {
	var deckIsMissingText = "";
	
	for (var hashEntry in deck2Hash) {
		if (!deck1Hash.hasOwnProperty(hashEntry)) {
			deckIsMissingText = deckIsMissingText + deck2Hash[hashEntry] + " " + hashEntry + "\n";
		} else if (deck2Hash[hashEntry] > deck1Hash[hashEntry]) {
			var cardDifference = deck2Hash[hashEntry] - deck1Hash[hashEntry];
			deckIsMissingText = deckIsMissingText + cardDifference + " " + hashEntry + "\n";
		}
	}
	
	return deckIsMissingText;
}

function compareDeckHashShares(deck1Hash, deck2Hash) {
	var deckSharesText = "";
	
	for (var hashEntry in deck2Hash) {
		if (deck1Hash.hasOwnProperty(hashEntry)) {
			if (deck1Hash[hashEntry] == deck2Hash[hashEntry]) {
				deckSharesText = deckSharesText + deck1Hash[hashEntry] + " " + hashEntry + "\n";
			} else {
				var leastCardNum = (deck2Hash[hashEntry] > deck1Hash[hashEntry]) ? deck1Hash[hashEntry] : deck2Hash[hashEntry];
				deckSharesText = deckSharesText + leastCardNum + " " + hashEntry + "\n";
			}
		}
	}
	
	return deckSharesText;
}

function goCompare(deck1SelectedOption, deck2SelectedOption) {
	if (!$("#deck1InputTextArea").val().length && !$("#deck2InputTextArea").val().length) {
		alert("Please complete Deck 1 or Deck 2 Input");
		return 0;
	}
	
	var deck1Input = [];
	var deck1Hash = {};
	var deck2Input = [];
	var deck2Hash = {};
	
	if (deck1SelectedOption == "Text") {
		deck1Input = $("#deck1InputTextArea").val().split("\n");
		deck1Hash = getDeckHash(deck1Input);
	}
	
	if (deck2SelectedOption == "Text") {
		deck2Input = $("#deck2InputTextArea").val().split("\n");
		deck2Hash = getDeckHash(deck2Input);
	}
	
	var decksSameText = compareDeckHashShares(deck1Hash, deck2Hash);
	var deckSharedHash = getDeckHash(decksSameText.split("\n"));
	
	var deck1IsMissingText = compareDeckHashMissing(deck1Hash, deck2Hash);
	var deck2IsMissingText = compareDeckHashMissing(deck2Hash, deck1Hash);
	
	if (!$("#resultsH3").length) {
		$("#compareDiv").append('<h3 id="resultsH3">Results</h3>');
	}
	
	showMissingResults(1, deck1IsMissingText);
	showSharedResults(decksSameText);
	showMissingResults(2, deck2IsMissingText);
}

function showMissingResults(deckNum, deckIsMissingText) {
	var otherDeckNum = (deckNum == 1) ? 2 : 1;
	
	if (!$("#deck" + deckNum + "Missing").length) {
		var deckMissingDiv = $(document.createElement('div')).attr("id", "deck" + deckNum + "Missing").attr("class", "deck" + deckNum + "Missing");
		var deckMissingHeader = $(document.createElement('h4')).html("Deck " + deckNum + " is missing the following from Deck " + otherDeckNum + ":");
		deckMissingHeader.appendTo(deckMissingDiv);

		var deckMissingInputTextArea = $(document.createElement('textarea')).attr("rows", 10).attr("cols", 40).attr("id", "deck" + deckNum + "MissingInputTextArea").attr("name", "deck" + deckNum + "MissingInputTextArea").val(deckIsMissingText).attr("disabled", "true");
	
		deckMissingInputTextArea.appendTo(deckMissingDiv);
		deckMissingDiv.appendTo("#compareDiv");
	} else {
		$("#deck" + deckNum + "MissingInputTextArea").val(deckIsMissingText);
	}
}

function showSharedResults(decksSameText) {
	if (!$("#deckShared").length) {
		var deckSharedDiv = $(document.createElement('div')).attr("id", "deckShared").attr("class", "deckShared");
		var deckSharedHeader = $(document.createElement('h4')).html("Shared cards:");
		deckSharedHeader.appendTo(deckSharedDiv);

		var deckSharedTextArea = $(document.createElement('textarea')).attr("rows", 10).attr("cols", 40).attr("id", "deckSharedTextArea").attr("name", "deckSharedTextArea").val(decksSameText).attr("disabled", "true");
	
		deckSharedTextArea.appendTo(deckSharedDiv);
		deckSharedDiv.appendTo("#compareDiv");
	} else {
		$("#deckSharedTextArea").val(decksSameText);
	}
}

