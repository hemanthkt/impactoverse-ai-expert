// this component has   other component.    componet help to live transcribe or translat from anyother language.
"use client";
import React, { useState } from "react";
import RecordingView from "./RecordingView";
import LanguageSelector from "./LanguageSelector";
import Recording from "@/app/voice-record/Recording";
export default function VoiceRecord() {
  const [language, setLanguage] = useState("en-US");

  return (
    <div className="flex justify-center  ml-3">
      <LanguageSelector language={language} setLanguage={setLanguage} />

      {language == "en-US" ? (
        <RecordingView />
      ) : (
        <Recording language={language} />
      )}
    </div>
  );
}
