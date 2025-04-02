
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { Session } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, FileText } from "lucide-react";

type SessionCardProps = {
  session: Session;
};

export const SessionCard = ({ session }: SessionCardProps) => {
  const noteCount = session.notes.length;
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{session.title}</CardTitle>
          <div 
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              session.status === 'in-progress' 
                ? 'bg-green-100 text-green-800' 
                : session.status === 'scheduled' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-gray-100 text-gray-800'
            }`}
          >
            {session.status === 'in-progress' 
              ? 'In Progress' 
              : session.status === 'scheduled' 
                ? 'Scheduled' 
                : 'Completed'}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2 flex-grow">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <Clock size={14} />
          <span>{format(session.date, "MMM d, yyyy • h:mm a")}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <FileText size={14} />
          <span>{noteCount} {noteCount === 1 ? 'note' : 'notes'}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link to={`/sessions/${session.id}`}>
            Continue Session
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
