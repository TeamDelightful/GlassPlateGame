var cardIds = ["ambivalence", "anthropomorphism", "art_versus_nature",
"city_as_artifact", "coding", "contemplation", "creation", "death",
"education", "emotional_manipulation", "eternity_continuity",
"freedom", "fundamental_theorem_of_calculus", "gestalt", "harmony",
"helplessness", "hidden_potential", "intuition", "joy", "magic",
"metamorphosis", "monetary_value",
"multiplication_of_mechanical_advantage", "myth",
"nature_tending_towards_perfection",
"ontogeny_recapitulates_philogeny", "point_of_view_perspective",
"reaching_out", "return", "society_as_active_passive_hierarchy",
"species_specific_norms", "structural_strength",
"structured_improvisation", "struggle", "symbolic_handles",
"synergy", "syntax", "the_need_not_to_judge",
"unwanted_relationships"];

var cardNames = ["ambivalence", "anthropomorphism", "art versus nature",
"city as artifact", "coding", "contemplation", "creation", "death",
"education", "emotional manipulation", "eternity continuity",
"freedom", "fundamental theorem of calculus", "gestalt", "harmony",
"helplessness", "hidden potential", "intuition", "joy", "magic",
"metamorphosis", "monetary value",
"multiplication of mechanical advantage", "myth",
"nature tending towards perfection",
"ontogeny recapitulates philogeny", "point of view perspective",
"reaching out", "return", "society as active passive hierarchy",
"species specific norms", "structural strength",
"structured improvisation", "struggle", "symbolic handles",
"synergy", "syntax", "the need not to judge",
"unwanted relationships"];

function printCheckBoxes(){
    var theDiv = document.getElementById("scroll-div");
    for (var i = 0; i < cardIds.length; i++) {
        var check = document.createElement("INPUT");
        check.setAttribute("type", "checkbox");
        check.checked = true;
        check.id = cardIds[i];
        var label = document.createElement('label')
        label.htmlFor = cardIds[i];
        label.appendChild(document.createTextNode(cardNames[i]));
		linebreak = document.createElement("br");
        theDiv.appendChild(check);
        theDiv.appendChild(label);
		theDiv.appendChild(linebreak);
    }
}

var sizes = ["1x1","2x2", "3x3", "4x4", "5x5", "6x6"];

function printRadio(){
    var theDiv2 = document.getElementById("scroll-div-2");
	for (var i = 0; i < sizes.length; i++) {
		var radiobox = document.createElement('input');
		radiobox.type = "radio";
		radiobox.id = sizes[i];
		radiobox.name = "size";
		radiobox.value = (i+1) * (i+1);
		if(i == 1){
			radiobox.checked = true;
		}
		var label = document.createElement('label')
        label.htmlFor = sizes[i];
        label.appendChild(document.createTextNode(sizes[i]));
		linebreak = document.createElement("br");
		theDiv2.appendChild(radiobox);
        theDiv2.appendChild(label);
		theDiv2.appendChild(linebreak);
	}
}
printRadio();
printCheckBoxes();

