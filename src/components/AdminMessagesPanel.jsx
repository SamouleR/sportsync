import React, { useState, useEffect } from 'react';
import { getPublicMessages, deletePublicMessage, markPublicMessageRead } from '../data/store';

export default function AdminMessagesPanel() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = () => {
    setMessages(getPublicMessages().sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
  };

  const handleDelete = (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce message ?')) {
      deletePublicMessage(id);
      loadMessages();
    }
  };

  const handleMarkRead = (id) => {
    markPublicMessageRead(id);
    loadMessages();
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-[#000000] tracking-tight">Boîte de réception</h2>
          <p className="text-gray-500 text-sm mt-1">Messages reçus depuis le formulaire de contact</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#E5E5E5] overflow-hidden">
        {messages.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Aucun message pour le moment.</div>
        ) : (
          <div className="divide-y divide-[#E5E5E5]">
            {messages.map(msg => (
              <div key={msg.id} className={`p-5 hover:bg-gray-50 transition-colors ${!msg.read ? 'bg-blue-50/30' : ''}`}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    {!msg.read && <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></div>}
                    <h3 className="font-bold text-gray-900">{msg.subject}</h3>
                  </div>
                  <span className="text-xs text-gray-400 font-medium bg-gray-100 px-2 py-1 rounded-md">
                    {new Date(msg.timestamp).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3 pl-5">
                  <span className="material-icons-round text-[16px]">person</span> {msg.name} 
                  <span className="mx-2">•</span>
                  <span className="material-icons-round text-[16px]">email</span> <a href={`mailto:${msg.email}`} className="text-blue-600 hover:underline">{msg.email}</a>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 whitespace-pre-wrap ml-5 border border-gray-100">
                  {msg.message}
                </div>
                
                <div className="mt-4 flex gap-3 pl-5">
                  {!msg.read && (
                    <button onClick={() => handleMarkRead(msg.id)} className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors">
                      Marquer comme lu
                    </button>
                  )}
                  <button onClick={() => handleDelete(msg.id)} className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors">
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
