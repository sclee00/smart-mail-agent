const micBtn = document.getElementById('mic-btn');
const transcriptEl = document.getElementById('transcript');
const statusEl = document.getElementById('connection-status');
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
    transcriptEl.textContent = "이 브라우저는 음성 인식을 지원하지 않습니다.";
    micBtn.disabled = true;
} else {
    const recognition = new SpeechRecognition();
    recognition.lang = 'ko-KR';
    recognition.interimResults = false;
    let isListening = false;

    micBtn.addEventListener('click', () => {
        if (!isListening) recognition.start();
        else recognition.stop();
    });

    recognition.onstart = () => {
        isListening = true;
        micBtn.classList.add('listening');
        micBtn.textContent = "🔴 듣고 있는 중...";
        statusEl.textContent = "음성 대기 중";
        statusEl.className = "status badge-active";
    };

    recognition.onresult = (event) => {
        const speechResult = event.results[0][0].transcript;
        transcriptEl.textContent = `"${speechResult}"`;
        handleVoiceCommand(speechResult);
    };

    recognition.onerror = (event) => {
        transcriptEl.textContent = `오류: ${event.error}`;
        resetMicState();
    };

    recognition.onend = () => { resetMicState(); };

    function resetMicState() {
        isListening = false;
        micBtn.classList.remove('listening');
        micBtn.textContent = "🎤 음성 명령 시작";
        statusEl.textContent = "연결 대기중";
        statusEl.className = "status badge-normal";
    }

    function handleVoiceCommand(command) {
        if (command.includes("답장") || command.includes("보내")) {
            setTimeout(() => alert(`[에이전트 실행] "${command}" 반영 완료`), 500);
        } else {
            setTimeout(() => transcriptEl.textContent = `명령 인식: "${command}"`, 500);
        }
    }
}
