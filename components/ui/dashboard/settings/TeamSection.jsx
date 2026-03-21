import React from 'react'
import { Plus, Trash2, Loader2, Users, X } from 'lucide-react'

const StatusBadge = ({ status }) => {
  const styles = {
    pending:  'bg-amber-500/10 text-amber-400 border-amber-500/20',
    active:   'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    inactive: 'bg-zinc-800 text-zinc-500 border-zinc-700',
  }
  return (
    <span className={`text-xs px-2 py-1 rounded-md border capitalize ${styles[status] || styles.inactive}`}>
      {status || 'pending'}
    </span>
  )
}

const TeamSection = () => {

  const [team, setTeam] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isAdding, setIsAdding] = React.useState(false);
  const [newMemberEmail, setNewMemberEmail] = React.useState('');
  const [newMemberName, setNewMemberName] = React.useState('');
  const [openDialog, setOpenDialog] = React.useState(false);
  const [memberToDelete, setMemberToDelete] = React.useState(null);
  const [showForm, setShowForm] = React.useState(false);

  React.useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      const response = await fetch('/api/team/fetch');
      if (response.ok) {
        const data = await response.json();
        setTeam(data);
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleAddMember = async () => {
    if (!newMemberEmail.trim()) return;
    setIsAdding(true);
    try {
      const response = await fetch('/api/team/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newMemberEmail, name: newMemberName }),
      });
      if (response.ok) {
        setNewMemberEmail('');
        setNewMemberName('');
        setShowForm(false);
        fetchTeam();
      }
    } catch (error) {
      console.error('Error adding member:', error);
    } finally {
      setIsAdding(false);
    }
  }

  const handleDelete = async () => {
    if (!memberToDelete) return;
    try {
      const response = await fetch(`/api/team/delete/${memberToDelete.id}`, { method: 'DELETE' });
      if (response.ok) {
        setTeam(prev => prev.filter(m => m.id !== memberToDelete.id));
        setOpenDialog(false);
        setMemberToDelete(null);
      }
    } catch (error) {
      console.error('Error deleting member:', error);
    }
  }

  return (
    <div className='space-y-4'>

      {/* Add Member button */}
      <div className='flex justify-end'>
        <button
          onClick={() => setShowForm(v => !v)}
          className='flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium
            bg-white text-black hover:bg-zinc-200 transition-colors'
        >
          <Plus className='w-3.5 h-3.5' />
          Add Member
        </button>
      </div>

      {/* Invite form */}
      {showForm && (
        <div className='rounded-lg border border-zinc-700/60 bg-zinc-800/50 p-4 space-y-3'>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
            <input
              type='text'
              placeholder='Full name'
              value={newMemberName}
              onChange={e => setNewMemberName(e.target.value)}
              className='w-full bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-white
                placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-all py-2.5 px-3.5'
            />
            <input
              type='email'
              placeholder='Email address'
              value={newMemberEmail}
              onChange={e => setNewMemberEmail(e.target.value)}
              className='w-full bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-white
                placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-all py-2.5 px-3.5'
            />
          </div>
          <div className='flex gap-2 justify-end'>
            <button
              onClick={() => setShowForm(false)}
              className='px-4 py-2 rounded-lg text-sm text-zinc-400 hover:text-white
                border border-zinc-700 bg-transparent transition-all'
            >
              Cancel
            </button>
            <button
              onClick={handleAddMember}
              disabled={isAdding || !newMemberEmail.trim()}
              className='flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg
                text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-200 transition-all'
            >
              {isAdding
                ? <><Loader2 className='w-3.5 h-3.5 animate-spin' /> Inviting...</>
                : 'Send Invite'
              }
            </button>
          </div>
        </div>
      )}

      {/* Team list */}
      {isLoading ? (
        <div className='flex items-center justify-center py-10'>
          <Loader2 className='w-4 h-4 animate-spin text-zinc-600' />
        </div>
      ) : team.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-10 gap-2 text-center'>
          <Users className='w-5 h-5 text-zinc-700' />
          <p className='text-sm text-zinc-500'>No team members yet.</p>
        </div>
      ) : (
        <div className='divide-y divide-zinc-800'>
          {team.map((member) => (
            <div key={member.id} className='flex items-center gap-3 py-3'>
              <div className='w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center
                text-xs font-medium text-zinc-300 shrink-0'>
                {member.name?.[0]?.toUpperCase() || member.user_email?.[0]?.toUpperCase() || '?'}
              </div>
              <div className='flex-1 min-w-0'>
                <p className='text-sm text-zinc-200 truncate'>{member.name || 'Unnamed'}</p>
                <p className='text-xs text-zinc-500 truncate'>{member.user_email}</p>
              </div>
              {/* role badge */}
              <span className='hidden sm:inline text-xs text-zinc-500 capitalize px-2 py-1
                rounded-md bg-zinc-800 border border-zinc-700'>
                {member.role || 'member'}
              </span>
              {/* status badge */}
              <StatusBadge status={member.status} />
              <button
                onClick={() => { setMemberToDelete(member); setOpenDialog(true); }}
                className='p-1.5 text-zinc-600 hover:text-red-400 rounded-md hover:bg-red-500/10 transition-all'
              >
                <Trash2 className='w-3.5 h-3.5' />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Delete dialog */}
      {openDialog && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70'>
          <div className='bg-zinc-900 border border-zinc-800 rounded-xl p-5 w-full max-w-sm space-y-4'>
            <div className='flex items-start justify-between gap-3'>
              <div>
                <p className='text-sm font-semibold text-white'>Remove member</p>
                <p className='text-xs text-zinc-500 mt-1'>
                  Remove <span className='text-zinc-300 font-medium'>{memberToDelete?.name || memberToDelete?.user_email}</span> from the team? This can&apos;t be undone.
                </p>
              </div>
              <button
                onClick={() => { setOpenDialog(false); setMemberToDelete(null); }}
                className='text-zinc-600 hover:text-zinc-300 transition-colors mt-0.5'
              >
                <X className='w-4 h-4' />
              </button>
            </div>
            <div className='flex gap-2 justify-end pt-1'>
              <button
                onClick={() => { setOpenDialog(false); setMemberToDelete(null); }}
                className='px-4 py-2 rounded-lg text-sm text-zinc-400 border border-zinc-700
                  hover:text-white transition-all'
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className='px-4 py-2 rounded-lg text-sm font-medium text-white
                  bg-red-600 hover:bg-red-500 transition-all'
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default TeamSection