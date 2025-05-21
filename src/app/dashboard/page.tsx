"use client";

import { Message } from "@/model/User";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import MessageCard from "@/components/MessageCard";
import { Button } from "@react-email/components";
import { Copy, Loader2, RefreshCcw } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { User } from "next-auth";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [isMessagesAccepted, setIsMessagesAccepted] = useState(false);

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const { data: session } = useSession();

  const form = useForm<z.infer<typeof acceptMessageSchema>>({
    resolver: zodResolver(acceptMessageSchema),
  });

  const { register, setValue } = form;

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/acceptMessages");
      setValue("acceptMessages", response.data.isAcceptingMesage ?? false);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast(
        axiosError.response?.data.message || "failed to fetch message settings"
      );
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(false);

      try {
        const response = await axios.get<ApiResponse>("/api/getMessages");
        setMessages(response.data.messages || []);

        if (refresh) {
          toast("Showing latest messages");
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast(
          axiosError.response?.data.message ||
            "failed to fetch message settings"
        );
      } finally {
        setTimeout(() => {
          setIsLoading(false);
          setIsSwitchLoading(false);
        }, 3000);
      }
    },
    [setIsLoading, setMessages]
  );

  useEffect(() => {
    if (!session || !session.user) return;

    fetchMessages();
    fetchAcceptMessages();
  }, [session, setValue, fetchAcceptMessages, fetchMessages]);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/acceptMessages", {
        acceptMessages: !isMessagesAccepted,
      });

      setValue("acceptMessages", !isMessagesAccepted);
      toast(response.data.message);

      setIsMessagesAccepted(!isMessagesAccepted);
      localStorage.setItem("acceptMessages", (!isMessagesAccepted).toString());
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast(
        axiosError.response?.data.message || "failed to fetch message settings"
      );
    }
  };

  useEffect(() => {
    const savedValue = localStorage.getItem("acceptMessages");
    if (savedValue !== null) {
      setIsMessagesAccepted(savedValue === "true");
    }
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast("Profile url has been copied to clipboard");
  };

  if (!session || !session.user) {
    return <div>Please login</div>;
  }

  const { username } = session.user as User;

  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>
        <div className="flex items-center border border-gray-300 rounded-lg p-3 bg-white shadow-sm">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>
            <span className="flex items-center gap-2 cursor-pointer">
              Copy <Copy />
            </span>
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register("acceptMessages")}
          checked={isMessagesAccepted}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {isMessagesAccepted ? "On" : "Off"}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4 cursor-pointer"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4 " />
        )}
      </Button>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, idx) => (
            <Skeleton key={idx} className="h-[125px] w-full rounded-xl" />
          ))
        ) : messages.length > 0 ? (
          messages.map((message) => (
            <MessageCard
              key={message._id}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
