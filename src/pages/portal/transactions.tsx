import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/components/AuthGuard';
import Layout from '@/components/Layout';
import TransactionTable from '@/components/Transactions/TransactionTable';
import TransactionEditModal from '@/components/Transactions/TransactionEditModal';
import NotesModal from '@/components/Transactions/NotesModal';
import { Transaction } from '@/lib/types';

export default function TransactionsPage() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const [editTx, setEditTx] = useState<Transaction | null>(null);
  const [notesTx, setNotesTx] = useState<Transaction | null>(null);

  const fetchData = async () => {
    if (!user?.id) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      console.error('Fetch error:', error);
      setLoading(false);
      return;
    }

    setTransactions(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();

    const channel = supabase
      .channel('transactions-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions',
          filter: `user_id=eq.${user?.id}`
        },
        () => fetchData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  return (
    <Layout>
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-[#3f3d56]">Your Transactions</h2>
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <TransactionTable
            transactions={transactions}
            onRefresh={fetchData}
            onEdit={(tx) => setEditTx(tx)}
            onNotes={(tx) => setNotesTx(tx)}
          />
        )}
      </section>

      {editTx && (
        <div className="fixed inset-0 z-40 backdrop-blur-sm bg-white/30 flex items-center justify-center px-4">
          <TransactionEditModal
            isOpen={true}
            onClose={() => setEditTx(null)}
            transaction={editTx}
            onSave={() => {
              setEditTx(null);
              fetchData();
            }}
          />
        </div>
      )}

      {notesTx && (
        <div className="fixed inset-0 z-40 backdrop-blur-sm bg-white/30 flex items-center justify-center px-4">
          <NotesModal
            tx={notesTx}
            onClose={() => setNotesTx(null)}
            onSave={() => {
              setNotesTx(null);
              fetchData();
            }}
          />
        </div>
      )}
    </Layout>
  );
}

// ✅ this line must be outside of the component
TransactionsPage.requiresAuth = true;
