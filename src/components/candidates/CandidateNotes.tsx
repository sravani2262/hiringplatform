import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { Send, AtSign, User } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface Note {
  id: string;
  content: string;
  mentionedUsers: string[];
  createdAt: string;
  userId: string;
  userName: string;
}

interface CandidateNotesProps {
  candidateId: string;
}

const mockUsers = [
  { id: 'user-1', name: 'Sarah Johnson', email: 'sarah@example.com' },
  { id: 'user-2', name: 'Mike Chen', email: 'mike@example.com' },
  { id: 'user-3', name: 'Emily Davis', email: 'emily@example.com' },
  { id: 'user-4', name: 'David Wilson', email: 'david@example.com' },
];

export function CandidateNotes({ candidateId }: CandidateNotesProps) {
  const [noteText, setNoteText] = useState('');
  const [showMentionDropdown, setShowMentionDropdown] = useState(false);
  const [mentionPosition, setMentionPosition] = useState(0);
  const [mentions, setMentions] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const queryClient = useQueryClient();

  // Mock notes data - in real app, this would come from API
  const { data: notes = [] } = useQuery<Note[]>({
    queryKey: ['notes', candidateId],
    queryFn: async () => {
      // In a real app, this would fetch from API
      // For now, return empty array - notes will be stored in local state
      return [];
    },
    staleTime: 1000 * 60 * 2,
  });

  const addNoteMutation = useMutation({
    mutationFn: async (note: Omit<Note, 'id'>) => {
      // In a real app, this would POST to API
      const newNote = {
        ...note,
        id: `note-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      
      // Store in localStorage for persistence
      const existingNotes = JSON.parse(localStorage.getItem(`notes-${candidateId}`) || '[]');
      const updatedNotes = [newNote, ...existingNotes];
      localStorage.setItem(`notes-${candidateId}`, JSON.stringify(updatedNotes));
      
      return newNote;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', candidateId] });
      setNoteText('');
      setMentions([]);
      toast.success('Note added successfully');
    },
    onError: () => {
      toast.error('Failed to add note');
    },
  });

  // Check for @ mentions
  const checkForMentions = (text: string) => {
    const atIndex = text.lastIndexOf('@');
    if (atIndex !== -1) {
      const afterAt = text.substring(atIndex + 1);
      const match = afterAt.match(/^(\w*)/);
      if (match) {
        const currentQuery = match[0];
        if (textareaRef.current) {
          const selectionStart = textareaRef.current.selectionStart;
          setMentionPosition(selectionStart);
          setShowMentionDropdown(true);
        }
      }
    } else {
      setShowMentionDropdown(false);
    }
  };

  const handleMention = (userName: string) => {
    const atIndex = noteText.lastIndexOf('@');
    if (atIndex !== -1) {
      const beforeAt = noteText.substring(0, atIndex);
      const newText = `${beforeAt}@${userName} `;
      setNoteText(newText);
      setMentions([...mentions, userName]);
      setShowMentionDropdown(false);
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newText.length, newText.length);
      }
    }
  };

  const handleSubmit = () => {
    if (noteText.trim()) {
      addNoteMutation.mutate({
        content: noteText,
        mentionedUsers: mentions,
        userId: 'current-user',
        userName: 'You',
      });
    }
  };

  // Get notes from localStorage
  const storedNotes = (() => {
    try {
      const notes = localStorage.getItem(`notes-${candidateId}`);
      return notes ? JSON.parse(notes) : [];
    } catch {
      return [];
    }
  })();

  const filteredUsers = (() => {
    if (!showMentionDropdown) return [];
    const query = noteText.substring(noteText.lastIndexOf('@') + 1).split(' ')[0];
    if (!query) return mockUsers;
    return mockUsers.filter(u =>
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase())
    );
  })();

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <User className="h-4 w-4 sm:h-5 sm:w-5" />
          Notes & Mentions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4">
        {/* Note Input */}
        <div className="space-y-2">
          <div className="relative">
            <Textarea
              ref={textareaRef}
              placeholder="Add a note... Use @ to mention team members"
              value={noteText}
              onChange={(e) => {
                setNoteText(e.target.value);
                checkForMentions(e.target.value);
              }}
              rows={3}
              className="resize-none text-sm sm:text-base"
            />
            
            {/* Mention Dropdown */}
            {showMentionDropdown && (
              <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-48 overflow-auto animate-in fade-in slide-in-from-top-2">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleMention(user.name)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-sm">{user.name}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-2 text-sm text-muted-foreground">No users found</div>
                )}
              </div>
            )}
          </div>
          <Button onClick={handleSubmit} disabled={addNoteMutation.isPending || !noteText.trim()}>
            <Send className="h-4 w-4 mr-2" />
            {addNoteMutation.isPending ? 'Adding...' : 'Add Note'}
          </Button>
        </div>

          {/* Notes List */}
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
          {storedNotes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <AtSign className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-2 opacity-50" />
              <p className="text-xs sm:text-sm">No notes yet. Add one to get started!</p>
            </div>
          ) : (
            storedNotes.map((note: Note) => (
              <Card key={note.id} className="border-l-4 border-l-primary hover:shadow-md transition-shadow">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
                        <AvatarFallback className="text-xs">{note.userName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-xs sm:text-sm">{note.userName}</div>
                        <div className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm whitespace-pre-wrap break-words">{note.content}</p>
                  {note.mentionedUsers && note.mentionedUsers.length > 0 && (
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className="text-xs text-muted-foreground">Mentioned:</span>
                      {note.mentionedUsers.map((user, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          @{user}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
