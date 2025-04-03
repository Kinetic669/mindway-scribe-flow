
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { NavBar } from "@/components/NavBar";
import { mockClients, mockNotes } from "@/data/mockData";
import { ChevronRight, Clock, Target, Calendar, User, FileText, List, Activity } from "lucide-react";
import { ChartContainer } from "@/components/ui/chart";
import { CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, BarChart, Bar } from "recharts";

const SessionPrep = () => {
  const navigate = useNavigate();
  const [sessionGoals, setSessionGoals] = useState<string[]>(["Explore anxiety triggers", "Practice mindfulness technique"]);
  const [newGoal, setNewGoal] = useState("");
  const [sessionDuration, setSessionDuration] = useState(50);
  const [sessionNotes, setSessionNotes] = useState("");
  
  // Get demo client (first client in the mock data)
  const client = mockClients[0];
  
  // Mock attendance data for the chart
  const attendanceData = [
    { month: "Aug", count: 4, sessions: 4 },
    { month: "Sep", count: 3, sessions: 4 },
    { month: "Oct", count: 4, sessions: 4 },
    { month: "Nov", count: 3, sessions: 4 },
    { month: "Dec", count: 4, sessions: 4 },
    { month: "Jan", count: 4, sessions: 4 },
  ];
  
  // Generate weekly attendance data for the small chart
  const weeklyData = Array.from({ length: 20 }, (_, i) => ({
    week: i + 1,
    attended: Math.random() > 0.2 // 80% attendance probability
  }));
  
  const addGoal = () => {
    if (newGoal.trim() === "") return;
    setSessionGoals([...sessionGoals, newGoal.trim()]);
    setNewGoal("");
  };
  
  const removeGoal = (index: number) => {
    setSessionGoals(goals => goals.filter((_, i) => i !== index));
  };
  
  const startSession = () => {
    // In a real app, you would save session prep data here
    // For the demo, just navigate to the session
    navigate("/demo/session");
  };
  
  return (
    <div className="min-h-screen flex flex-col pb-6">
      <NavBar />
      
      <main className="flex-grow max-w-4xl mx-auto px-4 md:px-6 pt-4 pb-20">
        <div className="flex flex-col gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-14 w-14 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                <User size={28} />
              </div>
              <div>
                <h1 className="text-xl font-semibold">{client.name}</h1>
                <p className="text-sm text-gray-500">Session Preparation</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Attendance overview */}
              <div className="space-y-4">
                <h2 className="text-lg font-medium flex items-center gap-2">
                  <Calendar size={18} />
                  <span>Attendance Overview</span>
                </h2>
                
                <Card className="p-4 h-44">
                  <div className="text-xs text-gray-500 mb-1">Weekly Sessions</div>
                  <div className="h-full w-full">
                    <ChartContainer
                      config={{
                        attended: {
                          label: "Attended",
                          color: "#4c6fff"
                        },
                        missed: {
                          label: "Missed",
                          color: "#f1f1f1"
                        }
                      }}
                    >
                      <BarChart data={attendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          domain={[0, 5]}
                          ticks={[0, 1, 2, 3, 4]}
                        />
                        <Tooltip />
                        <Bar dataKey="count" fill="var(--color-attended)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ChartContainer>
                  </div>
                </Card>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Attendance Calendar</span>
                    <span className="text-xs text-gray-500">Last 20 weeks</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {weeklyData.map((week, i) => (
                      <div 
                        key={i}
                        className="w-5 h-5 rounded-sm"
                        style={{ 
                          backgroundColor: week.attended ? "#4c6fff33" : "#f1f1f1",
                          border: week.attended ? "1px solid #4c6fff" : "1px solid #e5e7eb"
                        }}
                        title={`Week ${week.week}: ${week.attended ? "Attended" : "Missed"}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Previous notes */}
              <div className="space-y-4">
                <h2 className="text-lg font-medium flex items-center gap-2">
                  <FileText size={18} />
                  <span>Previous Session Notes</span>
                </h2>
                
                <div className="max-h-64 overflow-y-auto space-y-3 pr-2">
                  {mockNotes.map(note => (
                    <Card key={note.id} className="p-3">
                      <div className="flex items-start gap-2">
                        <div 
                          className="w-3 h-3 rounded-full mt-1.5"
                          style={{ backgroundColor: note.type.color }}
                        />
                        <div>
                          <div className="text-xs text-gray-500 mb-1 flex items-center gap-2">
                            <span>{note.type.name}</span>
                            <span>•</span>
                            <span>{note.timestamp.toLocaleDateString()}</span>
                          </div>
                          <p className="text-sm">{note.content}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </Card>
          
          {/* Session preparation */}
          <Card className="p-6">
            <h2 className="text-lg font-medium mb-4">Session Preparation</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium flex items-center gap-2 mb-2">
                    <Clock size={16} />
                    <span>Session Duration (minutes)</span>
                  </label>
                  <div className="flex items-center gap-2">
                    {[30, 45, 50, 60, 90].map(duration => (
                      <Button
                        key={duration}
                        type="button"
                        variant={sessionDuration === duration ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSessionDuration(duration)}
                      >
                        {duration}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium flex items-center gap-2 mb-2">
                    <Target size={16} />
                    <span>Session Goals</span>
                  </label>
                  <div className="space-y-2 mb-3">
                    {sessionGoals.map((goal, index) => (
                      <div key={index} className="flex items-center gap-2 bg-gray-50 rounded-md p-2">
                        <span className="text-sm flex-1">{goal}</span>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeGoal(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a new goal..."
                      value={newGoal}
                      onChange={(e) => setNewGoal(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addGoal()}
                    />
                    <Button type="button" onClick={addGoal}>Add</Button>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium flex items-center gap-2 mb-2">
                  <List size={16} />
                  <span>Session Notes</span>
                </label>
                <Textarea
                  placeholder="Add any notes or reminders for this session..."
                  className="min-h-36"
                  value={sessionNotes}
                  onChange={(e) => setSessionNotes(e.target.value)}
                />
              </div>
            </div>
          </Card>
          
          {/* Exercises library */}
          <Card className="p-6">
            <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
              <Activity size={18} />
              <span>Planned Exercises</span>
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="overflow-hidden border-2 border-blue-100">
                <div className="bg-blue-50 p-3">
                  <h3 className="font-medium">Emotion Wheel</h3>
                  <p className="text-sm text-gray-600">Identify and articulate emotions</p>
                </div>
                <div className="p-3 flex justify-end">
                  <Button variant="outline" size="sm">Preview</Button>
                </div>
              </Card>
              
              <Card className="overflow-hidden border-2 border-green-100">
                <div className="bg-green-50 p-3">
                  <h3 className="font-medium">Breathing Exercise</h3>
                  <p className="text-sm text-gray-600">4-7-8 breath technique for anxiety</p>
                </div>
                <div className="p-3 flex justify-end">
                  <Button variant="outline" size="sm">Preview</Button>
                </div>
              </Card>
            </div>
          </Card>
        </div>
      </main>
      
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t flex justify-end">
        <Button 
          size="lg" 
          onClick={startSession}
          className="gap-2"
        >
          <span>Start Session</span>
          <ChevronRight size={18} />
        </Button>
      </div>
    </div>
  );
};

export default SessionPrep;
