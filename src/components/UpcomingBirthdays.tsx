
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Member } from '@/types';
import { formatBirthday } from '@/data/mockData';
import { Gift, Calendar, CalendarDays } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UpcomingBirthdaysProps {
  members: Member[];
}

export function UpcomingBirthdays({ members }: UpcomingBirthdaysProps) {
  // Filter active members with birthdays
  const birthdaysToShow = members
    .filter(member => member.status === 'active' && member.birthday)
    .map(member => {
      const birthday = new Date(member.birthday || '');
      const today = new Date();
      const currentYear = today.getFullYear();
      
      // Calculate next birthday (this year or next year)
      let nextBirthday = new Date(currentYear, birthday.getMonth(), birthday.getDate());
      if (nextBirthday < today) {
        nextBirthday = new Date(currentYear + 1, birthday.getMonth(), birthday.getDate());
      }
      
      // Calculate days until next birthday
      const daysUntil = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 3600 * 24));
      
      return { ...member, daysUntil };
    })
    .sort((a, b) => (a.daysUntil || 0) - (b.daysUntil || 0))
    .slice(0, 5); // Show only the 5 nearest birthdays
  
  return (
    <Card className="bg-gradient-to-br from-pink-50 to-rose-50 border-0 shadow-md overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-pink-800 flex items-center">
          <Gift className="h-4 w-4 mr-2 text-pink-600" />
          Upcoming Birthdays
        </CardTitle>
      </CardHeader>
      <CardContent>
        {birthdaysToShow.length > 0 ? (
          <ul className="space-y-3">
            {birthdaysToShow.map((member) => (
              <li key={member.id} className="flex items-center">
                <Avatar className="h-8 w-8 mr-2 border border-pink-200">
                  {member.imageUrl ? (
                    <AvatarImage src={member.imageUrl} alt={member.name} />
                  ) : (
                    <AvatarFallback className="bg-pink-200 text-pink-700">
                      {member.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-pink-800 truncate">{member.name}</p>
                  <div className="flex items-center text-xs text-pink-600">
                    <Calendar className="h-3 w-3 mr-1 inline" />
                    <span>{formatBirthday(member.birthday || '')}</span>
                  </div>
                </div>
                <div className="ml-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-pink-100 text-pink-800">
                    {member.daysUntil === 0 ? (
                      'Today!'
                    ) : member.daysUntil === 1 ? (
                      'Tomorrow'
                    ) : (
                      `${member.daysUntil} days`
                    )}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <CalendarDays className="h-12 w-12 text-pink-300 mb-2" />
            <p className="text-sm text-pink-600">No upcoming birthdays</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
