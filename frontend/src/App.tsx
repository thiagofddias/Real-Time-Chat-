import './App.css'
import { useChat } from './chat/ChatContext'
import { Login } from './chat/Login'
import { Chat } from './chat/Chat'

export default function App() {
  const { name, room } = useChat();
  return name && room ? <Chat /> : <Login />
}
