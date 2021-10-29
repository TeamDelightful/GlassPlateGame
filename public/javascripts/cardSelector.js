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

function printCheckBoxes(){
    var theDiv = document.getElementById("scroll-div");
    for (var i = 0; i < cardIds.length; i++) {
        var check = document.createElement("INPUT");
        check.setAttribute("type", "checkbox");
        check.checked = true;
        check.id = cardIds[i];
        var label = document.createElement('label')
        label.htmlFor = cardIds[i];
        label.appendChild(document.createTextNode(cardIds[i]));
        theDiv.appendChild(check);
        theDiv.appendChild(label);
    }
}

printCheckBoxes();

