import React from "react";

const ChatMessage = ({ message }) => {
  return (
    <div className={`chat-message ${message.sender}-message`}>
      {message.text}
      {message.audioBlob && (
        <audio controls>
          <source src={URL.createObjectURL(message.audioBlob)} type="audio/wav" />
        </audio>
      )}
    </div>
  );
};

export default ChatMessage;
