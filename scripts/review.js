var config = {
	apiKey: "AIzaSyCxnL1UyMBU51tJU5MAKmCxHPAaMpb2veY",
	databaseURL: "https://listen-f5fcf.firebaseio.com/",
};
firebase.initializeApp(config);
database = firebase.database();

/* dynamic data. hardcoded for now */
var course_code = 'CS101'
var lecture_title = 'Lecture 13'

tagsRef = database.ref(`courses/${course_code}/lectures/${lecture_title}/tags/`);

$(document).ready(function () {
	$('.questions').empty();
	$('.tags').empty();

	setQuestionsAndTagsUpdater();
	setCheckboxListeners();
	setTagFilterListeners();
});

function setCheckboxListeners() {
	$('body').on('click', 'button[role=checkbox]', function() {
		let checked = $(this).attr('aria-checked');
		$(this).attr('aria-checked', checked == 'true' ?'false' :'true');
	});
}

function setTagFilterListeners() {
	$('body').on('click', '.tags .tag', function() {
		$(this).toggleClass('selected');

		// Hide all questions
		if ($('.tags .tag.selected').length > 0) {
			$('.question').hide();

			$('.tags .tag.selected').each(function () {
				tag_key = $(this).html();

				$('.question[data-tag=' + tag_key + ']').show();
			});
		}
		else {
			$('.question').show();
		}
	});
}

function setQuestionsAndTagsUpdater() {
	tagsRef.on('value', function(snapshot) {
		tags = snapshot.val();

		// Update tags
		Object.keys(tags).forEach(function (tag_key) {
			var tag = tags[tag_key];

			$('.tags').append(`
				<button class="tag">${tag_key}</button>
			`);

			// Update questions
			Object.keys(tag).forEach(function (question_key) {
				var question = tag[question_key];
				console.log(question);

				$('.questions').append(`
					<div class="question" data-tag="${tag_key}">
						<button role="checkbox" aria-checked="false" id="selectall"></button>
						<button class="tag">${tag_key}</button>
						${question.text}
					</div>
				`);
			});
		});
	})
}