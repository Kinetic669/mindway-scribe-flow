
import { useState } from "react";
import { Link } from "react-router-dom";
import { MobileNav } from "@/components/app/MobileNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockSessions, mockClients } from "@/data/mockData";
import { SessionCard } from "@/components/app/SessionCard";
import { Plus, Calendar, Clock } from "lucide-react";
import { format } from "date-fns";

const Dashboard = () => {
  const [sessions] = useState(mockSessions);
  const [clients] = useState(mockClients);
  
  // In a real app, we would filter these based on real data
  const upcomingSessions = sessions.filter(session => session.status === 'scheduled');
  const inProgressSessions = sessions.filter(session => session.status === 'in-progress');
  
  const today = new Date();

  return (
    <div className="min-h-screen bg-mindway-gray pb-20">
      <header className="bg-white border-b p-4 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-mindway-primary flex items-center justify-center text-white font-bold">M</div>
            <span className="text-xl font-semibold">Mindway</span>
          </div>
          <Button variant="ghost" size="icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bell"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          </Button>
        </div>
      </header>
      
      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Welcome back</h1>
            <p className="text-gray-600">{format(today, "EEEE, MMMM d, yyyy")}</p>
          </div>
          <Button asChild>
            <Link to="/sessions/new">
              <Plus size={16} className="mr-1" /> New Session
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Schedule */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar size={18} />
                    Today's Schedule
                  </CardTitle>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/calendar">View Calendar</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {upcomingSessions.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingSessions.map(session => (
                      <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{session.title}</p>
                          <p className="text-sm text-gray-500">
                            {format(session.date, "h:mm a")} · {clients.find(c => c.id === session.clientId)?.name}
                          </p>
                        </div>
                        <Button size="sm" asChild>
                          <Link to={`/sessions/${session.id}`}>
                            Start
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Clock size={36} className="mx-auto mb-2 text-gray-400" />
                    <p>No upcoming sessions for today</p>
                    <Button variant="link" asChild>
                      <Link to="/sessions/new">Schedule a session</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Recent Sessions */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Recent Sessions</CardTitle>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/sessions">View All</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {inProgressSessions.length > 0 ? (
                    inProgressSessions.map(session => (
                      <SessionCard key={session.id} session={session} />
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500 md:col-span-2">
                      <p>No recent sessions</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Right column */}
          <div className="space-y-6">
            {/* Clients */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Your Clients</CardTitle>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/clients">View All</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {clients.length > 0 ? (
                  <div className="space-y-3">
                    {clients.map(client => (
                      <Link
                        key={client.id}
                        to={`/clients/${client.id}`}
                        className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium mr-3">
                          {client.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{client.name}</p>
                          <p className="text-sm text-gray-500">
                            {client.sessions.length} {client.sessions.length === 1 ? 'session' : 'sessions'}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No clients yet</p>
                    <Button variant="link" asChild>
                      <Link to="/clients/new">Add a client</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Quick Links */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/tools">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-briefcase mr-2"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                    Therapy Tools
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/reports">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bar-chart-2 mr-2"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>
                    Reports & Analytics
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/settings">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-settings mr-2"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
                    Settings
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <MobileNav />
    </div>
  );
};

export default Dashboard;
