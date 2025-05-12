'use client'

import { useSession } from "next-auth/react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { User } from "next-auth"
import axios from "axios"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import Link from "next/link"

const Message = () => {
  const [messageText, setMessageText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)

  const { data: session } = useSession()
  const { username } = session?.user as User || {}

  // ✉️ Handle sending a message
  const sendMessages = async () => {
    if (!messageText.trim()) {
      toast("Please enter a message before sending.")
      return
    }

    setIsLoading(true)
    try {
      const response = await axios.post('/api/sendMessages', {
        username,
        content: messageText,
      })
      console.log("response from sendMessages", response.data)
      toast("Message sent successfully!")
      setMessageText("")
    } catch (error) {
      console.error("Error sending message:", error)
      toast("Failed to send message")
    } finally {
      setIsLoading(false)
    }
  }

  const getSuggestions = async () => {
    setLoadingSuggestions(true)
    try {
      const response = await axios.post('/api/suggestMessages')
      // console.log("Suggestion API response:", response.data)
      const result = response.data.result
      const questions = result?.split("||").map(q => q.trim()) || []
      setSuggestions(questions)
    } catch (error) {
      console.error("Suggestion fetch error:", error)
      toast("Failed to fetch suggestions.")
    } finally {
      setLoadingSuggestions(false)
    }
  }

  // Check for login
  if (!session || !session.user) {
    return <div>Please login</div>
  }

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4 text-center ">Public Profile Url</h1>

      {/* Message Input */}
      <div className="mb-4">
        <h2 className="text-md font-semibold mb-2">{`Send Anonymous Message To @${username}`}</h2>
        <div className="flex items-center border border-gray-300 rounded-lg p-3 bg-white shadow-sm">
          <textarea
            placeholder="Add anonymous message..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            className="w-full p-2 mr-2 h-12 resize-none outline-none focus:ring-0 shadow-none bg-white"
          />
        </div>
      </div>

      {/* Send Button */}
      <div className="flex flex-col md:flex-row gap-4 justify-center mb-6">
        <Button 
          onClick={sendMessages} 
          disabled={isLoading || !messageText.trim()}
          variant="custom" 
          className="w-full md:w-auto cursor-pointer"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : "Send Message"}
        </Button>
      </div>

      {/* Suggestion Section */}
      <div className="mb-6">
        <Button 
          variant="custom" 
          onClick={getSuggestions}
          className="w-full md:w-auto mb-4 cursor-pointer"
          disabled={loadingSuggestions}
        >
        {loadingSuggestions ? (
  <div className="flex items-center gap-2">
    <Loader2 className="animate-spin" />
    <span>Please wait</span>
  </div>
) : (
  "Suggest Messages"
)}

        </Button>

        {suggestions.length > 0 && (
          <>
            <h2 className="text-md font-semibold mb-4">Click a suggestion to use it:</h2>
            <div className="flex flex-col gap-2">

              {suggestions.map((question, idx) => (
                <Card
                  key={idx}
                  onClick={() => setMessageText(question)}
                  className="cursor-pointer hover:shadow-md transition"
                >
                  <CardContent className="px-4  text-sm truncate">
                    {question}
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Call to Action */}
      <h2 className="text-md font-bold mb-2 text-center">Get Your Message Board</h2>
      <div className="flex justify-center">
        <Link href="/signIn">
        <Button 
          variant="thala"
          className="w-full md:w-auto cursor-pointer"
        >
          Create Your Account
        </Button>
        </Link>
      </div>
    </div>
  )
}

export default Message
