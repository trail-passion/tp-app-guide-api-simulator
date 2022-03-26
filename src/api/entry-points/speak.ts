window.speechSynthesis.onvoiceschanged = () => {
    const voices = window.speechSynthesis.getVoices()
    console.log('🚀 [speak] voices = ', voices) // @FIXME: Remove this line written on 2022-03-18 at 21:04
}

export async function  ApiSpeak(text: string, lang: string, priority: number): Promise<void> {
    console.log("SPEAK", text)
    const synth = window.speechSynthesis
    console.log('🚀 [speak] synth.getVoices() = ', synth.getVoices()) // @FIXME: Remove this line written on 2022-03-18 at 20:57
    const utterance = new SpeechSynthesisUtterance(text)
    synth.speak(utterance)
}