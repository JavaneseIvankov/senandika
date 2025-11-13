// ...existing code...
"use client";

import { useJournalTest } from "@/hooks/useJournalTest";
import { useEffect, useRef } from "react";

/* shadcn/ui components */
import { Button } from "@/shared/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/shared/components/ui/card";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Progress } from "@/shared/components/ui/progress";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Separator } from "@/shared/components/ui/separator";

export default function TestPage() {
  const {
    messages,
    input,
    isLoading,
    error,
    session,
    debugLogs,
    gamificationStats,
    badges,
    lastReward,
    setInput,
    sendMessage,
    startSession,
    endSession,
    clearMessages,
    clearDebugLogs,
    fetchGamificationData,
  } = useJournalTest();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const debugEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  // Auto-scroll debug logs
  useEffect(() => {
    debugEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [debugLogs.length]);

  // Auto-start session and fetch gamification data on mount
  useEffect(() => {
    if (!session) {
      startSession();
    }
    fetchGamificationData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      sendMessage(input);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle>Journal Test Page</CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Testing rolling summary + gamification implementation
            </p>
          </CardHeader>
        </Card>

        {/* Gamification Stats Panel */}
        {gamificationStats && (
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200">
            <CardHeader className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-gray-900">🎮 Gamification Stats</h2>
              </div>
              <Button size="sm" onClick={() => fetchGamificationData()} className="bg-purple-600">
                Refresh
              </Button>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Level */}
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-sm text-gray-600 mb-1">Level</div>
                  <div className="text-3xl font-bold text-purple-600">{gamificationStats.level}</div>
                  <div className="mt-2">
                    <div className="text-xs text-gray-500 mb-1">
                      {gamificationStats.progress.xpInCurrentLevel ?? 0} /{" "}
                      {gamificationStats.progress.xpNeededForLevel ?? 100} XP
                    </div>
                    <Progress value={gamificationStats.progress.progressPercentage} className="h-2" />
                  </div>
                </div>

                {/* Total XP */}
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-sm text-gray-600 mb-1">Total XP</div>
                  <div className="text-3xl font-bold text-blue-600">{gamificationStats.xp.toLocaleString()}</div>
                  <div className="text-xs text-gray-500 mt-2">
                    Next level: {gamificationStats.progress.nextLevelXP.toLocaleString()} XP
                  </div>
                </div>

                {/* Streak */}
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-sm text-gray-600 mb-1">Streak</div>
                  <div className="text-3xl font-bold text-orange-600">🔥 {gamificationStats.streakDays}</div>
                  <div className="text-xs text-gray-500 mt-2">
                    {gamificationStats.streakDays === 0
                      ? "Start your streak!"
                      : `${gamificationStats.streakDays} day${gamificationStats.streakDays > 1 ? "s" : ""} in a row`}
                  </div>
                </div>

                {/* Badges */}
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-sm text-gray-600 mb-1">Badges Earned</div>
                  <div className="text-3xl font-bold text-yellow-600">🏆 {badges.length}</div>
                  <div className="text-xs text-gray-500 mt-2">
                    {badges.length === 0 ? "Earn your first badge!" : `${badges.length} achievement${badges.length > 1 ? "s" : ""} unlocked`}
                  </div>
                </div>
              </div>

              {/* Last Reward */}
              {lastReward && (
                <>
                  <Separator className="my-4" />
                  <div className="mt-2 bg-white rounded-lg p-4 shadow-sm border-2 border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">✨</span>
                      <span className="font-semibold text-green-700">Last Reward</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600">XP Gained:</span>
                        <span className="ml-2 font-bold text-green-600">+{lastReward.xpGained}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Level:</span>
                        <span className="ml-2 font-bold">
                          {lastReward.level}
                          {lastReward.leveledUp && <span className="ml-1 text-yellow-500">⬆️</span>}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Streak:</span>
                        <span className="ml-2 font-bold">{lastReward.streakDays}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">New Badges:</span>
                        <span className="ml-2 font-bold text-yellow-600">{lastReward.badgesEarned.length}</span>
                      </div>
                    </div>
                    {lastReward.badgesEarned.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {lastReward.badgesEarned.map((badgeCode) => (
                          <Badge key={badgeCode} variant="secondary" className="px-2 py-1 text-xs">
                            🏆 {badgeCode}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Badges List */}
              {badges.length > 0 && (
                <>
                  <Separator className="my-4" />
                  <div className="mt-4 bg-white rounded-lg p-4 shadow-sm">
                    <div className="font-semibold text-gray-900 mb-3">🏆 Your Badges ({badges.length})</div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                      {badges.map((badge) => (
                        <div
                          key={badge.code}
                          className="flex flex-col items-center p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          title={badge.description || badge.name}
                        >
                          <div className="text-2xl mb-1">{badge.icon || "🏅"}</div>
                          <div className="text-xs font-medium text-center text-gray-700">{badge.name}</div>
                          {badge.earnedAt && (
                            <div className="text-[10px] text-gray-500 mt-1">
                              {new Date(badge.earnedAt).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column: Chat Interface */}
          <div className="lg:col-span-2 space-y-4">
            {/* Session Controls */}
            <Card>
              <CardContent className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Session</h2>
                  {session ? (
                    <div className="text-sm text-gray-600">
                      <p>
                        ID: <code className="text-xs bg-gray-100 px-1 rounded">{session.id}</code>
                      </p>
                      <p>
                        Status:{" "}
                        <span className={session.endedAt ? "text-red-600 font-medium" : "text-green-600 font-medium"}>
                          {session.endedAt ? "Ended" : "Active"}
                        </span>
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No active session</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button onClick={startSession} disabled={isLoading || (session ? !session.endedAt : false)} variant="default">
                    Start New
                  </Button>
                  <Button onClick={endSession} disabled={isLoading || !session || !!session.endedAt} variant="destructive">
                    End &amp; Summarize
                  </Button>
                  <Button onClick={clearMessages} disabled={isLoading} variant="ghost">
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Error Display */}
            {error && (
              <Card className="bg-red-50 border border-red-200">
                <CardContent>
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-label="Error icon">
                        <title>Error</title>
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">Error</h3>
                      <p className="text-sm text-red-700 mt-1">{error}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Messages */}
            <Card className="h-[500px] flex flex-col">
              <CardHeader className="p-4 border-b">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Conversation</h2>
                  <p className="text-xs text-gray-500 mt-1">{messages.length} messages</p>
                </div>
              </CardHeader>

              <CardContent className="flex-1 p-0">
                <ScrollArea className="h-full p-4">
                  <div className="space-y-4">
                    {messages.length === 0 ? (
                      <div className="text-center text-gray-500 mt-8">
                        <p>No messages yet. Start chatting!</p>
                        <p className="text-xs mt-2">
                          Try: "Nama saya Arundaya" → End session → New session → "Kamu ingat nama aku?"
                        </p>
                      </div>
                    ) : (
                      messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg px-4 py-2 ${
                              msg.role === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                            {msg.metadata && (
                              <div className="mt-2 pt-2 border-t border-gray-300 text-xs">
                                <div className="space-y-1">
                                  <p>
                                    <span className="font-semibold">Emotions:</span> {msg.metadata.analysis.emotions.join(", ")}
                                  </p>
                                  <p>
                                    <span className="font-semibold">Stress:</span> {msg.metadata.analysis.stress_score}/100
                                  </p>
                                  <p>
                                    <span className="font-semibold">Risk:</span>{" "}
                                    <span
                                      className={`font-medium ${
                                        msg.metadata.analysis.risk_flag === "none"
                                          ? "text-green-600"
                                          : msg.metadata.analysis.risk_flag === "low"
                                          ? "text-yellow-600"
                                          : "text-red-600"
                                      }`}
                                    >
                                      {msg.metadata.analysis.risk_flag}
                                    </span>
                                  </p>
                                  {msg.metadata.analysis.topics.length > 0 && (
                                    <p>
                                      <span className="font-semibold">Topics:</span> {msg.metadata.analysis.topics.join(", ")}
                                    </p>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
              </CardContent>

              <CardFooter className="p-4 border-t">
                <form onSubmit={handleSubmit} className="w-full">
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      disabled={isLoading || !session || !!session.endedAt}
                      placeholder={
                        !session ? "Start a session first..." : session.endedAt ? "Session ended. Start a new one..." : "Type a message..."
                      }
                      className="flex-1"
                    />
                    <Button
                      type="submit"
                      disabled={isLoading || !input.trim() || !session || !!session.endedAt}
                    >
                      {isLoading ? "Sending..." : "Send"}
                    </Button>
                  </div>
                </form>
              </CardFooter>
            </Card>
          </div>

          {/* Right Column: Debug Panel */}
          <div className="space-y-4">
            <Card className="h-[700px] flex flex-col">
              <CardHeader className="p-4 border-b flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Debug Logs</h2>
                  <p className="text-xs text-gray-500 mt-1">{debugLogs.length} logs</p>
                </div>
                <Button size="sm" onClick={clearDebugLogs} variant="ghost">
                  Clear
                </Button>
              </CardHeader>

              <CardContent className="flex-1 p-4 font-mono text-xs">
                <ScrollArea className="h-full space-y-2">
                  {debugLogs.length === 0 ? (
                    <p className="text-gray-500 text-center mt-8">No logs yet</p>
                  ) : (
                    debugLogs.map((log) => (
                      <div
                        key={`${log.timestamp}-${log.message}`}
                        className={`p-2 rounded ${
                          log.type === "success"
                            ? "bg-green-50 text-green-900 border border-green-200"
                            : log.type === "error"
                            ? "bg-red-50 text-red-900 border border-red-200"
                            : log.type === "warning"
                            ? "bg-yellow-50 text-yellow-900 border border-yellow-200"
                            : "bg-blue-50 text-blue-900 border border-blue-200"
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <span className="text-gray-500 shrink-0">{new Date(log.timestamp).toLocaleTimeString()}</span>
                          <span
                            className={`uppercase font-bold shrink-0 ${
                              log.type === "success" ? "text-green-700" : log.type === "error" ? "text-red-700" : log.type === "warning" ? "text-yellow-700" : "text-blue-700"
                            }`}
                          >
                            [{log.type}]
                          </span>
                        </div>
                        <p className="mt-1">{log.message}</p>
                        {log.data !== undefined && (
                          <details className="mt-1">
                            <summary className="cursor-pointer text-gray-600 hover:text-gray-900">Show data</summary>
                            <pre className="mt-1 p-2 bg-white rounded text-[10px] overflow-x-auto">{JSON.stringify(log.data, null, 2)}</pre>
                          </details>
                        )}
                      </div>
                    ))
                  )}
                  <div ref={debugEndRef} />
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Testing Instructions */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-blue-50 border border-blue-200">
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-blue-900">🧪 Testing Rolling Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                <li>
                  <strong>Session 1:</strong> Share info (e.g., "Nama saya Arundaya", "Saya suka rendang")
                </li>
                <li>
                  <strong>End Session:</strong> Click "End & Summarize" → Watch debug logs for summary generation
                </li>
                <li>
                  <strong>Session 2:</strong> Click "Start New" → Ask "Kamu ingat nama aku?"
                </li>
                <li>
                  <strong>Verify:</strong> AI should remember "Arundaya" from rolling summary!
                </li>
              </ol>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 border border-purple-200">
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-purple-900">🎮 Testing Gamification</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="text-sm text-purple-800 space-y-1 list-decimal list-inside">
                <li>
                  <strong>Send Messages:</strong> Earn +5 XP per message, +20 for first of day
                </li>
                <li>
                  <strong>Complete Session:</strong> Earn +50 XP base (+30 for long session)
                </li>
                <li>
                  <strong>Build Streak:</strong> Come back daily to maintain streak (2x multiplier at 30 days!)
                </li>
                <li>
                  <strong>Earn Badges:</strong> Watch debug logs for badge notifications! 🏆
                </li>
                <li>
                  <strong>Level Up:</strong> Level formula: level = sqrt(xp/100) + 1
                </li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
// ...existing code...