// Initialize SpeechSynthesis API
const synth = window.speechSynthesis;

// DOM Elements
const textForm = document.querySelector('form');
const textInput = document.querySelector('#text-input');
const voiceSelect = document.querySelector('#voice-select');
const rate = document.querySelector('#rate');
const rateValue = document.querySelector('#rate-value');
const pitch = document.querySelector('#pitch');
const pitchValue = document.querySelector('#pitch-value');

// Initialize voices array
let voices = [];

// Function to get voices
const getVoices = () => {
    voices = synth.getVoices();

    if (voices.length > 0) {
        // Clear previous options
        voiceSelect.innerHTML = '';

        // Populate voice options
        voices.forEach(voice => {
            const option = document.createElement('option');
            option.textContent = `${voice.name} (${voice.lang})`;
            option.setAttribute('data-lang', voice.lang);
            option.setAttribute('data-name', voice.name);
            voiceSelect.appendChild(option);
        });
    } else {
        console.warn('No voices available. Retrying...');
        // Retry fetching voices in case it's still initializing
        setTimeout(getVoices, 500);
    }
};

// Initialize voices and handle `onvoiceschanged` fallback
if (synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = getVoices;
} else {
    // Fallback for browsers where `onvoiceschanged` doesn't fire
    setTimeout(getVoices, 500);
}

// Speak function
const speak = () => {
    if (synth.speaking) {
        console.error('Already speaking...');
        return;
    }

    if (textInput.value.trim() !== '') {
        const speakText = new SpeechSynthesisUtterance(textInput.value);

        // Event listeners for speech synthesis
        speakText.onend = () => console.log('Done speaking...');
        speakText.onerror = () => console.error('An error occurred during speaking.');

        // Select the chosen voice
        const selectedVoiceName = voiceSelect.selectedOptions[0]?.getAttribute('data-name');
        const selectedVoice = voices.find(voice => voice.name === selectedVoiceName);
        if (selectedVoice) {
            speakText.voice = selectedVoice;
        }

        // Ensure valid pitch and rate values
        const pitchValueNum = parseFloat(pitch.value) || 1.0; // Default to 1.0 if invalid
        const rateValueNum = parseFloat(rate.value) || 1.0;   // Default to 1.0 if invalid

        speakText.pitch = pitchValueNum;
        speakText.rate = rateValueNum;

        // Start speaking
        synth.speak(speakText);
    }
};

// Event Listeners

// Handle text form submission
textForm.addEventListener('submit', e => {
    e.preventDefault();
    speak();
    textInput.blur();
});

// Update rate and pitch value display
rate.addEventListener('input', () => {
    const rateVal = parseFloat(rate.value) || 1.0; // Fallback to 1.0
    rateValue.textContent = rateVal.toFixed(1);
});

pitch.addEventListener('input', () => {
    const pitchVal = parseFloat(pitch.value) || 1.0; // Fallback to 1.0
    pitchValue.textContent = pitchVal.toFixed(1);
});

// Speak on voice selection change
voiceSelect.addEventListener('change', speak);

// Check for SpeechSynthesis API Support
if (!('speechSynthesis' in window)) {
    alert('Your browser does not support the SpeechSynthesis API.');
}
