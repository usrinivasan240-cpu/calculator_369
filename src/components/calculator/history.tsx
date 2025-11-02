"use client";

import { useMemo } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { type CalculationRecord, clearHistory } from '@/lib/firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Trash2, History as HistoryIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Skeleton } from '../ui/skeleton';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';

export default function History() {
  const { user } = useAuth();
  const firestore = useFirestore();

  const historyQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(
      collection(firestore, 'users', user.uid, 'history'),
      orderBy('timestamp', 'desc')
    );
  }, [user, firestore]);

  const { data: history, isLoading: loading } = useCollection<CalculationRecord>(historyQuery);

  const handleClearHistory = async () => {
    if (user) {
      await clearHistory(user.uid, firestore);
    }
  };

  return (
    <Card className="h-full flex flex-col min-h-[600px] max-h-[600px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HistoryIcon className="h-6 w-6" />
          Calculation History
        </CardTitle>
        <CardDescription>Your recent calculations are saved here.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 min-h-0">
        <ScrollArea className="h-full pr-4">
          {loading && (
            <div className="space-y-4">
                {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
            </div>
          )}
          {!loading && history && history.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
              <p>No calculations yet.</p>
              <p className="text-sm">Your history will appear here.</p>
            </div>
          )}
          <div className="space-y-4">
            {history && history.map((item) => (
              <div key={item.id} className="text-sm border-b pb-2">
                <p className="text-muted-foreground truncate">{item.expression}</p>
                <div className="flex justify-between items-center">
                    <p className="text-xs text-muted-foreground">
                        {item.timestamp ? formatDistanceToNow(new Date(item.timestamp.seconds * 1000), { addSuffix: true }) : ''}
                    </p>
                    <p className="font-bold text-lg text-right">= {item.result}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      {history && history.length > 0 && !loading && (
        <CardFooter>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                <Trash2 className="mr-2 h-4 w-4" /> Clear History
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your
                  entire calculation history.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearHistory} className="bg-destructive hover:bg-destructive/90">Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      )}
    </Card>
  );
}
