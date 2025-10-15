document.addEventListener("DOMContentLoaded", () => {
    const inputLanguageDropdown = document.getElementById("source-language");
    const outputLanguageDropdown = document.getElementById("target-language");
    const translateBtn = document.getElementById("translate-btn");
    const inputTextElem = document.getElementById("transcript");
    const outputTextElem = document.getElementById("translated-text");
    const youtubeTab = document.getElementById("youtube-tab");
    const uploadTab = document.getElementById("upload-tab");
    const youtubeInput = document.getElementById("youtube-input");
    const uploadInput = document.getElementById("upload-input");
    const youtubeUrlInput = document.getElementById("youtube-url");
    const loadYoutubeBtn = document.getElementById("load-youtube");
    const localVideoUpload = document.getElementById("local-video-upload");
    const videoContainer = document.getElementById("video-container");
    const subtitles = document.getElementById("subtitles");

    // Populate language dropdowns
    languages.forEach(lang => {
        const option1 = document.createElement("option");
        option1.value = lang.code;
        option1.textContent = `${lang.native} (${lang.name})`;
        inputLanguageDropdown.appendChild(option1);

        const option2 = document.createElement("option");
        option2.value = lang.code;
        option2.textContent = `${lang.native} (${lang.name})`;
        outputLanguageDropdown.appendChild(option2);
    });

    // Set default languages
    inputLanguageDropdown.value = "auto";
    outputLanguageDropdown.value = "hi"; // Default target Hindi

    // Tab switching
    youtubeTab.addEventListener("click", () => {
        youtubeTab.classList.add("active");
        uploadTab.classList.remove("active");
        youtubeInput.classList.add("active");
        uploadInput.classList.remove("active");
        clearVideo();
    });

    uploadTab.addEventListener("click", () => {
        uploadTab.classList.add("active");
        youtubeTab.classList.remove("active");
        uploadInput.classList.add("active");
        youtubeInput.classList.remove("active");
        clearVideo();
    });

    // Load YouTube video
    loadYoutubeBtn.addEventListener("click", () => {
        const url = youtubeUrlInput.value.trim();
        if (!url) {
            alert("Please enter a YouTube video URL.");
            return;
        }
        loadYoutubeVideo(url);
    });

    // Upload local video
    localVideoUpload.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file || !file.type.startsWith("video/")) {
            alert("Please upload a valid video file.");
            return;
        }
        loadLocalVideo(file);
    });

    // Translate button click
    translateBtn.addEventListener("click", () => {
        const transcript = inputTextElem.value.trim();
        const sourceLang = inputLanguageDropdown.value;
        const targetLang = outputLanguageDropdown.value;
        if (!transcript) {
            alert("No transcript available to translate.");
            return;
        }
        translateText(transcript, sourceLang, targetLang);
    });

    function clearVideo() {
        videoContainer.innerHTML = "";
        subtitles.textContent = "";
        inputTextElem.value = "";
        outputTextElem.value = "";
    }

    function loadYoutubeVideo(url) {
        // Extract video ID
        const videoId = extractYouTubeID(url);
        if (!videoId) {
            alert("Invalid YouTube URL.");
            return;
        }
        clearVideo();
        const iframe = document.createElement("iframe");
        iframe.width = "720";
        iframe.height = "405";
        iframe.src = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${window.location.origin}`;
        iframe.frameBorder = "0";
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        iframe.allowFullscreen = true;
        videoContainer.appendChild(iframe);

        // Note: Speech-to-text and subtitle sync with YouTube player requires YouTube API integration
        inputTextElem.value = "Youtube video loaded. Transcribe and translate with API integration.";
    }

    function loadLocalVideo(file) {
        clearVideo();
        const video = document.createElement("video");
        video.width = 720;
        video.height = 405;
        video.controls = true;
        video.src = URL.createObjectURL(file);
        videoContainer.appendChild(video);

        // Mock transcript
        inputTextElem.value = "Local video loaded. Speech-to-text and translation feature coming soon.";
    }

    function extractYouTubeID(url) {
        const regex = /(?:youtube\.com\/.*v=|youtu\.be\/)([^&#]+)/;
        const match = url.match(regex);
        return match ? match[1] : null;
    }

    async function translateText(text, sourceLang, targetLang) {
        try {
            const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error("Translation API error");
            const data = await response.json();
            let translated = "";
            data[0].forEach(item => {
                translated += item[0];
            });
            outputTextElem.value = translated;
        } catch (error) {
            alert("Translation failed: " + error.message);
        }
    }
});
