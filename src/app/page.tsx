'use client';

import { Inter } from 'next/font/google'
import axios from 'axios';
import { useState } from 'react';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [inputValue, setInputValue] = useState('');
  const [chatLog, setChatLog] = useState<string[]>([]);

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(event.target.value);
  }

  const sendMessageToChatGPT = async (input: string) => {
    await axios.post(process.env.NEXT_PUBLIC_API_URL as string, 
    {
      prompt: `Veja o produto que está neste link: ${inputValue} e me retorne um título em html com o nome do produto e 05 vantages e 05 desvantagens dele e me retorne no formato de uma lista em HTML. Me retorne também em uma lista html separada 03 opções de produtos similares.`,
      model: "text-davinci-003",
      max_tokens: 2048, // tamanho da resposta
      temperature: 0.5, // criatividade na resposta
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
    ).then(response => setChatLog(response.data.choices[0].text))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await sendMessageToChatGPT(inputValue);
  }

  return (
    <div>
      <h1>Digite o nome do produto ou cole a URL:</h1>
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <input type="text" value={inputValue} onChange={handleInputChange} className="border"/>
      <button type="submit" className="bg-blue-500 text-white rounded">Enviar</button>
    </form>
    <div dangerouslySetInnerHTML={{__html: chatLog}}></div>
    </div>
  )
}
