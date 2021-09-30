!(function () {
    const TAB_KEY_CODE = 9;
    const suggestionId = 'gmail-autocomplete-suggestion';
    const phrases = [
        `Do you have time to meet next week?`,
        `I have forwarded this message to the appropriate service rep.`,
        `If you're not the right person, can you please put me in touch with whoever is?`,
        `Thanks again for chatting today and I look forward to hearing from you!`
    ];

    const phrasesSearch = phrases.map((phrase) => {
        let fortyPercentagePhrase = Math.round(phrase.length / 100 * 40);
        return {
            'title': phrase,
            'search': phrase.slice(0, fortyPercentagePhrase).toLowerCase()
        };
    });

    const gmailTextAreas = document.querySelectorAll('div[role="textbox"]');

    const placeCaretAtEnd = (el) => {
        el.focus();
        if (typeof window.getSelection != "undefined"
            && typeof document.createRange != "undefined") {
            let range = document.createRange();
            range.selectNodeContents(el);
            range.collapse(false);
            let sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        } else if (typeof document.body.createTextRange != "undefined") {
            let textRange = document.body.createTextRange();
            textRange.moveToElementText(el);
            textRange.collapse(false);
            textRange.select();
        }
    };

    const getSuggestion = (index) => document.getElementsByClassName(suggestionId)[index];

    const setSuggestionShadow = (title, index) => {
        let suggestion = getSuggestion(index);
        if (suggestion?.shadowRoot) {
            suggestion.shadowRoot.innerHTML = `<span>${title}</span>`;
        } else {
            gmailTextAreas[index].innerHTML += `<span class="${suggestionId}" style="opacity: 0.5"></span>`;
            suggestion = getSuggestion(index);
            let suggestionShadow = suggestion.attachShadow({mode: 'open'});
            suggestionShadow.innerHTML = `<span>${title}</span>`;
        }
    };

    const intervalId = setInterval(() => {
        console.log('tick');
        let countGmailTextAreas = gmailTextAreas.length;

        if (countGmailTextAreas) {
            for (let index = 0; index < countGmailTextAreas; index++) {
                gmailTextAreas[index].addEventListener('input', function(event) {
                    let text = this.innerText;
                    let autocompleteData = phrasesSearch.find((phrase) =>
                        text.toLowerCase().startsWith(phrase.search));

                    if (autocompleteData) {
                        let textLength = text.length;
                        setSuggestionShadow(autocompleteData.title.slice(textLength), index);
                        placeCaretAtEnd(gmailTextAreas[index]);
                    } else {
                        let suggestion = getSuggestion(index);
                        if (suggestion?.shadowRoot?.innerHTML) {
                            setSuggestionShadow('', index);
                        }
                    }
                });

                gmailTextAreas[index].addEventListener('keydown', function (event) {
                    if (event.keyCode === TAB_KEY_CODE) {
                        let suggestion = getSuggestion(index);
                        let suggestionShadow = suggestion.shadowRoot.querySelectorAll('span')[0];
                        let shadowText = suggestionShadow.innerText;

                        if (shadowText.length) {
                            this.innerText += shadowText;
                            setSuggestionShadow('', index);
                            placeCaretAtEnd(this);
                        }
                    }
                });

                clearInterval(intervalId);
            }
        }
    }, 1000);
})();
